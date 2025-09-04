import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  // mock de login — troque quando tiver auth real
  const user = JSON.parse(localStorage.getItem("user") || "null");
  useEffect(() => { if (!user) navigate("/login"); }, [user, navigate]);
  if (!user) return null;

  // mock do agendamento
  const appointmentId = 123;
  const amount = 180.0;
  const description = "Consulta - Nutrição Esportiva";

  const BACK = import.meta.env.VITE_BACK_URL;
  const PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

  const [method, setMethod] = useState("card"); // "card" | "pix"
  const [pix, setPix] = useState(null);
  const [busy, setBusy] = useState(false);

  // refs para montar uma única vez e desmontar certo
  const areaRef = useRef(null);
  const mpRef = useRef(null);
  const cardControllerRef = useRef(null);

  async function unmountCardBrick() {
    const c = cardControllerRef.current;
    if (!c) return;
    try {
      if (typeof c.unmount === "function") await c.unmount();
      else if (typeof c.destroy === "function") await c.destroy();
    } catch {}
    cardControllerRef.current = null;
  }

  useEffect(() => {
    if (!window.MercadoPago || !areaRef.current) return;

    // instancia única do MP
    if (!mpRef.current) {
      mpRef.current = new window.MercadoPago(PUBLIC_KEY, {
        locale: "pt-BR",
        // se ainda tiver erro de Secure Fields em DEV, pode testar desligar:
        // advancedFraudPrevention: false,
      });
    }

    // limpa UI ao trocar de método
    setPix(null);
    areaRef.current.innerHTML = "";

    const mp = mpRef.current;
    const bricks = mp.bricks();

    async function mountCard() {
      await unmountCardBrick();

      const div = document.createElement("div");
      div.id = "card-brick";
      areaRef.current.appendChild(div);

      try {
        // ⚠️ BRICK CORRETO PARA CARTÃO
        const controller = await bricks.create("cardPayment", "card-brick", {
          initialization: {
            amount,               // só o valor — NÃO passe payer aqui p/ mostrar o campo de e-mail
          },
          customization: {
            visual: { style: { theme: "default" } },   // visual original
            paymentMethods: { maxInstallments: 12 },   // ajuste se quiser parcelamento
          },
          callbacks: {
            onReady: () => {},

            // assinatura do cardPayment: ({ selectedPaymentMethod, formData })
            onSubmit: async ({ selectedPaymentMethod, formData }) => {
              try {
                setBusy(true);

                // normaliza campos que mudam entre versões do Brick
                const token =
                  formData?.token ||
                  formData?.cardToken ||
                  formData?.tokenizedCard?.id;

                const paymentMethodId =
                  formData?.paymentMethodId || selectedPaymentMethod?.id || undefined;

                const issuerId =
                  formData?.issuerId || selectedPaymentMethod?.issuer?.id || undefined;

                const installments = Number(formData?.installments || 1);

                const payerEmail =
                  formData?.payer?.email ||
                  user?.email ||
                  "comprador-teste@example.com";

                const idType = (formData?.payer?.identification?.type || "CPF").toUpperCase();
                const idNumber = String(formData?.payer?.identification?.number || "").replace(/\D/g, "");

                if (!token) throw new Error("Failed to create card token");
                if (!payerEmail) throw new Error("E-mail ausente");
                if (!idNumber || idNumber.length !== 11) throw new Error("CPF inválido");

                const headers = {
                  "Content-Type": "application/json",
                  ...(localStorage.getItem("token")
                    ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    : { "x-user-id": user.id }),
                };

                const resp = await fetch(`${BACK}/api/payments/card`, {
                  method: "POST",
                  headers,
                  body: JSON.stringify({
                    appointmentId,
                    description,
                    amount,
                    token,
                    ...(paymentMethodId ? { payment_method_id: paymentMethodId } : {}),
                    ...(issuerId ? { issuer_id: issuerId } : {}),
                    installments,
                    payer: {
                      email: payerEmail,
                      identification: { type: idType, number: idNumber },
                    },
                  }),
                });

                const data = await resp.json();
                if (!resp.ok || data.error) throw new Error(data.error || "Falha na API");

                if (data.status === "approved") {
                  location.href = `/pagamento/sucesso?appointmentId=${appointmentId}`;
                } else if (["in_process", "pending"].includes(data.status)) {
                  location.href = `/pagamento/pendente?appointmentId=${appointmentId}`;
                } else {
                  location.href = `/pagamento/erro?appointmentId=${appointmentId}`;
                }
              } catch (err) {
                console.error("CARD SUBMIT ERR:", err);
                alert(err?.message || "Erro no formulário do cartão");
              } finally {
                setBusy(false);
              }
            },

            onError: (error) => {
              console.group("BRICK onError");
              console.log("message:", error?.message);
              console.log("code:", error?.code);
              console.log("cause:", error?.cause);
              console.log("full:", JSON.stringify(error, null, 2));
              console.groupEnd();

              const msg =
                error?.message ||
                error?.cause?.[0]?.description ||
                error?.cause?.[0]?.code ||
                "Erro no formulário do cartão";
              alert(msg);
            },
          },
        });

        cardControllerRef.current = controller;
      } catch (e) {
        console.error("CREATE BRICK ERR:", e);
        alert("Falha ao montar o formulário do cartão");
      }
    }

    async function mountPix() {
      await unmountCardBrick();

      const btn = document.createElement("button");
      btn.textContent = "Gerar QR Pix";
      btn.style.padding = "12px";
      btn.style.borderRadius = "10px";
      btn.style.border = "1px solid #e2c8c0";
      btn.style.background = "#ead8d2";
      btn.onclick = async () => {
        try {
          setBusy(true);
          const headers = {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token")
              ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
              : { "x-user-id": user.id }),
          };
          const resp = await fetch(`${BACK}/api/payments/pix`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              appointmentId,
              description: `${description} (Pix)`,
              amount,
              payer: { email: user?.email || "comprador-teste@example.com" },
            }),
          });
          const data = await resp.json();
          if (!resp.ok || data.error) throw new Error(data.error || "falha ao gerar PIX");
          setPix(data);
        } catch (e) {
          console.error("PIX ERR:", e);
          alert("Erro ao gerar Pix");
        } finally {
          setBusy(false);
        }
      };

      areaRef.current.appendChild(btn);
    }

    if (method === "card") mountCard();
    else mountPix();

    return () => {
      unmountCardBrick();
      if (areaRef.current) areaRef.current.innerHTML = "";
    };
  }, [method, BACK, PUBLIC_KEY, user?.id, user?.email]);

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Pagamento</h1>
      <p>Escolha o método de pagamento:</p>

      <div style={{ display: "flex", gap: 12, margin: "12px 0 20px" }}>
        <button
          onClick={() => setMethod("card")}
          disabled={busy}
          style={{
            padding: 10,
            background: method === "card" ? "#e9d9d3" : "#f5f1ee",
            border: "1px solid #e2c8c0",
            borderRadius: 10,
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          Cartão
        </button>
        <button
          onClick={() => setMethod("pix")}
          disabled={busy}
          style={{
            padding: 10,
            background: method === "pix" ? "#e9d9d3" : "#f5f1ee",
            border: "1px solid #e2c8c0",
            borderRadius: 10,
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          Pix
        </button>
      </div>

      {/* Aqui o Brick do cartão OU o botão do Pix */}
      <div ref={areaRef} />

      {/* Pix render */}
      {method === "pix" && pix?.qr_code_base64 && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <img
            src={`data:image/png;base64,${pix.qr_code_base64}`}
            alt="QR Pix"
            width="240"
            height="240"
            style={{ borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,.08)" }}
          />
          <p style={{ marginTop: 8 }}>Expira: {pix.expiration_date}</p>
          <p style={{ opacity: 0.8 }}>
            Depois de pagar, aguarde alguns segundos para o sistema confirmar.
          </p>
        </div>
      )}
    </div>
  );
}
