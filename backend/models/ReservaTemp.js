// models/ReservaTemp.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ReservaTemp = sequelize.define('ReservaTemp', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.BIGINT, allowNull: false },
    inicio: { type: DataTypes.DATE, allowNull: false }, // início do slot
    fim: { type: DataTypes.DATE, allowNull: false }, // fim do slot (= inicio + intervalo)
    expires_at: { type: DataTypes.DATE, allowNull: false }, // agora + 15 min (por ex)
    payment_ref: { type: DataTypes.STRING(64), allowNull: false, unique: true }, // linka com pagamento
     especialidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    idempotency_key: { type: DataTypes.STRING(64), allowNull: true, unique: true }  // evita duplo POST
}, {
    tableName: 'reservas_temp',
    underscored: true,
    indexes: [
        { fields: ['expires_at'] },
        // 1 hold por horário exato; antes de criar um novo hold, limpamos os expirados
        { unique: true, fields: ['inicio'] }
    ]
});

module.exports = ReservaTemp;
