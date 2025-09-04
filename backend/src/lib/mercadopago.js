import { MercadoPagoConfig } from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});
