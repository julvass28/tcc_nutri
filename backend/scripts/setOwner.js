require('dotenv').config();
const sequelize = require('../config/db');
const Usuario = require('../models/Usuario');

const EMAIL = process.env.SUPERADMIN_EMAIL; // defina no .env

(async () => {
  try {
    await sequelize.authenticate();
    const u = await Usuario.findOne({ where: { email: EMAIL } });
    if (!u) {
      console.error('Usuário não encontrado:', EMAIL);
      process.exit(1);
    }
    await u.update({ isOwner: true, isAdmin: true });
    console.log('✅ Dono definido com sucesso:', EMAIL);
    process.exit(0);
  } catch (e) {
    console.error('Erro:', e);
    process.exit(1);
  }
})();
