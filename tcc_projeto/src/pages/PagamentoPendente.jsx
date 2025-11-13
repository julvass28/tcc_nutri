// src/pages/pagamento/PagamentoPendente.jsx
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
  background: "rgba(138,143,117,0.18)",
  color: "#555d3f",
  display: "grid",
  placeItems: "center",
  fontSize: "26px",
  fontWeight: 700,
  margin: "0 auto 14px",
};

const titleStyle = {
  fontSize: "1.5rem",
  color: "#8a8f75",
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
  background: "#8A8F75",
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

export default function PagamentoPendente() {
  return (
    <div style={shellStyle}>
      <div style={cardStyle}>
        <div style={iconStyle}>⏳</div>
        <h1 style={titleStyle}>Pagamento pendente</h1>
        <p style={textStyle}>
          Estamos aguardando a confirmação do provedor de pagamento. Assim
          que o PIX for identificado, sua consulta será confirmada
          automaticamente.
        </p>
        <div style={actionsStyle}>
          <a href="/perfil" style={primaryBtnStyle}>
            Ver minhas consultas
          </a>
          <a href="/" style={linkStyle}>
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}
