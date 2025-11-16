// backend/controllers/anamneseController.js
const Anamnese = require("../models/Anamnese");
const Agendamentos = require("../models/Agendamentos");
const Usuario = require("../models/Usuario");

exports.salvar = async (req, res) => {
  try {
    const userId = req.user?.id; // vem do middleware auth.js (vc já usa)
    const { booking_hold_id, payment_ref, data, hora, modalidade, respostas } =
      req.body;

    if (!userId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    if (!respostas || typeof respostas !== "object") {
      return res.status(400).json({ erro: "Respostas inválidas." });
    }

    // salva
    const registro = await Anamnese.create({
      user_id: userId,
      booking_hold_id: booking_hold_id || null,
      payment_ref: payment_ref || null,
      data_consulta: data || null,
      hora_consulta: hora || null,
      modalidade: modalidade || null,
      respostas,
    });

    // se tiver agendamento com essa payment_ref, marca lá também
  if (payment_ref) {
  await Agendamentos.update(
    { anamnese_preenchida: true },
    {
      // 👇 usa idempotency_key, que é onde você guarda o payment_ref
      where: { idempotency_key: payment_ref },
    }
  );
}

    return res.status(201).json({
      ok: true,
      id: registro.id,
      msg: "Anamnese salva.",
    });
  } catch (err) {
    console.error("ERRO salvar anamnese:", err);
    return res.status(500).json({ erro: "Erro ao salvar anamnese." });
  }
};

exports.minhas = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const lista = await Anamnese.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });

    return res.json(lista);
  } catch (err) {
    console.error("ERRO listar anamnese:", err);
    return res.status(500).json({ erro: "Erro ao listar." });
  }
};
