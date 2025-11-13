// backend/routes/publicContactRoutes.js
const express = require("express");
const router = express.Router();
const ConfigSistema = require("../models/ConfigSistema");

// chaves usadas na tabela ConfigSistema
const CONTACT_KEYS = ["contato_email", "contato_telefone", "contato_whatsapp"];

// GET /config/contact-info  (rota pública)
router.get("/contact-info", async (_req, res) => {
  try {
    const rows = await ConfigSistema.findAll({
      where: { chave: CONTACT_KEYS },
    });

    const map = {};
    for (const row of rows) {
      map[row.chave] = row.valor;
    }

    const email =
      map.contato_email || (process.env.OWNER_EMAIL || "").trim() || null;
    const telefone = map.contato_telefone || null;
    const whatsapp = map.contato_whatsapp || telefone || null;

    res.json({
      email,
      telefone,
      whatsapp,
    });
  } catch (e) {
    console.error("Erro ao carregar contact-info:", e);
    res.status(500).json({ erro: "Erro ao carregar dados de contato." });
  }
});

module.exports = router;
