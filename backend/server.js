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

// -------------------------
// CORS FIX SUPER SEGURO 💚
// -------------------------

const allowedOrigins = [
  "https://drasimanoviski.com",
  "https://www.drasimanoviski.com",
  "http://drasimanoviski.com",
  "http://www.drasimanoviski.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // permitir requests do próprio backend, cron, certbot, etc:
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Bloqueado por CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());

// Rotas
const agendaRoutes = require("./routes/agendaRoutes");
app.use("/agenda", agendaRoutes);

app.use("/admin/config", adminConfigRoutes);
app.use("/admin/agenda", adminAgendaRoutes);
app.use("/config", publicContactRoutes);

const paymentsRoutes = require("./routes/paymentsRoutes");
app.use(paymentsRoutes);

app.use("/pacientes", anamneseRoutes);

const configRoutes = require("./routes/configRoutes");
app.use("/", configRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

app.use(authRoutes);
app.use(receitaRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/receitas", adminRecipeRoutes);
app.use(faqRoutes);
app.use("/admin/faq", adminFaqRoutes);

// DB + Start
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
