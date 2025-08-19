// backend/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const {
  DATABASE_URL,
  DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
} = process.env;

const base = {
  dialect: 'mysql',
  logging: false,
};

let sequelize;

if (DATABASE_URL) {
  // Produção / serviços gerenciados → geralmente exigem SSL
  sequelize = new Sequelize(DATABASE_URL, {
    ...base,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  });
} else {
  // Localhost → sem SSL
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    ...base,
    host: DB_HOST,
    port: DB_PORT || 3306,
  });
}

module.exports = sequelize;

