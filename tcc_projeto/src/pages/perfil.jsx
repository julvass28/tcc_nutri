// src/pages/perfil.jsx
import React, { useState, useEffect, useContext } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../css/perfil.css";
import "../css/perfil-consultas.css";
import { AuthContext } from "../context/AuthContext";
import { objetivoLabel } from "../utils/objetivos";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaArrowRight } from "react-icons/fa";

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

function Toast({ show, children }) {
  if (!show) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <i className="fas fa-check-circle toast-icone" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

function LoadingOverlay({ show, text = "Carregando..." }) {
  if (!show) return null;
  return (
    <div className="auth-loading-overlay" role="status" aria-live="polite">
      <div className="auth-loading-card">
        <i className="fas fa-spinner fa-spin" aria-hidden="true" />
        <span>{text}</span>
      </div>
    </div>
  );
}

// normaliza um agendamento vindo do backend para o formato usado no front
function normalizarAgendamento(ag) {
  if (!ag) return null;

  const inicio = ag.inicio || ag.dataHora || ag.data;
  let date = "";
  let time = "";

  if (inicio) {
    const d = new Date(inicio);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");
      date = `${yyyy}-${mm}-${dd}`;
      time = `${hh}:${mi}`;
    } else {
      // fallback: tenta parsear formato YYYY-MM-DDTHH:mm ou yyyy-mm-dd
      try {
        const parts = String(inicio).split(" ");
        if (parts[0] && parts[1]) {
          date = parts[0];
          time = parts[1].slice(0, 5);
        } else {
          date = String(inicio).slice(0, 10);
        }
      } catch {
        date = "";
        time = "";
      }
    }
  }

  return {
    date,
    time,
    especialidade: ag.especialidade || null,
    payment_ref: ag.payment_ref || ag.idempotency_key || ag.id || null,
    status: ag.status || ag.situacao || "confirmada",
    anamneseRespondida:
      ag.anamnese_preenchida === true ||
      ag.anamnese_preenchida === 1 ||
      ag.anamneseRespondida === true ||
      ag.anamneseRespondida === 1,
  };
}

