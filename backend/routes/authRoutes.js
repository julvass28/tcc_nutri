const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require("../middleware/auth");
const Usuario = require("../models/Usuario");

// GET /me → retorna os dados do usuário logado
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: ["id", "nome", "email"] // evita mandar senha
    });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
});

router.post('/register', authController.register);

router.post('/login', authController.login);

module.exports = router;