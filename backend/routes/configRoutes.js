// backend/routes/configRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const { getPrecoCents, setPrecoCents } = require("../services/preco");

// Público: usado pelo site para exibir preço
// GET /config/consulta-preco  => { valor_cents, moeda, updated_at }
router.get("/config/consulta-preco", async (_req, res) => {
  try {
    const cents = await getPrecoCents();
    res.json({ valor_cents: cents, moeda: "BRL", updated_at: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ erro: "Falha ao obter preço." });
  }
});

// Admin: alterar preço
// PUT /admin/config/consulta-preco body: { valor_cents }
router.put("/admin/config/consulta-preco", auth, adminOnly, async (req, res) => {
  try {
    const { valor_cents } = req.body || {};
    if (valor_cents == null) return res.status(400).json({ erro: "valor_cents é obrigatório (inteiro em centavos)." });
    const saved = await setPrecoCents(valor_cents);
    res.json({ ok: true, valor_cents: saved });
  } catch (e) {
    res.status(500).json({ erro: "Falha ao salvar preço." });
  }
});

module.exports = router;
