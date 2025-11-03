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

  return (
    <div className="pay-ok-shell">
      <div className="pay-ok-card">
        <div className="pay-ok-icon">✓</div>
        <h1>Pagamento confirmado!</h1>
        <p className="pay-ok-sub">
          Sua consulta foi agendada com sucesso. Você receberá as instruções por e-mail.
        </p>

        <div className="pay-ok-info">
          <div className="pay-ok-row">
            <span>Data da consulta</span>
            <strong>{dataBr(last?.date)}</strong>
          </div>
          <div className="pay-ok-row">
            <span>Horário</span>
            <strong>{last?.time || "—"}</strong>
          </div>
          <div className="pay-ok-row">
            <span>Especialidade</span>
            <strong>{last?.especialidade || "Nutrição"}</strong>
          </div>
        </div>

        {!anamneseRespondida ? (
          <div className="pay-ok-alert">
            <h2>Falta responder sua anamnese 📝</h2>
            <p>
              Para que a nutricionista prepare seu atendimento, preencha o formulário de anamnese.
              Leva só alguns minutinhos.
            </p>
            <a className="pay-ok-btn-secondary" href="/anamnese">
              Responder anamnese agora
            </a>
          </div>
        ) : null}

        <div className="pay-ok-actions">
          <a className="pay-ok-btn" href="/perfil">
            Ver minhas consultas
          </a>
          <a className="pay-ok-link" href="/">
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}
