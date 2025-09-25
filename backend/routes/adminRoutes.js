// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const Usuario = require("../models/Usuario");

const OWNER_EMAIL = (process.env.OWNER_EMAIL || "").trim().toLowerCase();
const OWNER_ID = process.env.OWNER_ID ? Number(process.env.OWNER_ID) : null;

function isOwnerUser(user) {
  if (!user) return false;
  if (OWNER_ID && Number(user.id) === OWNER_ID) return true;
  if (OWNER_EMAIL && String(user.email || "").toLowerCase() === OWNER_EMAIL) return true;
  return false;
}

function sanitize(u) {
  if (!u) return null;
  const json = u.toJSON();
  delete json.senha;
  return json;
}

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

  // (opcional) sinaliza quem é owner na listagem (útil se quiser esconder botões na tabela)
  const withOwner = users.map((u) => {
    const j = u.toJSON();
    j.isOwner = isOwnerUser(u);
    return j;
  });

  res.json(withOwner);
});

// Detalhes de um usuário (sem senha), incluindo isOwner
router.get("/users/:id", auth, adminOnly, async (req, res) => {
  const u = await Usuario.findByPk(req.params.id, {
    attributes: { exclude: ["senha"] },
  });
  if (!u) return res.status(404).json({ erro: "Usuário não encontrado" });

  const json = sanitize(u);
  json.isOwner = isOwnerUser(u);
  res.json(json);
});

// Alterar papel (promover/depromover)
router.patch("/users/:id/role", auth, adminOnly, async (req, res) => {
  try {
    const { isAdmin } = req.body;
    if (typeof isAdmin !== "boolean") {
      return res.status(400).json({ erro: "Parâmetro isAdmin deve ser booleano." });
    }

    const target = await Usuario.findByPk(req.params.id);
    if (!target) return res.status(404).json({ erro: "Usuário não encontrado" });

    const actor = await Usuario.findByPk(req.user.id);
    const actorIsOwner = isOwnerUser(actor);
    const targetIsOwner = isOwnerUser(target);

    // ninguém altera o próprio papel
    if (req.user.id === target.id) {
      return res.status(400).json({ erro: "Você não pode alterar seu próprio papel." });
    }

    // proteger o Líder Geral
    if (targetIsOwner) {
      return res.status(403).json({ erro: "Não é permitido alterar o papel do Líder Geral." });
    }

    // regras:
    // - Owner: pode promover e despromover qualquer um (exceto owner).
    // - Sub-admin: pode PROMOVER usuários comuns; NÃO pode despromover nenhum admin.
    if (!actorIsOwner) {
      if (isAdmin === false && !!target.isAdmin) {
        return res.status(403).json({ erro: "Apenas o Líder Geral pode despromover um administrador." });
      }
    }

    await target.update({ isAdmin });
    const updated = sanitize(target);
    updated.isOwner = isOwnerUser(target);
    res.json({ ok: true, user: updated });
  } catch (e) {
    console.error("Erro ao alterar papel:", e);
    res.status(500).json({ erro: "Erro ao alterar papel do usuário." });
  }
});

// Deletar usuário (regras com owner e admins)
router.delete("/users/:id", auth, adminOnly, async (req, res) => {
  const u = await Usuario.findByPk(req.params.id);
  if (!u) return res.status(404).json({ erro: "Usuário não encontrado" });

  const actor = await Usuario.findByPk(req.user.id);
  const actorIsOwner = isOwnerUser(actor);
  const targetIsOwner = isOwnerUser(u);

  // não deleta a si mesmo
  if (u.id === req.user.id) {
    return res.status(400).json({ erro: "Você não pode deletar a si mesmo." });
  }

  // ninguém deleta o Líder Geral
  if (targetIsOwner) {
    return res.status(403).json({ erro: "Não é permitido remover o Líder Geral." });
  }

  // apenas owner pode deletar outro admin
  if (!!u.isAdmin && !actorIsOwner) {
    return res.status(403).json({ erro: "Apenas o Líder Geral pode remover outro administrador." });
  }

  await u.destroy();
  res.json({ ok: true });
});

module.exports = router;
