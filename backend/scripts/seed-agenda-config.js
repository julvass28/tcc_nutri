// scripts/seed-agenda-config.js
require('dotenv').config();

const sequelize = require('../config/db');
const AgendaConfig = require('../models/AgendaConfig');

(async () => {
  try {
    // garante conexão e que as tabelas existam
    await sequelize.authenticate();
    await sequelize.sync();

    // 🔧 grade padrão — pode ajustar depois
    const semana = [
      // { dia_semana: 0, inicio: '00:00:00', fim: '00:00:00', intervaloMin: 30 }, // domingo: sem atendimento → NÃO criar linha
      { dia_semana: 1, inicio: '09:00:00', fim: '18:00:00', intervaloMin: 30 }, // segunda
      { dia_semana: 2, inicio: '09:00:00', fim: '18:00:00', intervaloMin: 30 }, // terça
      { dia_semana: 3, inicio: '09:00:00', fim: '18:00:00', intervaloMin: 30 }, // quarta
      { dia_semana: 4, inicio: '09:00:00', fim: '18:00:00', intervaloMin: 30 }, // quinta
      { dia_semana: 5, inicio: '09:00:00', fim: '18:00:00', intervaloMin: 30 }, // sexta
      { dia_semana: 6, inicio: '09:00:00', fim: '12:00:00', intervaloMin: 30 }  // sábado
    ];

    for (const cfg of semana) {
      // se já existe o dia, atualiza; se não, cria
      const [row, created] = await AgendaConfig.findOrCreate({
        where: { dia_semana: cfg.dia_semana },
        defaults: cfg
      });
      if (!created) {
        await row.update(cfg);
      }
    }

    console.log('✅ Agenda seed OK');
    process.exit(0);
  } catch (e) {
    console.error('🛑 Seed falhou:', e);
    process.exit(1);
  } finally {
   try { await sequelize.close(); } catch {}
  }
})();
