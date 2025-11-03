// src/pages/admin/AdminPreco.jsx
import { useEffect, useMemo, useState } from "react";
import "../../css/admin-preco.css";
import {
  getPrecoCents,
  setPrecoCentsAdmin,
  formatBRLFromCents,
} from "../../services/config";

const MIN_SPINNER_MS = 800;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export default function AdminPreco() {
  const [cents, setCents] = useState(null);
  const [input, setInput] = useState("180,00");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const t0 = performance.now();
      try {
        const v = await getPrecoCents();
        setCents(v);
        setInput((v / 100).toFixed(2).replace(".", ","));
      } catch {
        setMsg("Falha ao carregar preço atual.");
      } finally {
        const left = Math.max(0, MIN_SPINNER_MS - (performance.now() - t0));
        if (left) await sleep(left);
        setLoading(false);
      }
    })();
  }, []);

  const preview = useMemo(() => {
    const n = Number(String(input).replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(n)) return "—";
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }, [input]);

  async function salvar() {
    setMsg("");
    setSaving(true);
    const t0 = performance.now();
    try {
      const n = Number(String(input).replace(/\./g, "").replace(",", "."));
      if (!Number.isFinite(n) || n < 0)
        throw new Error("Informe um valor válido.");

      const novoEmCents = Math.round(n * 100);

      const saved = await setPrecoCentsAdmin(novoEmCents);
      setCents(saved);
      setInput((saved / 100).toFixed(2).replace(".", ","));
      setMsg("Preço atualizado com sucesso!");
    } catch (e) {
      setMsg(e.message || "Erro ao salvar.");
    } finally {
      const left = Math.max(0, MIN_SPINNER_MS - (performance.now() - t0));
      if (left) await sleep(left);
      setSaving(false);
    }
  }

  return (
    <div className="admin-preco__page">
      {(loading || saving) && (
        <div className="adm-op-overlay" role="status" aria-live="polite">
          <div className="adm-op-card">
            <i className="fas fa-spinner fa-spin" aria-hidden="true" />
            <span>{loading ? "Carregando..." : "Salvando..."}</span>
          </div>
        </div>
      )}

      <div className="admin-preco__card">
        <div className="admin-preco__header">
          <h1>Preço da Consulta</h1>
          <p>
            Altere aqui o valor cobrado em todo o site (agenda, home e
            checkout).
          </p>
        </div>

        <div className="admin-preco__grid">
          <div className="admin-preco__field">
            <label className="admin-preco__label">Valor atual</label>
            <div className="admin-preco__value">
              {Number.isFinite(cents) ? formatBRLFromCents(cents) : "—"}
            </div>
          </div>

          <div className="admin-preco__field">
            <label className="admin-preco__label">Novo valor (R$)</label>
            <input
              className="admin-preco__input"
              placeholder="0,00"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <small className="admin-preco__hint">
              Use vírgula como separador decimal (ex.: 180,00).
            </small>
          </div>

          <div className="admin-preco__field">
            <label className="admin-preco__label">Pré-visualização</label>
            <div className="admin-preco__preview">{preview}</div>
          </div>
        </div>

        <div className="admin-preco__actions">
          <button
            className="admin-preco__btn admin-preco__btn--primary"
            onClick={salvar}
            disabled={saving}
          >
            Salvar valor
          </button>
        </div>

        {msg && <div className="admin-preco__message">{msg}</div>}
      </div>
    </div>
  );
}
