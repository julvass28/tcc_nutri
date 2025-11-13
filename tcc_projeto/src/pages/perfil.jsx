// src/pages/perfil.jsx
import React, { useState, useEffect, useContext } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../css/perfil.css";
import "../css/perfil-consultas.css";
import { AuthContext } from "../context/AuthContext";
import { objetivoLabel } from "../utils/objetivos";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    date = `${yyyy}-${mm}-${dd}`;
    time = `${hh}:${mi}`;
  }

  return {
    date,
    time,
    especialidade: ag.especialidade || "Nutrição",
    payment_ref: ag.payment_ref || ag.id || null,
    anamneseRespondida:
      ag.anamneseRespondida === true || ag.anamneseRespondida === 1,
  };
}

export default function Perfil() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const { token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // link do WhatsApp da nutri (defina em VITE_WHATSAPP_NUTRI no .env do front)
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

  // controla qual consulta está com o texto "Como será a consulta?" aberto
  const [consultaInfoAbertaId, setConsultaInfoAbertaId] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // carrega dados do usuário
    (async () => {
      try {
        const res = await fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
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
      } catch {
        setError("Erro ao carregar dados.");
      }
    })();

    // pega a última consulta salva em sessionStorage (cache)
    try {
      const raw = sessionStorage.getItem("booking.last");
      if (raw) {
        const obj = JSON.parse(raw);
        setConsulta(obj);
      }
    } catch {
      // ignore
    }

    // pega a lista de consultas salva em sessionStorage (cache)
    try {
      const listRaw = sessionStorage.getItem("booking.list");
      if (listRaw) {
        const list = JSON.parse(listRaw);
        if (Array.isArray(list)) {
          setConsultas(list);
        }
      }
    } catch {
      setConsultas([]);
    }

    // pega anamnese pendente (se tiver) do sessionStorage
    try {
      const pendRaw = sessionStorage.getItem("anamnese.pendente");
      if (pendRaw) {
        setAnamnesePendente(JSON.parse(pendRaw));
      }
    } catch {
      setAnamnesePendente(null);
    }

    // 🔥 BUSCA REAL NO BACKEND: /agenda/minhas
    (async () => {
      try {
        const res = await fetch(`${API}/agenda/minhas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          // se não existir ainda o endpoint, só loga e mantém o comportamento antigo
          console.warn("Falha ao carregar /agenda/minhas");
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const normalizadas = data
          .map((ag) => normalizarAgendamento(ag))
          .filter(Boolean);

        setConsultas(normalizadas);

        // atualiza o cache local, pra manter compat com fluxo antigo
        sessionStorage.setItem("booking.list", JSON.stringify(normalizadas));
        if (normalizadas.length > 0) {
          const last = normalizadas[normalizadas.length - 1];
          setConsulta(last);
          sessionStorage.setItem("booking.last", JSON.stringify(last));
        }
      } catch (e) {
        console.error("Erro ao carregar consultas do backend:", e);
      }
    })();
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

      await sleep(700);
      setShowOverlay(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    } catch {
      setShowOverlay(false);
      setShowToast(false);
      alert("Erro ao enviar foto. Use JPG/PNG/WebP até 2MB.");
    }
  };

  const handleGoEdit = async () => {
    setOverlayText("Abrindo edição de perfil...");
    setShowOverlay(true);
    await sleep(700);
    navigate("/perfil/editar");
  };

  const primeiroNome = (dados.nome || "").split(" ")[0];

  const temConsultaUnica = !!consulta;

  const dataBr = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const consultaUnicaId = consulta?.payment_ref || "consulta-unica";
  const consultaUnicaInfoAberta = consultaInfoAbertaId === consultaUnicaId;

  return (
    <div className="perfil-container">
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
      <section className="secao">
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
                ? ` (${anamnesePendente.especialidade})`
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

      {/* SEÇÃO DE CONSULTAS */}
      <section className="secao">
        <h2>Consultas</h2>

        {consultas && consultas.length > 0 ? (
          consultas.map((c, idx) => {
            const anamneseOk =
              c.anamneseRespondida === true || c.anamneseRespondida === 1;
            const cardId = c.payment_ref || `consulta-${idx}`;
            const infoAberta = consultaInfoAbertaId === cardId;

            return (
              <div key={cardId} className="perfil-consulta-card">
                <div className="perfil-consulta-head">
                  <span className="badge-ok">Agendada</span>
                  <span className="perfil-consulta-date">
                    {dataBr(c.date)} às {c.time || "—"}
                  </span>
                </div>
                <div className="perfil-consulta-body">
                  <p>
                    <b>Especialidade:</b> {c.especialidade || "Nutrição"}
                  </p>
                  <p>
                    <b>Código do agendamento:</b> {c.payment_ref || "—"}
                  </p>
                </div>

                {/* Botões: explicação da consulta + WhatsApp */}
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
                      <i
                        className="fab fa-whatsapp"
                        style={{ marginRight: 6 }}
                      />
                      Falar com a nutricionista
                    </a>
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

                {!anamneseOk ? (
                  <div className="perfil-consulta-alert">
                    <p>
                      Sua anamnese ainda não foi respondida para esta consulta.
                    </p>
                    <button
                      className="perfil-consulta-btn"
                      onClick={() => {
                        // guarda qual consulta é essa
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
                  <p className="perfil-consulta-ok">✅ Anamnese respondida</p>
                )}
              </div>
            );
          })
        ) : temConsultaUnica ? (
          // fallback pra quem só tem o booking.last
          <div className="perfil-consulta-card" key={consultaUnicaId}>
            <div className="perfil-consulta-head">
              <span className="badge-ok">Agendada</span>
              <span className="perfil-consulta-date">
                {dataBr(consulta.date)} às {consulta.time}
              </span>
            </div>
            <div className="perfil-consulta-body">
              <p>
                <b>Especialidade:</b> {consulta.especialidade || "Nutrição"}
              </p>
              <p>
                <b>Código do agendamento:</b> {consulta.payment_ref || "—"}
              </p>
            </div>

            <div className="perfil-consulta-actions">
              <button
                type="button"
                className="perfil-consulta-btn-sec"
                onClick={() =>
                  setConsultaInfoAbertaId(
                    consultaUnicaInfoAberta ? null : consultaUnicaId
                  )
                }
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
            </div>

            {consultaUnicaInfoAberta && (
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
                  No horário combinado, acesse o link em um local calmo, com boa
                  internet. Tenha em mãos exames, lista de medicamentos (se
                  houver) e suas principais dúvidas.
                </p>
              </div>
            )}

            {!consulta.anamneseRespondida ? (
              <div className="perfil-consulta-alert">
                <p>
                  Sua anamnese ainda não foi respondida. É importante preencher
                  antes da consulta.
                </p>
                <Link className="perfil-consulta-btn" to="/anamnese">
                  Responder anamnese agora
                </Link>
              </div>
            ) : null}
          </div>
        ) : (
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
      </section>
    </div>
  );
}
