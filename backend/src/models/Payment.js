// backend/src/models/Payment.js
import { DataTypes } from "sequelize";
export default (sequelize) => {
  return sequelize.define("Payment", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    appointment_id: { type: DataTypes.BIGINT, allowNull: false },
    user_id: { type: DataTypes.BIGINT },                 // <— NOVO
    preference_id: { type: DataTypes.STRING(80) },
    mp_payment_id: { type: DataTypes.BIGINT },
    status: { type: DataTypes.STRING(40) },
    status_detail: { type: DataTypes.STRING(80) },
    method: { type: DataTypes.STRING(40) },              // credit_card | pix
    installments: { type: DataTypes.INTEGER },
    amount: { type: DataTypes.DECIMAL(10,2) },
    payer_email: { type: DataTypes.STRING(120) },
    qr_base64: { type: DataTypes.TEXT },                 // QR Pix opcional
  }, { tableName: "payments", underscored: true });
};
