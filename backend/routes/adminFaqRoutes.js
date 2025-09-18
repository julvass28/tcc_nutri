// backend/routes/adminFaqRoutes.js
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const Faq = require("../models/Faq");

// LISTAR (ordenado)
router.get("/", auth, adminOnly, async (_req, res) => {
  const itens = await Faq.findAll({
    order: [["ordem", "ASC"], ["createdAt", "ASC"]],
  });
  res.json(itens);
});

// CRIAR
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { pergunta, resposta } = req.body;
    if (!pergunta || !resposta) {
      return res.status(400).json({ erro: "Preencha pergunta e resposta" });
    }
    // pega o maior ordem atual e soma 1
    const last = await Faq.findOne({ order: [["ordem", "DESC"]] });
    const ordem = last ? (last.ordem || 0) + 1 : 1;

    const created = await Faq.create({ pergunta, resposta, ordem });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Erro ao criar FAQ" });
  }
});

// ATUALIZAR
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const item = await Faq.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: "FAQ não encontrado" });

    const { pergunta, resposta } = req.body;
    await item.update({
      pergunta: pergunta ?? item.pergunta,
      resposta: resposta ?? item.resposta,
    });
    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Erro ao atualizar FAQ" });
  }
});

// REMOVER
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const item = await Faq.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: "FAQ não encontrado" });
    await item.destroy();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Erro ao remover FAQ" });
  }
});

// REORDENAR (salva nova ordem)
// body: { ids: [3, 1, 5, ...] } na ordem final
router.post("/reordenar", auth, adminOnly, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ erro: "Lista de IDs inválida" });
    }
    // atualiza ordem conforme a posição no array (1-based)
    const updates = ids.map((id, idx) =>
      Faq.update({ ordem: idx + 1 }, { where: { id } })
    );
    await Promise.all(updates);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Falha ao reordenar" });
  }
});

module.exports = router;
