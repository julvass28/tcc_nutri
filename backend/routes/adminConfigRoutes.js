// backend/routes/adminConfigRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const ConfigSistema = require("../models/ConfigSistema");

// GET /admin/config/precos
router.get("/precos", auth, adminOnly, async (_req, res) => {
  const configs = await ConfigSistema.findAll({
    where: { chave: ["preco_consulta_presencial", "preco_consulta_online"] }
  });

  const out = {};
  for (const c of configs) {
    if (c.chave === "preco_consulta_presencial") out.presencial = c.valor;
    if (c.chave === "preco_consulta_online") out.online = c.valor;
  }

  res.json(out);
});

// PATCH /admin/config/precos
router.patch("/precos", auth, adminOnly, async (req, res) => {
  const { presencial, online } = req.body;

  async function upsert(chave, valor) {
    if (valor === undefined) return;
    const [row, created] = await ConfigSistema.findOrCreate({
      where: { chave },
      defaults: { valor: String(valor) }
    });
    if (!created) await row.update({ valor: String(valor) });
  }

  await upsert("preco_consulta_presencial", presencial);
  await upsert("preco_consulta_online", online);

  res.json({ ok: true });
});

module.exports = router;
