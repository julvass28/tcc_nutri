// backend/models/Receita.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Receita = sequelize.define("Receita", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  categoria: {
    type: DataTypes.ENUM(
      "clinica",
      "pediatrica",
      "esportiva",
      "emagrecimento",
      "intolerancias"
    ),
    allowNull: false,
  },
  resumo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bannerUrl: {
    type: DataTypes.STRING, // imagem do topo no detalhe
    allowNull: true,
  },
  thumbUrl: {
    type: DataTypes.STRING, // imagem do card/listagem
    allowNull: true,
  },
  ingredientes: {
    type: DataTypes.JSON, // array de strings
    allowNull: true,
  },
  passos: {
    type: DataTypes.JSON, // array de strings
    allowNull: true,
  },
  dicas: {
    type: DataTypes.JSON, // array de strings
    allowNull: true,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
});

module.exports = Receita;
