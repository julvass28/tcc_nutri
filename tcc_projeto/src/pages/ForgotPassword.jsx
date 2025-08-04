import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/auth-pages.css";

export default function ForgotPassword() {
  const [etapa, setEtapa] = useState(1);
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState(Array(6).fill(""));
  const [contador, setContador] = useState(0);
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [erroEmail, setErroEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erroCodigo, setErroCodigo] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const [toastVisivel, setToastVisivel] = useState(false);
  const [toastTexto, setToastTexto] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  useEffect(() => {
    document.body.classList.add("forgot-password-page");
    return () => document.body.classList.remove("forgot-password-page");
  }, []);

  useEffect(() => {
    if (contador <= 0) return;
    const intervalo = setInterval(() => setContador((prev) => prev - 1), 1000);
    return () => clearInterval(intervalo);
  }, [contador]);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setErroEmail("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setErroEmail(data.erro || "E-mail inválido ou não encontrado");
        return;
      }

      setEtapa(2);
      setContador(300);
    } catch (error) {
      setErroEmail("Erro ao enviar código. Tente novamente.");
      setLoading(false);
    }
  };
  const handleStartCountdown = async () => {
    if (contador === 0) {
      setContador(60);

      try {
        const response = await fetch("http://localhost:3001/esqueci-senha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Erro ao reenviar código");

        console.log("✅ Código reenviado para:", email);
      } catch (err) {
        alert("Erro ao reenviar código.");
        setContador(0);
      }
    }
  };

  const handleCodigoChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, "");
    const novoCodigo = [...codigo];
    novoCodigo[idx] = val;
    setCodigo(novoCodigo);

    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    } else if (!val && idx > 0) {
      inputsRef.current[idx - 1]?.focus(); // permite voltar com backspace
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace") {
        const idx = inputsRef.current.findIndex((ref) => ref === document.activeElement);
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

  const handleSubmitCodigo = async (e) => {
    e.preventDefault();
    setErroCodigo("");

    const codigoCompleto = codigo.join("");

    try {
      const response = await fetch("http://localhost:3001/verificar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo: codigoCompleto }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErroCodigo(data.message || "Código inválido ou expirado.");
        return;
      }

      setEtapa(3);
      setToastTexto("Código confirmado com sucesso!");
      setToastVisivel(true);
      setTimeout(() => setToastVisivel(false), 2500); // some sozinho após 2.5s
    } catch (error) {
      setErroCodigo("Erro ao verificar código.");
    }
  };
const handleSubmitSenha = async (e) => {
  e.preventDefault();
  setErroSenha("");

  if (senha !== confirmarSenha) return;

  try {
    const response = await fetch("http://localhost:3001/redefinir-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        novaSenha: senha,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErroSenha(data.message || "Erro ao redefinir a senha.");
      return;
    }

    setToastTexto("Senha redefinida com sucesso!");
    setToastVisivel(true);
    setTimeout(() => {
      setToastVisivel(false);
      navigate("/login");
    }, 2500);
  } catch (error) {
    setErroSenha("Erro ao redefinir a senha.");
  }
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
        {toastVisivel && (
          <div className="toast toast-sucesso" role="status" aria-live="polite">
            <i className="fas fa-check-circle toast-icone" aria-hidden="true"></i>
            <span>{toastTexto}</span>
          </div>
        )}
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
                className={`forgot-password-input ${erroEmail ? "erro-borda" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {erroEmail && <p className="erro-texto">{erroEmail}</p>}
              <button type="submit" className="forgot-password-submit-btn">
                {loading ? "Enviando..." : "Enviar"}
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
            <form onSubmit={handleSubmitCodigo} className="forgot-password-form" noValidate>
              <div className="codigo-container">
                {codigo.map((digito, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    className={`codigo-digit ${erroCodigo ? "erro-borda" : ""}`}
                    inputMode="numeric"
                    maxLength={1}
                    value={digito}
                    onChange={(e) => handleCodigoChange(e, i)}
                  />
                ))}
              </div>
              {erroCodigo && <p className="erro-texto">{erroCodigo}</p>}


              <div style={{ textAlign: "left" }}>
                <span
                  className={`reenviar-link ${contador > 0 ? "disabled" : ""}`}
                  onClick={contador === 0 ? handleStartCountdown : null}
                >
                  {contador > 0
                    ? `Reenviar código (${Math.floor(contador / 60)}:${String(contador % 60).padStart(2, '0')})`
                    : "Reenviar código"}
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
                  className={`criar-conta-input criar-conta-input-password ${senha !== confirmarSenha && confirmarSenha ? "erro-borda" : ""
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
    </div >
  );
}
