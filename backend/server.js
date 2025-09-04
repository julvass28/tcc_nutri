import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { initDb } from "./src/db/index.js";
import paymentsRouter from "./src/routes/payments.js";
import { rawBody, webhookHandler } from "./src/webhooks/mercadopago.js";

const app = express();

// CORS básico: ajuste para teu domínio em produção
app.use(cors({ origin: process.env.FRONT_URL, credentials: true }));

// JSON normal para todas as rotas (menos o webhook)
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));

// Rotas REST de pagamento
app.use("/api/payments", paymentsRouter);

// Webhook do MP precisa de RAW body pra validar assinatura
app.post("/api/payments/webhook", rawBody, webhookHandler);

// Sobe servidor depois de garantir conexão + tabelas
const PORT = process.env.PORT || 3000;
initDb()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server ON at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("DB init failed:", err);
    process.exit(1);
  });
