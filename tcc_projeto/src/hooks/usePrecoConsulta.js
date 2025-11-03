// src/hooks/usePrecoConsulta.js
import { useEffect, useState } from "react";
import { getPrecoCents } from "../services/config";
import { PRECO_CACHE_KEY } from "../services/config";

const CACHE_TTL_MS = 5 * 60 * 1000;

export default function usePrecoConsulta() {
  const [cents, setCents] = useState(() => {
    const raw = localStorage.getItem(PRECO_CACHE_KEY);
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      if (Date.now() - obj.t > CACHE_TTL_MS) return null;
      return Number(obj.v);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!Number.isFinite(cents));
  const [error, setError] = useState("");

  useEffect(() => {
    // se já tenho um valor vindo do cache válido, não busco
    if (Number.isFinite(cents)) return;

    (async () => {
      try {
        const v = await getPrecoCents();
        setCents(v);
        localStorage.setItem(
          PRECO_CACHE_KEY,
          JSON.stringify({ v, t: Date.now() })
        );
      } catch {
        setError("Não foi possível carregar o preço.");
      } finally {
        setLoading(false);
      }
    })();
  }, [cents]);

  return { cents, setCents, loading, error };
}
