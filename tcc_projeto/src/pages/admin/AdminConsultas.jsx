// src/pages/admin/AdminConsultas.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../../css/admin-consultas.css";
import { API, fetchAuth } from "../../services/api";
import {
  FaClipboardList,
  FaFilePdf,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import ConfirmDialog from "../../components/ConfirmDialog";

function formatDateTimeRange(inicio, fim) {
  const di = new Date(inicio);
  const df = new Date(fim);

  const data = di.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });

  const hi = di.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const hf = df.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { data, horario: `${hi} – ${hf}` };
}

// helper p/ tentar extrair telefone de um objeto de respostas de anamnese
function extrairTelefoneDeRespostas(respostas = {}) {
  const chavesPossiveis = [
    "telefone",
    "telefone_contato",
    "telefone de contato",
    "celular",
    "celular (whatsapp)",
    "whatsapp",
    "whats",
    "contato",
  ];

  for (const [k, v] of Object.entries(respostas)) {
    const keyLower = String(k).toLowerCase();
    if (
      chavesPossiveis.some((alvo) =>
        keyLower.includes(alvo.toLowerCase())
      )
    ) {
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  }

  return "";
}

// helper p/ tentar extrair especialidade das respostas da anamnese
function extrairEspecialidadeDeRespostas(respostas = {}) {
  const chavesPossiveis = [
    "especialidade",
    "especialidade_desejada",
    "especialidade desejada",
    "tipo_consulta",
    "tipo de consulta",
    "área de atendimento",
    "area_atendimento",
  ];

  for (const [k, v] of Object.entries(respostas)) {
    const keyLower = String(k).toLowerCase();
    if (
      chavesPossiveis.some((alvo) =>
        keyLower.includes(alvo.toLowerCase())
      )
    ) {
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  }

  return "";
}

export default function AdminConsultas() {
  const hojeISO = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );

  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [selected, setSelected] = useState(null); // consulta selecionada p/ ver anamnese/PDF
  const [printing, setPrinting] = useState(false);

  const [confirmState, setConfirmState] = useState({
    open: false,
    type: null, // "finalizar" | "cancelar"
    consulta: null,
  });

  const [filtros, setFiltros] = useState({
    de: hojeISO,
    ate: hojeISO,
    status: "ativas",
    especialidade: "",
  });

  // limpa feedback automaticamente
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(t);
  }, [feedback]);

  const statusLabel = {
    pendente: "Pendente",
    confirmada: "Confirmada",
    finalizada: "Finalizada",
    cancelada: "Cancelada",
  };

  const statusBadgeClass = (s) => {
    switch (s) {
      case "pendente":
        return "adm-consulta-badge adm-consulta-badge--pending";
      case "confirmada":
        return "adm-consulta-badge adm-consulta-badge--ok";
      case "finalizada":
        return "adm-consulta-badge adm-consulta-badge--done";
      case "cancelada":
        return "adm-consulta-badge adm-consulta-badge--cancel";
      default:
        return "adm-consulta-badge";
    }
  };

  const especialidades = useMemo(
    () => [
      { value: "", label: "Todas" },
      { value: "clinica", label: "Nutrição Clínica" },
      { value: "emagrecimento", label: "Emagrecimento e Obesidade" },
      { value: "esportiva", label: "Nutrição Esportiva" },
      { value: "pediatrica", label: "Nutrição Pediátrica" },
      { value: "intolerancias", label: "Intolerâncias Alimentares" },
    ],
    []
  );

  async function carregarConsultas(sigFiltros = filtros) {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (sigFiltros.de) params.set("de", sigFiltros.de);
      if (sigFiltros.ate) params.set("ate", sigFiltros.ate);
      if (sigFiltros.status) params.set("status", sigFiltros.status);
      if (sigFiltros.especialidade)
        params.set("especialidade", sigFiltros.especialidade);

      const url = `${API}/admin/consultas?${params.toString()}`;
      const resp = await fetchAuth(url);
      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.erro || "Erro ao carregar consultas.");
      }
      const data = await resp.json();

      setConsultas(
        (data || []).map((c) => {
          const _inicioDate = c.inicio ? new Date(c.inicio) : null;

          // normaliza referência do pagamento (para casar com a anamnese)
          const paymentRef =
            c.payment_ref ||
            c.idempotency_key ||
            c.idempotencyKey ||
            null;

          const anamnese = c.anamnese || null;
          let anamneseOk = false;

          if (anamnese) {
            const anRef =
              anamnese.payment_ref ||
              anamnese.paymentRef ||
              anamnese.payment_reference ||
              null;

            // ✅ só considera respondida se a anamnese for DAQUELA consulta
            if (paymentRef && anRef && String(paymentRef) === String(anRef)) {
              anamneseOk = true;
            } else if (!paymentRef) {
              // fallback p/ registros antigos sem payment_ref
              if (typeof c.anamneseRespondida === "boolean") {
                anamneseOk = c.anamneseRespondida;
              } else if (
                anamnese.respostas &&
                Object.keys(anamnese.respostas).length > 0
              ) {
                anamneseOk = true;
              }
            }
          } else if (typeof c.anamneseRespondida === "boolean") {
            anamneseOk = c.anamneseRespondida;
          }

          return {
            ...c,
            _inicioDate,
            payment_ref: paymentRef,
            anamneseRespondida: anamneseOk,
          };
        })
      );
    } catch (e) {
      console.error(e);
      setFeedback({
        type: "error",
        msg: e.message || "Erro ao carregar consultas.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarConsultas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.de, filtros.ate, filtros.status, filtros.especialidade]);

  function handleFiltroChange(e) {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  }

  function limparFiltros() {
    setFiltros({
      de: hojeISO,
      ate: hojeISO,
      status: "ativas",
      especialidade: "",
    });
  }

  function fmtData(d) {
    if (!d) return "-";
    return d.toLocaleDateString("pt-BR");
  }

  function fmtHora(d) {
    if (!d) return "-";
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function copiar(texto, tipo = "Dado") {
    try {
      await navigator.clipboard.writeText(texto);
      setFeedback({
        type: "ok",
        msg: `${tipo} copiado para a área de transferência.`,
      });
    } catch (e) {
      console.error(e);
      setFeedback({
        type: "error",
        msg: `Não foi possível copiar o ${tipo.toLowerCase()}.`,
      });
    }
  }

  async function cancelarConsulta(id) {
    try {
      setActionId(id);
      const resp = await fetchAuth(`${API}/admin/consultas/${id}/cancelar`, {
        method: "POST",
      });
      const j = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(j.erro || "Erro ao cancelar consulta.");

      setConsultas((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "cancelada" } : c
        )
      );
      setFeedback({ type: "ok", msg: "Consulta cancelada com sucesso." });
    } catch (e) {
      console.error(e);
      setFeedback({
        type: "error",
        msg: e.message || "Erro ao cancelar consulta.",
      });
    } finally {
      setActionId(null);
    }
  }

  async function finalizarConsulta(id) {
    try {
      setActionId(id);
      const resp = await fetchAuth(`${API}/admin/consultas/${id}/finalizar`, {
        method: "POST",
      });
      const j = await resp.json().catch(() => ({}));
      if (!resp.ok)
        throw new Error(j.erro || "Erro ao finalizar a consulta.");

      setConsultas((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "finalizada" } : c
        )
      );
      setFeedback({
        type: "ok",
        msg: "Consulta marcada como finalizada.",
      });
    } catch (e) {
      console.error(e);
      setFeedback({
        type: "error",
        msg: e.message || "Erro ao finalizar consulta.",
      });
    } finally {
      setActionId(null);
    }
  }

  function openConfirm(tipo, consulta) {
    setConfirmState({
      open: true,
      type: tipo,
      consulta,
    });
  }

  function closeConfirm() {
    setConfirmState({
      open: false,
      type: null,
      consulta: null,
    });
  }

  function handleConfirmDialog() {
    if (!confirmState.consulta) return;
    const id = confirmState.consulta.id;

    if (confirmState.type === "finalizar") {
      finalizarConsulta(id);
    } else if (confirmState.type === "cancelar") {
      cancelarConsulta(id);
    }

    closeConfirm();
  }

  function handleAbrirAnamnese(consulta) {
    if (!consulta?.anamneseRespondida || !consulta.anamnese) {
      setFeedback({
        type: "error",
        msg: "Esta consulta ainda não possui anamnese vinculada.",
      });
      return;
    }
    setSelected(consulta);
  }

  function handleExportarPDF() {
    if (!selected?.anamnese) return;

    const { paciente, anamnese, inicio, fim, telefone, especialidade } =
      selected;
    const { data, horario } = formatDateTimeRange(inicio, fim);
    const respostas = anamnese.respostas || {};

    // telefone p/ PDF
    let telefonePDF = telefone || "";
    if (!telefonePDF) {
      telefonePDF = extrairTelefoneDeRespostas(respostas);
    }

    // especialidade p/ PDF
    let especialidadePDF = "";
    if (especialidade) {
      const found = especialidades.find((e) => e.value === especialidade);
      especialidadePDF = found?.label || especialidade;
    }
    if (!especialidadePDF) {
      especialidadePDF = extrairEspecialidadeDeRespostas(respostas);
    }

    const camposHTML = Object.entries(respostas)
      .map(([chave, valor]) => {
        const label = String(chave)
          .replace(/_/g, " ")
          .replace(/\b\w/g, (m) => m.toUpperCase());

        let texto;
        if (Array.isArray(valor)) {
          texto = valor.join(", ");
        } else if (typeof valor === "boolean") {
          texto = valor ? "Sim" : "Não";
        } else if (typeof valor === "object" && valor !== null) {
          texto = Object.entries(valor)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n");
        } else {
          texto = String(valor ?? "");
        }

        return `
          <div class="campo">
            <span class="campo-label">${label}</span>
            <span class="campo-valor">${texto || "—"}</span>
          </div>
        `;
      })
      .join("");

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;

    setPrinting(true);

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Anamnese - ${paciente?.nome || ""}</title>
          <style>
            :root {
              --bg:#f4efec;
              --card:#ffffff;
              --rose:#d1a0a0;
              --olive:#8a8f75;
              --text:#333333;
              --border:#e0d5d2;
            }
            body {
              margin:0;
              padding:32px;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              background: radial-gradient(circle at top left,#fceff1,#f4efec);
              color:var(--text);
            }
            .wrapper {
              max-width:920px;
              margin:0 auto;
            }
            .card {
              background:var(--card);
              border-radius:14px;
              border:1px solid var(--border);
              padding:18px 20px 20px;
              box-shadow:0 10px 26px rgba(0,0,0,.06);
            }
            .header {
              display:flex;
              justify-content:space-between;
              align-items:flex-start;
              margin-bottom:16px;
            }
            .marca {
              font-size:13px;
              text-transform:uppercase;
              letter-spacing:.18em;
              color:#a18787;
            }
            .titulo {
              font-size:22px;
              font-weight:700;
              color:var(--rose);
              margin:4px 0 2px;
            }
            .sub {
              font-size:13px;
              color:#6a6a6a;
            }
            .info-consulta {
              font-size:13px;
              margin-top:8px;
            }
            .grid-2 {
              display:grid;
              grid-template-columns:1fr 1fr;
              gap:12px 32px;
              margin-top:10px;
            }
            .campo {
              margin-bottom:6px;
            }
            .campo-label {
              display:block;
              font-size:11px;
              text-transform:uppercase;
              letter-spacing:.08em;
              color:#9b8c8c;
              margin-bottom:2px;
            }
            .campo-valor {
              font-size:13px;
              color:var(--text);
              line-height:1.3;
              white-space:pre-wrap;
            }
            .rodape {
              margin-top:18px;
              padding-top:10px;
              border-top:1px dashed var(--border);
              display:flex;
              justify-content:space-between;
              align-items:center;
              font-size:11px;
              color:#7a746f;
            }
            .assinatura {
              text-align:right;
            }
            .assinatura strong {
              display:block;
              font-size:12px;
              color:#5e5a55;
            }
            .logo-mini {
              font-weight:700;
              font-size:12px;
              color:var(--olive);
              letter-spacing:.12em;
              text-transform:uppercase;
            }
            @media print {
              body { padding:12mm; background:#f4efec; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <div class="header">
                <div>
                  <div class="marca">Registro de Anamnese</div>
                  <h1 class="titulo">Nutricionista Natália Simanoviski</h1>
                  <div class="sub">
                    Paciente: ${paciente?.nome || ""} ${paciente?.sobrenome || ""}<br/>
                    E-mail: ${paciente?.email || "—"}<br/>
                    Telefone: ${telefonePDF || "—"}<br/>
                    Especialidade: ${especialidadePDF || "—"}
                  </div>
                  <div class="info-consulta">
                    Consulta em <strong>${data}</strong> • <strong>${horario}</strong>
                  </div>
                </div>
                <div class="logo-mini">
                  NEVEN<br/>
                  NUTRI
                </div>
              </div>

              <div class="grid-2">
                ${camposHTML}
              </div>

              <div class="rodape">
                <div>
                  Documento gerado para arquivo clínico da Nutricionista Natália Simanoviski.
                </div>
                <div class="assinatura">
                  <strong>Nutricionista Natália Simanoviski</strong>
                  <span>Registro profissional • Arquivo digital</span>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();

    setTimeout(() => setPrinting(false), 800);
  }

  return (
    <div className="adm-consultas-page">
      {/* estilos específicos da tela de consultas */}
      <style>{`
        .adm-consultas-page {
          --rose:#D1A0A0;
          --olive:#8A8F75;
          --bg:#ECE7E6;
          --border:rgba(0,0,0,.08);
          --danger:#b23b3b;
          --ok:#4c8c4a;
        }
        .adm-consultas-header{
          display:flex;
          flex-direction:column;
          gap:8px;
          margin-bottom:18px;
        }
        .adm-consultas-title{
          font-size:24px;
          font-weight:700;
          color:#3c3c3c;
          display:flex;
          align-items:center;
          gap:8px;
        }
        .adm-consultas-sub{
          font-size:14px;
          color:#666;
        }

        .adm-consultas-filtros{
          display:flex;
          flex-wrap:wrap;
          gap:12px;
          padding:12px 14px;
          background:#fff;
          border-radius:14px;
          border:1px solid var(--border);
          margin-bottom:16px;
        }
        .adm-consultas-filtro{
          display:flex;
          flex-direction:column;
          gap:4px;
          min-width:150px;
          flex:1 1 150px;
        }
        .adm-consultas-filtro label{
          font-size:12px;
          font-weight:600;
          color:#555;
        }
        .adm-consultas-filtro input,
        .adm-consultas-filtro select{
          border-radius:8px;
          border:1px solid var(--border);
          padding:6px 8px;
          font-size:14px;
          background:#fafafa;
        }
        .adm-consultas-filtros-footer{
          display:flex;
          align-items:flex-end;
          gap:8px;
          margin-left:auto;
        }
        .adm-consultas-btn-clear{
          border-radius:999px;
          padding:6px 12px;
          border:1px solid var(--border);
          background:#f5f3f2;
          font-size:13px;
          cursor:pointer;
        }
        .adm-consultas-btn-clear:hover{
          background:#ece7e6;
        }

        .adm-consultas-table-wrapper{
          background:#fff;
          border-radius:14px;
          border:1px solid var(--border);
          overflow-x:auto;
        }
        table.adm-consultas-table{
          width:100%;
          border-collapse:collapse;
          font-size:14px;
        }
        .adm-consultas-table thead{
          background:#f7f4f3;
        }
        .adm-consultas-table th,
        .adm-consultas-table td{
          padding:10px 8px;
          border-bottom:1px solid #eee;
          text-align:left;
          white-space:nowrap;
        }
        .adm-consultas-table th{
          font-size:12px;
          text-transform:uppercase;
          letter-spacing:.06em;
          color:#777;
        }
        .adm-consultas-table tbody tr:hover{
          background:#fcfafa;
        }

        .adm-consultas-spinner{
          width:22px;
          height:22px;
          border-radius:50%;
          border:3px solid #ddd;
          border-top-color:var(--olive);
          animation:adm-spin .7s linear infinite;
          margin-right:8px;
          display:inline-block;
          vertical-align:middle;
        }
        @keyframes adm-spin{
          to{ transform:rotate(360deg); }
        }

        .adm-consulta-email{
          display:flex;
          align-items:center;
          gap:6px;
        }
        .adm-consulta-copy-btn{
          border:none;
          background:transparent;
          padding:0;
          cursor:pointer;
          font-size:16px;
        }

        .adm-consulta-badge{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:2px 8px;
          border-radius:999px;
          font-size:11px;
          font-weight:600;
          background:#eee;
          color:#555;
        }
        .adm-consulta-badge--pending{
          background:#fff8e1;
          color:#8a6d1f;
        }
        .adm-consulta-badge--ok{
          background:#e3f3e2;
          color:#2e6b2b;
        }
        .adm-consulta-badge--done{
          background:#e7e3ff;
          color:#4c3ba5;
        }
        .adm-consulta-badge--cancel{
          background:#ffe5e5;
          color:#b23b3b;
        }

        .adm-consulta-actions{
          display:flex;
          flex-wrap:wrap;
          gap:6px;
        }
        .adm-consulta-btn{
          border-radius:999px;
          border:1px solid transparent;
          padding:4px 10px;
          font-size:12px;
          cursor:pointer;
          background:#f5f3f2;
        }
        .adm-consulta-btn--primary{
          background:var(--olive);
          color:#fff;
          border-color:var(--olive);
        }
        .adm-consulta-btn--danger{
          background:#fff;
          color:#b23b3b;
          border-color:rgba(178,59,59,.3);
        }
        .adm-consulta-btn--ghost{
          background:#fff;
          color:#555;
          border-color:#ddd;
        }
        .adm-consulta-btn[disabled]{
          opacity:.6;
          cursor:default;
        }

        .adm-consultas-empty{
          padding:14px;
          font-size:14px;
          color:#777;
          display:flex;
          align-items:center;
          gap:8px;
        }

        .adm-consultas-feedback{
          margin-top:10px;
          font-size:13px;
          padding:8px 10px;
          border-radius:8px;
        }
        .adm-consultas-feedback--ok{
          background:#e3f3e2;
          color:#2e6b2b;
        }
        .adm-consultas-feedback--error{
          background:#ffe5e5;
          color:#b23b3b;
        }

        .adm-consultas-pill{
          display:inline-flex;
          align-items:center;
          gap:4px;
          padding:2px 8px;
          border-radius:999px;
          font-size:11px;
          font-weight:600;
        }
        .adm-consultas-pill--ok{
          background:#e3f3e2;
          color:#2e6b2b;
        }
        .adm-consultas-pill--pending{
          background:#fff8e1;
          color:#8a6d1f;
        }

        .adm-consultas-modal-backdrop{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.35);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:60;
        }
        .adm-consultas-modal{
          background:#fff;
          border-radius:14px;
          max-width:960px;
          width:100%;
          max-height:90vh;
          display:flex;
          flex-direction:column;
          overflow:hidden;
          box-shadow:0 20px 50px rgba(0,0,0,.25);
        }
        .adm-consultas-modal__header{
          padding:12px 16px;
          border-bottom:1px solid #eee;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }
        .adm-consultas-modal__header h2{
          margin:0;
          font-size:18px;
          display:flex;
          align-items:center;
          gap:6px;
        }
        .adm-consultas-modal__close{
          border:none;
          background:transparent;
          font-size:16px;
          cursor:pointer;
        }
        .adm-consultas-modal__body{
          padding:12px 16px 8px;
          overflow:auto;
        }
        .adm-consultas-modal__info{
          font-size:13px;
          margin-bottom:10px;
          color:#666;
        }
        .adm-consultas-modal__grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:10px 16px;
        }
        .adm-consultas-modal__campo{
          border-radius:10px;
          border:1px solid #f0e6e3;
          padding:8px 9px;
          background:#fdfaf9;
        }
        .adm-consultas-modal__label{
          display:block;
          font-size:11px;
          text-transform:uppercase;
          letter-spacing:.06em;
          color:#9b8c8c;
          margin-bottom:2px;
        }
        .adm-consultas-modal__value{
          font-size:13px;
          color:#333;
          white-space:pre-wrap;
        }
        .adm-consultas-modal__footer{
          padding:10px 16px;
          border-top:1px solid #eee;
          display:flex;
          justify-content:flex-end;
          gap:8px;
        }
        .adm-consultas-btn{
          border-radius:999px;
          border:1px solid transparent;
          padding:6px 14px;
          font-size:13px;
          cursor:pointer;
        }
        .adm-consultas-btn--ghost{
          background:#fff;
          border-color:#ddd;
          color:#555;
        }
        .adm-consultas-btn--pdf{
          background:var(--rose);
          border-color:var(--rose);
          color:#fff;
          display:inline-flex;
          align-items:center;
          gap:6px;
        }

        .cd-backdrop{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.35);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:70;
        }
        .cd-card{
          background:#fff;
          border-radius:12px;
          padding:18px 20px 16px;
          max-width:360px;
          width:100%;
          box-shadow:0 18px 45px rgba(0,0,0,.25);
        }
        .cd-title{
          margin:0 0 8px;
          font-size:16px;
          font-weight:700;
          color:#3b3b3b;
        }
        .cd-message{
          margin:0 0 14px;
          font-size:14px;
          color:#555;
        }
        .cd-actions{
          display:flex;
          justify-content:flex-end;
          gap:8px;
        }
        .cd-btn{
          border-radius:999px;
          padding:6px 12px;
          font-size:13px;
          border:1px solid transparent;
          cursor:pointer;
        }
        .cd-btn.outlined{
          background:#fff;
          border-color:#ddd;
          color:#555;
        }
        .cd-btn.danger{
          background:#b23b3b;
          border-color:#b23b3b;
          color:#fff;
        }

        @media (max-width: 768px){
          .adm-consultas-header{
            align-items:flex-start;
          }
          .adm-consultas-title{
            font-size:20px;
          }
          .adm-consultas-modal{
            max-width:100%;
            margin:0 10px;
          }
        }
      `}</style>

      <header className="adm-consultas-header">
        <h1 className="adm-consultas-title">
          <FaClipboardList />
          <span>Consultas</span>
        </h1>
        <p className="adm-consultas-sub">
          Acompanhe consultas, finalize atendimentos, visualize anamneses e
          gerencie cancelamentos em um só lugar.
        </p>
      </header>

      <section className="adm-consultas-filtros">
        <div className="adm-consultas-filtro">
          <label>De</label>
          <input
            type="date"
            name="de"
            value={filtros.de}
            onChange={handleFiltroChange}
          />
        </div>

        <div className="adm-consultas-filtro">
          <label>Até</label>
          <input
            type="date"
            name="ate"
            value={filtros.ate}
            onChange={handleFiltroChange}
          />
        </div>

        <div className="adm-consultas-filtro">
          <label>Status</label>
          <select
            name="status"
            value={filtros.status}
            onChange={handleFiltroChange}
          >
            <option value="ativas">Ativas (pendente + confirmada)</option>
            <option value="pendente">Só pendentes</option>
            <option value="confirmada">Só confirmadas</option>
            <option value="finalizada">Só finalizadas</option>
            <option value="cancelada">Só canceladas</option>
            <option value="todas">Todas</option>
          </select>
        </div>

        <div className="adm-consultas-filtro">
          <label>Especialidade</label>
          <select
            name="especialidade"
            value={filtros.especialidade}
            onChange={handleFiltroChange}
          >
            {especialidades.map((e) => (
              <option key={e.value || "all"} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        <div className="adm-consultas-filtros-footer">
          <button
            type="button"
            className="adm-consultas-btn-clear"
            onClick={limparFiltros}
          >
            Limpar filtros
          </button>
        </div>
      </section>

      <section className="adm-consultas-table-wrapper">
        {loading && !consultas.length ? (
          <div className="adm-consultas-empty">
            <span className="adm-consultas-spinner" />
            <span>Carregando consultas…</span>
          </div>
        ) : !consultas.length ? (
          <div className="adm-consultas-empty">
            Nenhuma consulta encontrada com os filtros atuais.
          </div>
        ) : (
          <table className="adm-consultas-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Horário</th>
                <th>Paciente</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Especialidade</th>
                <th>Status</th>
                <th>Anamnese</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {consultas.map((c) => {
                const isPast = c.fim ? new Date(c.fim) < new Date() : false;
                const podeFinalizar =
                  c.status === "confirmada" && isPast;
                const podeCancelar =
                  c.status === "confirmada" || c.status === "pendente";

                const telefoneFromAnamnese = c.anamnese
                  ? extrairTelefoneDeRespostas(
                      c.anamnese.respostas || {}
                    )
                  : "";
                const telefoneLinha =
                  c.telefone || telefoneFromAnamnese || "";

                return (
                  <tr key={c.id}>
                    <td>{fmtData(c._inicioDate)}</td>
                    <td>{fmtHora(c._inicioDate)}</td>
                    <td>
                      {c.paciente
                        ? `${c.paciente.nome || ""} ${
                            c.paciente.sobrenome || ""
                          }`.trim() || "-"
                        : "-"}
                    </td>
                    <td>
                      {c.paciente?.email ? (
                        <div className="adm-consulta-email">
                          <span>{c.paciente.email}</span>
                          <button
                            type="button"
                            className="adm-consulta-copy-btn"
                            onClick={() =>
                              copiar(c.paciente.email, "E-mail")
                            }
                            title="Copiar e-mail"
                          >
                            <MdContentCopy />
                          </button>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {telefoneLinha ? (
                        <div className="adm-consulta-email">
                          <span>{telefoneLinha}</span>
                          <button
                            type="button"
                            className="adm-consulta-copy-btn"
                            onClick={() =>
                              copiar(telefoneLinha, "Telefone")
                            }
                            title="Copiar telefone"
                          >
                            <MdContentCopy />
                          </button>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {(() => {
                        // 1) tenta usar slug vindo da agenda (clinica, esportiva, etc)
                        if (c.especialidade) {
                          const opt = especialidades.find(
                            (e) => e.value === c.especialidade
                          );
                          if (opt) return opt.label;
                          return c.especialidade;
                        }

                        // 2) fallback: tenta extrair da própria anamnese
                        if (c.anamnese && c.anamnese.respostas) {
                          const esp = extrairEspecialidadeDeRespostas(
                            c.anamnese.respostas || {}
                          );
                          if (esp) return esp;
                        }

                        return "-";
                      })()}
                    </td>
                    <td>
                      <span className={statusBadgeClass(c.status)}>
                        {statusLabel[c.status] || c.status}
                      </span>
                    </td>
                    <td>
                      {c.anamneseRespondida ? (
                        <span className="adm-consultas-pill adm-consultas-pill--ok">
                          <FaCheckCircle /> Respondida
                        </span>
                      ) : (
                        <span className="adm-consultas-pill adm-consultas-pill--pending">
                          Pendente
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="adm-consulta-actions">
                        <button
                          type="button"
                          className="adm-consulta-btn adm-consulta-btn--ghost"
                          disabled={!c.anamneseRespondida || !c.anamnese}
                          onClick={() => handleAbrirAnamnese(c)}
                        >
                          Ver anamnese
                        </button>

                        {c.status === "finalizada" ? (
                          <button
                            type="button"
                            className="adm-consulta-btn adm-consulta-btn--primary"
                            onClick={() => setSelected(c)}
                          >
                            Exportar PDF
                          </button>
                        ) : (
                          <>
                            {podeFinalizar && (
                              <button
                                type="button"
                                className="adm-consulta-btn adm-consulta-btn--primary"
                                disabled={actionId === c.id}
                                onClick={() => openConfirm("finalizar", c)}
                              >
                                {actionId === c.id
                                  ? "Finalizando..."
                                  : "Finalizar"}
                              </button>
                            )}

                            {podeCancelar && (
                              <button
                                type="button"
                                className="adm-consulta-btn adm-consulta-btn--danger"
                                disabled={actionId === c.id}
                                onClick={() => openConfirm("cancelar", c)}
                              >
                                {actionId === c.id
                                  ? "Cancelando..."
                                  : "Cancelar"}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {feedback && (
        <div
          className={
            "adm-consultas-feedback " +
            (feedback.type === "error"
              ? "adm-consultas-feedback--error"
              : "adm-consultas-feedback--ok")
          }
        >
          {feedback.msg}
        </div>
      )}

      {selected && selected.anamnese && (
        <div
          className="adm-consultas-modal-backdrop"
          onClick={() => !printing && setSelected(null)}
        >
          <div
            className="adm-consultas-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="adm-consultas-modal__header">
              <h2>
                Anamnese –{" "}
                {selected.paciente
                  ? `${selected.paciente.nome || ""} ${
                      selected.paciente.sobrenome || ""
                    }`
                  : ""}
              </h2>
              <button
                type="button"
                className="adm-consultas-modal__close"
                onClick={() => setSelected(null)}
                disabled={printing}
              >
                <FaTimes />
              </button>
            </header>

            <div className="adm-consultas-modal__body">
              <p className="adm-consultas-modal__info">
                <strong>Consulta:</strong>{" "}
                {formatDateTimeRange(selected.inicio, selected.fim).data} •{" "}
                {formatDateTimeRange(selected.inicio, selected.fim).horario}
              </p>

              <div className="adm-consultas-modal__grid">
                {Object.entries(selected.anamnese.respostas || {}).map(
                  ([chave, valor]) => {
                    const label = String(chave)
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (m) => m.toUpperCase());

                    let texto;
                    if (Array.isArray(valor)) {
                      texto = valor.join(", ");
                    } else if (typeof valor === "boolean") {
                      texto = valor ? "Sim" : "Não";
                    } else if (typeof valor === "object" && valor !== null) {
                      texto = Object.entries(valor)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join("\n");
                    } else {
                      texto = String(valor ?? "");
                    }

                    return (
                      <div
                        key={chave}
                        className="adm-consultas-modal__campo"
                      >
                        <span className="adm-consultas-modal__label">
                          {label}
                        </span>
                        <span className="adm-consultas-modal__value">
                          {texto || "—"}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <footer className="adm-consultas-modal__footer">
              <button
                type="button"
                className="adm-consultas-btn adm-consultas-btn--ghost"
                onClick={() => setSelected(null)}
                disabled={printing}
              >
                Fechar
              </button>
              <button
                type="button"
                className="adm-consultas-btn adm-consultas-btn--pdf"
                onClick={handleExportarPDF}
                disabled={printing}
              >
                <FaFilePdf /> Exportar PDF
              </button>
            </footer>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmState.open}
        title={
          confirmState.type === "finalizar"
            ? "Finalizar consulta"
            : "Cancelar consulta"
        }
        message={
          confirmState.type === "finalizar"
            ? "Tem certeza que deseja marcar esta consulta como FINALIZADA? Essa ação é permanente."
            : "Tem certeza que deseja CANCELAR esta consulta? O horário será liberado para outros agendamentos."
        }
        confirmText={
          confirmState.type === "finalizar" ? "Finalizar" : "Cancelar consulta"
        }
        cancelText="Voltar"
        onConfirm={handleConfirmDialog}
        onClose={closeConfirm}
      />
    </div>
  );
}
