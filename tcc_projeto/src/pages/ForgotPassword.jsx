import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/auth-pages.css";

export default function ForgotPassword() {
  const [etapa, setEtapa] = useState(1);
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState(Array(6).fill(""));
  const [contador, setContador] = useState(0);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const inputsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("forgot-password-page");
    return () => document.body.classList.remove("forgot-password-page");
  }, []);

  useEffect(() => {
    if (contador <= 0) return;
    const intervalo = setInterval(() => setContador((prev) => prev - 1), 1000);
    return () => clearInterval(intervalo);
  }, [contador]);

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    console.log("Solicitação de redefinição para:", email);
    // 🔗 Backend: envio do e-mail para solicitação de recuperação de senha
    setEtapa(2);
  };

  const handleStartCountdown = () => {
    if (contador === 0) {
      setContador(60);
      console.log("Código reenviado para:", email);
      // 🔗 Backend: reenvio do código de verificação
    }
  };

  const handleCodigoChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;
    const novoCodigo = [...codigo];
    novoCodigo[idx] = val;
    setCodigo(novoCodigo);
    if (idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleCodigoSubmit = (e) => {
    e.preventDefault();
    const codigoFinal = codigo.join("");
    console.log("Código digitado:", codigoFinal);
    // 🔗 Backend: verificação do código de recuperação enviado por e-mail
    setEtapa(3);
  };

  const handleSubmitSenha = (e) => {
    e.preventDefault();
    if (senha !== confirmarSenha) return;
    console.log("Nova senha definida:", { senha, confirmarSenha });
    // 🔗 Backend: envio da nova senha para atualizar a conta
    navigate("/login");
  };

  const voltarEtapa = () => {
    if (etapa === 1) {
      navigate("/login");
    } else {
      setEtapa((prev) => prev - 1);
    }
  };

  return (
    <div className="forgot-password-body">
      <main className="forgot-password-container">

        <div className="voltar-etapa-wrapper">
          <i className="fas fa-arrow-left voltar-etapa-icone" onClick={voltarEtapa} />
        </div>

        {etapa === 1 && (
          <>
            <h1 className="forgot-password-title">Esqueceu a Senha?</h1>
            <p className="forgot-password-subtitle">
              Redefina sua senha em duas etapas
            </p>
            <form onSubmit={handleSubmitEmail} className="forgot-password-form" noValidate>
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                className="forgot-password-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="forgot-password-submit-btn">
                Enviar
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
            <form onSubmit={handleCodigoSubmit} className="forgot-password-form" noValidate>
              <div className="codigo-container">
                {codigo.map((digito, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    className="codigo-digit"
                    inputMode="numeric"
                    maxLength={1}
                    value={digito}
                    onChange={(e) => handleCodigoChange(e, i)}
                  />
                ))}
              </div>

              <div style={{ textAlign: "left" }}>
                <span
                  className={`reenviar-link ${contador > 0 ? "disabled" : ""}`}
                  onClick={contador === 0 ? handleStartCountdown : null}
                >
                  {contador > 0 ? `Reenviar código (${contador}s)` : "Reenviar código"}
                </span>
              </div>

              <button type="submit" className="forgot-password-submit-btn">
                Enviar código
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
            <form onSubmit={handleSubmitSenha} className="forgot-password-form" noValidate>
              <div className="criar-conta-password-wrapper">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Senha"
                  className="criar-conta-input criar-conta-input-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <i
                  className={`fas ${mostrarSenha ? "fa-eye-slash" : "fa-eye"} criar-conta-eye-icon`}
                  onClick={() => setMostrarSenha((prev) => !prev)}
                />
              </div>

              <div className="criar-conta-password-wrapper">
                <input
                  type={mostrarConfirmar ? "text" : "password"}
                  placeholder="Confirmar senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className={`criar-conta-input criar-conta-input-password ${
                    senha !== confirmarSenha && confirmarSenha ? "erro-borda" : ""
                  }`}
                />
                <i
                  className={`fas ${mostrarConfirmar ? "fa-eye-slash" : "fa-eye"} criar-conta-eye-icon`}
                  onClick={() => setMostrarConfirmar((prev) => !prev)}
                />
              </div>

              <div className={`erro-texto-container ${senha !== confirmarSenha && confirmarSenha ? "visivel" : ""}`}>
                <p className="erro-texto">As senhas não coincidem.</p>
              </div>

              <button
                type="submit"
                className="forgot-password-submit-btn"
                style={{ marginTop: senha !== confirmarSenha && confirmarSenha ? "0" : "1.5rem" }}
              >
                Redefinir Senha
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
