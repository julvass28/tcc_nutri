const { Sequelize } = require('sequelize');
require('dotenv').config();

const {
  DATABASE_URL,
  DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME,
  DB_TZ, // opcional, ex: -03:00
} = process.env;

// base comum p/ ambas as formas de conexão
const base = {
  dialect: 'mysql',
  logging: false,

  // grava no fuso correto
  timezone: DB_TZ || '-03:00',

  // lê DATETIME como string (sem converter pra UTC)
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
};

let sequelize;

if (DATABASE_URL) {
  // ex.: ClearDB/PlanetScale/Render → geralmente precisa SSL
  sequelize = new Sequelize(DATABASE_URL, {
    ...base,
    dialectOptions: {
      ...base.dialectOptions,
      ssl: { require: true, rejectUnauthorized: false },
    },
  });
} else {
  // ambiente local (sem SSL)
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    ...base,
    host: DB_HOST,
    port: DB_PORT || 3306,
  });
}

module.exports = sequelize;
