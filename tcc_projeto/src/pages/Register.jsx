import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth-pages.css";

export default function CriarConta() {
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

  const navigate = useNavigate(); // usado para redirecionar

  useEffect(() => {
    document.body.classList.add("register-page");
    return () => document.body.classList.remove("register-page");
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) return;

    fetch("http://localhost:3001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate("/login");
      })
      .catch((err) => console.error("Erro ao registrar:", err));

    navigate("/login"); // redireciona após envio
  };

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

        <form onSubmit={handleSubmit} className="criar-conta-form" noValidate>
          <input name="nome" type="text" placeholder="Nome" required value={formData.nome} onChange={handleChange} className="criar-conta-input" />
          <input name="sobrenome" type="text" placeholder="Sobrenome" required value={formData.sobrenome} onChange={handleChange} className="criar-conta-input" />
          <input name="email" type="email" placeholder="E-mail" required value={formData.email} onChange={handleChange} className="criar-conta-input" />

          <div className="criar-conta-password-wrapper">
            <input
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              required
              value={formData.senha}
              onChange={handleChange}
              className="criar-conta-input criar-conta-input-password"
            />
            <i
              className={`fas ${mostrarSenha ? "fa-eye-slash" : "fa-eye"} criar-conta-eye-icon`}
              onClick={() => setMostrarSenha((prev) => !prev)}
            />
          </div>

          <div className="criar-conta-password-wrapper">
            <input
              name="confirmarSenha"
              type={mostrarConfirmarSenha ? "text" : "password"}
              placeholder="Confirmar senha"
              required
              value={formData.confirmarSenha}
              onChange={handleChange}
              className={`criar-conta-input criar-conta-input-password ${formData.confirmarSenha && formData.senha !== formData.confirmarSenha ? "erro-borda" : ""
                }`}
            />
            <i
              className={`fas ${mostrarConfirmarSenha ? "fa-eye-slash" : "fa-eye"} criar-conta-eye-icon`}
              onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
            />
          </div>

          <div className={`erro-texto-container ${formData.confirmarSenha && formData.senha !== formData.confirmarSenha ? "visivel" : ""}`}>
            <p className="erro-texto">As senhas não coincidem.</p>
          </div>

          <input
            name="data_nascimento"
            type="date"
            required
            value={formData.data_nascimento}
            onChange={handleChange}
            className={`criar-conta-input ${formData.data_nascimento ? "preenchido" : ""}`}
          />

          <select name="genero" required value={formData.genero} onChange={handleChange} className="criar-conta-input">
            <option value="">Selecione o gênero</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>

          <input
            name="altura"
            type="number"
            step="0.01"
            placeholder="Altura (m)"
            required
            value={formData.altura}
            onChange={handleChange}
            className="criar-conta-input"
          />
          <input
            name="peso"
            type="number"
            step="0.01"
            placeholder="Peso (kg)"
            required
            value={formData.peso}
            onChange={handleChange}
            className="criar-conta-input"
          />

          <select name="objetivo" required value={formData.objetivo} onChange={handleChange} className="criar-conta-input">
            <option value="">Selecione o objetivo</option>
            <option value="1">Nutrição Clínica</option>
            <option value="2">Nutrição Pediátrica</option>
            <option value="3">Nutrição Esportiva</option>
            <option value="4">Emagrecimento e Obesidade</option>
            <option value="5">Intolerâncias Alimentares</option>
          </select>

          <button type="submit" className="criar-conta-submit-btn">
            Criar
          </button>
        </form>

        <Link to="/login" className="criar-conta-login-link">
          Já tem conta? Fazer Login
        </Link>
      </main>
    </div>
  );
}
