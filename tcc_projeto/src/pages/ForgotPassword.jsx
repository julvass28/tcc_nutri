import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/auth-pages.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function passwordScore(pw = "") {
  let score = 0;
  const len = pw.length;
  const sets = [
    /[a-z]/.test(pw),
    /[A-Z]/.test(pw),
    /\d/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ].filter(Boolean).length;

  if (len >= 8) score++;
  if (len >= 10) score++;
  if (sets >= 2) score++;
  if (sets >= 3) score++;
  const common = [
    "123456",
    "password",
    "qwerty",
    "111111",
    "12345678",
    "abc123",
    "123123",
  ];
  if (common.includes(pw.toLowerCase())) score = 0;

  return clamp(score, 0, 4);
}
const scoreLabel = (s) =>
  ["Muito fraca", "Fraca", "Ok", "Forte", "Muito forte"][s];

export default function ForgotPassword() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const [etapa, setEtapa] = useState(1);

  // Etapa 1
  const [email, setEmail] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState("Carregando...");

  // Etapa 2
  const [codigo, setCodigo] = useState(Array(6).fill(""));
  const [contador, setContador] = useState(0);
  const [erroCodigo, setErroCodigo] = useState("");
  const [verificando, setVerificando] = useState(false);
  const inputsRef = useRef([]);

  // Etapa 3
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const score = passwordScore(senha);
  const label = scoreLabel(score);

  const [toastVisivel, setToastVisivel] = useState(false);
  const [toastTexto, setToastTexto] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // <<< NOVO: alvo de retorno (se veio do Editar Perfil, volta pra lá; senão, Login)
  const backTarget = location.state?.from || "/login";

  useEffect(() => {
    document.body.classList.add("forgot-password-page");
    return () => document.body.classList.remove("forgot-password-page");
  }, []);

  useEffect(() => {
    if (contador <= 0) return;
    const intervalo = setInterval(() => setContador((prev) => prev - 1), 1000);
    return () => clearInterval(intervalo);
  }, [contador]);

  const isSixDigits = (arr) =>
    arr.join("").length === 6 && arr.every((d) => /^\d$/.test(d));
  const handlePasteCodigo = (e) => {
    const paste = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!paste) return;
    e.preventDefault();
    const novo = codigo.slice();
    for (let i = 0; i < paste.length; i++) novo[i] = paste[i];
    setCodigo(novo);
    const idx = Math.min(paste.length, 5);
    inputsRef.current[idx]?.focus();
    if (paste.length === 6) setTimeout(() => submitCodigo(novo.join("")), 50);
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setErroEmail("");

    if (!email.trim()) {
      setErroEmail("Informe seu e-mail.");
      return;
    }
    if (!isEmail(email)) {
      setErroEmail("E-mail inválido.");
      return;
    }

    setLoadingBtn(true);
    setOverlayText("Enviando e-mail...");
    setShowOverlay(true);
    const t0 = performance.now();

    try {
      const response = await fetch(`${API}/esqueci-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      const left = Math.max(0, 900 - (performance.now() - t0));
      if (left) await sleep(left);

      if (!response.ok) {
        setErroEmail(data?.erro || "E-mail inválido ou não encontrado.");
        setShowOverlay(false);
        setLoadingBtn(false);
        return;
      }

      setToastTexto("Código enviado com sucesso!");
      setToastVisivel(true);
      setTimeout(() => setToastVisivel(false), 2000);

      setEtapa(2);
      setContador(300);
      setShowOverlay(false);
      setLoadingBtn(false);
    } catch {
      const left2 = Math.max(0, 700 - (performance.now() - t0));
      if (left2) await sleep(left2);
      setErroEmail("Erro ao enviar código. Tente novamente.");
      setShowOverlay(false);
      setLoadingBtn(false);
    }
  };

  const handleStartCountdown = async () => {
    if (contador !== 0) return;

    setOverlayText("Reenviando código...");
    setShowOverlay(true);
    try {
      const resp = await fetch(`${API}/esqueci-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json();
      await sleep(700);
      if (!resp.ok) {
        setErroCodigo(data?.message || "Erro ao reenviar código.");
        setShowOverlay(false);
        return;
      }
      setContador(60);
      setShowOverlay(false);
    } catch {
      setErroCodigo("Erro ao reenviar código.");
      setShowOverlay(false);
    }
  };

  const handleCodigoChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, "");
    const novo = [...codigo];
    novo[idx] = val;
    setCodigo(novo);

    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
    else if (!val && idx > 0) inputsRef.current[idx - 1]?.focus();

    if (isSixDigits(novo)) setTimeout(() => submitCodigo(novo.join("")), 80);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace") {
        const idx = inputsRef.current.findIndex(
          (ref) => ref === document.activeElement
        );
        if (idx !== -1) {
          const novo = [...codigo];
          novo[idx] = "";
          setCodigo(novo);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [codigo]);

  const submitCodigo = async (codigoCompleto) => {
    setErroCodigo("");
    setVerificando(true);
    setOverlayText("Verificando código...");
    setShowOverlay(true);
    const t0 = performance.now();

    try {
      const response = await fetch(`${API}/verificar-codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo: codigoCompleto }),
      });
      const data = await response.json();

      const left = Math.max(0, 800 - (performance.now() - t0));
      if (left) await sleep(left);

      if (!response.ok) {
        setErroCodigo(data.message || "Código inválido ou expirado.");
        setShowOverlay(false);
        setVerificando(false);
        return;
      }

      setEtapa(3);
      setToastTexto("Código confirmado com sucesso!");
      setToastVisivel(true);
      setTimeout(() => setToastVisivel(false), 2000);
    } catch {
      const left2 = Math.max(0, 600 - (performance.now() - t0));
      if (left2) await sleep(left2);
      setErroCodigo("Erro ao verificar código.");
    } finally {
      setShowOverlay(false);
      setVerificando(false);
    }
  };

  const handleSubmitCodigo = async (e) => {
    e.preventDefault();
    const full = codigo.join("");
    if (!isSixDigits(codigo)) {
      setErroCodigo("Digite os 6 dígitos do código.");
      return;
    }
    await submitCodigo(full);
  };

  const senhaAtendeRequisitos = () => {
    const s = senha || "";
    const req = {
      len: s.length >= 8,
      upper: /[A-Z]/.test(s),
      lower: /[a-z]/.test(s),
      num: /\d/.test(s),
      special: /[^A-Za-z0-9]/.test(s),
    };
    const combinacoes = [req.upper, req.lower, req.num, req.special].filter(
      Boolean
    ).length;
    return req.len && combinacoes >= 3;
  };

  const handleSubmitSenha = async (e) => {
    e.preventDefault();
    setErroSenha("");

    if (!senhaAtendeRequisitos()) {
      setErroSenha(
        "Senha fraca. Use 8+ caracteres e combine maiúsculas, minúsculas, número e símbolo."
      );
      return;
    }
    if (!confirmarSenha.trim() || senha !== confirmarSenha) {
      setErroSenha("As senhas não coincidem.");
      return;
    }

    setOverlayText("Atualizando senha...");
    setShowOverlay(true);
    const t0 = performance.now();

    try {
      const response = await fetch(`${API}/redefinir-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          codigo: codigo.join(""),
          novaSenha: senha,
        }),
      });

      const data = await response.json();

      const left = Math.max(0, 900 - (performance.now() - t0));
      if (left) await sleep(left);

      if (!response.ok) {
        // mantém a mensagem do backend (ex.: "Nova senha não pode ser igual à anterior.")
        setErroSenha(data.message || "Erro ao redefinir a senha.");
        setShowOverlay(false);
        return;
      }

      setToastTexto("Senha redefinida com sucesso!");
      setToastVisivel(true);
      setTimeout(() => {
        setToastVisivel(false);
        navigate("/login");
      }, 2000);
    } catch {
      const left2 = Math.max(0, 700 - (performance.now() - t0));
      if (left2) await sleep(left2);
      setErroSenha("Erro ao redefinir a senha.");
      setShowOverlay(false);
    }
  };

  // <<< NOVO: usa o destino correto
  const voltarEtapa = () => {
    if (etapa === 1) navigate(backTarget);
    else setEtapa((prev) => prev - 1);
  };

  return (
    <div className="forgot-password-body">
      <main className="forgot-password-container">
        <div>
          {toastVisivel && (
            <div
              className="toast toast-sucesso"
              role="status"
              aria-live="polite"
            >
              <i
                className="fas fa-check-circle toast-icone"
                aria-hidden="true"
              ></i>
              <span>{toastTexto}</span>
            </div>
          )}

          <div className="voltar-etapa-wrapper">
            <i
              className="fas fa-arrow-left voltar-etapa-icone"
              onClick={voltarEtapa}
            />
          </div>

          {etapa === 1 && (
            <>
              <h1 className="forgot-password-title">Esqueceu a Senha?</h1>
              <p className="forgot-password-subtitle">
                Redefina sua senha em duas etapas
              </p>

              <form
                onSubmit={handleSubmitEmail}
                className="forgot-password-form auth-compact"
                noValidate
              >
                <input
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  className={`forgot-password-input ${
                    erroEmail ? "erro-borda" : ""
                  }`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErroEmail("");
                  }}
                  required
                  aria-invalid={!!erroEmail}
                  aria-describedby={erroEmail ? "erro-email" : undefined}
                />
                {erroEmail && (
                  <p id="erro-email" className="erro-texto">
                    {erroEmail}
                  </p>
                )}

                <button
                  type="submit"
                  className="forgot-password-submit-btn"
                  disabled={loadingBtn}
                >
                  {loadingBtn ? (
                    <i
                      className="fas fa-spinner fa-spin"
                      style={{ marginRight: 8 }}
                    />
                  ) : null}
                  {loadingBtn ? "Enviando..." : "Enviar"}
                </button>
              </form>
            </>
          )}

          {etapa === 2 && (
            <>
              <h1 className="forgot-password-title">Enviamos um código</h1>
              <p className="forgot-password-subtitle">
                Insira o código de 6 dígitos enviado para seu e-mail.
              </p>
              <form
                onSubmit={handleSubmitCodigo}
                className="forgot-password-form auth-compact"
                noValidate
              >
                <div
                  className="codigo-container"
                  onPaste={handlePasteCodigo}
                  aria-label="Campos para inserir o código de 6 dígitos"
                >
                  {codigo.map((digito, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputsRef.current[i] = el)}
                      className={`codigo-digit ${
                        erroCodigo ? "erro-borda" : ""
                      }`}
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={1}
                      aria-label={`Dígito ${i + 1}`}
                      value={digito}
                      onChange={(e) => handleCodigoChange(e, i)}
                    />
                  ))}
                </div>
                {erroCodigo && <p className="erro-texto">{erroCodigo}</p>}

                <div style={{ textAlign: "left" }}>
                  <span
                    className={`reenviar-link ${
                      contador > 0 ? "disabled" : ""
                    }`}
                    onClick={contador === 0 ? handleStartCountdown : null}
                  >
                    {contador > 0
                      ? `Reenviar código (${Math.floor(contador / 60)}:${String(
                          contador % 60
                        ).padStart(2, "0")})`
                      : "Reenviar código"}
                  </span>
                </div>

                <button
                  type="submit"
                  className="forgot-password-submit-btn"
                  disabled={!isSixDigits(codigo) || verificando}
                >
                  {verificando ? (
                    <i
                      className="fas fa-spinner fa-spin"
                      style={{ marginRight: 8 }}
                    />
                  ) : null}
                  {verificando ? "Verificando..." : "Enviar código"}
                </button>
              </form>
            </>
          )}

          {etapa === 3 && (
            <>
              <h1 className="forgot-password-title">Criar uma nova senha</h1>
              <p className="forgot-password-subtitle">
                Crie uma nova senha forte para manter sua conta segura.
              </p>
              <form
                onSubmit={handleSubmitSenha}
                className="forgot-password-form auth-compact"
                noValidate
              >
                <div className="criar-conta-password-wrapper">
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Senha"
                    className={`criar-conta-input criar-conta-input-password ${
                      erroSenha ? "erro-borda" : ""
                    }`}
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                      setErroSenha("");
                    }}
                    aria-invalid={!!erroSenha}
                  />
                  <i
                    className={`fas ${
                      mostrarSenha ? "fa-eye-slash" : "fa-eye"
                    } criar-conta-eye-icon`}
                    onClick={() => setMostrarSenha((prev) => !prev)}
                  />
                </div>

                <div className="pwd-meter">
                  <div className={`pwd-bar s${score}`} aria-hidden="true" />
                  <span className={`pwd-label s${score}`}>{label}</span>
                </div>
                <ul className="pwd-reqs">
                  <li className={senha.length >= 8 ? "ok" : ""}>
                    8+ caracteres
                  </li>
                  <li className={/[A-Z]/.test(senha) ? "ok" : ""}>
                    Letra maiúscula
                  </li>
                  <li className={/[a-z]/.test(senha) ? "ok" : ""}>
                    Letra minúscula
                  </li>
                  <li className={/\d/.test(senha) ? "ok" : ""}>Número</li>
                  <li className={/[^A-Za-z0-9]/.test(senha) ? "ok" : ""}>
                    Símbolo
                  </li>
                </ul>

                <div className="criar-conta-password-wrapper">
                  <input
                    type={mostrarConfirmar ? "text" : "password"}
                    placeholder="Confirmar senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className={`criar-conta-input criar-conta-input-password ${
                      senha !== confirmarSenha && confirmarSenha
                        ? "erro-borda"
                        : ""
                    }`}
                  />
                  <i
                    className={`fas ${
                      mostrarConfirmar ? "fa-eye-slash" : "fa-eye"
                    } criar-conta-eye-icon`}
                    onClick={() => setMostrarConfirmar((prev) => !prev)}
                  />
                </div>
                <div
                  className={`erro-texto-container ${
                    senha !== confirmarSenha && confirmarSenha ? "visivel" : ""
                  }`}
                >
                  <p className="erro-texto">As senhas não coincidem.</p>
                </div>

                {erroSenha && <p className="erro-texto">{erroSenha}</p>}

                <button
                  type="submit"
                  className="forgot-password-submit-btn"
                  disabled={
                    !senhaAtendeRequisitos() || senha !== confirmarSenha
                  }
                  style={{
                    marginTop:
                      senha !== confirmarSenha && confirmarSenha
                        ? "0"
                        : "1.5rem",
                  }}
                >
                  Redefinir Senha
                </button>
              </form>
            </>
          )}

          <LoadingOverlay show={showOverlay} text={overlayText} />
        </div>
      </main>
    </div>
  );
}
