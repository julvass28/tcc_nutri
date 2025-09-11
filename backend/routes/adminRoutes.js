// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const Usuario = require("../models/Usuario");

// Lista todos os usuários (sem campos sensíveis)
router.get("/users", auth, adminOnly, async (_req, res) => {
  const users = await Usuario.findAll({
    attributes: [
      "id",
      "nome",
      "sobrenome",
      "email",
      "fotoUrl",
      "isAdmin",
      "createdAt",
      "updatedAt",
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(users);
});

// Detalhes de um usuário (sem senha)
router.get("/users/:id", auth, adminOnly, async (req, res) => {
  const u = await Usuario.findByPk(req.params.id, {
    attributes: { exclude: ["senha"] },
  });
  if (!u) return res.status(404).json({ erro: "Usuário não encontrado" });
  res.json(u);
});

// Deletar usuário (impede deletar a si próprio)
router.delete("/users/:id", auth, adminOnly, async (req, res) => {
  const u = await Usuario.findByPk(req.params.id);
  if (!u) return res.status(404).json({ erro: "Usuário não encontrado" });
  if (u.id === req.user.id) {
    return res.status(400).json({ erro: "Você não pode deletar a si mesmo" });
  }
  await u.destroy();
  res.json({ ok: true });
});

module.exports = router;
