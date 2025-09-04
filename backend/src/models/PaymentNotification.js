import { DataTypes } from "sequelize";

export default (sequelize) => {
  const PaymentNotification = sequelize.define(
    "PaymentNotification",
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      headers: { type: DataTypes.JSON },
      body: { type: DataTypes.JSON },
      verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "payment_notifications",
      underscored: true,
    }
  );

  return PaymentNotification;
};
