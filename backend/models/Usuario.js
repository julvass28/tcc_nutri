const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  nome: DataTypes.STRING,
  sobrenome: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  senha: DataTypes.STRING,
  data_nascimento: DataTypes.DATE, // se quiser data sem hora, pode trocar pra DATEONLY
  genero: DataTypes.STRING,
  altura: DataTypes.FLOAT,
  peso: DataTypes.FLOAT,
  objetivo: DataTypes.STRING,
  tokenRecuperacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tokenExpiraEm: {
    type: DataTypes.DATE,
    allowNull: true,
  }
});

module.exports = Usuario; // <-- sem acento e variável certa
