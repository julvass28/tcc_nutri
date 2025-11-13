// src/pages/pagamento/PagamentoErro.jsx
const shellStyle = {
  minHeight: "75vh",
  background: "#F4EFEC",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 16px",
  fontFamily:
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: "18px",
  maxWidth: "520px",
  width: "100%",
  padding: "26px 26px 28px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const iconStyle = {
  width: "54px",
  height: "54px",
  borderRadius: "999px",
  background: "rgba(209,160,160,0.18)",
  color: "#874848",
  display: "grid",
  placeItems: "center",
  fontSize: "28px",
  fontWeight: 700,
  margin: "0 auto 14px",
};

const titleStyle = {
  fontSize: "1.5rem",
  color: "#8a4b4b",
  marginBottom: "8px",
};

const textStyle = {
  fontSize: "0.95rem",
  color: "#6a6a6a",
  marginBottom: "18px",
};

const actionsStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const primaryBtnStyle = {
  background: "#D1A0A0",
  color: "#ffffff",
  borderRadius: "10px",
  padding: "10px 16px",
  fontWeight: 600,
  textDecoration: "none",
};

const linkStyle = {
  color: "#8A8F75",
  textDecoration: "underline",
  fontSize: "0.9rem",
};

export default function PagamentoErro() {
  return (
    <div style={shellStyle}>
      <div style={cardStyle}>
        <div style={iconStyle}>!</div>
        <h1 style={titleStyle}>Pagamento não aprovado</h1>
        <p style={textStyle}>
          Sua transação não foi concluída. Você pode tentar novamente ou
          revisar seus dados de pagamento.
        </p>
        <div style={actionsStyle}>
          <a href="/pagamento" style={primaryBtnStyle}>
            Tentar novamente
          </a>
          <a href="/perfil" style={linkStyle}>
            Ver minhas consultas
          </a>
        </div>
      </div>
    </div>
  );
}
