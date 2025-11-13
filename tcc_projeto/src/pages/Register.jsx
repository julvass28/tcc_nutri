import React, { useState, useEffect } from "react";
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

// ===== helpers de validação =====
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function calcAge(dateStr) {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

// força de senha simples (0–4) sem lib externa
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
  // penaliza senhas muito comuns
  const common = ["123456", "password", "qwerty", "111111", "12345678", "abc123", "123123"];
  if (common.includes(pw.toLowerCase())) score = 0;

  return clamp(score, 0, 4);
}

function scoreLabel(score) {
  return ["Muito fraca", "Fraca", "Ok", "Forte", "Muito forte"][score];
}

export default function CriarConta() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    data_nascimento: "",
    genero: "",
    altura: "",
    peso: "",
    objetivo: ""
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  useEffect(() => {
    document.body.classList.add("register-page");
    return () => document.body.classList.remove("register-page");
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((fe) => ({ ...fe, [name]: "" }));
    setFormError("");
  };

  // validação completa
  function validateAll(data) {
    const errors = {};
    if (!data.nome.trim()) errors.nome = "Informe seu nome.";
    if (!data.sobrenome.trim()) errors.sobrenome = "Informe seu sobrenome.";

    if (!data.email.trim()) errors.email = "Informe seu e-mail.";
    else if (!isEmail(data.email)) errors.email = "E-mail inválido.";

    const age = calcAge(data.data_nascimento);
    if (!data.data_nascimento) errors.data_nascimento = "Informe sua data de nascimento.";
    else if (new Date(data.data_nascimento) > new Date()) errors.data_nascimento = "Data no futuro não é válida.";
    else if (age < 13) errors.data_nascimento = "É necessário ter pelo menos 13 anos.";

    if (!data.genero) errors.genero = "Selecione o gênero.";

    const altura = parseFloat(data.altura);
    if (!data.altura) errors.altura = "Informe sua altura.";
    else if (isNaN(altura) || altura < 1.2 || altura > 2.5) errors.altura = "Altura deve estar entre 1,20 m e 2,50 m.";

    const peso = parseFloat(data.peso);
    if (!data.peso) errors.peso = "Informe seu peso.";
    else if (isNaN(peso) || peso < 30 || peso > 300) errors.peso = "Peso deve estar entre 30 e 300 kg.";

    if (!data.objetivo) errors.objetivo = "Selecione um objetivo.";

    // senha
    const s = (data.senha || "").trim();
    if (!s) errors.senha = "Crie uma senha.";
    const req = {
      len: s.length >= 8,
      upper: /[A-Z]/.test(s),
      lower: /[a-z]/.test(s),
      num: /\d/.test(s),
      special: /[^A-Za-z0-9]/.test(s),
    };
    // exige pelo menos 3 critérios para passar
    const passed = [req.upper, req.lower, req.num, req.special].filter(Boolean).length >= 3 && req.len;
    if (!passed && !errors.senha) errors.senha = "Senha fraca. Use 8+ caracteres e combine maiúsculas, minúsculas, número e símbolo.";

    if (!data.confirmarSenha.trim()) errors.confirmarSenha = "Confirme sua senha.";
    else if (data.senha !== data.confirmarSenha) errors.confirmarSenha = "As senhas não coincidem.";

    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateAll(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setShowOverlay(true);
    const t0 = performance.now();

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setIsSubmitting(false);
        setShowOverlay(false);
        setFormError(data?.erro || data?.message || "Erro ao criar conta.");
        return;
      }

      const left = Math.max(0, 900 - (performance.now() - t0));
      if (left) await sleep(left);
      navigate("/login", { state: { from } });
    } catch (err) {
      setIsSubmitting(false);
      setShowOverlay(false);
      setFormError("Falha de conexão. Tente novamente.");
    }
  };

  const handleVoltarLogin = async () => {
    if (isSubmitting) return;
    setShowOverlay(true);
    await sleep(800);
    navigate("/login", { state: { from } });
  };

  const score = passwordScore(formData.senha);
  const label = scoreLabel(score);

  return (
    <div className="criar-conta-body">
      <main className="criar-conta-container">
        <h1 className="criar-conta-title">Criar Conta</h1>
        <p className="criar-conta-subtitle">
          Para acessar suas consultas e dietas,
          <br />
          entre com sua conta
        </p>

        <button type="button" className="criar-conta-btn criar-conta-btn-google">
          <i className="fab fa-google criar-conta-icon"></i>
          Continuar com o Google
        </button>

        <button type="button" className="criar-conta-btn criar-conta-btn-facebook">
          <i className="fab fa-facebook-f criar-conta-icon"></i>
          Continuar com o Facebook
        </button>

        <div className="criar-conta-or-container">
          <hr className="criar-conta-hr" />
          <span className="criar-conta-or-text">ou</span>
          <hr className="criar-conta-hr" />
        </div>

        {/* modo compacto nas mensagens */}
        <form onSubmit={handleSubmit} className="criar-conta-form auth-compact" noValidate>
          <input
            name="nome" type="text" placeholder="Nome" required
            value={formData.nome} onChange={onChange}
            className={`criar-conta-input ${fieldErrors.nome ? "erro-borda" : ""}`}
            aria-invalid={!!fieldErrors.nome}
          />
          {fieldErrors.nome && <p className="erro-texto">{fieldErrors.nome}</p>}

          <input
            name="sobrenome" type="text" placeholder="Sobrenome" required
            value={formData.sobrenome} onChange={onChange}
            className={`criar-conta-input ${fieldErrors.sobrenome ? "erro-borda" : ""}`}
            aria-invalid={!!fieldErrors.sobrenome}
          />
          {fieldErrors.sobrenome && <p className="erro-texto">{fieldErrors.sobrenome}</p>}

          <input
            name="email" type="email" placeholder="E-mail" required
            value={formData.email} onChange={onChange}
            className={`criar-conta-input ${fieldErrors.email ? "erro-borda" : ""}`}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && <p className="erro-texto">{fieldErrors.email}</p>}

          {/* senha */}
          <div className="criar-conta-password-wrapper">
            <input
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              required
              value={formData.senha}
              onChange={onChange}
              className={`criar-conta-input criar-conta-input-password ${fieldErrors.senha ? "erro-borda" : ""}`}
              aria-invalid={!!fieldErrors.senha}
            />
            <i
              className={`fas ${mostrarSenha ? "fa-eye-slash" : "fa-eye"} criar-conta-eye-icon`}
              onClick={() => setMostrarSenha((prev) => !prev)}
            />
          </div>
          {/* medidor de força */}
          <div className="pwd-meter">
            <div className={`pwd-bar s${score}`} aria-hidden="true" />
            <span className={`pwd-label s${score}`}>{label}</span>
          </div>
          {/* checklist de requisitos */}
          <ul className="pwd-reqs">
            <li className={formData.senha.length >= 8 ? "ok" : ""}>8+ caracteres</li>
            <li className={/[A-Z]/.test(formData.senha) ? "ok" : ""}>Letra maiúscula</li>
            <li className={/[a-z]/.test(formData.senha) ? "ok" : ""}>Letra minúscula</li>
            <li className={/\d/.test(formData.senha) ? "ok" : ""}>Número</li>
            <li className={/[^A-Za-z0-9]/.test(formData.senha) ? "ok" : ""}>Símbolo</li>
          </ul>
          {fieldErrors.senha && <p className="erro-texto">{fieldErrors.senha}</p>}

          {/* confirmar senha */}
          <div className="criar-conta-password-wrapper">
            <input
              name="confirmarSenha"
              type={mostrarConfirmarSenha ? "text" : "password"}
              placeholder="Confirmar senha"
              required
              value={formData.confirmarSenha}
              onChange={onChange}
              className={`criar-conta-input criar-conta-input-password ${formData.confirmarSenha && formData.senha !== formData.confirmarSenha ? "erro-borda" : ""}`}
              aria-invalid={!!fieldErrors.confirmarSenha || (formData.confirmarSenha && formData.senha !== formData.confirmarSenha)}
            />
            <i
              className={`fas ${mostrarConfirmarSenha ? "fa-eye-slash" : "fa-eye"} criar-conta-eye-icon`}
              onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
            />
          </div>
          <div className={`erro-texto-container ${(formData.confirmarSenha && formData.senha !== formData.confirmarSenha) ? "visivel" : ""}`}>
            <p className="erro-texto">As senhas não coincidem.</p>
          </div>
          {fieldErrors.confirmarSenha && <p className="erro-texto">{fieldErrors.confirmarSenha}</p>}

          {/* data de nascimento */}
          <input
            name="data_nascimento" type="date" required
            value={formData.data_nascimento} onChange={onChange}
            className={`criar-conta-input ${fieldErrors.data_nascimento ? "erro-borda" : ""} ${formData.data_nascimento ? "preenchido" : ""}`}
            aria-invalid={!!fieldErrors.data_nascimento}
          />
          {fieldErrors.data_nascimento && <p className="erro-texto">{fieldErrors.data_nascimento}</p>}

          {/* genero */}
          <select
            name="genero" required value={formData.genero} onChange={onChange}
            className={`criar-conta-input ${fieldErrors.genero ? "erro-borda" : ""}`}
            aria-invalid={!!fieldErrors.genero}
          >
            <option value="">Selecione o gênero</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
          {fieldErrors.genero && <p className="erro-texto">{fieldErrors.genero}</p>}

          {/* altura/peso */}
          <input
            name="altura" type="number" step="0.01" placeholder="Altura (m)" required
            value={formData.altura} onChange={onChange}
            className={`criar-conta-input ${fieldErrors.altura ? "erro-borda" : ""}`}
            aria-invalid={!!fieldErrors.altura}
          />
          {fieldErrors.altura && <p className="erro-texto">{fieldErrors.altura}</p>}

          <input
            name="peso" type="number" step="0.01" placeholder="Peso (kg)" required
            value={formData.peso} onChange={onChange}
            className={`criar-conta-input ${fieldErrors.peso ? "erro-borda" : ""}`}
            aria-invalid={!!fieldErrors.peso}
          />
          {fieldErrors.peso && <p className="erro-texto">{fieldErrors.peso}</p>}

          {/* objetivo */}
          <select
            name="objetivo" required value={formData.objetivo} onChange={onChange}
            className={`criar-conta-input ${fieldErrors.objetivo ? "erro-borda" : ""}`}
            aria-invalid={!!fieldErrors.objetivo}
          >
            <option value="">Selecione o objetivo</option>
            <option value="1">Nutrição Clínica</option>
            <option value="2">Nutrição Pediátrica</option>
            <option value="3">Nutrição Esportiva</option>
            <option value="4">Emagrecimento e Obesidade</option>
            <option value="5">Intolerâncias Alimentares</option>
          </select>
          {fieldErrors.objetivo && <p className="erro-texto">{fieldErrors.objetivo}</p>}

          {formError && <p className="erro-texto">{formError}</p>}

          <button type="submit" className="criar-conta-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }} /> : null}
            {isSubmitting ? "Criando..." : "Criar"}
          </button>
        </form>

        <button type="button" onClick={handleVoltarLogin} className="criar-conta-login-link as-button">
          Já tem conta? Fazer Login
        </button>

        <LoadingOverlay show={showOverlay} text={isSubmitting ? "Criando sua conta..." : "Abrindo login..."} />
      </main>
    </div>
  );
}
