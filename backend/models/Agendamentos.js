// backend/models/Agendamentos.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Agendamento = sequelize.define(
  "Agendamento",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    inicio: {
      type: DataTypes.DATE,
      allowNull: false, // data + hora do início
    },

    fim: {
      type: DataTypes.DATE,
      allowNull: false, // data + hora do fim
    },

    status: {
      // pendente / confirmada / cancelada / finalizada
      type: DataTypes.ENUM("pendente", "confirmada", "cancelada", "finalizada"),
      allowNull: false,
      defaultValue: "confirmada",
    },

    // especialidade da consulta (slug): clinica, emagrecimento, esportiva, pediatrica, intolerancias
    especialidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // usado pra idempotência de pagamento (é o seu payment_ref)
    idempotency_key: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    },

    // 👇 flag pra saber rápido se aquela consulta já tem anamnese preenchida
    anamnese_preenchida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "agendamentos",
    underscored: true,
    indexes: [
      // 1 consulta por horário de início
      { unique: true, fields: ["inicio"] },
    ],
  }
);

module.exports = Agendamento;
