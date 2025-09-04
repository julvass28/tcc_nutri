import express from "express";
import crypto from "crypto";
import { PaymentNotification } from "../db/index.js";
import { applyPaymentUpdateFromMP } from "../services/paymentsService.js";


export const rawBody = express.raw({ type: "*/*" });

export async function webhookHandler(req, res) {
  try {
    const signature = req.header("x-signature"); // contém ts e v1
    const requestId = req.header("x-request-id");
    const secret = process.env.MP_WEBHOOK_SECRET;

    const bodyText = req.body?.toString?.("utf8") || "";
    const body = bodyText ? JSON.parse(bodyText) : {};

    // Loga a notificação (útil pra debug)
    const log = await PaymentNotification.create({
      headers: { "x-signature": signature, "x-request-id": requestId },
      body,
      verified: false
    });

    // Verificação de assinatura
    const [pTs, pV1] = (signature || "").split(",").map((s) => s.trim());
    const ts = pTs?.split("=")[1];
    const v1 = pV1?.split("=")[1];
    if (!ts || !v1 || !requestId) {
      return res.status(400).send("Missing signature data");
    }

    const paymentId = body?.data?.id;
    if (!paymentId) {
      // ping/teste
      await log.update({ verified: false });
      return res.status(200).send("noop");
    }

    // Manifest padrão: "id:PAYMENT_ID;request-id:REQUEST_ID;ts:TS"
    const manifest = `id:${paymentId};request-id:${requestId};ts:${ts}`;
    const calc = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

    if (calc !== v1) {
      await log.update({ verified: false });
      return res.status(401).send("Invalid signature");
    }

    // Assinatura OK → aplica atualização no nosso DB
    await applyPaymentUpdateFromMP(paymentId);
    await log.update({ verified: true });

    return res.status(200).send("ok");
  } catch (err) {
    console.error("webhook error:", err);
    return res.status(500).send("error");
  }
}
