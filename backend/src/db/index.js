import { Sequelize } from "sequelize";
import { dbConfig } from "../config/database.js";
import PaymentModel from "../models/Payment.js";
import PaymentNotificationModel from "../models/PaymentNotification.js";

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

export const Payment = PaymentModel(sequelize);
export const PaymentNotification = PaymentNotificationModel(sequelize);

export async function initDb() {
  await sequelize.authenticate();
  // Em desenvolvimento, cria/atualiza as tabelas automaticamente
  if (String(process.env.DB_SYNC).toLowerCase() === "true") {
    await sequelize.sync({ alter: true });
  }
}
