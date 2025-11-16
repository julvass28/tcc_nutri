// src/pages/Pagamento.jsx
import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { API } from "../services/api";
import usePrecoConsulta from "../hooks/usePrecoConsulta";
import { formatBRLFromCents } from "../services/config";
import "../css/pagamento.css";

const MODALIDADE_PADRAO = "Online";
const DURACAO_PADRAO_MIN = 50;

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
  const [copied, setCopied] = useState(false);

  // controle do polling de status (pra não criar intervalos duplicados)
  const pollingRef = useRef(null);

  const formatDateBr = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = String(iso).split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  };

  // pegar o booking da sessão + restaurar PIX se já estiver em andamento
  useEffect(() => {
    const ref = sessionStorage.getItem("booking.payment_ref");
    const date = sessionStorage.getItem("booking.date");
    const time = sessionStorage.getItem("booking.time");
    const especialidadeLabel = sessionStorage.getItem("booking.especialidade");
    const especialidadeSlug = sessionStorage.getItem(
      "booking.especialidade_slug"
    );

    if (ref) {
      setPaymentRef(ref);
    } else {
      setMensagem("Reserva não encontrada. Volte e selecione o horário.");
    }

    // pra exibir, tanto faz label ou slug (mapEspecialidade trata)
    setBookingInfo({
      date,
      time,
      especialidade: especialidadeSlug || especialidadeLabel,
    });

    // restaurar dados do PIX se já tiver sido gerado antes (ex: recarregou a página)
    const pixRef = sessionStorage.getItem("pix.payment_ref");
    const pixStatus = sessionStorage.getItem("pix.status");
    const pixQrStored = sessionStorage.getItem("pix.qr");
    const pixCodeStored = sessionStorage.getItem("pix.code");

    if (pixRef && pixStatus === "pending" && pixQrStored && pixCodeStored) {
      // mantém na tela aguardando o pagamento
      setPaymentRef(pixRef);
      setQrPix(pixQrStored);
      setPixCode(pixCodeStored);
      setMensagem(
        "Use o QR Code ou copie o código abaixo para concluir o pagamento via PIX."
      );
      startPolling(pixRef);
    }
  }, []);

  // limpa interval quando sair da página
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
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

  // inicia (ou reinicia) o polling de status do pagamento
  function startPolling(ref) {
    if (!ref) return;
    if (pollingRef.current) return; // já está pollando

    const interval = setInterval(async () => {
      try {
        const check = await fetch(`${API}/payments/status/${ref}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const st = await check.json();

        if (st.status === "approved") {
          clearInterval(interval);
          pollingRef.current = null;

          sessionStorage.setItem("pix.status", "approved");

          const consultaObj = {
            payment_ref: ref,
            date: sessionStorage.getItem("booking.date"),
            time: sessionStorage.getItem("booking.time"),
            // de preferência o slug; se não tiver, cai pro label
            especialidade:
              sessionStorage.getItem("booking.especialidade_slug") ||
              sessionStorage.getItem("booking.especialidade") ||
              null,
            anamneseRespondida: false,
          };

          // salva para mostrar no perfil / minhas consultas / página de sucesso
          sessionStorage.setItem("booking.last", JSON.stringify(consultaObj));
          sessionStorage.setItem(
            "anamnese.pendente",
            JSON.stringify(consultaObj)
          );

          // acumula também
          addConsultaNaLista(consultaObj);

          // limpa os temporários do hold
          sessionStorage.removeItem("booking.hold_id");
          sessionStorage.removeItem("booking.payment_ref");
          sessionStorage.removeItem("booking.expires_at");

          // limpa dados do PIX armazenados
          sessionStorage.removeItem("pix.payment_ref");
          sessionStorage.removeItem("pix.qr");
          sessionStorage.removeItem("pix.code");
          sessionStorage.removeItem("pix.status");

          // vai para tela de sucesso
          window.location.href = "/pagamento/sucesso";
        } else if (
          st.status === "rejected" ||
          st.status === "cancelled" ||
          st.status === "failed"
        ) {
          clearInterval(interval);
          pollingRef.current = null;

          setMensagem(
            "Pagamento não aprovado. Gere um novo código PIX para tentar novamente."
          );

          // limpa dados de PIX, mas mantém o booking pra poder gerar outro
          sessionStorage.removeItem("pix.payment_ref");
          sessionStorage.removeItem("pix.qr");
          sessionStorage.removeItem("pix.code");
          sessionStorage.removeItem("pix.status");

          setQrPix("");
          setPixCode("");
        }
      } catch (err) {
        console.log("Erro ao checar status:", err);
      }
    }, 8000);

    pollingRef.current = interval;
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
        const qr = data.qr_code_base64 || "";
        const code = data.copia_cola || "";

        setMensagem(
          "Use o QR Code ou copie o código abaixo para concluir o pagamento via PIX."
        );
        setQrPix(qr);
        setPixCode(code);

        // salva info do PIX pra, se recarregar a página, continuar do mesmo ponto
        sessionStorage.setItem("pix.payment_ref", paymentRef);
        sessionStorage.setItem("pix.qr", qr);
        sessionStorage.setItem("pix.code", code);
        sessionStorage.setItem("pix.status", "pending");

        // começa o polling de status
        startPolling(paymentRef);
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

  const handleCopyPixCode = async () => {
    if (!pixCode) return;
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Erro ao copiar código PIX:", err);
      setMensagem(
        "Não foi possível copiar automaticamente. Selecione o código e copie manualmente."
      );
    }
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
        <p className="pay-flow-sub">
          Confira os detalhes da sua consulta e conclua o pagamento de forma
          segura via PIX.
        </p>

        {/* Resumo principal */}
        <section className="pay-flow-summary" aria-label="Resumo da consulta">
          <div className="pay-flow-summary-header">Resumo da consulta</div>
          <ul className="pay-flow-summary-list">
            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span className="pay-flow-check-badge" aria-hidden="true">
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
                <span className="pay-flow-check-badge" aria-hidden="true">
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
                <span className="pay-flow-check-badge" aria-hidden="true">
                  ✓
                </span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Especialidade</span>
                  <span className="pay-flow-value">
                    {mapEspecialidade(bookingInfo.especialidade)}
                  </span>
                </div>
              </div>
            </li>

            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span className="pay-flow-check-badge" aria-hidden="true">
                  ✓
                </span>
                <div className="pay-flow-summary-text">
                  <span className="pay-flow-label">Modalidade</span>
                  <span className="pay-flow-value">{MODALIDADE_PADRAO}</span>
                </div>
              </div>
            </li>

            <li className="pay-flow-summary-item">
              <div className="pay-flow-summary-left">
                <span className="pay-flow-check-badge" aria-hidden="true">
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
        <section className="pay-flow-steps" aria-label="Etapas do pagamento">
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
                <img src={`data:image/png;base64,${qrPix}`} alt="QR Code PIX" />
              )}
              <div className="pay-flow-pix-code">
                <span className="pay-flow-copy-label">Código copia e cola</span>
                <div className="pay-flow-pix-code-row">
                  <span className="pay-flow-pix-code-text">{pixCode}</span>
                  <button
                    type="button"
                    className="pay-flow-copy-btn"
                    onClick={handleCopyPixCode}
                  >
                    {copied ? "Copiado!" : "Copiar código"}
                  </button>
                </div>
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
                Verifique se as informações abaixo estão corretas antes de gerar
                o código PIX.
              </p>
            </div>

            <div className="pay-flow-modal-body">
              <ul className="pay-flow-summary-list">
                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span className="pay-flow-check-badge" aria-hidden="true">
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
                    <span className="pay-flow-check-badge" aria-hidden="true">
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
                    <span className="pay-flow-check-badge" aria-hidden="true">
                      ✓
                    </span>
                    <div className="pay-flow-summary-text">
                      <span className="pay-flow-label">Especialidade</span>
                      <span className="pay-flow-value">
                        {mapEspecialidade(bookingInfo.especialidade)}
                      </span>
                    </div>
                  </div>
                </li>

                <li className="pay-flow-summary-item">
                  <div className="pay-flow-summary-left">
                    <span className="pay-flow-check-badge" aria-hidden="true">
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
                    <span className="pay-flow-check-badge" aria-hidden="true">
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
