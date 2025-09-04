import { Payment } from "../db/index.js";
import { Payment as MPPayment } from "mercadopago";
import { mpClient } from "../lib/mercadopago.js";

export async function createOrUpdateFromPreference({
  appointmentId,
  preferenceId,
  amount,
  method, // 'credit_card' | 'pix'
}) {
  // cria um registro "rascunho" quando a preference é criada
  const [pay, created] = await Payment.findOrCreate({
    where: { appointment_id: appointmentId },
    defaults: {
      appointment_id: appointmentId,
      preference_id: preferenceId,
      amount,
      method,
      status: "initiated",
    },
  });

  if (!created) {
    pay.preference_id = preferenceId;
    pay.amount = amount;
    pay.method = method;
    await pay.save();
  }

  return pay;
}

export async function applyPaymentUpdateFromMP(paymentId) {
  // busca dados do pagamento direto no MP (fonte da verdade)
  const mp = new MPPayment(mpClient);
  const mpPay = await mp.get({ id: paymentId });

  const appointmentId = mpPay?.metadata?.appointmentId;
  const method = mpPay?.payment_type_id; // 'credit_card' | 'pix' | ...
  const installments = mpPay?.installments || null;
  const status = mpPay?.status; // approved | pending | rejected | ...
  const status_detail = mpPay?.status_detail;
  const amount = mpPay?.transaction_amount;
  const payer_email = mpPay?.payer?.email || null;

  // dados Pix (opcional)
  const qr_base64 = mpPay?.point_of_interaction?.transaction_data?.qr_code_base64 || null;

  let pay = await Payment.findOne({ where: { appointment_id: appointmentId } });
  if (!pay) {
    // fallback: cria se não existir (não deve ocorrer se a preference foi criada via nosso backend)
    pay = await Payment.create({
      appointment_id: appointmentId,
      mp_payment_id: paymentId,
      method,
      amount,
      status,
      status_detail,
      installments,
      payer_email,
      qr_base64,
    });
  } else {
    pay.mp_payment_id = paymentId;
    pay.method = method || pay.method;
    pay.amount = amount ?? pay.amount;
    pay.status = status;
    pay.status_detail = status_detail;
    pay.installments = installments;
    pay.payer_email = payer_email ?? pay.payer_email;
    if (qr_base64) pay.qr_base64 = qr_base64;
    await pay.save();
  }

  return pay;
}

export async function getPaymentStatusByAppointment(appointmentId) {
  const pay = await Payment.findOne({ where: { appointment_id: appointmentId } });
  if (!pay) return null;
  return {
    appointmentId: pay.appointment_id,
    status: pay.status,
    status_detail: pay.status_detail,
    method: pay.method,
    amount: pay.amount,
    installments: pay.installments,
    preference_id: pay.preference_id,
    mp_payment_id: pay.mp_payment_id,
    payer_email: pay.payer_email,
  };
}
