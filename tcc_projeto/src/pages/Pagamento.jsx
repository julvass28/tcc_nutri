// src/pages/Pagamento.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API } from "../services/api";
import usePrecoConsulta from "../hooks/usePrecoConsulta";

export default function Pagamento() {
  const { user } = useContext(AuthContext);
  const { cents: precoCents } = usePrecoConsulta();
  const [paymentRef, setPaymentRef] = useState("");
  const [metodo, setMetodo] = useState("cartao");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [mp, setMp] = useState(null);

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
    if (ref) setPaymentRef(ref);
    else setMensagem("Reserva não encontrada. Volte e selecione o horário.");
    setBookingInfo({ date, time, especialidade });
  }, []);

  // carregar MP do window
  useEffect(() => {
    if (window.MercadoPago) {
      const pk = import.meta.env.VITE_MP_PUBLIC_KEY;
      const inst = new window.MercadoPago(pk, { locale: "pt-BR" });
      setMp(inst);
    }
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

  const tabs = {
    display: "flex",
    gap: "10px",
    marginBottom: "24px",
  };

  const tab = (ativo) => ({
    flex: 1,
    textAlign: "center",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    backgroundColor: ativo ? corRosa : "#f7f7f7",
    color: ativo ? "#fff" : corOliva,
    fontWeight: 600,
    border: ativo ? "none" : borda,
    transition: "all 0.3s ease",
  });

  const label = {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: corOliva,
    marginBottom: "6px",
    display: "block",
  };

  const input = {
    width: "100%",
    padding: "14px 12px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: borda,
    marginBottom: "14px",
    outline: "none",
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

  // -------- FORMS --------
  const [dadosCartao, setDadosCartao] = useState({
    numero: "",
    nome: user?.nome || "",
    cpf: "",
    validadeMes: "",
    validadeAno: "",
    cvv: "",
  });

  const handleInput = (campo, valor) =>
    setDadosCartao((prev) => ({ ...prev, [campo]: valor }));

  const isInsecure =
    typeof window !== "undefined" &&
    window.location.protocol === "http:" &&
    window.location.hostname === "localhost";

  // 👇 função pra ACUMULAR consultas
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

  // CARTÃO
  async function pagarCartao(e) {
    e.preventDefault();
    setMensagem("");

    if (!paymentRef) {
      setMensagem("Reserva não encontrada.");
      return;
    }

    if (isInsecure) {
      setMensagem(
        "⚠️ Pagamento com cartão só funciona em HTTPS (site publicado ou túnel)."
      );
      return;
    }

    if (!mp) {
      setMensagem("SDK do Mercado Pago não carregou ainda. Atualize a página.");
      return;
    }

    setLoading(true);
    try {
      const tokenResp = await mp.createCardToken({
        cardNumber: dadosCartao.numero.replace(/\s+/g, ""),
        cardholderName: dadosCartao.nome,
        securityCode: dadosCartao.cvv,
        cardExpirationMonth: dadosCartao.validadeMes,
        cardExpirationYear: dadosCartao.validadeAno,
        identificationType: "CPF",
        identificationNumber: dadosCartao.cpf.replace(/\D/g, ""),
      });

      const cardToken = tokenResp.id;

      const resp = await fetch(`${API}/payments/charge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          payment_ref: paymentRef,
          token: cardToken,
          amount: (precoCents || 1) / 100,
          installments: 1,
          payer: {
            email: user?.email,
            first_name: user?.nome,
            identification: {
              type: "CPF",
              number: dadosCartao.cpf.replace(/\D/g, ""),
            },
          },
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setMensagem(
          data?.erro ||
            data?.message ||
            "Erro ao processar pagamento via cartão."
        );
        return;
      }

      if (data.status === "approved") {
        // salvar pro perfil e pra tela sucesso
        const consultaObj = {
          payment_ref: paymentRef,
          date: bookingInfo.date,
          time: bookingInfo.time,
          especialidade: bookingInfo.especialidade,
          anamneseRespondida: false,
        };

        // último
        sessionStorage.setItem("booking.last", JSON.stringify(consultaObj));
        // flag da anamnese
        sessionStorage.setItem(
          "anamnese.pendente",
          JSON.stringify(consultaObj)
        );
        // 👇 agora ACUMULA
        addConsultaNaLista(consultaObj);

        // limpa os temporários
        sessionStorage.removeItem("booking.hold_id");
        sessionStorage.removeItem("booking.payment_ref");
        sessionStorage.removeItem("booking.expires_at");

        window.location.href = "/pagamento/sucesso";
      } else {
        setMensagem(
          `Pagamento criado, status: ${data.status || "desconhecido"}`
        );
      }
    } catch (err) {
      console.log(err);
      setMensagem(
        "Erro ao tokenizar ou processar o cartão. Teste em HTTPS (hostinger/vercel + backend público)."
      );
    } finally {
      setLoading(false);
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
              // 👇 acumula também no PIX
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
      } else setMensagem("Erro ao gerar PIX.");
    } catch {
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
          Escolha o método desejado e finalize sua consulta com segurança.
        </p>

        {/* Abas */}
        <div style={tabs}>
          <div
            style={tab(metodo === "cartao")}
            onClick={() => setMetodo("cartao")}
          >
            Cartão (Crédito/Débito)
          </div>
          <div style={tab(metodo === "pix")} onClick={() => setMetodo("pix")}>
            PIX
          </div>
        </div>

        {metodo === "cartao" ? (
          <form onSubmit={pagarCartao}>
            {isInsecure && (
              <p
                style={{
                  background: "#fff3cd",
                  border: "1px solid #ffeeba",
                  color: "#856404",
                  padding: "10px 12px",
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: ".85rem",
                }}
              >
                🛡️ Pagamento com cartão só funciona quando o site estiver em
                HTTPS (publicado). Aqui no localhost ele bloqueia mesmo.
              </p>
            )}

            <label style={label}>Número do Cartão</label>
            <input
              style={input}
              placeholder="0000 0000 0000 0000"
              value={dadosCartao.numero}
              onChange={(e) => handleInput("numero", e.target.value)}
            />

            <label style={label}>Nome do Titular</label>
            <input
              style={input}
              placeholder="Ex: NATALIA SIMANOVSKI"
              value={dadosCartao.nome}
              onChange={(e) => handleInput("nome", e.target.value)}
            />

            <label style={label}>CPF do Titular</label>
            <input
              style={input}
              placeholder="000.000.000-00"
              value={dadosCartao.cpf}
              onChange={(e) => handleInput("cpf", e.target.value)}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                style={{ ...input, flex: 1 }}
                placeholder="MM"
                value={dadosCartao.validadeMes}
                onChange={(e) => handleInput("validadeMes", e.target.value)}
              />
              <input
                style={{ ...input, flex: 1 }}
                placeholder="AA"
                value={dadosCartao.validadeAno}
                onChange={(e) => handleInput("validadeAno", e.target.value)}
              />
              <input
                style={{ ...input, flex: 1 }}
                placeholder="CVV"
                value={dadosCartao.cvv}
                onChange={(e) => handleInput("cvv", e.target.value)}
              />
            </div>

            <button style={btn} disabled={loading}>
              {loading ? "Processando..." : "Pagar com Cartão"}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            {!qrPix ? (
              <>
                <p style={{ marginBottom: "20px", color: corOliva }}>
                  O PIX é instantâneo e sem taxas.
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
        )}

        <p style={msg}>{mensagem}</p>
      </div>
    </div>
  );
}
