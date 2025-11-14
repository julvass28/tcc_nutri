// backend/routes/adminConsultasRoutes.js
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const Agendamentos = require("../models/Agendamentos");
const Usuario = require("../models/Usuario");
const Anamnese = require("../models/Anamnese");

// helper pra montar período [de, ate]
function buildDateRange(de, ate) {
  let start = null;
  let end = null;

  if (de) start = new Date(`${de}T00:00:00`);
  if (ate) end = new Date(`${ate}T23:59:59`);

  if (start && end) return { [Op.between]: [start, end] };
  if (start) return { [Op.gte]: start };
  if (end) return { [Op.lte]: end };
  return undefined;
}

// GET /admin/consultas?de=YYYY-MM-DD&ate=YYYY-MM-DD&status=...&especialidade=...
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const { de, ate, status, especialidade } = req.query;

    const where = {};

    // período
    const range = buildDateRange(de, ate);
    if (range) where.inicio = range;

    // status:
    //  - "ativas" => pendente + confirmada
    //  - "todas" => NÃO filtra (vem tudo)
    //  - vazio (sem status) => por padrão, tudo menos cancelada
    if (status === "ativas") {
      where.status = { [Op.in]: ["pendente", "confirmada"] };
    } else if (status && status !== "todas") {
      // pendente / confirmada / finalizada / cancelada
      where.status = status;
    } else if (!status) {
      // se nem mandou status, mantém o comportamento antigo:
      // padrão: tudo menos cancelada
      where.status = { [Op.ne]: "cancelada" };
    }
    // se status === "todas" → não coloca where.status (vem tudo)

    // especialidade se existir coluna
    if (especialidade) {
      where.especialidade = especialidade;
    }

    const ags = await Agendamentos.findAll({
      where,
      order: [["inicio", "ASC"]],
      raw: true,
    });

    if (!ags.length) return res.json([]);

    const userIds = [...new Set(ags.map((a) => a.usuario_id).filter(Boolean))];

    // carrega dados básicos dos pacientes
    const users = await Usuario.findAll({
      where: { id: userIds },
      attributes: ["id", "nome", "sobrenome", "email"],
      raw: true,
    });

    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    // todas anamneses dos pacientes
    const anamneses = await Anamnese.findAll({
      where: { user_id: { [Op.in]: userIds } },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    // agrupa anamneses por usuário
    const anamPorUser = {};
    anamneses.forEach((a) => {
      if (!anamPorUser[a.user_id]) anamPorUser[a.user_id] = [];
      anamPorUser[a.user_id].push(a);
    });

    // último telefone de cada user (usando respostas da anamnese mais recente)
    const telefonePorUser = {};
    for (const a of anamneses) {
      if (telefonePorUser[a.user_id]) continue; // já peguei a mais recente

      let tel = null;
      try {
        const r = a.respostas || {};
        tel =
          r.telefone ||
          r.telefone_contato ||
          r.celular ||
          r.whatsapp ||
          r.contato ||
          null;
      } catch (_) {
        tel = null;
      }
      if (tel) telefonePorUser[a.user_id] = String(tel);
    }

    const out = ags.map((a) => {
      const paciente = userMap[a.usuario_id] || null;

      // chave de vínculo
      const ref = a.payment_ref || a.idempotency_key || null;

      const listaUser = anamPorUser[a.usuario_id] || [];
      let anamneseVinculada = null;

      if (ref) {
        anamneseVinculada = listaUser.find(
          (x) => x.payment_ref && String(x.payment_ref) === String(ref)
        );
      }

      // se não achou por payment_ref, pega a mais recente daquele paciente
      if (!anamneseVinculada && listaUser.length) {
        anamneseVinculada = listaUser[0];
      }

      const anamneseRespondida = !!anamneseVinculada;

      return {
        id: a.id,
        inicio: a.inicio,
        fim: a.fim,
        status: a.status,
        especialidade: a.especialidade || null,
        paciente,
        telefone: paciente ? telefonePorUser[a.usuario_id] || null : null,
        payment_ref: ref,
        anamneseRespondida,
        anamnese: anamneseVinculada || null,
      };
    });

    res.json(out);
  } catch (e) {
    console.error("GET /admin/consultas erro:", e);
    res.status(500).json({ erro: "Erro ao listar consultas." });
  }
});

// POST /admin/consultas/:id/cancelar
router.post("/:id/cancelar", auth, adminOnly, async (req, res) => {
  try {
    const ag = await Agendamentos.findByPk(req.params.id);
    if (!ag) return res.status(404).json({ erro: "Consulta não encontrada." });

    if (ag.status === "cancelada") {
      return res.status(400).json({ erro: "Consulta já está cancelada." });
    }

    await ag.update({ status: "cancelada" });

    res.json({ ok: true, status: "cancelada" });
  } catch (e) {
    console.error("POST /admin/consultas/:id/cancelar erro:", e);
    res.status(500).json({ erro: "Erro ao cancelar consulta." });
  }
});

// POST /admin/consultas/:id/finalizar
router.post("/:id/finalizar", auth, adminOnly, async (req, res) => {
  try {
    const ag = await Agendamentos.findByPk(req.params.id);
    if (!ag) return res.status(404).json({ erro: "Consulta não encontrada." });

    if (ag.status === "finalizada") {
      return res.status(400).json({ erro: "Consulta já está finalizada." });
    }

    await ag.update({ status: "finalizada" });

    // 🔮 FUTURO:
    // aqui é o ponto perfeito pra:
    //  - gerar o PDF de declaração
    //  - enviar por e-mail pro paciente
    // por enquanto, só marcamos como finalizada.

    res.json({ ok: true, status: "finalizada" });
  } catch (e) {
    console.error("POST /admin/consultas/:id/finalizar erro:", e);
    res.status(500).json({ erro: "Erro ao finalizar consulta." });
  }
});

module.exports = router;
