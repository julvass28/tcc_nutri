// backend/models/SiteConfig.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SiteConfig = sequelize.define("SiteConfig", {
  key: { type: DataTypes.STRING(64), allowNull: false, unique: true },
  value: { type: DataTypes.STRING(255), allowNull: false },
}, {
  tableName: "site_config",
  underscored: true,
});

module.exports = SiteConfig;
