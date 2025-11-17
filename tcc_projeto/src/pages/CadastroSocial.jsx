// src/pages/CadastroSocial.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/auth-pages.css";
import "../css/home-login-modal.css";
import { AuthContext } from "../context/AuthContext";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function calcAge(dateStr) {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
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

export default function CadastroSocial() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const { user, token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  // 👇 MESMA LÓGICA DO REGISTER: avisa pro <body> que é tela de cadastro
  useEffect(() => {
    document.body.classList.add("register-page");
    return () => {
      document.body.classList.remove("register-page");
    };
  }, []);
  // ☝️ sem mexer em login-page / forgot-password-page, igualzinho as outras auth

  const [formData, setFormData] = useState({
    data_nascimento: "",
    genero: "",
    altura: "",
    peso: "",
    objetivo: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // se não tiver token, manda pro login
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [token, navigate, location.pathname]);

  // quando o user carregar, preenche com dados existentes (se tiver)
  useEffect(() => {
    if (!user) return;

    setFormData({
      data_nascimento: user.data_nascimento
        ? String(user.data_nascimento).slice(0, 10)
        : "",
      genero: user.genero || "",
      altura: user.altura ?? "",
      peso: user.peso ?? "",
      objetivo: user.objetivo || "",
    });
  }, [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((fe) => ({ ...fe, [name]: "" }));
    setFormError("");
  };

  function validateAll(data) {
    const errors = {};

    const age = calcAge(data.data_nascimento);
    if (!data.data_nascimento)
      errors.data_nascimento = "Informe sua data de nascimento.";
    else if (new Date(data.data_nascimento) > new Date())
      errors.data_nascimento = "Data no futuro não é válida.";
    else if (age < 13)
      errors.data_nascimento = "É necessário ter pelo menos 13 anos.";

    if (!data.genero) errors.genero = "Selecione o gênero.";

    const altura = parseFloat(data.altura);
    if (!data.altura) errors.altura = "Informe sua altura.";
    else if (isNaN(altura) || altura < 1.2 || altura > 2.5)
      errors.altura = "Altura deve estar entre 1,20 m e 2,50 m.";

    const peso = parseFloat(data.peso);
    if (!data.peso) errors.peso = "Informe seu peso.";
    else if (isNaN(peso) || peso < 30 || peso > 300)
      errors.peso = "Peso deve estar entre 30 e 300 kg.";

    if (!data.objetivo) errors.objetivo = "Selecione um objetivo.";

    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const errors = validateAll(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setShowOverlay(true);

    try {
      const payload = {
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email, // backend não deixa alterar, mas mandamos igual
        data_nascimento: formData.data_nascimento,
        genero: formData.genero,
        altura: formData.altura,
        peso: formData.peso,
        objetivo: formData.objetivo,
      };

      const res = await fetch(`${API}/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data?.erro || data?.message || "Erro ao salvar dados.");
        return;
      }

      // Atualiza user no contexto
      if (setUser) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                data_nascimento: payload.data_nascimento,
                genero: payload.genero,
                altura: payload.altura,
                peso: payload.peso,
                objetivo: payload.objetivo,
              }
            : prev
        );
      }

      await sleep(700);

      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setFormError("Falha de conexão. Tente novamente.");
    } finally {
      // garante que o overlay seja desligado
      setShowOverlay(false);
      setIsSubmitting(false);
    }
  };

  if (!user) {
    // Evita layout "piscando"
    return <LoadingOverlay show text="Carregando dados do seu perfil..." />;
  }

  const primeiroNome = (user.nome || "").split(" ")[0];

  return (
    <div className="criar-conta-body">
      <main className="criar-conta-container">
        <h1 className="criar-conta-title">Completar Cadastro</h1>
        <p className="criar-conta-subtitle">
          Olá, {primeiroNome || "visitante"}!
          <br />
          Só falta preencher alguns dados para concluir seu cadastro.
        </p>

        {/* DADOS JÁ TRAZIDOS DO GOOGLE */}
        <div
          style={{
            background: "#f7f2ec",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Nome:</strong> {user.nome || "—"}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Sobrenome:</strong> {user.sobrenome || "—"}
          </p>
          <p style={{ margin: 0 }}>
            <strong>E-mail:</strong>{" "}
            <span className="mono">{user.email || "—"}</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="criar-conta-form auth-compact"
          noValidate
        >
          {/* data de nascimento */}
          <input
            name="data_nascimento"
            type="date"
            required
            value={formData.data_nascimento}
            onChange={onChange}
            className={`criar-conta-input ${
              fieldErrors.data_nascimento ? "erro-borda" : ""
            } ${formData.data_nascimento ? "preenchido" : ""}`}
            aria-invalid={!!fieldErrors.data_nascimento}
          />
          {fieldErrors.data_nascimento && (
            <p className="erro-texto">{fieldErrors.data_nascimento}</p>
          )}

          {/* genero */}
          <select
            name="genero"
            required
            value={formData.genero}
            onChange={onChange}
            className={`criar-conta-input ${
              fieldErrors.genero ? "erro-borda" : ""
            }`}
            aria-invalid={!!fieldErrors.genero}
          >
            <option value="">Selecione o gênero</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
          {fieldErrors.genero && (
            <p className="erro-texto">{fieldErrors.genero}</p>
          )}

          {/* altura */}
          <input
            name="altura"
            type="number"
            step="0.01"
            placeholder="Altura (m)"
            required
            value={formData.altura}
            onChange={onChange}
            className={`criar-conta-input ${
              fieldErrors.altura ? "erro-borda" : ""
            }`}
            aria-invalid={!!fieldErrors.altura}
          />
          {fieldErrors.altura && (
            <p className="erro-texto">{fieldErrors.altura}</p>
          )}

          {/* peso */}
          <input
            name="peso"
            type="number"
            step="0.01"
            placeholder="Peso (kg)"
            required
            value={formData.peso}
            onChange={onChange}
            className={`criar-conta-input ${
              fieldErrors.peso ? "erro-borda" : ""
            }`}
            aria-invalid={!!fieldErrors.peso}
          />
          {fieldErrors.peso && (
            <p className="erro-texto">{fieldErrors.peso}</p>
          )}

          {/* objetivo */}
          <select
            name="objetivo"
            required
            value={formData.objetivo}
            onChange={onChange}
            className={`criar-conta-input ${
              fieldErrors.objetivo ? "erro-borda" : ""
            }`}
            aria-invalid={!!fieldErrors.objetivo}
          >
            <option value="">Selecione o objetivo</option>
            <option value="1">Nutrição Clínica</option>
            <option value="2">Nutrição Pediátrica</option>
            <option value="3">Nutrição Esportiva</option>
            <option value="4">Emagrecimento e Obesidade</option>
            <option value="5">Intolerâncias Alimentares</option>
          </select>
          {fieldErrors.objetivo && (
            <p className="erro-texto">{fieldErrors.objetivo}</p>
          )}

          {formError && <p className="erro-texto">{formError}</p>}

          <button
            type="submit"
            className="criar-conta-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <i
                className="fas fa-spinner fa-spin"
                style={{ marginRight: 8 }}
              />
            ) : null}
            {isSubmitting ? "Salvando..." : "Concluir cadastro"}
          </button>
        </form>
      </main>

      <LoadingOverlay
        show={showOverlay}
        text={isSubmitting ? "Salvando seus dados..." : "Carregando..."}
      />
    </div>
  );
}
