// src/pages/pagamento/PagamentoSucesso.jsx
import "../css/pagamento-sucesso.css";

export default function PagamentoSucesso() {
  // pega o que foi salvo no pagamento
  let last = null;
  try {
    last = JSON.parse(sessionStorage.getItem("booking.last"));
  } catch {
    last = null;
  }

  const dataBr = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const anamneseRespondida = last?.anamneseRespondida === true;
  const showAnamneseBloco = !anamneseRespondida;

  return (
    <div className="pay-ok-shell">
      <div className="pay-ok-card">
        {/* seta de voltar ao início lá em cima */}
        <a href="/" className="pay-ok-back">
          <span className="pay-ok-back-arrow">←</span>
          <span>Voltar ao início</span>
        </a>

        <div className="pay-ok-icon" aria-hidden="true">
          ✓
        </div>
        <h1>Pagamento confirmado!</h1>
        <p className="pay-ok-sub">
          Sua consulta foi agendada com sucesso. Você receberá as instruções
          por e-mail.
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
            <strong>{last?.especialidade || "Nutrição"}</strong>
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
          <a className="pay-ok-btn" href="/perfil">
            Ver minhas consultas
          </a>

          {showAnamneseBloco && (
            <a className="pay-ok-btn-secondary" href="/anamnese">
              Responder anamnese
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
