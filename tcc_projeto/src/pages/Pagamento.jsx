// src/pages/Pagamento.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API } from "../services/api";
import usePrecoConsulta from "../hooks/usePrecoConsulta";

export default function Pagamento() {
  const { user } = useContext(AuthContext); // ainda disponível se quiser usar depois
  const { cents: precoCents } = usePrecoConsulta();

  const [paymentRef, setPaymentRef] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  // dados do booking
  const [bookingInfo, setBookingInfo] = useState({
    date: "",
    time: "",
    especialidade: "",
  });

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

  // -------- ESTILOS ------------

  const corOliva = "#8A8F75";
  const corRosa = "#D1A0A0";
  const corBege = "#F4EFEC";
  const borda = "1px solid #ddd";

  const container = {
    backgroundColor: corBege,
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
    fontFamily: "Inter, sans-serif",
  };

  const box = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "30px",
    width: "100%",
    maxWidth: 520,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  };

  const btn = {
    width: "100%",
    backgroundColor: corRosa,
    color: "#fff",
    fontWeight: 600,
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "1.05rem",
    cursor: "pointer",
    opacity: loading ? 0.7 : 1,
  };

  const msg = {
    marginTop: "20px",
    textAlign: "center",
    color: corOliva,
    fontSize: "0.9rem",
  };

  // 👇 função pra ACUMULAR consultas (mantida igual)
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

  // PIX
  const [qrPix, setQrPix] = useState("");
  const [pixCode, setPixCode] = useState("");

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
          "Use o QR Code ou copie o código abaixo para pagar via PIX:"
        );
        setQrPix(data.qr_code_base64);
        setPixCode(data.copia_cola);

        // polling do status
        const interval = setInterval(async () => {
          try {
            const check = await fetch(`${API}/payments/status/${paymentRef}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

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

  return (
    <div style={container}>
      <div style={box}>
        <h2 style={{ color: corOliva, marginBottom: "12px" }}>
          Finalizar Pagamento
        </h2>
        <p style={{ color: "#777", fontSize: "0.9rem", marginBottom: "20px" }}>
          Pagamento realizado exclusivamente via PIX, de forma rápida e segura.
        </p>

        <div
          style={{
            border: borda,
            borderRadius: 12,
            padding: 12,
            marginBottom: 20,
            fontSize: "0.85rem",
            color: "#555",
            background: "#faf7f5",
          }}
        >
          <strong>Resumo da consulta</strong>
          <br />
          Data: {bookingInfo.date || "—"} <br />
          Horário: {bookingInfo.time || "—"} <br />
          Especialidade: {bookingInfo.especialidade || "Nutrição"}
        </div>

        <div style={{ textAlign: "center" }}>
          {!qrPix ? (
            <>
              <p style={{ marginBottom: "20px", color: corOliva }}>
                Clique abaixo para gerar o QR Code PIX da sua consulta.
              </p>
              <button style={btn} onClick={pagarPix} disabled={loading}>
                {loading ? "Gerando PIX..." : "Gerar Código PIX"}
              </button>
            </>
          ) : (
            <>
              <img
                src={`data:image/png;base64,${qrPix}`}
                alt="QR Code PIX"
                style={{ width: 200, height: 200, marginBottom: "10px" }}
              />
              <p
                style={{
                  fontSize: "0.9rem",
                  color: corOliva,
                  wordBreak: "break-all",
                  marginTop: "10px",
                }}
              >
                <b>Código Copia e Cola:</b> <br /> {pixCode}
              </p>
            </>
          )}
        </div>

        <p style={msg}>{mensagem}</p>
      </div>
    </div>
  );
}
