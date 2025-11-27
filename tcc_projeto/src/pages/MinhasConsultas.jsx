// src/pages/MinhasConsultas.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
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
    id: ag.id,
    date,
    time,
    especialidade: ag.especialidade || null,
    payment_ref: ag.payment_ref || ag.idempotency_key || null,
    status: ag.status || ag.situacao || "confirmada",
    anamneseRespondida:
      ag.anamnese_preenchida === true ||
      ag.anamneseRespondida === true ||
      ag.anamneseRespondida === 1,
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

  const [activeTab, setActiveTab] = useState("andamento");

  const [cancelTargetId, setCancelTargetId] = useState(null);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  // função para mostrar toast
  const showToastMsg = useCallback((msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }, []);

  // carrega cache + backend (executa só uma vez no mount, ou quando token muda)
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    // 1) Carregar cache do sessionStorage (se houver)
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
        try {
          setConsultaFallback(JSON.parse(rawLast));
        } catch {
          // ignora
        }
      }

      const rawAnam = sessionStorage.getItem("anamnese.pendente");
      if (rawAnam) {
        try {
          setAnamnesePendente(JSON.parse(rawAnam));
        } catch {
          setAnamnesePendente(null);
        }
      }
    } catch {
      // parse erro -> ignora
    }

    // 2) Buscar dados reais no backend
    (async () => {
      try {
        const res = await fetch(`${API}/agenda/minhas`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // se 401 ou outro, tenta limpar sessão e redirecionar
          if (res.status === 401 || res.status === 403) {
            // logout silenciado (apenas local)
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          // não quebrar a UI — mantém cache
          return;
        }

        const data = await res.json();
        if (!Array.isArray(data)) return;

        const normalizadas = data
          .map((ag) => normalizarAgendamento(ag))
          .filter(Boolean);

        setConsultas(normalizadas);

        // atualiza cache local
        try {
          sessionStorage.setItem("booking.list", JSON.stringify(normalizadas));
          if (normalizadas.length > 0) {
            const last = normalizadas[normalizadas.length - 1];
            setConsultaFallback(last);
            sessionStorage.setItem("booking.last", JSON.stringify(last));
          }
        } catch {
          // ignora erros de storage
        }

        // --- NOVO: garantir que anamnese.pendente só exista se houver uma consulta ativa vinculada ---
        try {
          const rawAnam2 = sessionStorage.getItem("anamnese.pendente");
          if (rawAnam2) {
            const obj = JSON.parse(rawAnam2);
            const match = normalizadas.some(
              (c) =>
                (c.payment_ref && obj.payment_ref && String(c.payment_ref) === String(obj.payment_ref)) ||
                (c.id && obj.id && String(c.id) === String(obj.id))
            );
            if (!match) {
              sessionStorage.removeItem("anamnese.pendente");
              setAnamnesePendente(null);
            } else {
              // se bateu, atualiza o estado com versão canônica (caso backend tenha alterado algo)
              const matched = normalizadas.find(
                (c) =>
                  (c.payment_ref && obj.payment_ref && String(c.payment_ref) === String(obj.payment_ref)) ||
                  (c.id && obj.id && String(c.id) === String(obj.id))
              );
              if (matched) {
                sessionStorage.setItem("anamnese.pendente", JSON.stringify(matched));
                setAnamnesePendente(matched);
              }
            }
          }
        } catch {
          // ignora
        }
      } catch (e) {
        console.error("Erro ao carregar /agenda/minhas:", e);
      } finally {
        setLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]); // roda quando token muda (login/logout) ou no mount

  // se o usuário não tem consultas (lista do backend vazia e sem fallback), limpa anamnese pendente
  useEffect(() => {
    if (!loading) {
      const hasConsultas = Array.isArray(consultas) && consultas.length > 0;
      // se não tem consultas reais e não existe fallback válido
      if (!hasConsultas && !consultaFallback) {
        try {
          sessionStorage.removeItem("anamnese.pendente");
        } catch {}
        setAnamnesePendente(null);
      }
    }
  }, [consultas, consultaFallback, loading]);

  // base para grupos (se não vier nada do backend, usa fallback)
  const listaBase =
    consultas && consultas.length > 0
      ? consultas
      : fallbackToArray(consultaFallback);

  function fallbackToArray(fallback) {
    if (!fallback) return [];
    return [fallback];
  }

  // grupos por status
  const emAndamento = listaBase.filter(
    (c) => c.status === "pendente" || c.status === "confirmada"
  );
  const finalizadas = listaBase.filter((c) => c.status === "finalizada");
  const canceladas = listaBase.filter((c) => c.status === "cancelada");

  const consultaUnicaId = consultaFallback?.payment_ref || "consulta-unica";

  // cancelar: chama backend e atualiza lista local
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
        // tenta ler erro pra feedback
        let errText = "Falha ao cancelar";
        try {
          const errJson = await res.json();
          errText = errJson?.erro || errJson?.message || errText;
        } catch {
          /* ignore */
        }
        throw new Error(errText);
      }

      const updated = await res.json().catch(() => null);

      setConsultas((prev) => {
        const next = prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: updated?.status || "cancelada",
              }
            : c
        );
        try {
          sessionStorage.setItem("booking.list", JSON.stringify(next));
        } catch {
          // ignora
        }
        return next;
      });

      // também atualizar booking.last se essa consulta for a last
      try {
        const rawLast = sessionStorage.getItem("booking.last");
        if (rawLast) {
          const lastObj = JSON.parse(rawLast);
          if (lastObj && (lastObj.id === id || lastObj.payment_ref === consulta.payment_ref)) {
            lastObj.status = updated?.status || "cancelada";
            sessionStorage.setItem("booking.last", JSON.stringify(lastObj));
          }
        }
      } catch {
        // ignora
      }

      // --- NOVO: se a consulta cancelada for a vinculada à anamnese pendente, remove o anamnese.pendente ---
      try {
        const rawAnam = sessionStorage.getItem("anamnese.pendente");
        if (rawAnam) {
          const ap = JSON.parse(rawAnam);
          if (
            (ap.payment_ref && consulta.payment_ref && String(ap.payment_ref) === String(consulta.payment_ref)) ||
            (ap.id && consulta.id && String(ap.id) === String(consulta.id))
          ) {
            sessionStorage.removeItem("anamnese.pendente");
            setAnamnesePendente(null);
          }
        }
      } catch {
        // ignora
      }

      setCancelTargetId(null);
      showToastMsg("Consulta cancelada com sucesso. O valor não será estornado.");
    } catch (e) {
      console.error("Erro cancelamento:", e);
      showToastMsg(e?.message || "Não foi possível cancelar a consulta. Tente novamente.");
    } finally {
      setCancelLoadingId(null);
    }
  };

  // render da lista (componentizado dentro do arquivo)
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
          const anamneseOk = c.anamneseRespondida === true || c.anamneseRespondida === 1;
          const cardId = c.payment_ref || c.id || `consulta-${idx}`;
          const infoAberta = consultaInfoAbertaId === cardId;
          const isCancelada = c.status === "cancelada";
          const isFinalizada = c.status === "finalizada";
          const isAndamento = !isCancelada && !isFinalizada;

          return (
            <div
              key={cardId}
              className={`perfil-consulta-card ${isCancelada ? "consulta-cancelada" : ""}`}
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
                  {isCancelada ? "Cancelada" : isFinalizada ? "Finalizada" : "Agendada"}
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
                  onClick={() => setConsultaInfoAbertaId(infoAberta ? null : cardId)}
                >
                  <i className="fas fa-info-circle" style={{ marginRight: 6 }} />
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

                {tipo === "andamento" && isAndamento && (
                  <button
                    type="button"
                    className="perfil-consulta-btn cancel-btn"
                    style={{
                      background: "#f8e3e0",
                      color: "#9b4b4b",
                      borderColor: "#e9b3aa",
                    }}
                    onClick={() => setCancelTargetId(cancelTargetId === cardId ? null : cardId)}
                  >
                    <FaTimes style={{ marginRight: 6 }} />
                    Cancelar consulta
                  </button>
                )}
              </div>

              {infoAberta && (
                <div className="perfil-consulta-extra">
                  <p>
                    A consulta será realizada <strong>online, via Google Meet</strong>. Cerca de{" "}
                    <strong>10 minutos antes</strong> do horário marcado, a nutricionista entrará em contato
                    pelo <strong>telefone informado na sua anamnese</strong> e pelo <strong>seu e-mail</strong>.
                  </p>
                  <p>
                    No horário combinado, acesse o link em um local calmo, com boa internet. Tenha em mãos exames,
                    lista de medicamentos (se houver) e suas principais dúvidas.
                  </p>
                </div>
              )}

              {tipo === "andamento" && isAndamento && cancelTargetId === cardId && (
                <div
                  className="perfil-consulta-alert"
                  style={{
                    marginTop: "0.75rem",
                    borderColor: "#e9b3aa",
                    background: "#fff8f6",
                  }}
                >
                  <p style={{ marginBottom: "0.5rem" }}>
                    <strong>Tem certeza que deseja cancelar esta consulta?</strong>
                  </p>
                  <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                    Ao confirmar o cancelamento, a sua vaga neste horário será liberada na agenda da
                    nutricionista. <strong>O valor pago não será estornado, conforme política do serviço.</strong>{" "}
                    Você poderá agendar um novo horário posteriormente.
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <button type="button" className="perfil-consulta-btn-sec" onClick={() => setCancelTargetId(null)}>
                      Manter consulta
                    </button>

                    <button
                      type="button"
                      className="perfil-consulta-btn"
                      style={{ background: "#c45959", borderColor: "#c45959" }}
                      disabled={cancelLoadingId === c.id}
                      onClick={() => handleConfirmCancel(c)}
                    >
                      {cancelLoadingId === c.id ? "Cancelando..." : "Confirmar cancelamento"}
                    </button>
                  </div>
                </div>
              )}

              {!isCancelada && (
                <>
                  {!anamneseOk ? (
                    <div className="perfil-consulta-alert">
                      <p>Sua anamnese ainda não foi respondida para esta consulta.</p>
                      <button
                        className="perfil-consulta-btn"
                        onClick={() => {
                          sessionStorage.setItem("anamnese.pendente", JSON.stringify({ ...c }));
                          sessionStorage.setItem("booking.last", JSON.stringify(c));
                          navigate("/anamnese");
                        }}
                      >
                        Responder anamnese agora
                      </button>
                    </div>
                  ) : (
                    <p className="perfil-consulta-ok">
                      <FaCheckCircle id="correct_perfil_consulta_anam" /> Anamnese respondida
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
      {/* toast */}
      {showToast && (
        <div className="toast" role="status" aria-live="polite">
          <i className="fas fa-check-circle toast-icone" aria-hidden="true" />
          <span>{toastMsg}</span>
        </div>
      )}

      <section className="secao">
        <div style={{ marginTop: 0, paddingLeft: 0, paddingRight: 0, marginBottom: "1rem" }} className="editar-topbar">
          <button type="button" className="editar-back" onClick={() => navigate(-1)}>
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              <FaArrowLeft style={{ marginRight: 6 }} />
              Voltar
            </span>
          </button>
          <h2>Minhas consultas</h2>
        </div>

        {anamnesePendente && (
          <div className="consultas-cta" style={{ borderColor: "#d1a0a0", marginBottom: "1rem" }}>
            <div className="consultas-cta-badge" style={{ background: "#f4efec", borderColor: "#d1a0a0" }}>
              Anamnese pendente
            </div>
            <p className="consultas-cta-text">
              Você já tem uma consulta marcada para o dia <b>{anamnesePendente.date || "—"}</b> às{" "}
              <b>{anamnesePendente.time || "—"}</b>
              {anamnesePendente.especialidade ? ` (${mapEspecialidade(anamnesePendente.especialidade)})` : ""} mas ainda não
              respondeu a anamnese.
            </p>
            <button onClick={() => navigate("/anamnese")} className="consultas-cta-btn">
              <i className="fas fa-notes-medical" style={{ marginRight: 8 }} />
              Responder agora
            </button>
          </div>
        )}

        {loading && <p style={{ marginTop: "0.5rem" }}>Carregando suas consultas…</p>}

        {!loading && listaBase.length === 0 && (
          <div className="consultas-cta">
            <div className="consultas-cta-badge">Você ainda não possui consultas</div>
            <p className="consultas-cta-text">
              Que tal dar o primeiro passo? Agende uma consulta para receber um plano alimentar personalizado e começar sua
              evolução com segurança.
            </p>
            <Link to="/agendar-consulta" className="consultas-cta-btn">
              <i className="fas fa-calendar-plus" style={{ marginRight: 8 }} />
              Agendar minha primeira consulta
            </Link>
          </div>
        )}

        {!loading && listaBase.length > 0 && (
          <>
            <div className="consultas-tabs" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              <button
                type="button"
                className={`consultas-tab-btn ${activeTab === "andamento" ? "ativo" : ""}`}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: "999px",
                  border: activeTab === "andamento" ? "1px solid #b97b6f" : "1px solid #e0d0c8",
                  background: activeTab === "andamento" ? "#f4efec" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab("andamento")}
              >
                Em andamento
              </button>

              <button
                type="button"
                className={`consultas-tab-btn ${activeTab === "finalizadas" ? "ativo" : ""}`}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: "999px",
                  border: activeTab === "finalizadas" ? "1px solid #7b9b6f" : "1px solid #e0d0c8",
                  background: activeTab === "finalizadas" ? "#eef6ec" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab("finalizadas")}
              >
                Finalizadas
              </button>

              <button
                type="button"
                className={`consultas-tab-btn ${activeTab === "canceladas" ? "ativo" : ""}`}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: "999px",
                  border: activeTab === "canceladas" ? "1px solid #999" : "1px solid #e0d0c8",
                  background: activeTab === "canceladas" ? "#f2f2f2" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab("canceladas")}
              >
                Canceladas
              </button>
            </div>

            {activeTab === "andamento" && renderLista(emAndamento, "andamento")}
            {activeTab === "finalizadas" && renderLista(finalizadas, "finalizadas")}
            {activeTab === "canceladas" && renderLista(canceladas, "canceladas")}
          </>
        )}
      </section>
    </div>
  );
}
