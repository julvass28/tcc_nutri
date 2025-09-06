require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
const Usuario = require('../models/Usuario');

(async () => {
  try {
    await sequelize.authenticate();

    const email = process.env.ADMIN_EMAIL || 'admin@nutri.com';
    const senha = process.env.ADMIN_PASSWORD || 'admin123';
    const nome  = process.env.ADMIN_NAME || 'Admin Nutricionista';

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      existente.isAdmin = true;
      await existente.save();
      console.log('✅ Usuário já existia. Promovido a admin:', email);
    } else {
      const hash = await bcrypt.hash(senha, 10);
      await Usuario.create({
        nome, sobrenome: '',
        email, senha: hash, isAdmin: true
      });
      console.log('✅ Admin criado:', { email, senha });
    }
    process.exit(0);
  } catch (e) {
    console.error('Erro ao criar admin:', e.message);
    process.exit(1);
  }
})();
