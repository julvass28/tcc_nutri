import { useEffect, useState } from "react";
import { getPaymentStatus } from "../services/api";

export default function PagamentoPendente() {
  const [status, setStatus] = useState("pending");
  const appointmentId = new URLSearchParams(location.search).get("appointmentId");

  useEffect(() => {
    const i = setInterval(async () => {
      try {
        const data = await getPaymentStatus(appointmentId);
        setStatus(data.status);
      } catch {}
    }, 4000); // poll a cada 4s até webhook atualizar
    return () => clearInterval(i);
  }, [appointmentId]);

  return (
    <div className="retorno">
      <h1>⌛ Pagamento pendente</h1>
      <p>Se for Pix, assim que o pagamento for confirmado, essa tela vai atualizar.</p>
      <p>Status atual: <b>{status}</b></p>
    </div>
  );
}