export default function Perfil() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const { token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const WHATSAPP_NUTRI_LINK = import.meta.env.VITE_WHATSAPP_NUTRI || null;

  const [anamnesePendente, setAnamnesePendente] = useState(null);

  const [dados, setDados] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    foto: "",
    data_nascimento: "",
    genero: "",
    altura: "",
    peso: "",
    objetivo: "",
  });

  const [fotoPreview, setFotoPreview] = useState("");
  const [fotoOk, setFotoOk] = useState(false);
  const [error, setError] = useState(null);

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState("Carregando...");
  const [showToast, setShowToast] = useState(false);

  // consulta única (compatibilidade) 👇
  const [consulta, setConsulta] = useState(null);
  // lista de consultas 👇
  const [consultas, setConsultas] = useState([]);

  // --- Carregamento inicial (dados do user + consultas) ---
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const API_BASE = API; // usa a mesma const API definida no topo do arquivo

    // sincroniza rápido a partir do sessionStorage (evita piscar)
    function syncFromSessionStorage() {
      try {
        const rawLast = sessionStorage.getItem("booking.last");
        if (rawLast) {
          setConsulta(JSON.parse(rawLast));
        } else {
          setConsulta(null);
        }

        const listRaw = sessionStorage.getItem("booking.list");
        if (listRaw) {
          const list = JSON.parse(listRaw);
          if (Array.isArray(list)) setConsultas(list);
          else setConsultas([]);
        } else {
          setConsultas([]);
        }

        const pendRaw = sessionStorage.getItem("anamnese.pendente");
        if (pendRaw) setAnamnesePendente(JSON.parse(pendRaw));
        else setAnamnesePendente(null);
      } catch {
        // ignora erros de parse
      }
    }

    // busca no backend e garante consistência (limpa cache se não houver consultas)
    async function fetchBackendAndSync() {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const u = await res.json();
          setDados({
            nome: u.nome || "",
            sobrenome: u.sobrenome || "",
            email: u.email || "",
            altura: u.altura ?? "",
            peso: u.peso ?? "",
            data_nascimento: u.data_nascimento
              ? String(u.data_nascimento).slice(0, 10)
              : "",
            genero: u.genero || "",
            objetivo: u.objetivo || "",
            foto: u.fotoUrl || "",
          });
          setFotoPreview(u.fotoUrl || "");
          setFotoOk(!!u.fotoUrl);
        }
      } catch (e) {
        console.warn("Perfil: falha ao buscar /me", e);
      }

      try {
        const res2 = await fetch(`${API_BASE}/agenda/minhas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res2.ok) {
          const data = await res2.json();
          if (Array.isArray(data)) {
            const normalizadas = data
              .map((ag) => normalizarAgendamento(ag))
              .filter(Boolean);

            // atualiza estados e cache
            setConsultas(normalizadas);
            sessionStorage.setItem("booking.list", JSON.stringify(normalizadas));

            if (normalizadas.length > 0) {
              const last = normalizadas[normalizadas.length - 1];
              setConsulta(last);
              sessionStorage.setItem("booking.last", JSON.stringify(last));
            } else {
              // limpa cache quando não há consultas (garante que a UI volte ao estado "sem consultas")
              setConsulta(null);
              sessionStorage.removeItem("booking.last");
              sessionStorage.removeItem("booking.list");
            }

            // atualiza anamnese pendente com base nas consultas retornadas
            const pend = normalizadas.find(
              (c) =>
                !c.anamneseRespondida &&
                (c.status === "pendente" || c.status === "confirmada")
            );
            if (pend) {
              const pendObj = {
                date: pend.date,
                time: pend.time,
                especialidade: pend.especialidade || null,
                payment_ref: pend.payment_ref || null,
                anamneseRespondida: pend.anamneseRespondida || false,
              };
              setAnamnesePendente(pendObj);
              if (!sessionStorage.getItem("anamnese.pendente")) {
                sessionStorage.setItem("anamnese.pendente", JSON.stringify(pendObj));
              }
            } else {
              setAnamnesePendente(null);
              if (!sessionStorage.getItem("anamnese.pendente")) {
                sessionStorage.removeItem("anamnese.pendente");
              }
            }
          }
        } else {
          // se falhar, pelo menos re-sincroniza com sessionStorage
          syncFromSessionStorage();
        }
      } catch (e) {
        console.warn("Perfil: erro ao buscar /agenda/minhas", e);
        syncFromSessionStorage();
      }
    }

    // chamadas iniciais: primeiro rápido do sessionStorage, depois valida com backend
    syncFromSessionStorage();
    fetchBackendAndSync();

    // listener para mudanças entre abas (storage event)
    function onStorage(e) {
      if (!e.key) return;
      if (
        e.key.startsWith("booking.") ||
        e.key === "booking.list" ||
        e.key === "booking.last" ||
        e.key === "anamnese.pendente"
      ) {
        syncFromSessionStorage();
      }
    }
    window.addEventListener("storage", onStorage);

    // listener pra evento custom (útil para atualizar imediatamente no mesmo tab)
    function onBookingUpdated() {
      syncFromSessionStorage();
      // também tentar revalidar do backend
      fetchBackendAndSync();
    }
    window.addEventListener("bookingUpdated", onBookingUpdated);

    // named handler para visibilidade/foco (mesma aba)
    async function onVisibleOrFocus() {
      syncFromSessionStorage();
      await fetchBackendAndSync();
    }
    function onVisibilityChange() {
      if (document.visibilityState === "visible") onVisibleOrFocus();
    }
    window.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onVisibleOrFocus);

    // cleanup completo
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onVisibleOrFocus);
      window.removeEventListener("bookingUpdated", onBookingUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API, token, navigate]);

  // Upload da foto...
  const handleFotoInput = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOverlayText("Enviando foto...");
    setShowOverlay(true);

    const localURL = URL.createObjectURL(file);
    setFotoPreview(localURL);
    setFotoOk(true);

    try {
      const form = new FormData();
      form.append("foto", file);

      const res = await fetch(`${API}/perfil/foto`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || "Falha no upload");

      setDados((prev) => ({ ...prev, foto: data.fotoUrl }));
      setFotoPreview(data.fotoUrl);
      setFotoOk(true);
      setUser?.((prev) => (prev ? { ...prev, fotoUrl: data.fotoUrl } : prev));

      // Peq. delay pra transição suave
      await new Promise((r) => setTimeout(r, 700));
      setShowOverlay(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    } catch (err) {
      console.error("Erro upload foto:", err);
      setShowOverlay(false);
      alert("Erro ao enviar foto. Use JPG/PNG/WebP até 2MB.");
    }
  };

  const handleGoEdit = async () => {
    setOverlayText("Abrindo edição de perfil...");
    setShowOverlay(true);
    await new Promise((r) => setTimeout(r, 700));
    navigate("/perfil/editar");
  };

  const primeiroNome = (dados.nome || "").split(" ")[0];

  const temConsultaUnica = !!consulta;

  const dataBr = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = String(iso).split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  };

  // filtrar SOMENTE consultas realmente ativas
  const consultasValidas = (consultas || []).filter(
    (c) => c.status === "pendente" || c.status === "confirmada"
  );

  // **Ajuste importante**: proximaConsulta NÃO usa mais o fallback 'consulta'
  // porque esse fallback podia manter uma consulta cancelada visível.
  // Agora usamos apenas as consultas válidas.
  const proximaConsulta = consultasValidas.length > 0 ? consultasValidas[0] : null;

  // existe alguma consulta ativa?
  const temQualquerConsulta = !!proximaConsulta;

  return (
    <div className="perfil-container-principal-meuperfil">
      <Toast show={showToast}>Foto atualizada com sucesso!</Toast>
      <LoadingOverlay show={showOverlay} text={overlayText} />

      <section className="perfil-header">
        <div className="foto-wrapper">
          <div className="foto-container">
            <div className="foto-box">
              {fotoPreview && fotoOk ? (
                <img
                  src={fotoPreview}
                  alt={dados.nome || "Foto do usuário"}
                  onError={() => setFotoOk(false)}
                />
              ) : (
                <div
                  className="foto-placeholder"
                  aria-label="Sem foto de perfil"
                >
                  <FaUser
                    className="foto-placeholder-icon"
                    aria-hidden="true"
                  />
                </div>
              )}

              <label className="btn-editar-foto" title="Trocar foto">
                <i className="fas fa-pen"></i>
                <span className="editar-texto">Editar</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: "none" }}
                  onChange={handleFotoInput}
                />
              </label>
            </div>
            <div className="nome-usuario">
              {primeiroNome?.trim() || "\u00A0"}
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO INFORMATIVO */}
      <section className="secao-perfil-principal">
        <div className="perfil-view-grid pretty">
          <div className="perfil-view-item">
            <span className="perfil-view-label">Nome</span>
            <span className="perfil-view-value">{dados.nome || "—"}</span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Sobrenome</span>
            <span className="perfil-view-value">{dados.sobrenome || "—"}</span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">E-mail</span>
            <span className="perfil-view-value mono">{dados.email || "—"}</span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Data de nascimento</span>
            <span className="perfil-view-value">
              {dados.data_nascimento || "—"}
            </span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Gênero</span>
            <span className="perfil-view-value">{dados.genero || "—"}</span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Altura</span>
            <span className="perfil-view-value">
              {dados.altura ? `${dados.altura} m` : "—"}
            </span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Peso</span>
            <span className="perfil-view-value">
              {dados.peso ? `${dados.peso} kg` : "—"}
            </span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Objetivo</span>
            <span className="perfil-view-value">
              {objetivoLabel(dados.objetivo) || "—"}
            </span>
          </div>
        </div>

        <div className="perfil-actions">
          <button
            className="btn-save"
            onClick={handleGoEdit}
            aria-label="Editar perfil"
          >
            <i className="fas fa-pen" style={{ marginRight: 8 }} /> Editar
            perfil
          </button>
        </div>

        {error && (
          <p className="error-text" style={{ marginTop: 12 }}>
            {error}
          </p>
        )}
      </section>

      {/* ANAMNESE PENDENTE */}
      {anamnesePendente ? (
        <section className="secao">
          <div className="consultas-cta" style={{ borderColor: "#d1a0a0" }}>
            <div
              className="consultas-cta-badge"
              style={{ background: "#d1a0a0" }}
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
        </section>
      ) : null}

      {/* SEÇÃO DE CONSULTAS – CONTAINER COM SOMBRA + RESUMO + CTA */}
      <section className="secao">
        <div
          className="perfil-consultas-preview-wrapper"
          style={{
            background: "#f7f2ec",
            borderRadius: "18px",
            padding: "24px 20px",
            boxShadow: "0 14px 40px rgba(0, 0, 0, 0.06)",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "stretch",
          }}
        >
          {/* BLOCO DA CONSULTA (MENOR) */}
          <div
            className="perfil-consulta-resumo"
            style={{
              flex: "1 1 260px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "18px 18px 16px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f0dfd5",
            }}
          >
            {temQualquerConsulta ? (
              <>
                <div className="perfil-consulta-head">
                  <span className="badge-ok">Agendada</span>
                  <span className="perfil-consulta-date">
                    {dataBr(proximaConsulta.date)} às{" "}
                    {proximaConsulta.time || "—"}
                  </span>
                </div>
                <div className="perfil-consulta-body">
                  <p>
                    <b>Especialidade:</b>{" "}
                    {mapEspecialidade(proximaConsulta.especialidade)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="perfil-consulta-head">
                  <span className="badge-ok">Sem consultas</span>
                </div>
                <div className="perfil-consulta-body">
                  <p>
                    Você ainda não possui consultas agendadas. Assim que você
                    marcar, o próximo horário aparecerá aqui.
                  </p>
                  <Link to="/agendar-consulta" className="consultas-cta-btn">
                    <i
                      className="fas fa-calendar-plus"
                      style={{ marginRight: 8 }}
                    />
                    Agendar consulta
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* BLOCO DE CTA (MAIOR) */}
          <div
            className="perfil-consulta-cta"
            style={{
              flex: "1 1 320px",
              borderRadius: "16px",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                }}
              >
                Acompanhe o histórico completo das suas consultas
              </h3>
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.5,
                  maxWidth: "32rem",
                }}
              >
                Veja todos os horários já agendados, status da anamnese e
                orientações da consulta na página Minhas Consultas.
              </p>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className="consultas-cta-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  paddingInline: "18px",
                }}
                onClick={() => navigate("/minhas-consultas")}
              >
                Ver mais detalhes
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
