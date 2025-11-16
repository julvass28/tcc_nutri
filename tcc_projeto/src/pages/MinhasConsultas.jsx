// src/pages/MinhasConsultas.jsx
import React, { useState, useEffect, useContext } from "react";
import "../css/perfil.css";
import "../css/perfil-consultas.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../services/api";
import { FaArrowLeft, FaCheckCircle, FaTimes } from "react-icons/fa";

const ESPECIALIDADE_LABELS = {
  clinica: "Nutrição Clínica",
  emagrecimento: "Emagrecimento e Obesidade",
  esportiva: "Nutrição Esportiva",
  pediatrica: "Nutrição Pediátrica",
  intolerancias: "Intolerâncias Alimentares",
};

function mapEspecialidade(especialidade) {
  if (!especialidade) return "Nutrição";
  return ESPECIALIDADE_LABELS[especialidade] || especialidade;
}

// Toast simples reaproveitando estilo da tela de perfil
function Toast({ show, children }) {
  if (!show) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <i className="fas fa-check-circle toast-icone" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

function normalizarAgendamento(ag) {
  if (!ag) return null;

  const inicio = ag.inicio || ag.dataHora || ag.data;
  let date = "";
  let time = "";

  if (inicio) {
    const d = new Date(inicio);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    date = `${yyyy}-${mm}-${dd}`;
    time = `${hh}:${mi}`;
  }

  return {
    // id real vindo do backend (ag.id)
    id: ag.id,
    date,
    time,
    especialidade: ag.especialidade,
    payment_ref: ag.payment_ref || ag.idempotency_key || null,
    // status oficial do backend: pendente / confirmada / finalizada / cancelada
    status: ag.status || ag.situacao || "confirmada",
    anamneseRespondida:
      ag.anamneseRespondida === true || ag.anamneseRespondida === 1,
  };
}

function dataBr(iso) {
  if (!iso) return "—";
  const [y, m, d] = String(iso).split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export default function MinhasConsultas() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const WHATSAPP_NUTRI_LINK = import.meta.env.VITE_WHATSAPP_NUTRI || null;

  const [consultas, setConsultas] = useState([]);
  const [consultaFallback, setConsultaFallback] = useState(null);
  const [anamnesePendente, setAnamnesePendente] = useState(null);
  const [consultaInfoAbertaId, setConsultaInfoAbertaId] = useState(null);
  const [loading, setLoading] = useState(true);

  // abas: "andamento" | "finalizadas" | "canceladas"
  const [activeTab, setActiveTab] = useState("andamento");

  // controle do fluxo de cancelamento
  const [cancelTargetId, setCancelTargetId] = useState(null);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  // toast
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // 1) Carrega cache do sessionStorage
    try {
      const rawList = sessionStorage.getItem("booking.list");
      if (rawList) {
        const list = JSON.parse(rawList);
        if (Array.isArray(list) && list.length > 0) {
          setConsultas(list);
          setConsultaFallback(list[list.length - 1]);
        }
      }

      const rawLast = sessionStorage.getItem("booking.last");
      if (rawLast && !consultaFallback) {
        setConsultaFallback(JSON.parse(rawLast));
      }

      const rawAnam = sessionStorage.getItem("anamnese.pendente");
      if (rawAnam) {
        setAnamnesePendente(JSON.parse(rawAnam));
      }
    } catch {
      // ignora problema de parse
    }

    // 2) Busca real no backend
    (async () => {
      try {
        const res = await fetch(`${API}/agenda/minhas`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          setLoading(false);
          return;
        }

        const normalizadas = data
          .map((ag) => normalizarAgendamento(ag))
          .filter(Boolean);

        setConsultas(normalizadas);

        // atualiza cache local
        sessionStorage.setItem("booking.list", JSON.stringify(normalizadas));
        if (normalizadas.length > 0) {
          const last = normalizadas[normalizadas.length - 1];
          setConsultaFallback(last);
          sessionStorage.setItem("booking.last", JSON.stringify(last));
        }
      } catch (e) {
        console.error("Erro ao carregar /agenda/minhas:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, navigate, consultaFallback]);

  // base para grupos (se não vier nada do backend, usa fallback)
  const listaBase =
    consultas && consultas.length > 0
      ? consultas
      : consultaFallback
      ? [consultaFallback]
      : [];

  // grupos por status (strings oficiais do backend)
  const emAndamento = listaBase.filter(
    (c) => c.status === "pendente" || c.status === "confirmada"
  );
  const finalizadas = listaBase.filter((c) => c.status === "finalizada");
  const canceladas = listaBase.filter((c) => c.status === "cancelada");

  const temConsultaUnica = !!consultaFallback;
  const consultaUnicaId = consultaFallback?.payment_ref || "consulta-unica";

  const showToastMsg = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // 👉 Handler para confirmar cancelamento (chama o backend)
  const handleConfirmCancel = async (consulta) => {
    if (!consulta?.id) return;

    const id = consulta.id;
    setCancelLoadingId(id);

    try {
      const res = await fetch(`${API}/agenda/minhas/${id}/cancelar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origem: "cliente",
        }),
      });

      if (!res.ok) {
        throw new Error("Falha ao cancelar");
      }

      let updated;
      try {
        updated = await res.json();
      } catch {
        updated = null;
      }

      setConsultas((prev) => {
        const next = prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: updated?.status || "cancelada",
              }
            : c
        );
        // atualiza cache também
        sessionStorage.setItem("booking.list", JSON.stringify(next));
        return next;
      });

      // limpa target
      setCancelTargetId(null);
      showToastMsg(
        "Consulta cancelada com sucesso. O valor não será estornado."
      );
    } catch (e) {
      console.error(e);
      showToastMsg("Não foi possível cancelar a consulta. Tente novamente.");
    } finally {
      setCancelLoadingId(null);
    }
  };

  // conteúdo para cada aba
  const renderLista = (lista, tipo) => {
    if (!lista || lista.length === 0) {
      const msgMap = {
        andamento: "Nenhuma consulta em andamento no momento.",
        finalizadas: "Nenhuma consulta finalizada ainda.",
        canceladas: "Nenhuma consulta cancelada.",
      };
      return (
        <p style={{ marginTop: "0.5rem" }} className="consultas-empty">
          {msgMap[tipo]}
        </p>
      );
    }

    const espLabelAnamnesePendente = anamnesePendente?.especialidade
      ? mapEspecialidade(anamnesePendente.especialidade)
      : null;

    return (
      <>
        {lista.map((c, idx) => {
          const anamneseOk =
            c.anamneseRespondida === true || c.anamneseRespondida === 1;
          const cardId = c.payment_ref || c.id || `consulta-${idx}`;
          const infoAberta = consultaInfoAbertaId === cardId;
          const isCancelada = c.status === "cancelada";
          const isFinalizada = c.status === "finalizada";
          const isAndamento = !isCancelada && !isFinalizada;

          return (
            <div
              key={cardId}
              className={`perfil-consulta-card ${
                isCancelada ? "consulta-cancelada" : ""
              }`}
              style={
                isCancelada
                  ? {
                      opacity: 0.7,
                      filter: "grayscale(0.9)",
                      background: "#f4f4f4",
                    }
                  : undefined
              }
            >
              <div className="perfil-consulta-head">
                <span className="badge-ok">
                  {isCancelada
                    ? "Cancelada"
                    : isFinalizada
                    ? "Finalizada"
                    : "Agendada"}
                </span>
                <span className="perfil-consulta-date">
                  {dataBr(c.date)} às {c.time || "—"}
                </span>
              </div>

              <div className="perfil-consulta-body">
                <p>
                  <b>Especialidade:</b> {mapEspecialidade(c.especialidade)}
                </p>
                <p>
                  <b>Código do agendamento:</b> {c.payment_ref || "—"}
                </p>
              </div>

              <div className="perfil-consulta-actions">
                <button
                  type="button"
                  className="perfil-consulta-btn-sec"
                  onClick={() =>
                    setConsultaInfoAbertaId(infoAberta ? null : cardId)
                  }
                >
                  <i
                    className="fas fa-info-circle"
                    style={{ marginRight: 6 }}
                  />
                  Como será a consulta?
                </button>

                {WHATSAPP_NUTRI_LINK && (
                  <a
                    href={WHATSAPP_NUTRI_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="perfil-consulta-btn-whatsapp"
                  >
                    <i className="fab fa-whatsapp" style={{ marginRight: 6 }} />
                    Falar com a nutricionista
                  </a>
                )}

                {/* Botão de cancelar só em consultas em andamento */}
                {tipo === "andamento" && isAndamento && (
                  <button
                    type="button"
                    className="perfil-consulta-btn cancel-btn"
                    style={{
                      background: "#f8e3e0",
                      color: "#9b4b4b",
                      borderColor: "#e9b3aa",
                    }}
                    onClick={() =>
                      setCancelTargetId(
                        cancelTargetId === cardId ? null : cardId
                      )
                    }
                  >
                    <FaTimes style={{ marginRight: 6 }} />
                    Cancelar consulta
                  </button>
                )}
              </div>

              {infoAberta && (
                <div className="perfil-consulta-extra">
                  <p>
                    A consulta será realizada{" "}
                    <strong>online, via Google Meet</strong>. Cerca de{" "}
                    <strong>10 minutos antes</strong> do horário marcado, a
                    nutricionista entrará em contato pelo{" "}
                    <strong>telefone informado na sua anamnese</strong> e pelo{" "}
                    <strong>seu e-mail</strong>, enviando o link da reunião.
                  </p>
                  <p>
                    No horário combinado, acesse o link em um local calmo, com
                    boa internet. Tenha em mãos exames, lista de medicamentos
                    (se houver) e suas principais dúvidas.
                  </p>
                </div>
              )}

              {/* Box de confirmação de cancelamento */}
              {tipo === "andamento" &&
                isAndamento &&
                cancelTargetId === cardId && (
                  <div
                    className="perfil-consulta-alert"
                    style={{
                      marginTop: "0.75rem",
                      borderColor: "#e9b3aa",
                      background: "#fff8f6",
                    }}
                  >
                    <p style={{ marginBottom: "0.5rem" }}>
                      <strong>
                        Tem certeza que deseja cancelar esta consulta?
                      </strong>
                    </p>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        marginBottom: "0.75rem",
                        lineHeight: 1.5,
                      }}
                    >
                      Ao confirmar o cancelamento, a sua vaga neste horário será
                      liberada na agenda da nutricionista.{" "}
                      <strong>
                        O valor pago não será estornado, conforme política do
                        serviço.
                      </strong>{" "}
                      Você poderá agendar um novo horário posteriormente.
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        type="button"
                        className="perfil-consulta-btn-sec"
                        onClick={() => setCancelTargetId(null)}
                      >
                        Manter consulta
                      </button>

                      <button
                        type="button"
                        className="perfil-consulta-btn"
                        style={{
                          background: "#c45959",
                          borderColor: "#c45959",
                        }}
                        disabled={cancelLoadingId === c.id}
                        onClick={() => handleConfirmCancel(c)}
                      >
                        {cancelLoadingId === c.id
                          ? "Cancelando..."
                          : "Confirmar cancelamento"}
                      </button>
                    </div>
                  </div>
                )}

              {/* Status da anamnese (não mostra botão em canceladas) */}
              {!isCancelada && (
                <>
                  {!anamneseOk ? (
                    <div className="perfil-consulta-alert">
                      <p>
                        Sua anamnese ainda não foi respondida para esta
                        consulta.
                      </p>
                      <button
                        className="perfil-consulta-btn"
                        onClick={() => {
                          sessionStorage.setItem(
                            "anamnese.pendente",
                            JSON.stringify(c)
                          );
                          sessionStorage.setItem(
                            "booking.last",
                            JSON.stringify(c)
                          );
                          navigate("/anamnese");
                        }}
                      >
                        Responder anamnese agora
                      </button>
                    </div>
                  ) : (
                    <p className="perfil-consulta-ok">
                      <FaCheckCircle id="correct_perfil_consulta_anam" />{" "}
                      Anamnese respondida
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="perfil-container">
      <Toast show={showToast}>{toastMsg}</Toast>

      <section className="secao">
        <div
          className="editar-topbar"
          style={{
            marginTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            marginBottom: "1rem",
          }}
        >
          <button
            type="button"
            className="editar-back"
            onClick={() => navigate(-1)}
          >
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              <FaArrowLeft style={{ marginRight: 6 }} />
              Voltar
            </span>
          </button>
          <h2>Minhas consultas</h2>
        </div>

        {anamnesePendente && (
          <div
            className="consultas-cta"
            style={{ borderColor: "#d1a0a0", marginBottom: "1rem" }}
          >
            <div
              className="consultas-cta-badge"
              style={{ background: "#f4efec", borderColor: "#d1a0a0" }}
            >
              Anamnese pendente
            </div>
            <p className="consultas-cta-text">
              Você já tem uma consulta marcada para o dia{" "}
              <b>{anamnesePendente.date || "—"}</b> às{" "}
              <b>{anamnesePendente.time || "—"}</b>
              {anamnesePendente.especialidade
                ? ` (${mapEspecialidade(anamnesePendente.especialidade)})`
                : ""}{" "}
              mas ainda não respondeu a anamnese.
            </p>
            <button
              onClick={() => navigate("/anamnese")}
              className="consultas-cta-btn"
            >
              <i className="fas fa-notes-medical" style={{ marginRight: 8 }} />
              Responder agora
            </button>
          </div>
        )}

        {loading && (
          <p style={{ marginTop: "0.5rem" }}>Carregando suas consultas…</p>
        )}

        {!loading && listaBase.length === 0 && (
          <div className="consultas-cta">
            <div className="consultas-cta-badge">
              Você ainda não possui consultas
            </div>
            <p className="consultas-cta-text">
              Que tal dar o primeiro passo? Agende uma consulta para receber um
              plano alimentar personalizado e começar sua evolução com
              segurança.
            </p>
            <Link to="/agendar-consulta" className="consultas-cta-btn">
              <i className="fas fa-calendar-plus" style={{ marginRight: 8 }} />
              Agendar minha primeira consulta
            </Link>
          </div>
        )}

        {/* Abas de filtro */}
        {!loading && listaBase.length > 0 && (
          <>
            <div
              className="consultas-tabs"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <button
                type="button"
                className={`consultas-tab-btn ${
                  activeTab === "andamento" ? "ativo" : ""
                }`}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: "999px",
                  border:
                    activeTab === "andamento"
                      ? "1px solid #b97b6f"
                      : "1px solid #e0d0c8",
                  background:
                    activeTab === "andamento" ? "#f4efec" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab("andamento")}
              >
                Em andamento
              </button>

              <button
                type="button"
                className={`consultas-tab-btn ${
                  activeTab === "finalizadas" ? "ativo" : ""
                }`}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: "999px",
                  border:
                    activeTab === "finalizadas"
                      ? "1px solid #7b9b6f"
                      : "1px solid #e0d0c8",
                  background:
                    activeTab === "finalizadas" ? "#eef6ec" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab("finalizadas")}
              >
                Finalizadas
              </button>

              <button
                type="button"
                className={`consultas-tab-btn ${
                  activeTab === "canceladas" ? "ativo" : ""
                }`}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: "999px",
                  border:
                    activeTab === "canceladas"
                      ? "1px solid #999"
                      : "1px solid #e0d0c8",
                  background:
                    activeTab === "canceladas" ? "#f2f2f2" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab("canceladas")}
              >
                Canceladas
              </button>
            </div>

            {/* Conteúdo da aba selecionada */}
            {activeTab === "andamento" && renderLista(emAndamento, "andamento")}
            {activeTab === "finalizadas" &&
              renderLista(finalizadas, "finalizadas")}
            {activeTab === "canceladas" &&
              renderLista(canceladas, "canceladas")}
          </>
        )}
      </section>
    </div>
  );
}
