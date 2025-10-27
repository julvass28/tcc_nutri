// src/services/config.js
import { API, fetchAuth } from "./api";

/** Leitura pública (sem auth) */
export async function getPrecoCents() {
  const r = await fetch(`${API}/config/consulta-preco`);
  const data = await r.json();
  return Number(data?.valor_cents ?? 0);
}

/** Admin: salvar (com auth) */
export async function setPrecoCentsAdmin(cents) {
  const r = await fetchAuth(`${API}/admin/config/consulta-preco`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ valor_cents: Math.max(0, Math.round(Number(cents) || 0)) }),
  });
  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d?.erro || "Falha ao salvar preço.");
  }
  const d = await r.json();
  return Number(d.valor_cents);
}

export function formatBRLFromCents(cents) {
  return (cents/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
