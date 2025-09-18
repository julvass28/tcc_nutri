// backend/routes/faqRoutes.js
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Faq = require("../models/Faq");

// GET /faq?categoria=&q=
router.get("/faq", async (req, res) => {
  try {
    const { categoria, q } = req.query;
    const where = { ativo: true };
    if (categoria) where.categoria = categoria;
    if (q) where.pergunta = { [Op.like]: `%${q}%` };

    const itens = await Faq.findAll({
      where,
      order: [
        ["ordem", "ASC"],
        ["createdAt", "DESC"],
      ],
      attributes: ["id", "pergunta", "resposta", "categoria", "ordem"],
    });

    res.json(itens);
  } catch (e) {
    console.error("Erro listando FAQ público:", e);
    res.status(500).json({ erro: "Erro interno" });
  }
});

module.exports = router;
