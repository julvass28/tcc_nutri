// backend/middleware/adminOnly.js
const Usuario = require("../models/Usuario");

module.exports = async function (req, res, next) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ erro: "Não autenticado" });
    }
    const me = await Usuario.findByPk(req.user.id, {
      attributes: ["id", "email", "isAdmin", "isOwner"],
    });
    if (!me) return res.status(401).json({ erro: "Não autenticado" });

    // ✅ fonte da verdade é o DB (não o token)
    if (!me.isAdmin && !me.isOwner) {
      return res.status(403).json({ erro: "Acesso restrito a administradores" });
    }

    req.me = me; // vamos usar isso nas rotas admin
    next();
  } catch (e) {
    console.error("adminOnly:", e);
    res.status(500).json({ erro: "Erro interno de autorização" });
  }
};
