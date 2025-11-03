// backend/routes/anamneseRoutes.js
const express = require("express");
const router = express.Router();
const { salvar, minhas } = require("../controllers/anamneseController");
const auth = require("../middleware/auth"); // mesmo que vc já usa nas outras rotas

// POST /pacientes/anamnese
router.post("/anamnese", auth, salvar);

// GET /pacientes/anamnese
router.get("/anamnese", auth, minhas);

module.exports = router;
