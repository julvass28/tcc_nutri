// backend/controllers/paymentsController.js
const axios = require("axios");
const { Op } = require("sequelize");
const ReservaTemp = require("../models/ReservaTemp");
const Agendamentos = require("../models/Agendamentos");
const sequelize = require("../config/db");
const Usuario = require("../models/Usuario");
const { sendConsultaConfirmadaEmail } = require("../services/emailService");

const API_MP = "https://api.mercadopago.com";
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const FRONT_URL = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

// ================= PIX =================
async function gerarPix(req, res) {
  try {
    const { payment_ref, amount } = req.body;

    if (!payment_ref || !amount) {
      return res
        .status(400)
        .json({ erro: "payment_ref e amount são obrigatórios" });
    }

    // conferir se a reserva ainda é válida
    const hold = await ReservaTemp.findOne({
      where: {
        payment_ref,
        expires_at: { [Op.gt]: new Date() },
      },
      raw: true,
    });

    if (!hold) {
      return res
        .status(404)
        .json({ erro: "Reserva temporária não encontrada ou expirada." });
    }

    // chamar Mercado Pago para criar cobrança PIX
    const mpResp = await axios.post(
      `${API_MP}/v1/payments`,
      {
        transaction_amount: Number(amount),
        description: `Consulta - ${hold.especialidade || "nutrição"}`,
        payment_method_id: "pix",
        external_reference: payment_ref,
        payer: {
          email: "sandbox@mail.com",
          first_name: "Paciente",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": payment_ref, // 👈 obrigatoriamente único
        },
      }
    );

    const pixData = mpResp.data.point_of_interaction?.transaction_data;

    return res.json({
      qr_code_base64: pixData?.qr_code_base64 || null,
      copia_cola: pixData?.qr_code || null,
      status: mpResp.data.status,
    });
  } catch (e) {
    console.error("gerarPix ERRO:", e.response?.data || e.message);
    return res.status(500).json({ erro: "Falha ao gerar PIX" });
  }
}

// ================= WEBHOOK (serve tanto pra PIX quanto pra outros métodos, se usados) =================
async function webhook(req, res) {
  try {
    const { type, data } = req.body || {};
    if (type !== "payment" || !data?.id) {
      return res.sendStatus(200);
    }

    // pega detalhes do pagamento no MP
    const pay = await axios.get(`${API_MP}/v1/payments/${data.id}`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });

    const status = pay.data.status; // approved | pending | rejected
    const externalRef = String(pay.data.external_reference || "");

    if (!externalRef) return res.sendStatus(200);

    if (status === "approved") {
      const hold = await ReservaTemp.findOne({
        where: {
          payment_ref: externalRef,
          expires_at: { [Op.gt]: new Date() },
        },
      });

      if (!hold) return res.sendStatus(200);

      const jaExiste = await Agendamentos.findOne({
        where: { idempotency_key: externalRef },
      });

      if (jaExiste) {
        // se já existe, remove o hold (cleanup) e sai
        await ReservaTemp.destroy({ where: { id: hold.id } });
        return res.sendStatus(200);
      }

      let novoAgendamento = null;

      await sequelize.transaction(async (t) => {
        novoAgendamento = await Agendamentos.create(
          {
            usuario_id: hold.usuario_id,
            inicio: hold.inicio,
            fim: hold.fim,
            status: "confirmada",
            idempotency_key: externalRef,
            especialidade: hold.especialidade || null, // <- SALVA AQUI
          },
          { transaction: t }
        );

        await ReservaTemp.destroy({
          where: { id: hold.id },
          transaction: t,
        });
      });

      // tenta enviar e-mail de confirmação (não bloqueia o webhook)
      try {
        const usuario = await Usuario.findByPk(hold.usuario_id);
        if (usuario && usuario.email && novoAgendamento) {
          await sendConsultaConfirmadaEmail({
            usuario,
            agendamento: novoAgendamento,
          });
        }
      } catch (errMail) {
        console.error(
          "Erro ao enviar e-mail de confirmação (webhook PIX):",
          errMail.message || errMail
        );
      }
    }

    return res.sendStatus(200);
  } catch (e) {
    console.error("webhook MP:", e.response?.data || e.message);
    return res.sendStatus(500);
  }
}

// verifica status do pagamento PIX
async function verificarStatusPix(req, res) {
  try {
    const { payment_ref } = req.params;

    if (!payment_ref) {
      return res.status(400).json({ erro: "payment_ref ausente" });
    }

    // 1. perguntar pro Mercado Pago qual o status desse pagamento
    const mpRes = await axios.get(
      `${API_MP}/v1/payments/search?external_reference=${payment_ref}`,
      {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      }
    );

    const pagamentos = mpRes.data.results || [];
    if (!pagamentos.length) {
      // ainda não tem pagamento registrado lá (ninguém pagou esse PIX)
      return res.json({ status: "pending" });
    }

    const ultimo = pagamentos[0];
    const status = ultimo.status || "pending";

    // 2. se já tá aprovado, agora sim a gente CONFIRMA a consulta no banco
    if (status === "approved") {
      const hold = await ReservaTemp.findOne({
        where: {
          payment_ref: payment_ref,
          expires_at: { [Op.gt]: new Date() }, // ainda válida
        },
      });

      if (hold) {
        // vê se já não criaram agendamento com essa mesma chave
        const existente = await Agendamentos.findOne({
          where: { idempotency_key: payment_ref },
        });

        if (!existente) {
          let agendamentoCriado = null;

          await sequelize.transaction(async (t) => {
            agendamentoCriado = await Agendamentos.create(
              {
                usuario_id: hold.usuario_id,
                inicio: hold.inicio,
                fim: hold.fim,
                status: "confirmada",
                idempotency_key: payment_ref,
                especialidade: hold.especialidade || null, // <- SALVA AQUI também
              },
              { transaction: t }
            );

            await ReservaTemp.destroy({
              where: { id: hold.id },
              transaction: t,
            });
          });

          // e-mail de confirmação (não bloqueia resposta)
          try {
            const usuario = await Usuario.findByPk(hold.usuario_id);
            if (usuario && usuario.email && agendamentoCriado) {
              await sendConsultaConfirmadaEmail({
                usuario,
                agendamento: agendamentoCriado,
              });
            }
          } catch (errMail) {
            console.error(
              "Erro ao enviar e-mail de confirmação (status PIX):",
              errMail.message || errMail
            );
          }
        }
      }
    }

    // 3. sempre devolve algo pro front dizer pra tela do usuário
    return res.json({
      status,
      amount: ultimo.transaction_amount,
      date_approved: ultimo.date_approved,
    });
  } catch (err) {
    console.error("verificarStatusPix:", err.response?.data || err.message);
    res.status(500).json({ erro: "Erro ao verificar status PIX" });
  }
}

// EXPORTA SÓ O QUE IMPORTA PRO PIX 👇
module.exports = {
  gerarPix,
  webhook,
  verificarStatusPix,
};
