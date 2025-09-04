const BACK_URL = import.meta.env.VITE_BACK_URL || "http://localhost:3000";

export async function createPreference(payload) {
  const res = await fetch(`${BACK_URL}/api/payments/create-preference`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Falha ao criar preferência");
  return res.json();
}

export async function getPaymentStatus(appointmentId) {
  const res = await fetch(`${BACK_URL}/api/payments/status/${appointmentId}`);
  if (!res.ok) throw new Error("Falha ao consultar status");
  return res.json();
}
