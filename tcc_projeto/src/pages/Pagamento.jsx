// src/pages/Pagamento.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API } from "../services/api";
import usePrecoConsulta from "../hooks/usePrecoConsulta";
import { formatBRLFromCents } from "../services/config";
import "../css/pagamento.css";

const MODALIDADE_PADRAO = "Online";
const DURACAO_PADRAO_MIN = 50;

export default function Pagamento() {
  const { user } = useContext(AuthContext); // mantido se quiser usar depois
  const { cents: precoCents } = usePrecoConsulta();

  const [paymentRef, setPaymentRef] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // dados do booking
  const [bookingInfo, setBookingInfo] = useState({
    date: "",
    time: "",
    especialidade: "",
  });

  // PIX
  const [qrPix, setQrPix] = useState("");
  const [pixCode, setPixCode] = useState("");

  const formatDateBr = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = String(iso).split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  };

  // pegar o booking da sessão
  useEffect(() => {
    const ref = sessionStorage.getItem("booking.payment_ref");
    const date = sessionStorage.getItem("booking.date");
    const time = sessionStorage.getItem("booking.time");
    const especialidade = sessionStorage.getItem("booking.especialidade");

    if (ref) {
      setPaymentRef(ref);
    } else {
      setMensagem("Reserva não encontrada. Volte e selecione o horário.");
    }

    setBookingInfo({ date, time, especialidade });
  }, []);

  // acumula consultas na lista da sessão (mantido)
  function addConsultaNaLista({
    payment_ref,
    date,
    time,
    especialidade,
    anamneseRespondida = false,
  }) {
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

  async function pagarPix() {
    setMensagem("");

    if (!paymentRef) {
      setMensagem("Reserva não encontrada.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${API}/payments/pix`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          payment_ref: paymentRef,
          amount: (precoCents || 1) / 100,
        }),
      });

      const data = await resp.json();

      if (data.qr_code_base64 || data.copia_cola) {
        setMensagem(
          "Use o QR Code ou copie o código abaixo para concluir o pagamento via PIX."
        );
        setQrPix(data.qr_code_base64);
        setPixCode(data.copia_cola);

        // polling do status
        const interval = setInterval(async () => {
          try {
            const check = await fetch(
              `${API}/payments/status/${paymentRef}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            const st = await check.json();

            if (st.status === "approved") {
              clearInterval(interval);

              const consultaObj = {
                payment_ref: paymentRef,
                date: bookingInfo.date,
                time: bookingInfo.time,
                especialidade: bookingInfo.especialidade,
                anamneseRespondida: false,
              };

              // salva para mostrar no perfil e na página de sucesso
              sessionStorage.setItem(
                "booking.last",
                JSON.stringify(consultaObj)
              );
              sessionStorage.setItem(
                "anamnese.pendente",
                JSON.stringify(consultaObj)
              );

              // acumula também
              addConsultaNaLista(consultaObj);

              // limpa os temporários
              sessionStorage.removeItem("booking.hold_id");
              sessionStorage.removeItem("booking.payment_ref");
              sessionStorage.removeItem("booking.expires_at");

              window.location.href = "/pagamento/sucesso";
            }
          } catch (err) {
            console.log("Erro ao checar status:", err);
          }
        }, 8000);
      } else {
        setMensagem("Erro ao gerar PIX.");
      }
    } catch (e) {
      console.log(e);
      setMensagem("Erro na solicitação do PIX.");
    } finally {
      setLoading(false);
    }
  }

  const resumoIncompleto = !bookingInfo.date || !bookingInfo.time;

  return (
    <div className="pay-flow-shell">
      {/* overlay enquanto gera o PIX */}
      {loading && (
        <div
          className="pay-flow-overlay"
          role="status"
          aria-live="polite"
        >
          <div className="pay-flow-overlay-card">
            <div className="pay-flow-spinner" />
            <span>Gerando pagamento via PIX…</span>
          </div>
        </div>
      )}

      <div className="pay-flow-card">
        <h2 className="pay-flow-title">Finalizar pagamento</h2>
        <p className="pay-flow-sub">
          Confira os detalhes da sua consulta e conclua o pagamento de
          forma segura via PIX.
        </p>

        {/* Resumo principal */}
        <section
          className="pay-flow-summary"
          aria-label="Resumo da consulta"
        >
          <div className="pay-flow-summary-header">Resumo da consulta</div>
          <ul className="pay-flow-summary-list">
            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span
                  className="pay-flow-check-badge"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Data</span>
                  <span className="pay-flow-value">
                    {formatDateBr(bookingInfo.date)}
                  </span>
                </div>
              </div>
            </li>

            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span
                  className="pay-flow-check-badge"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Horário</span>
                  <span className="pay-flow-value">
                    {bookingInfo.time || "—"}
                  </span>
                </div>
              </div>
            </li>

            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span
                  className="pay-flow-check-badge"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Especialidade</span>
                  <span className="pay-flow-value">
                    {bookingInfo.especialidade || "Nutrição"}
                  </span>
                </div>
              </div>
            </li>

            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span
                  className="pay-flow-check-badge"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Modalidade</span>
                  <span className="pay-flow-value">
                    {MODALIDADE_PADRAO}
                  </span>
                </div>
              </div>
            </li>

            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span
                  className="pay-flow-check-badge"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Valor da consulta</span>
                  <span className="pay-flow-value">
                    {Number.isFinite(precoCents)
                      ? formatBRLFromCents(precoCents)
                      : "—"}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </section>

        {/* Etapas do fluxo */}
        <section
          className="pay-flow-steps"
          aria-label="Etapas do pagamento"
        >
          <div className="pay-flow-step pay-flow-step--done">
            <div className="pay-flow-step-number">1</div>
            <div className="pay-flow-step-title">Agendamento</div>
          </div>
          <div
            className={
              "pay-flow-step " +
              (qrPix ? "pay-flow-step--done" : "pay-flow-step--current")
            }
          >
            <div className="pay-flow-step-number">2</div>
            <div className="pay-flow-step-title">Pagamento via PIX</div>
          </div>
        </section>

        {/* Ações / PIX */}
        <div className="pay-flow-actions">
          {!qrPix ? (
            <>
              <p className="pay-flow-hint">
                Revise as informações antes de gerar o código PIX. Se algo
                estiver incorreto, volte para ajustar o agendamento.
              </p>
              <button
                className="pay-flow-btn"
                type="button"
                onClick={() => setShowReviewModal(true)}
                disabled={loading || resumoIncompleto}
                title={
                  resumoIncompleto
                    ? "Selecione data e horário antes de prosseguir."
                    : "Revisar dados e gerar PIX."
                }
              >
                {loading ? "Gerando PIX..." : "Revisar dados e gerar PIX"}
              </button>
            </>
          ) : (
            <div className="pay-flow-qr">
              {qrPix && (
                <img
                  src={`data:image/png;base64,${qrPix}`}
                  alt="QR Code PIX"
                />
              )}
              <div className="pay-flow-pix-code">
                <span className="pay-flow-copy-label">
                  Código copia e cola
                </span>
                <span>{pixCode}</span>
              </div>
            </div>
          )}
        </div>

        {mensagem && <p className="pay-flow-message">{mensagem}</p>}
      </div>

      {/* Modal de revisão antes de gerar o PIX */}
      {showReviewModal && (
        <div
          className="pay-flow-modal-backdrop"
          role="dialog"
          aria-modal="true"
        >
          <div className="pay-flow-modal">
            <div className="pay-flow-modal-header">
              <h2 className="pay-flow-modal-title">
                Revisar dados da consulta
              </h2>
              <p className="pay-flow-modal-sub">
                Verifique se as informações abaixo estão corretas antes de
                gerar o código PIX.
              </p>
            </div>

            <div className="pay-flow-modal-body">
              <ul className="pay-flow-summary-list">
                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span
                      className="pay-flow-check-badge"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <div className="pay-flow-summary-text">
                      <span className="pay-flow-label">Data</span>
                      <span className="pay-flow-value">
                        {formatDateBr(bookingInfo.date)}
                      </span>
                    </div>
                  </div>
                </li>

                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span
                      className="pay-flow-check-badge"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <div className="pay-flow-summary-text">
                      <span className="pay-flow-label">Horário</span>
                      <span className="pay-flow-value">
                        {bookingInfo.time || "—"}
                      </span>
                    </div>
                  </div>
                </li>

                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span
                      className="pay-flow-check-badge"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <div className="pay-flow-summary-text">
                      <span className="pay-flow-label">Especialidade</span>
                      <span className="pay-flow-value">
                        {bookingInfo.especialidade || "Nutrição"}
                      </span>
                    </div>
                  </div>
                </li>

                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span
                      className="pay-flow-check-badge"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <div className="pay-flow-summary-text">
                      <span className="pay-flow-label">Modalidade</span>
                      <span className="pay-flow-value">
                        {MODALIDADE_PADRAO}
                      </span>
                    </div>
                  </div>
                </li>

                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span
                      className="pay-flow-check-badge"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <div className="pay-flow-summary-text">
                      <span className="pay-flow-label">Valor da consulta</span>
                      <span className="pay-flow-value">
                        {Number.isFinite(precoCents)
                          ? formatBRLFromCents(precoCents)
                          : "—"}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pay-flow-modal-actions">
              <button
                type="button"
                className="pay-flow-modal-btn-secondary"
                onClick={() => setShowReviewModal(false)}
              >
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
