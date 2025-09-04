import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/auth-pages.css";
import { AuthContext } from "../context/AuthContext";

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

export default function Login(props) {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const { login } = useContext(AuthContext);
  const MIN_LOADING_MS = 1000;

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState("Carregando...");
  const [credentials, setCredentials] = useState({ email: "", senha: "" });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroLogin, setErroLogin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [askRegister, setAskRegister] = useState(false);
  const [logoutHint, setLogoutHint] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!props._inlineFromHome) {
      document.body.classList.add("login-page");
      return () => document.body.classList.remove("login-page");
    }
  }, [props._inlineFromHome]);

  useEffect(() => {
    if (location.state?.fromLogout) {
      (async () => {
        setOverlayText("Encerrando sessão...");
        setShowOverlay(true);
        await sleep(900);
        setShowOverlay(false);
        setLogoutHint(true);
        navigate(location.pathname, { replace: true, state: {} });
      })();
    }
  }, [location.state, navigate, location.pathname]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((f) => ({ ...f, [e.target.name]: "" }));
    setErroLogin("");
  };

  const validarCampos = () => {
    const errors = {};
    const email = credentials.email.trim();
    const senha = credentials.senha.trim();
    if (!email) errors.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "E-mail inválido.";
    if (!senha) errors.senha = "Informe sua senha.";
    return errors;
  };

  const handleGoForgot = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setOverlayText("Preparando etapa de verificação...");
    setShowOverlay(true);
    await sleep(1200);
    navigate("/esqueci-senha");
  };

  const handleGoRegister = async () => {
    setOverlayText("Abrindo criação de conta...");
    setShowOverlay(true);
    await sleep(900);
    navigate("/cadastro");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroLogin("");

    const errors = validarCampos();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    const t0 = performance.now();

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      if (!response.ok) {
        const elapsed = performance.now() - t0;
        const left = Math.max(0, 600 - elapsed);
        if (left) await sleep(left);

        setIsLoading(false);

        if (
          response.status === 404 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email.trim())
        ) {
          setAskRegister(true);
          setErroLogin("");
          return;
        }

        setErroLogin(
          "E-mail ou senha incorretos. Verifique e tente novamente."
        );
        return;
      }

      login(data.token);

      const elapsed = performance.now() - t0;
      const left = Math.max(0, MIN_LOADING_MS - elapsed);
      if (left) await sleep(left);

      if (data?.usuario?.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const elapsed = performance.now() - t0;
      const left = Math.max(0, 700 - elapsed);
      if (left) await sleep(left);

      setIsLoading(false);
      setErroLogin("Erro ao conectar com o servidor. Tente novamente.");
    }
  };

  return (
    <div className="login-body">
      {askRegister && (
        <div className="auth-loading-overlay" role="dialog" aria-modal="true">
          <div
            className="auth-loading-card"
            style={{
              flexDirection: "column",
              alignItems: "stretch",
              minWidth: 280,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <i className="fas fa-user-plus" aria-hidden="true" />
              <strong>E-mail não cadastrado</strong>
            </div>
            <p style={{ margin: "6px 0 12px", color: "#4a4a4a" }}>
              O e-mail <b>{credentials.email}</b> não está cadastrado. Deseja
              criar uma conta?
            </p>
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => setAskRegister(false)}
                style={{
                  background: "transparent",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Agora não
              </button>
              <button
                onClick={handleGoRegister}
                style={{
                  background: "#c89b9b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Criar conta
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="login-container">
        {logoutHint && (
          <div className="logout-banner" role="status" aria-live="polite">
            <i className="fas fa-door-open" aria-hidden="true" />
            <span>
              Você saiu com segurança. <b>Faça login</b> para continuar
              acompanhando suas consultas.
            </span>
          </div>
        )}

        <h1 className="login-title">Fazer Login</h1>
        <p className="login-subtitle">
          Para acessar suas consultas e dietas,
          <br />
          entre com sua conta
        </p>

        <button type="button" className="login-btn login-btn-google">
          <i className="fab fa-google login-icon"></i>
          Continuar com o Google
        </button>

        <button type="button" className="login-btn login-btn-facebook">
          <i className="fab fa-facebook-f login-icon"></i>
          Continuar com o Facebook
        </button>

        <div className="login-or-container">
          <hr className="login-hr" />
          <span className="login-or-text">ou</span>
          <hr className="login-hr" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form auth-compact"
          noValidate
        >
          <input
            name="email"
            type="email"
            className={`login-input ${fieldErrors.email ? "erro-borda" : ""}`}
            placeholder="E-mail"
            autoComplete="email"
            value={credentials.email}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "erro-email" : undefined}
          />
          {fieldErrors.email && (
            <p id="erro-email" className="erro-texto">
              {fieldErrors.email}
            </p>
          )}

          <div className="criar-conta-password-wrapper">
            <input
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              className={`criar-conta-input criar-conta-input-password ${
                fieldErrors.senha ? "erro-borda" : ""
              }`}
              placeholder="Senha"
              autoComplete="current-password"
              value={credentials.senha}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.senha}
              aria-describedby={fieldErrors.senha ? "erro-senha" : undefined}
            />
            <i
              className={`fas ${
                mostrarSenha ? "fa-eye-slash" : "fa-eye"
              } criar-conta-eye-icon`}
              onClick={() => setMostrarSenha((prev) => !prev)}
              style={{ cursor: "pointer" }}
            />
          </div>
          {fieldErrors.senha && (
            <p id="erro-senha" className="erro-texto">
              {fieldErrors.senha}
            </p>
          )}

          <button
            type="button"
            onClick={handleGoForgot}
            className="login-forgot-password as-button"
          >
            Esqueceu a senha?
          </button>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <i
                className="fas fa-spinner fa-spin"
                style={{ marginRight: 8 }}
              />
            ) : null}
            {isLoading ? "Entrando..." : "Fazer Login"}
          </button>

          {erroLogin && <p className="erro-texto">{erroLogin}</p>}
        </form>

        <button
          onClick={handleGoRegister}
          className="login-create-account as-button"
          style={{ textDecoration: "underline" }}
        >
          Criar Conta
        </button>

        <LoadingOverlay show={showOverlay} text={overlayText} />
      </main>
    </div>
  );
}
