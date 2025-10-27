// backend/models/ConfigSistema.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ConfigSistema = sequelize.define("ConfigSistema", {
  chave: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  valor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "config_sistema",
  underscored: true,
});

module.exports = ConfigSistema;
