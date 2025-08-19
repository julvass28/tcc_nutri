import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function Login() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const { setUser } = useContext(AuthContext);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const MIN_LOADING_MS = 1000;
  const [showOverlay, setShowOverlay] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", senha: "" });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroLogin, setErroLogin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((f) => ({ ...f, [e.target.name]: "" })); // limpa erro do campo ao digitar
    setErroLogin("");
  };
  const handleGoForgot = async (e) => {
    e.preventDefault();
    if (isLoading) return; // evita conflito com submit
    setShowOverlay(true);
    await sleep(1200); // deixa aparecer com calma
    navigate("/esqueci-senha");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroLogin("");

    const errors = validarCampos();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    const t0 = performance.now(); // pra calcular quanto já levou

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      if (!response.ok) {
        // falha → segura um pouquinho o spinner pra UX ficar suave
        const elapsed = performance.now() - t0;
        const left = Math.max(0, 600 - elapsed); // garante pelo menos 600ms
        if (left) await sleep(left);

        setIsLoading(false);
        setErroLogin(
          "E-mail ou senha incorretos. Verifique e tente novamente."
        );
        return;
      }

      // sucesso → garante tempo mínimo antes de navegar
      localStorage.setItem("token", data.token);
      localStorage.setItem("nome", data.usuario?.nome || "");
      if (data.usuario) {
        setUser({
          id: data.usuario.id,
          nome: data.usuario.nome,
          email: data.usuario.email,
        });
      }

      const elapsed = performance.now() - t0;
      const left = Math.max(0, MIN_LOADING_MS - elapsed); // segura até dar 1.5s
      if (left) await sleep(left);

      // não precisamos dar setIsLoading(false); navegar desmonta o componente
      navigate("/");
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
      <main className="login-container">
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

        <Link to="/cadastro" className="login-create-account">
          Criar Conta
        </Link>
        <LoadingOverlay show={showOverlay} text="Preparando etapa de verificação..." />
      </main>
    </div>
  );
}
