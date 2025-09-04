const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const Usuario = require('./models/Usuario'); // força a criação da tabela
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(authRoutes);

// Sincroniza o banco com os models
sequelize.sync().then(() => {
  console.log("📦 Banco sincronizado com Sequelize!");
  app.listen(process.env.PORT, () =>
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`)
  );
});
 const receitaRoutes = require("./routes/receitaRoutes");
app.use(receitaRoutes);
