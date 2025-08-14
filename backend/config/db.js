const { Sequelize } = require('sequelize');
require('dotenv').config();

const {
  DATABASE_URL,
  DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
} = process.env;

const common = {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {}
};

// Em provedores gerenciados, quase sempre precisa SSL
common.dialectOptions.ssl = { require: true, rejectUnauthorized: false };

const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, common)
  : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      ...common,
      host: DB_HOST,
      port: DB_PORT || 3306
    });

module.exports = sequelize;
