// src/services/api.js
const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function fetchAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });
}

export async function fetchJSON(url, options = {}) {
  const r = await fetch(url, options);
  if (!r.ok) {
    let msg = "Erro na requisição";
    try { const j = await r.json(); msg = j?.erro || j?.message || msg; } catch {}
    throw new Error(msg);
  }
  return r.json();
}

export { API };
