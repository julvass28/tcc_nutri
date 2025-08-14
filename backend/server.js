const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const sequelize = require('./config/db');
require('./models/Usuario'); // registra o model
const authRoutes = require('./routes/authRoutes');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://tcc-nutri.vercel.app/';
app.use(cors({
  origin: FRONTEND_URL === 'https://tcc-nutri.vercel.app/' ? true : [FRONTEND_URL],
  credentials: true
}));

app.use(express.json());
app.use(helmet());
app.use(compression());

// Healthcheck pra monitorar no Render
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

// Rotas
app.use(authRoutes);

const port = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com DB OK');
    // Em produção, evite alter: true. Se quiser manter, saiba que pode quebrar schema.
    await sequelize.sync(); // simples. Se tiver migrations, rode elas via script.
    console.log('✅ Sequelize sync OK');

    app.listen(port, () => {
      console.log(`🚀 API rodando na porta ${port}`);
    });
  } catch (e) {
    console.error('🛑 Falha ao iniciar:', e.message);
    process.exit(1);
  }
})();
