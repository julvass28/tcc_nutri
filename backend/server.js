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
const faqRoutes = require("./routes/faqRoutes");           // ← público
const adminConfigRoutes = require("./routes/adminConfigRoutes");
const adminAgendaRoutes = require("./routes/adminAgendaRoutes");
const adminFaqRoutes = require("./routes/adminFaqRoutes"); // ← admin
const anamneseRoutes = require("./routes/anamneseRoutes");
const publicContactRoutes = require("./routes/publicContactRoutes"); // ← NOVO
const sequelize = require("./config/db");
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

const FRONTEND_URL = (
  process.env.FRONTEND_URL || "https://tcc-nutri.vercel.app"
).replace(/\/$/, "");

const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// middlewares
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const agendaRoutes = require("./routes/agendaRoutes");
app.use("/agenda", agendaRoutes);

app.use(compression());

// rotas de admin/config + agenda + contato público
app.use("/admin/config", adminConfigRoutes);
app.use("/admin/agenda", adminAgendaRoutes);
app.use("/config", publicContactRoutes); // ← NOVO: /config/contact-info

const paymentsRoutes = require("./routes/paymentsRoutes");
app.use(paymentsRoutes);

app.use("/pacientes", anamneseRoutes);
const configRoutes = require("./routes/configRoutes");
app.use("/", configRoutes);

// uploads estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// healthcheck
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

// rotas principais
app.use(authRoutes); // /login, /register, /me ...
app.use(receitaRoutes); // público: /receitas, /receitas/:slug
app.use("/admin", adminRoutes); // /admin/users ...
app.use("/admin/receitas", adminRecipeRoutes); // CRUD receitas admin
app.use(faqRoutes); // público: /faq
app.use("/admin/faq", adminFaqRoutes); // admin: /admin/faq/*

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
