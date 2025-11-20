// src/pages/Pagamento.jsx
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API } from "../services/api";
import usePrecoConsulta from "../hooks/usePrecoConsulta";
import { formatBRLFromCents } from "../services/config";
import "../css/pagamento.css";

const MODALIDADE_PADRAO = "Online";
const DURACAO_PADRAO_MIN = 50;
const PIX_TTL_MS = 10 * 60 * 1000; // 10 minutos

const ESPECIALIDADE_LABELS = {
  clinica: "Nutrição Clínica",
  emagrecimento: "Emagrecimento e Obesidade",
  esportiva: "Nutrição Esportiva",
  pediatrica: "Nutrição Pediátrica",
  intolerancias: "Intolerâncias Alimentares",
};

function mapEspecialidade(especialidade) {
  if (!especialidade) return "Nutrição";
  return ESPECIALIDADE_LABELS[especialidade] || especialidade;
}

export default function Pagamento() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { cents: precoCents } = usePrecoConsulta();

  const [paymentRef, setPaymentRef] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [bookingInfo, setBookingInfo] = useState({
    date: "",
    time: "",
    especialidade: "",
  });

  // PIX
  const [qrPix, setQrPix] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [copied, setCopied] = useState(false);

  // expiry / countdown
  const [expiresAt, setExpiresAt] = useState(null); // ms timestamp
  const [remaining, setRemaining] = useState(0);
  const [expired, setExpired] = useState(false);

  // polling control
  const pollingRef = useRef(null);
  const isMountedRef = useRef(true);
  const countdownRef = useRef(null);

  // utility: format date BR
  const formatDateBr = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = String(iso).split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  };

  // restore booking + PIX pending if exist
  useEffect(() => {
    isMountedRef.current = true;

    const ref = sessionStorage.getItem("booking.payment_ref");
    const date = sessionStorage.getItem("booking.date");
    const time = sessionStorage.getItem("booking.time");
    const especialidadeLabel = sessionStorage.getItem("booking.especialidade");
    const especialidadeSlug = sessionStorage.getItem("booking.especialidade_slug");

    if (ref) {
      setPaymentRef(ref);
    } else {
      setMensagem("Reserva não encontrada. Volte e selecione o horário.");
    }

    setBookingInfo({
      date,
      time,
      especialidade: especialidadeSlug || especialidadeLabel,
    });

    // restaura PIX (se já foi gerado antes)
    const pixRef = sessionStorage.getItem("pix.payment_ref");
    const pixStatus = sessionStorage.getItem("pix.status");
    const pixQrStored = sessionStorage.getItem("pix.qr");
    const pixCodeStored = sessionStorage.getItem("pix.code");
    const pixExpires = sessionStorage.getItem("pix.expires_at");

    if (pixRef && pixStatus === "pending" && pixQrStored && pixCodeStored) {
      setPaymentRef(pixRef);
      setQrPix(pixQrStored);
      setPixCode(pixCodeStored);
      setMensagem("Use o QR Code ou copie o código abaixo para concluir o pagamento via PIX.");
      startPolling(pixRef);
      if (pixExpires) {
        const ex = Number(pixExpires);
        setExpiresAt(ex);
        const now = Date.now();
        if (now >= ex) {
          handleExpire();
        } else {
          startCountdown(ex);
        }
      } else {
        // se não tiver expiry salvo, cria um local (compatibilidade)
        const ex = Date.now() + PIX_TTL_MS;
        sessionStorage.setItem("pix.expires_at", String(ex));
        setExpiresAt(ex);
        startCountdown(ex);
      }
    }

    return () => {
      isMountedRef.current = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCountdown(expiresAtMs) {
    if (countdownRef.current) clearInterval(countdownRef.current);
    const tick = () => {
      const rem = Math.max(0, expiresAtMs - Date.now());
      setRemaining(rem);
      if (rem <= 0) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        handleExpire();
      }
    };
    tick();
    countdownRef.current = setInterval(tick, 1000);
  }

  function handleExpire() {
    setExpired(true);
    setMensagem("O código PIX expirou. Gere um novo código para tentar novamente.");
    // não limpa automaticamente o pixCode/qr — apenas marca expirado e mostra ação de regenerar
  }

  // safe polling starter
  const startPolling = useCallback(
    (ref) => {
      if (!ref) return;
      if (pollingRef.current) return; // já está rodando

      const interval = setInterval(async () => {
        try {
          const token = localStorage.getItem("token");
          const check = await fetch(`${API}/payments/status/${encodeURIComponent(ref)}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });

          // tenta parse seguro
          let st = null;
          try {
            st = await check.json();
          } catch {
            st = null;
          }

          if (st && st.status === "approved") {
            clearInterval(interval);
            pollingRef.current = null;

            sessionStorage.setItem("pix.status", "approved");

            const consultaObj = {
              payment_ref: ref,
              date: sessionStorage.getItem("booking.date"),
              time: sessionStorage.getItem("booking.time"),
              especialidade:
                sessionStorage.getItem("booking.especialidade_slug") ||
                sessionStorage.getItem("booking.especialidade") ||
                null,
              anamneseRespondida: false,
            };

            // salva para mostrar no perfil / minhas consultas / página de sucesso
            try {
              sessionStorage.setItem("booking.last", JSON.stringify(consultaObj));
              sessionStorage.setItem("anamnese.pendente", JSON.stringify(consultaObj));
              addConsultaNaLista(consultaObj);
            } catch {
              // ignora storage erros
            }

            // limpa temporários do hold + pix
            sessionStorage.removeItem("booking.hold_id");
            sessionStorage.removeItem("booking.payment_ref");
            sessionStorage.removeItem("booking.expires_at");
            sessionStorage.removeItem("pix.payment_ref");
            sessionStorage.removeItem("pix.qr");
            sessionStorage.removeItem("pix.code");
            sessionStorage.removeItem("pix.status");
            sessionStorage.removeItem("pix.expires_at");

            // navega para tela de sucesso (React way)
            if (isMountedRef.current) navigate("/pagamento/sucesso");
          } else if (
            st &&
            (st.status === "rejected" || st.status === "cancelled" || st.status === "failed")
          ) {
            clearInterval(interval);
            pollingRef.current = null;

            if (isMountedRef.current) {
              setMensagem("Pagamento não aprovado. Gere um novo código PIX para tentar novamente.");
              setQrPix("");
              setPixCode("");
              // limpa dados antigos
              sessionStorage.removeItem("pix.payment_ref");
              sessionStorage.removeItem("pix.qr");
              sessionStorage.removeItem("pix.code");
              sessionStorage.removeItem("pix.status");
              sessionStorage.removeItem("pix.expires_at");
            }
          }
          // caso st seja nulo ou outro status, continua checando
        } catch (err) {
          // não trava o intervalo por erros temporários
          console.warn("Erro ao checar status do PIX:", err);
        }
      }, 8000);

      pollingRef.current = interval;
    },
    [navigate]
  );

  // adiciona consulta na lista local (sessionStorage)
  function addConsultaNaLista({ payment_ref, date, time, especialidade, anamneseRespondida = false }) {
    try {
      const raw = sessionStorage.getItem("booking.list");
      const list = raw ? JSON.parse(raw) : [];
      list.push({
        payment_ref,
        date,
        time,
        especialidade,
        anamneseRespondida,
      });
      sessionStorage.setItem("booking.list", JSON.stringify(list));
    } catch {
      // ignora
    }
  }

  // gerar PIX
  async function pagarPix() {
    setMensagem("");

    const ref = paymentRef;
    if (!ref) {
      setMensagem("Reserva não encontrada.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API}/payments/pix`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          payment_ref: ref,
          amount: (precoCents || 1) / 100,
        }),
      });

      if (!resp.ok) {
        // tenta ler mensagem do backend
        let errMsg = "Erro ao gerar PIX.";
        try {
          const errJson = await resp.json();
          errMsg = errJson?.erro || errJson?.message || errMsg;
        } catch {
          // ignore
        }
        setMensagem(errMsg);
        setLoading(false);
        return;
      }

      const data = await resp.json().catch(() => ({}));

      const qr = data.qr_code_base64 || data.qr || "";
      const code = data.copia_cola || data.copyPaste || "";

      if (qr || code) {
        setMensagem("Use o QR Code ou copie o código abaixo para concluir o pagamento via PIX.");
        setQrPix(qr);
        setPixCode(code);
        setExpired(false);

        // salva info do PIX pra persistir após reload
        try {
          sessionStorage.setItem("pix.payment_ref", ref);
          sessionStorage.setItem("pix.qr", qr);
          sessionStorage.setItem("pix.code", code);
          sessionStorage.setItem("pix.status", "pending");
          const ex = Date.now() + PIX_TTL_MS;
          sessionStorage.setItem("pix.expires_at", String(ex));
          setExpiresAt(ex);
          startCountdown(ex);
        } catch {
          // ignore
        }

        // inicia polling
        startPolling(ref);
      } else {
        setMensagem("Erro ao gerar PIX.");
      }
    } catch (e) {
      console.error("Erro pagarPix:", e);
      setMensagem("Erro na solicitação do PIX.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }

  const resumoIncompleto = !bookingInfo.date || !bookingInfo.time;

  const handleCopyPixCode = async () => {
    if (!pixCode) return;
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Erro ao copiar código PIX:", err);
      setMensagem("Não foi possível copiar automaticamente. Selecione o código e copie manualmente.");
    }
  };

  const formatRemaining = (ms) => {
    if (!ms || ms <= 0) return "00:00";
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="pay-flow-shell">
      {/* overlay enquanto gera o PIX */}
      {loading && (
        <div className="pay-flow-overlay" role="status" aria-live="polite">
          <div className="pay-flow-overlay-card">
            <div className="pay-flow-spinner" />
            <span>Gerando pagamento via PIX…</span>
          </div>
        </div>
      )}

      <div className="pay-flow-card">
        <h2 className="pay-flow-title">Finalizar pagamento</h2>
        <p className="pay-flow-sub">Confira os detalhes da sua consulta e conclua o pagamento de forma segura via PIX.</p>

        <section className="pay-flow-summary" aria-label="Resumo da consulta">
          <div className="pay-flow-summary-header">Resumo da consulta</div>
          <ul className="pay-flow-summary-list">
            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span className="pay-flow-check-badge" aria-hidden="true">✓</span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Data</span>
                  <span className="pay-flow-value">{formatDateBr(bookingInfo.date)}</span>
                </div>
              </div>
            </li>

            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span className="pay-flow-check-badge" aria-hidden="true">✓</span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Horário</span>
                  <span className="pay-flow-value">{bookingInfo.time || "—"}</span>
                </div>
              </div>
            </li>

            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span className="pay-flow-check-badge" aria-hidden="true">✓</span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Especialidade</span>
                  <span className="pay-flow-value">{mapEspecialidade(bookingInfo.especialidade)}</span>
                </div>
              </div>
            </li>

            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span className="pay-flow-check-badge" aria-hidden="true">✓</span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Modalidade</span>
                  <span className="pay-flow-value">{MODALIDADE_PADRAO}</span>
                </div>
              </div>
            </li>

            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span className="pay-flow-check-badge" aria-hidden="true">✓</span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Valor da consulta</span>
                  <span className="pay-flow-value">
                    {Number.isFinite(precoCents) ? formatBRLFromCents(precoCents) : "—"}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </section>

        <section className="pay-flow-steps" aria-label="Etapas do pagamento">
          <div className="pay-flow-step pay-flow-step--done">
            <div className="pay-flow-step-number">1</div>
            <div className="pay-flow-step-title">Agendamento</div>
          </div>
          <div className={"pay-flow-step " + (qrPix ? "pay-flow-step--done" : "pay-flow-step--current")}>
            <div className="pay-flow-step-number">2</div>
            <div className="pay-flow-step-title">Pagamento via PIX</div>
          </div>
        </section>

        <div className="pay-flow-actions">
          {!qrPix ? (
            <>
              <p className="pay-flow-hint">
                Revise as informações antes de gerar o código PIX. Se algo estiver incorreto, volte para ajustar o agendamento.
              </p>
              <button
                className="pay-flow-btn"
                type="button"
                onClick={() => setShowReviewModal(true)}
                disabled={loading || resumoIncompleto}
                title={resumoIncompleto ? "Selecione data e horário antes de prosseguir." : "Revisar dados e gerar PIX."}
              >
                {loading ? "Gerando PIX..." : "Revisar dados e gerar PIX"}
              </button>
            </>
          ) : (
            <div className="pay-flow-qr">
              {qrPix && (
                <div className="pay-flow-qr-wrap">
                  <img src={`data:image/png;base64,${qrPix}`} alt="QR Code PIX" />
                </div>
              )}

              <div className={`pay-flow-pix-code ${expired ? "pay-flow-pix-code--expired" : ""}`}>
                <label className="pay-flow-copy-label">Código copia e cola</label>

                <div className="pay-flow-pix-code-row">
                  {/* input de uma linha com overflow para mostrar parcialmente mas permitir seleção */}
                  <input
                    readOnly
                    className="pay-flow-pix-code-input"
                    value={pixCode || ""}
                    onFocus={(e) => e.target.select()}
                    aria-label="Código copia e cola PIX"
                  />
                </div>

                {/* contador e aviso */}
                <div className="pay-flow-pix-meta">
                  {!expired ? (
                    <div className="pay-flow-countdown">Validade: {formatRemaining(remaining)} <span className="pay-flow-countdown-note"> (até {new Date(expiresAt).toLocaleTimeString()})</span></div>
                  ) : (
                    <div className="pay-flow-expired">O código expirou.</div>
                  )}

                  <div className="pay-flow-copy-actions">
                    {/* botão grande rosa com ícone */}
                    <button
                      type="button"
                      className="pay-flow-copy-big-btn"
                      onClick={handleCopyPixCode}
                      disabled={!pixCode || expired}
                      title={copied ? "Copiado!" : "Copiar código do PIX"}
                      aria-pressed={copied}
                    >
                      {/* ícone de copiar (duplo) */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{marginRight:8}}>
                        <path d="M9 9H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="9" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {copied ? "Copiado!" : "Copiar código do PIX"}
                    </button>

                    {/* botão menor para gerar outro código (aparece quando expirou) */}
                    {expired && (
                      <button
                        type="button"
                        className="pay-flow-btn pay-flow-btn--secondary"
                        onClick={() => {
                          // gerar novo código PIX
                          pagarPix();
                        }}
                      >
                        Gerar outro código PIX
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {mensagem && <p className="pay-flow-message">{mensagem}</p>}
      </div>

      {/* Modal de revisão antes de gerar o PIX */}
      {showReviewModal && (
        <div className="pay-flow-modal-backdrop" role="dialog" aria-modal="true">
          <div className="pay-flow-modal">
            <div className="pay-flow-modal-header">
              <h2 className="pay-flow-modal-title">Revisar dados da consulta</h2>
              <p className="pay-flow-modal-sub">Verifique se as informações abaixo estão corretas antes de gerar o código PIX.</p>
            </div>

            <div className="pay-flow-modal-body">
              <ul className="pay-flow-summary-list">
                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span className="pay-flow-check-badge" aria-hidden="true">✓</span>
                    <div className="pay-flow-summary-text">
                      <span className="pay-flow-label">Data</span>
                      <span className="pay-flow-value">{formatDateBr(bookingInfo.date)}</span>
                    </div>
                  </div>
                </li>

                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span className="pay-flow-check-badge" aria-hidden="true">✓</span>
                    <div className="pay-flow-summary-text">
                      <span className="pay-flow-label">Horário</span>
                      <span className="pay-flow-value">{bookingInfo.time || "—"}</span>
                    </div>
                  </div>
                </li>

                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span className="pay-flow-check-badge" aria-hidden="true">✓</span>
                    <div className="pay-flow-summary-text">
                      <span className="pay-flow-label">Especialidade</span>
                      <span className="pay-flow-value">{mapEspecialidade(bookingInfo.especialidade)}</span>
                    </div>
                  </div>
                </li>

                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span className="pay-flow-check-badge" aria-hidden="true">✓</span>
                    <div className="pay-flow-summary-text">
                      <span className="pay-flow-label">Modalidade</span>
                      <span className="pay-flow-value">{MODALIDADE_PADRAO}</span>
                    </div>
                  </div>
                </li>

                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span className="pay-flow-check-badge" aria-hidden="true">✓</span>
                    <div className="pay-flow-summary-text">
                      <span className="pay-flow-label">Valor da consulta</span>
                      <span className="pay-flow-value">{Number.isFinite(precoCents) ? formatBRLFromCents(precoCents) : "—"}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pay-flow-modal-actions">
              <button type="button" className="pay-flow-modal-btn-secondary" onClick={() => setShowReviewModal(false)}>
                Corrigir informações
              </button>
              <button
                type="button"
                className="pay-flow-modal-btn-primary"
                onClick={() => {
                  setShowReviewModal(false);
                  pagarPix();
                }}
                disabled={loading}
              >
                Confirmar e gerar PIX
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
