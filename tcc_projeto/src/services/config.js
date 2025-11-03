// src/services/config.js
import { API, fetchAuth } from "./api";

const PRECO_CACHE_KEY = "precoConsulta.cents";

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
    body: JSON.stringify({
      valor_cents: Math.max(0, Math.round(Number(cents) || 0)),
    }),
  });

  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d?.erro || "Falha ao salvar preço.");
  }

  const d = await r.json();
  const saved = Number(d.valor_cents);

  // 🔥 invalida/atualiza o cache usado pelo hook
  try {
    localStorage.setItem(
      PRECO_CACHE_KEY,
      JSON.stringify({ v: saved, t: Date.now() })
    );
  } catch (_) {
    // se der erro no localStorage, ignora
  }

  return saved;
}

export function formatBRLFromCents(cents) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export { PRECO_CACHE_KEY };
