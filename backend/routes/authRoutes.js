// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Usuario = require("../models/Usuario");

// GET /me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: [
        "id",
        "nome",
        "email",
        "fotoUrl",
        "sobrenome",
        "data_nascimento",
        "genero",
        "altura",
        "peso",
        "objetivo",
      ],
    });
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
});

router.post("/register", authController.register);
router.post("/login", authController.login);

// Transporter universal (SMTP real)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1) Solicitar código
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

    await transporter.sendMail({
      from: `"Natalia Simonovski" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Seu código de verificação - Natalia Simonovski",
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
      </div>`,
    });

    res.json({ msg: "Código enviado com sucesso!" });
  } catch (error) {
    console.log("🛑 ERRO AO ENVIAR CÓDIGO:", error.message);
    res
      .status(500)
      .json({ erro: "Erro ao enviar e-mail", detalhes: error.message });
  }
});

// 2) Validar código
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

// 3) Trocar a senha usando o código válido
router.post("/redefinir-senha", async (req, res) => {
  const { email, codigo, novaSenha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const expirou =
      !usuario.tokenExpiraEm ||
      new Date().getTime() > new Date(usuario.tokenExpiraEm).getTime();
    const codigoOk =
      usuario.tokenRecuperacao && usuario.tokenRecuperacao === codigo;

    if (!codigoOk || expirou) {
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    // <<< NOVO: impede usar a mesma senha de antes
    const mesmaSenha = await bcrypt.compare(novaSenha, usuario.senha);
    if (mesmaSenha) {
      return res
        .status(400)
        .json({ message: "Nova senha não pode ser igual à anterior." });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await usuario.update({
      senha: senhaHash,
      tokenRecuperacao: null,
      tokenExpiraEm: null,
    });

    res.json({ message: "Senha atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({ message: "Erro interno ao redefinir a senha." });
  }
});

/** ================== PERFIL: ATUALIZAÇÃO TEXTUAL ================== */
/** ================== PERFIL: ATUALIZAÇÃO TEXTUAL ================== */
router.put("/perfil", authMiddleware, async (req, res) => {
  try {
    const {
      nome,
      sobrenome,
      email,
      data_nascimento,
      genero,
      altura,
      peso,
      objetivo,
    } = req.body;

    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    // 🚫 NÃO PERMITE alterar e-mail (requisito)
    if (typeof email !== "undefined" && email !== usuario.email) {
      return res.status(400).json({ erro: "E-mail não pode ser alterado." });
    }

    await usuario.update({
      nome,
      sobrenome,
      // email intencionalmente NÃO vai aqui
      data_nascimento,
      genero,
      altura,
      peso,
      objetivo,
    });

    res.json({ message: "Perfil atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ erro: "Erro interno ao atualizar perfil." });
  }
});

/** ================== PERFIL: UPLOAD DE FOTO ================== */
const uploadDir = path.join(__dirname, "..", "uploads", "avatars");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = (file.originalname.split(".").pop() || "jpg").toLowerCase();
    cb(null, `${req.user.id}-${Date.now()}.${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
      file.mimetype
    );
    cb(
      ok ? null : new Error("Formato de imagem inválido (use JPG/PNG/WebP)."),
      ok
    );
  },
});

router.post(
  "/perfil/foto",
  authMiddleware,
  upload.single("foto"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ erro: "Arquivo não enviado." });

      const usuario = await Usuario.findByPk(req.user.id);
      if (!usuario)
        return res.status(404).json({ erro: "Usuário não encontrado" });

      if (usuario.fotoUrl && usuario.fotoUrl.includes("/uploads/avatars/")) {
        const oldName = path.basename(usuario.fotoUrl);
        const oldPath = path.join(uploadDir, oldName);
        fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
      }

      const proto = req.headers["x-forwarded-proto"] || req.protocol;
      const host = req.get("host");
      const baseUrl = process.env.PUBLIC_BASE_URL || `${proto}://${host}`;
      const url = `${baseUrl}/uploads/avatars/${req.file.filename}`;

      await usuario.update({ fotoUrl: url });

      res.json({ message: "Foto atualizada!", fotoUrl: url });
    } catch (err) {
      console.error("Erro upload foto:", err);
      res.status(500).json({ erro: "Erro ao salvar foto." });
    }
  }
);

module.exports = router;
