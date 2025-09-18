// backend/models/Faq.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Faq = sequelize.define("Faq", {
  pergunta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resposta: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING, // opcional (ex.: "Consultas", "Planos", etc.)
    allowNull: true,
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // será preenchido na criação
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Faq;
