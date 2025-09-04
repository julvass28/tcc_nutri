import express from "express";
import { Payment as MPPayment } from "mercadopago";
import { mpClient } from "../lib/mercadopago.js"; // esse é o client que usa o ACCESS_TOKEN
import { requireUser } from "../middleware/auth.js"; // seu middleware que pega o x-user-id

const router = express.Router();

// Rota pagamento com cartão
router.post("/card", requireUser, async (req, res) => {
  try {
    const {
      appointmentId, description, amount, token,
      installments = 1, payment_method_id, issuer_id,
      payer
    } = req.body;

    if (!token || !amount || !payer?.email || !appointmentId)
      return res.status(400).json({ error: "dados obrigatórios faltando" });

    const mp = new MPPayment(mpClient);
    const result = await mp.create({
      body: {
        transaction_amount: Number(amount),
        token,
        description,
        installments: Number(installments),
        ...(payment_method_id ? { payment_method_id } : {}),
        ...(issuer_id ? { issuer_id } : {}),
        payer: {
          email: payer.email,
          ...(payer.identification ? { identification: payer.identification } : {})
        },
        metadata: { appointmentId, userId: req.userId },
        notification_url: `${process.env.BACK_URL}/api/payments/webhook`,
      },
    });

    res.json(result);
  } catch (e) {
    console.error("CARD ERR:", e?.response?.data || e);
    res.status(500).json({ error: "Falha ao criar pagamento com cartão" });
  }
});

// Rota pagamento com Pix
router.post("/pix", requireUser, async (req, res) => {
  try {
    const { appointmentId, description, amount, payer } = req.body;
    if (!amount || !payer?.email || !appointmentId)
      return res.status(400).json({ error: "dados obrigatórios faltando" });

    const mp = new MPPayment(mpClient);
    const result = await mp.create({
      body: {
        transaction_amount: Number(amount),
        description,
        payment_method_id: "pix",
        payer: { email: payer.email },
        metadata: { appointmentId, userId: req.userId },
        notification_url: `${process.env.BACK_URL}/api/payments/webhook`,
      },
    });

    const tx = result?.point_of_interaction?.transaction_data || {};
    res.json({
      id: result.id,
      status: result.status,
      qr_code: tx.qr_code,
      qr_code_base64: tx.qr_code_base64,
      expiration_date: tx.expiration_date,
    });
  } catch (e) {
    console.error("PIX ERR:", e?.response?.data || e);
    res.status(500).json({ error: "Falha ao criar pagamento Pix" });
  }
});

export default router;
