// Agendar.jsx (exemplo)
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Agendar() {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [paymentRef, setPaymentRef] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!date) return;
    fetch(`${API}/agenda/slots?date=${date}`)
      .then(r => r.json())
      .then(data => setSlots(data.slots ?? []))
      .catch(() => setSlots([]));
  }, [date]);

  // contador do hold
  useEffect(() => {
    if (!expiresAt) return;
    const i = setInterval(() => {
      const end = new Date(expiresAt).getTime();
      const diff = end - Date.now();
      if (diff <= 0) {
        setCountdown("expirado");
        clearInterval(i);
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(`${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(i);
  }, [expiresAt]);

  async function criarHold(time) {
    const body = { date, time, usuario_id: 123 }; // trocar pelo ID real se tiver login
    const r = await fetch(`${API}/agenda/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" /*, Authorization: `Bearer ${jwt}`*/ },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!r.ok) {
      alert(data.erro || "Falha ao segurar horário.");
      return;
    }
    setPaymentRef(data.payment_ref);
    setExpiresAt(data.expires_at);
    sessionStorage.setItem("payment_ref", data.payment_ref);
  }

  async function confirmar() {
    const ref = paymentRef || sessionStorage.getItem("payment_ref");
    if (!ref) { alert("Sem payment_ref"); return; }
    const r = await fetch(`${API}/agenda/confirmar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_ref: ref }),
    });
    const data = await r.json();
    if (!r.ok) { alert(data.erro || "Falha ao confirmar."); return; }
    alert("Agendamento confirmado!");
    // opcional: recarregar slots
    if (date) {
      const resp = await fetch(`${API}/agenda/slots?date=${date}`);
      const d = await resp.json();
      setSlots(d.slots ?? []);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Agendar consulta</h1>

      <label>Escolha a data:</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <div style={{ marginTop: 16 }}>
        {slots.map(s => (
          <button
            key={s.time}
            onClick={() => criarHold(s.time)}
            disabled={!s.available || !!paymentRef}
            style={{ margin: 4, padding: "8px 12px", opacity: s.available ? 1 : 0.4 }}
          >
            {s.time}
          </button>
        ))}
      </div>

      {paymentRef && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
          <p><strong>Reserva temporária criada.</strong></p>
          <p>Ref: {paymentRef}</p>
          <p>Expira em: {countdown}</p>
          <button onClick={confirmar}>Confirmar pagamento (simular)</button>
        </div>
      )}
    </div>
  );
}
