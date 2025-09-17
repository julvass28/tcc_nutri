// backend/routes/receitaRoutes.js
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Receita = require("../models/Receita");

// GET /receitas?categoria=...&q=...
router.get("/receitas", async (req, res) => {
  try {
    const { categoria, q } = req.query;
    const where = { ativo: true };

    if (categoria) where.categoria = categoria;
    if (q) where.titulo = { [Op.like]: `%${q}%` };

    const itens = await Receita.findAll({
      where,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "titulo",
        "slug",
        "categoria",
        "resumo",
        "bannerUrl",
        "thumbUrl",
        "createdAt",
      ],
    });

    res.json(itens);
  } catch (e) {
    console.error("Erro listando receitas públicas:", e);
    res.status(500).json({ erro: "Erro interno" });
  }
});

// GET /receitas/:slug
router.get("/receitas/:slug", async (req, res) => {
  try {
    const r = await Receita.findOne({
      where: { slug: req.params.slug, ativo: true },
    });
    if (!r) return res.status(404).json({ erro: "Receita não encontrada" });
    res.json(r);
  } catch (e) {
    console.error("Erro pegando receita por slug:", e);
    res.status(500).json({ erro: "Erro interno" });
  }
});

module.exports = router;
