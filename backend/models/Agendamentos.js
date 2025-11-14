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

    // 👇 VOLTANDO: especialidade escolhida no fechamento da consulta
    // valores esperados: "clinica", "emagrecimento", "esportiva",
    // "pediatrica", "intolerancias" (ou o que vc já estiver salvando)
    especialidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    idempotency_key: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
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
