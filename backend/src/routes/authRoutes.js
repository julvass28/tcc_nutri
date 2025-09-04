const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require("../middleware/auth");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post("/esqueci-senha", async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ erro: "E-mail não encontrado" });
    }

    const codigo = crypto.randomInt(100000, 999999).toString();
    const validade = new Date(Date.now() + 5 * 60 * 1000); // 5 min


    await usuario.update({
      tokenRecuperacao: codigo,
      tokenExpiraEm: validade,
    });

    const info = await transporter.sendMail({
  from: `"Natalia Simonovski" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Seu código de verificação - Natalia Simonovski',
  html: `
  <div style="background-color:#ECE7E6;padding:40px 20px;font-family:sans-serif;color:#8A8F75;max-width:600px;margin:auto;border-radius:12px;">
    <div style="background-color:#FFFFFF;padding:30px;border-radius:12px;box-shadow:0 4px 8px rgba(0,0,0,0.05);">
      <div style="text-align:center;">
        <img src="https://i.imgur.com/5Qr0Gqp.png" alt="Logo Natalia Simonovski" style="width:100px;margin-bottom:20px;" />
        <h2 style="color:#8A8F75;margin-bottom:10px;">Redefinição de Senha</h2>
        <p style="font-size:16px;color:#8A8F75;margin-top:0;">Recebemos sua solicitação para alterar a senha da sua conta.</p>
      </div>

      <p style="margin:30px 0 10px;">Aqui está seu código de verificação:</p>
      <div style="background-color:#D1A0A0;color:white;font-size:22px;font-weight:bold;letter-spacing:4px;text-align:center;padding:12px 20px;border-radius:8px;">
        ${codigo}
      </div>
      <p style="margin-top:10px;font-size:14px;">Este código é válido por <strong>5 minutos</strong>. Insira-o na plataforma para continuar com a redefinição da sua senha.</p>

      <p style="margin-top:30px;font-size:13px;color:#8A8F75;">
        Se você não solicitou essa alteração, por favor ignore este e-mail.
      </p>

      <hr style="margin:30px 0;border:none;border-top:1px solid #EEE;" />

      <p style="text-align:center;font-size:12px;color:#8A8F75;">
        © 2025 Natalia Simonovski | Nutricionista <br/>
        Desenvolvido por Equipe Neven
      </p>
    </div>
  </div>
  `
});




    console.log("📨 Preview do e-mail:", nodemailer.getTestMessageUrl(info));

    res.json({ msg: "Código enviado com sucesso!" });
  } catch (error) {
    console.log("🛑 ERRO AO ENVIAR CÓDIGO:");
    console.log("📍 STACK:", error.stack);
    console.log("📍 MESSAGE:", error.message);
    res.status(500).json({ erro: "Erro ao enviar e-mail", detalhes: error.message });
  }
});

router.post("/verificar-codigo", async (req, res) => {
  const { email, codigo } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || usuario.tokenRecuperacao !== codigo) {
      return res.status(400).json({ message: "Código inválido." });
    }

    if (new Date().getTime() > new Date(usuario.tokenExpiraEm).getTime()) {
      return res.status(400).json({ message: "Código expirado." });
    }
    res.status(200).json({ message: "Código válido!" });
  } catch (err) {
    console.error("Erro ao verificar código:", err);
    res.status(500).json({ message: "Erro interno ao verificar código." });
  }
});

// Atualizar senha com base no código e novo password
router.post("/redefinir-senha", async (req, res) => {
  const { email, token, novaSenha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || usuario.token !== token || usuario.expiration < new Date()) {
      return res.status(400).json({ message: "Token inválido ou expirado." });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await usuario.update({
      senha: senhaHash,
      token: null,
      expiration: null
    });

    res.json({ message: "Senha atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({ message: "Erro interno ao redefinir a senha." });
  }
});


module.exports = router;