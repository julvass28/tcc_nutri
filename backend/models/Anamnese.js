// backend/models/Anamnese.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
; // 👈 se o teu arquivo for outro nome, troca aqui

// ⚠️ IMPORTANTE
// No teu projeto eu vi só "config", não vi o nome do arquivo.
// Se o teu sequelize está em "../config/db.js" ou "../config/sequelize.js",
// troca essa linha de cima pro caminho certo, beleza?

const Anamnese = sequelize.define(
  "Anamnese",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_ref: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    booking_hold_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    data_consulta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hora_consulta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modalidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    respostas: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "anamnese",
    timestamps: true,
  }
);

module.exports = Anamnese;
