module.exports = function adminOnly(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ erro: "Acesso restrito a administradores" });
  }
  next();
};
