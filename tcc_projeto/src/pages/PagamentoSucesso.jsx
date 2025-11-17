import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/pagamento-sucesso.css";

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

export default function PagamentoSucesso() {
  const navigate = useNavigate();

  // pega o que foi salvo no pagamento
  let last = null;
  try {
    last = JSON.parse(sessionStorage.getItem("booking.last"));
  } catch {
    last = null;
  }

  const dataBr = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = String(iso).split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  };

  const anamneseRespondida = last?.anamneseRespondida === true;
  const showAnamneseBloco = !anamneseRespondida;

  // Navega para Minhas Consultas sem recarregar a SPA
  function handleVerMinhasConsultas() {
    navigate("/minhas-consultas");
  }

  // Garante salvar anamnese pendente e booking.last antes de navegar p/ anamnese
  function handleResponderAnamnese() {
    try {
      const consultaObj = {
        payment_ref: last?.payment_ref || null,
        date: last?.date || null,
        time: last?.time || null,
        especialidade: last?.especialidade || null,
        anamneseRespondida: last?.anamneseRespondida || false,
      };
      if (consultaObj.payment_ref || consultaObj.date) {
        sessionStorage.setItem("booking.last", JSON.stringify(consultaObj));
        sessionStorage.setItem("anamnese.pendente", JSON.stringify(consultaObj));
      } else {
        // fallback: se não tiver booking.last válido, tenta não sobrescrever nada
        console.warn("PagamentoSucesso: booking.last ausente ou incompleto.");
      }
    } catch (e) {
      console.warn("Erro ao gravar anamnese.pendente:", e);
    } finally {
      navigate("/anamnese");
    }
  }

  return (
    <div className="pay-ok-shell">
      <div className="pay-ok-card">
        <button
          type="button"
          className="pay-ok-back"
          onClick={() => navigate("/")}
          aria-label="Voltar ao início"
          style={{ textDecoration: "none", border: "none", background: "transparent", cursor: "pointer" }}
        >
          <span className="pay-ok-back-arrow">←</span>
          <span>Voltar ao início</span>
        </button>

        <div className="pay-ok-icon" aria-hidden="true">
          ✓
        </div>
        <h1>Pagamento confirmado!</h1>
        <p className="pay-ok-sub">
          Sua consulta foi agendada com sucesso. Você receberá as instruções por e-mail.
        </p>

        <div className="pay-ok-info">
          <div className="pay-ok-row pay-ok-row--anim">
            <div className="pay-ok-row-left">
              <span className="pay-ok-row-badge">
                <span className="pay-ok-row-check">✓</span>
              </span>
              <span>Data da consulta</span>
            </div>
            <strong>{dataBr(last?.date)}</strong>
          </div>
          <div className="pay-ok-row pay-ok-row--anim">
            <div className="pay-ok-row-left">
              <span className="pay-ok-row-badge">
                <span className="pay-ok-row-check">✓</span>
              </span>
              <span>Horário</span>
            </div>
            <strong>{last?.time || "—"}</strong>
          </div>
          <div className="pay-ok-row pay-ok-row--anim">
            <div className="pay-ok-row-left">
              <span className="pay-ok-row-badge">
                <span className="pay-ok-row-check">✓</span>
              </span>
              <span>Especialidade</span>
            </div>
            <strong>{mapEspecialidade(last?.especialidade)}</strong>
          </div>
        </div>

        {showAnamneseBloco && (
          <div className="pay-ok-alert pay-ok-alert--compact">
            <h2>Falta responder sua anamnese</h2>
            <p>
              Antes da consulta, preencha a anamnese para que a nutricionista
              conheça seu histórico, rotina e objetivos. Isso torna o
              atendimento mais preciso e personalizado.
            </p>
          </div>
        )}

        <div className="pay-ok-actions">
          <button
            className="pay-ok-btn"
            type="button"
            onClick={handleVerMinhasConsultas}
          >
            Ver minhas consultas
          </button>

          {showAnamneseBloco && (
            <button
              className="pay-ok-btn-secondary"
              type="button"
              onClick={handleResponderAnamnese}
            >
              Responder anamnese
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
