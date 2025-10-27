// src/pages/admin/AdminAgendaSlots.jsx
import { useEffect, useMemo, useState } from "react";
import "../../css/admin-agenda.css";
import { fetchAuth, API } from "../../services/api";

function fmt(dt){
  const d = new Date(dt);
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit"});
}
function duracaoMin(inicio, fim){
  const a = new Date(inicio).getTime();
  const b = new Date(fim).getTime();
  return Math.max(0, Math.round((b-a)/60000));
}
function toCSV(rows){
  const header = ["Data Início","Data Fim","Duração (min)","Status","Paciente","Email","Pagamento Ref","Criado em"];
  const body = rows.map(r => [
    fmt(r.inicio),
    fmt(r.fim),
    duracaoMin(r.inicio, r.fim),
    r.tipo === "confirmado" ? (r.status || "confirmada") : "pendente",
    r.paciente ? `${r.paciente.nome || ""} ${r.paciente.sobrenome || ""}`.trim() : "",
    r.paciente?.email || "",
    r.payment_ref || "",
    r.reserved_at ? fmt(r.reserved_at) : ""
  ]);
  return [header, ...body].map(line => line.map(v => `"${String(v||"").replace(/"/g,'""')}"`).join(";")).join("\n");
}

export default function AdminAgendaSlots() {
  const hoje = new Date().toISOString().split("T")[0];
  const [dataInicio, setDataInicio] = useState(hoje);
  const [dataFim, setDataFim] = useState(hoje);

  const [status, setStatus] = useState("todos"); // todos|confirmado|hold
  const [busca, setBusca] = useState("");
  const [ordenar, setOrdenar] = useState("inicio"); // inicio|criado

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgTipo, setMsgTipo] = useState("");

  async function carregarSlots() {
    setLoading(true);
    setMsg("");
    try {
      const url = `${API}/admin/agenda/slots?de=${dataInicio}&ate=${dataFim}`;
      const r = await fetchAuth(url);
      const data = await r.json();
      setSlots(Array.isArray(data) ? data : []);
    } catch {
      setMsg("Erro ao carregar horários.");
      setMsgTipo("erro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregarSlots(); }, []);

  const filtrados = useMemo(()=>{
    let arr = [...slots];

    if (status !== "todos") {
      arr = arr.filter(s => (status === "confirmado" ? s.tipo === "confirmado" : s.tipo !== "confirmado"));
    }
    if (busca.trim()) {
      const q = busca.trim().toLowerCase();
      arr = arr.filter(s => {
        const nome = s.paciente ? `${s.paciente.nome||""} ${s.paciente.sobrenome||""}`.toLowerCase() : "";
        const email = s.paciente?.email?.toLowerCase() || "";
        const ref = (s.payment_ref || "").toLowerCase();
        return nome.includes(q) || email.includes(q) || ref.includes(q);
      });
    }
    if (ordenar === "inicio") {
      arr.sort((a,b)=> new Date(a.inicio) - new Date(b.inicio));
    } else {
      arr.sort((a,b)=> new Date(a.reserved_at || a.inicio) - new Date(b.reserved_at || b.inicio));
    }
    return arr;
  }, [slots, status, busca, ordenar]);

  function exportarCSV(){
    const csv = toCSV(filtrados);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agenda_${dataInicio}_a_${dataFim}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="admin-agenda-container">
      <h1 className="admin-agenda-titulo"> Agenda (lista detalhada)</h1>

      <div className="admin-agenda-filtros" style={{flexWrap:"wrap"}}>
        <div>
          <label>De:</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </div>
        <div>
          <label>Até:</label>
          <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>

        <div>
          <label>Status:</label>
          <select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="confirmado">Confirmados</option>
            <option value="hold">Pendentes/Hold</option>
          </select>
        </div>

        <div style={{flex:1, minWidth:240}}>
          <label>Buscar:</label>
          <input type="text" placeholder="Nome, e-mail ou ref. de pagamento" onChange={e=>setBusca(e.target.value)} />
        </div>

        <div>
          <label>Ordenar por:</label>
          <select value={ordenar} onChange={e=>setOrdenar(e.target.value)}>
            <option value="inicio">Data/Hora</option>
            <option value="criado">Criado em</option>
          </select>
        </div>

        <button onClick={carregarSlots}>Carregar</button>
        <button className="admin-agenda-btn-bloquear" onClick={exportarCSV}>Exportar CSV</button>
      </div>

      {loading ? (
        <div className="admin-agenda-spinner">Carregando...</div>
      ) : (
        <div className="admin-agenda-tabela">
          <div className="admin-agenda-head" style={{gridTemplateColumns:"1.4fr 1.4fr .6fr 1.3fr 1.4fr .9fr"}}>
            <span>Início</span>
            <span>Fim</span>
            <span>Duração</span>
            <span>Paciente</span>
            <span>E-mail</span>
            <span>Status</span>
          </div>

          {filtrados.length === 0 ? (
            <p className="admin-agenda-vazio">Nenhum registro encontrado.</p>
          ) : (
            filtrados.map((s, i) => (
              <div
                key={i}
                className={`admin-agenda-item ${s.tipo}`}
                style={{gridTemplateColumns:"1.4fr 1.4fr .6fr 1.3fr 1.4fr .9fr"}}
              >
                <span title={s.reserved_at ? `Criado em: ${fmt(s.reserved_at)}` : ""}>{fmt(s.inicio)}</span>
                <span>{fmt(s.fim)}</span>
                <span>{duracaoMin(s.inicio, s.fim)} min</span>
                <span>{s.paciente ? `${s.paciente.nome} ${s.paciente.sobrenome||""}` : "—"}</span>
                <span>{s.paciente?.email || "—"}</span>
                <span>
                  {s.tipo === "confirmado" ? " Confirmado" : " Pendente"}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {msg && <div className={`admin-agenda-msg ${msgTipo}`}>{msg}</div>}
    </div>
  );
}
