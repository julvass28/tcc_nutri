const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const receitaRoutes = require("./routes/receitaRoutes");
const adminRecipeRoutes = require("./routes/adminRecipeRoutes");
const faqRoutes = require("./routes/faqRoutes");
const adminConfigRoutes = require("./routes/adminConfigRoutes");
const adminAgendaRoutes = require("./routes/adminAgendaRoutes");
const adminFaqRoutes = require("./routes/adminFaqRoutes");
const anamneseRoutes = require("./routes/anamneseRoutes");
const publicContactRoutes = require("./routes/publicContactRoutes");
const agendaRoutes = require("./routes/agendaRoutes");
const paymentsRoutes = require("./routes/paymentsRoutes");
const configRoutes = require("./routes/configRoutes");

const sequelize = require("./config/db");

// Models
require("./models/Usuario");
require("./models/Faq");
require("./models/AgendaConfig");
require("./models/Agendamentos");
require("./models/ReservaTemp");
require("./models/Bloqueio");
require("./models/ConfigSistema");
require("./models/Anamnese");

const app = express();
app.set("trust proxy", 1);

// -------------------------
//  CORS CONFIG
// -------------------------

// FRONTEND_URL no .env: https://www.drasimanoviski.com/
const RAW_FRONTEND_URL =
  process.env.FRONTEND_URL || "https://drasimanoviski.com";

const FRONTEND_URL = RAW_FRONTEND_URL.replace(/\/$/, "");

const allowedOrigins = [
  FRONTEND_URL,
  "https://drasimanoviski.com",
  "https://www.drasimanoviski.com",
  "http://drasimanoviski.com",
  "http://www.drasimanoviski.com",
  // para testes locais:
  "http://localhost:5173",
];

app.use(
  cors({
    origin(origin, callback) {
      // sem origin = tipo Postman, Certbot, scripts internos → libera
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("❌ CORS bloqueado para origem:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// -------------------------
//  Middlewares
// -------------------------

app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());

// -------------------------
//  Rotas
// -------------------------

// Agenda pública
app.use("/agenda", agendaRoutes);

// Admin configs e agenda admin
app.use("/admin/config", adminConfigRoutes);
app.use("/admin/agenda", adminAgendaRoutes);

// Contato público /config/contact-info
app.use("/config", publicContactRoutes);

// Pagamentos (Mantém as rotas como foram definidas no arquivo)
app.use(paymentsRoutes);

// Anamnese / pacientes
app.use("/pacientes", anamneseRoutes);

// Config geral (homepage, etc.)
app.use("/", configRoutes);

// Uploads estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Healthcheck
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

// Rotas principais de auth, receitas, admin, FAQ
app.use(authRoutes); // /login, /register, etc.
app.use(receitaRoutes); // /receitas
app.use("/admin", adminRoutes); // /admin/*
app.use("/admin/receitas", adminRecipeRoutes);
app.use(faqRoutes); // /faq
app.use("/admin/faq", adminFaqRoutes);

// -------------------------
//  DB + Start
// -------------------------

const port = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com DB OK");

    const ALTER = process.env.DB_SYNC_ALTER === "1";
    await sequelize.sync({ alter: ALTER });
    console.log("✅ Sequelize sync OK");

    app.listen(port, () => {
      console.log(`🚀 API rodando na porta ${port}`);
    });
  } catch (e) {
    console.error("🛑 Falha ao iniciar:", e.message);
    process.exit(1);
  }
})();
