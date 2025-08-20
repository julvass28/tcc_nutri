// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');
require('./models/Usuario');
const authRoutes = require('./routes/authRoutes');

const app = express();

const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://tcc-nutri.vercel.app').replace(/\/$/, '');
const allowedOrigins = [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    return cb(null, allowedOrigins.includes(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(compression());

// NOVO: servir uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Healthcheck
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

// Rotas
app.use(authRoutes);

const port = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com DB OK');

    // ⚠️ DEV ONLY (rodar 1x para criar coluna fotoUrl):
    await sequelize.sync();
    // Depois de criado, volte para: await sequelize.sync();

    console.log('✅ Sequelize sync OK');

    app.listen(port, () => {
      console.log(`🚀 API rodando na porta ${port}`);
    });
  } catch (e) {
    console.error('🛑 Falha ao iniciar:', e.message);
    process.exit(1);
  }
})();
