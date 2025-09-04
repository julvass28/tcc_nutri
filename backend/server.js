const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const sequelize = require('./config/db');
require('./models/Usuario');
const authRoutes = require('./routes/authRoutes');

const app = express();

// CORS
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://tcc-nutri.vercel.app',
];

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));



// ⚠️ Estes middlewares tinham sumido
app.use(express.json());
app.use(helmet());
app.use(compression());

// (opcional) healthcheck
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

// Rotas
const agendaRoutes = require('./routes/agendaRoutes');
app.use('/agenda', agendaRoutes);
app.use(authRoutes);

const port = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com DB OK');
    await sequelize.sync();
    console.log('✅ Sequelize sync OK');

    app.listen(port, () => {
      console.log(`🚀 API rodando na porta ${port}`);
    });
  } catch (e) {
    console.error('🛑 Falha ao iniciar:', e.message);
    process.exit(1);
  }
})();
