// backend/routes/adminRecipeRoutes.js
const express = require("express");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const Receita = require("../models/Receita");

const router = express.Router();

// util: slugify simples
function slugify(str) {
  return String(str || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// LIST (admin)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const { q = "", categoria } = req.query;
    const where = {};
    if (categoria) where.categoria = categoria;
    if (q) where.titulo = { [Op.like]: `%${q}%` };

    const itens = await Receita.findAll({
      where,
      order: [["updatedAt", "DESC"]],
      attributes: [
        "id",
        "titulo",
        "slug",
        "categoria",
        "ativo",
        "bannerUrl",
        "thumbUrl",
        "createdAt",
        "updatedAt",
      ],
    });

    res.json(itens);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Falha ao listar" });
  }
});

// CREATE
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    let {
      titulo,
      slug,
      categoria,
      resumo,
      bannerUrl,
      thumbUrl,
      ingredientes,
      passos,
      dicas,
      ativo,
    } = req.body;

    if (!titulo || !categoria) {
      return res
        .status(400)
        .json({ erro: "Título e categoria são obrigatórios" });
    }

    let finalSlug = slugify(slug || titulo);
    if (!finalSlug) finalSlug = `receita-${Date.now()}`;

    // evita slug repetido
    let k = 2;
    while (await Receita.findOne({ where: { slug: finalSlug } })) {
      finalSlug = `${finalSlug.replace(/-\d+$/, "")}-${k++}`;
    }

    const r = await Receita.create({
      titulo,
      slug: finalSlug,
      categoria,
      resumo: resumo || null,
      bannerUrl: bannerUrl || null,
      thumbUrl: thumbUrl || null,
      ingredientes: Array.isArray(ingredientes)
        ? ingredientes
        : ingredientes
        ? [].concat(ingredientes)
        : null,
      passos: Array.isArray(passos)
        ? passos
        : passos
        ? [].concat(passos)
        : null,
      dicas: Array.isArray(dicas) ? dicas : dicas ? [].concat(dicas) : null,
      ativo: typeof ativo === "boolean" ? ativo : true,
    });

    res.status(201).json(r);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Falha ao criar" });
  }
});

// READ by id
router.get("/:id", auth, adminOnly, async (req, res) => {
  const r = await Receita.findByPk(req.params.id);
  if (!r) return res.status(404).json({ erro: "Não encontrada" });
  res.json(r);
});

// UPDATE
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const r = await Receita.findByPk(req.params.id);
    if (!r) return res.status(404).json({ erro: "Não encontrada" });

    const {
      titulo,
      slug,
      categoria,
      resumo,
      bannerUrl,
      thumbUrl,
      ingredientes,
      passos,
      dicas,
      ativo,
    } = req.body;

    // slug
    let newSlug = r.slug;
    if (typeof slug === "string" && slug.trim()) {
      const candidate = slugify(slug);
      if (
        candidate !== r.slug &&
        (await Receita.findOne({
          where: { slug: candidate, id: { [Op.ne]: r.id } },
        }))
      ) {
        return res.status(400).json({ erro: "Slug já em uso" });
      }
      newSlug = candidate;
    }

    await r.update({
      titulo: titulo ?? r.titulo,
      slug: newSlug,
      categoria: categoria ?? r.categoria,
      resumo: resumo ?? r.resumo,
      bannerUrl: bannerUrl ?? r.bannerUrl,
      thumbUrl: thumbUrl ?? r.thumbUrl,
      ingredientes:
        ingredientes === undefined
          ? r.ingredientes
          : Array.isArray(ingredientes)
          ? ingredientes
          : [].concat(ingredientes || []),
      passos:
        passos === undefined
          ? r.passos
          : Array.isArray(passos)
          ? passos
          : [].concat(passos || []),
      dicas:
        dicas === undefined
          ? r.dicas
          : Array.isArray(dicas)
          ? dicas
          : [].concat(dicas || []),
      ativo: typeof ativo === "boolean" ? ativo : r.ativo,
    });

    res.json(r);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Falha ao atualizar" });
  }
});

// DELETE
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const r = await Receita.findByPk(req.params.id);
    if (!r) return res.status(404).json({ erro: "Não encontrada" });
    await r.destroy();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Falha ao remover" });
  }
});

/* upload opcional de banner */
/* upload opcional de banner / thumb */
const uploadDir = path.join(__dirname, "..", "uploads", "recipes");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = (file.originalname.split(".").pop() || "jpg").toLowerCase();
    // ex: 12-1731719200000.jpg
    cb(null, `${req.params.id}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
      file.mimetype
    );
    cb(ok ? null : new Error("Formato inválido"), ok);
  },
});

// helper pra gerar URL pública a partir do filename salvo
function buildPublicRecipeUrl(req, filename) {
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");
  const baseUrl = process.env.PUBLIC_BASE_URL || `${proto}://${host}`;
  return `${baseUrl}/uploads/recipes/${filename}`;
}

// POST /admin/receitas/:id/banner
// campo do form-data: "banner"
router.post(
  "/:id/banner",
  auth,
  adminOnly,
  upload.single("banner"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ erro: "Arquivo não enviado" });

      const r = await Receita.findByPk(req.params.id);
      if (!r) return res.status(404).json({ erro: "Não encontrada" });

      const url = buildPublicRecipeUrl(req, req.file.filename);

      await r.update({ bannerUrl: url });
      res.json({ bannerUrl: url });
    } catch (e) {
      console.error(e);
      res.status(500).json({ erro: "Falha ao enviar banner" });
    }
  }
);

// POST /admin/receitas/:id/thumb
// campo do form-data: "thumb"
router.post(
  "/:id/thumb",
  auth,
  adminOnly,
  upload.single("thumb"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ erro: "Arquivo não enviado" });

      const r = await Receita.findByPk(req.params.id);
      if (!r) return res.status(404).json({ erro: "Não encontrada" });

      const url = buildPublicRecipeUrl(req, req.file.filename);

      await r.update({ thumbUrl: url });
      res.json({ thumbUrl: url });
    } catch (e) {
      console.error(e);
      res.status(500).json({ erro: "Falha ao enviar thumbnail" });
    }
  }
);

module.exports = router;
