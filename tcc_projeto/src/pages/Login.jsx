import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ⬅️ importando useNavigate
import "../css/auth-pages.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";




export default function Login() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const { setUser } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", senha: "" });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate(); // ⬅️ instanciando o hook
  const [erroLogin, setErroLogin] = useState('');

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroLogin(""); // limpa erros anteriores

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setErroLogin("*E-mail ou senha inválidos");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("nome", data.usuario?.nome || "");
     window.location.href = "/";
    } catch (error) {
      console.error("Erro no login:", error);
      setErroLogin("Erro ao conectar com o servidor");
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

        <button type="button" className="login-btn login-btn-google" aria-label="Continuar com o Google">
          <i className="fab fa-google login-icon"></i>
          Continuar com o Google
        </button>

        <button type="button" className="login-btn login-btn-facebook" aria-label="Continuar com o Facebook">
          <i className="fab fa-facebook-f login-icon"></i>
          Continuar com o Facebook
        </button>

        <div className="login-or-container">
          <hr className="login-hr" />
          <span className="login-or-text">ou</span>
          <hr className="login-hr" />
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <input
            name="email"
            type="email"
            className={`login-input ${erroLogin ? "erro-input" : ""}`}
            placeholder="E-mail"
            aria-label="E-mail"
            autoComplete="email"
            required
            value={credentials.email}
            onChange={handleChange}
          />


          <div className="criar-conta-password-wrapper">
            <input
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              className={`criar-conta-input criar-conta-input-password ${erroLogin ? "erro-input" : ""}`}
              placeholder="Senha"
              aria-label="Senha"
              autoComplete="current-password"
              required
              value={credentials.senha}
              onChange={handleChange}
            />

            <i
              className={`fas ${mostrarSenha ? "fa-eye-slash" : "fa-eye"} criar-conta-eye-icon`}
              tabIndex={-1}
              onClick={() => setMostrarSenha((prev) => !prev)}
              style={{ cursor: "pointer" }}
            />
          </div>

          <Link to="/esqueci-senha" className="login-forgot-password">
            Esqueceu a senha?
          </Link>

          <button type="submit" className="login-submit-btn">
            Fazer Login
          </button>
          {erroLogin && (
            <p className="mensagem-erro" style={{ color: "#D9534F", marginTop: "10px" }}>
              {erroLogin}
            </p>
          )}
        </form>

        <Link to="/cadastro" className="login-create-account">
          Criar Conta
        </Link>
      </main>
    </div>
  );
}
