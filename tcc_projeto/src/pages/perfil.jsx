import React from "react";
import "../css/perfil.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const CampoEditavel = ({ type = "text", value, label }) => (
  <div className="input-wrapper">
    <input type={type} value={`${label}: ${value}`} readOnly />
    <i className="fas fa-pencil-alt icon-dentro-input" />
  </div>
);

const CampoSenha = ({ value }) => (
  <div className="input-wrapper">
    <input type="text" value={`Senha: ${value}`} readOnly />
    <i className="fas fa-pencil-alt icon-dentro-input" />
  </div>
);


const Objetivo = ({ texto, tipo }) => (
  <span className={`objetivo ${tipo}`}>
    <i className="fas fa-seedling"></i> {texto}
  </span>
);

const DocItem = ({ src, titulo }) => (
  <div className="doc">
    <img src={src} alt="Doc" />
    <div className="doc-info">
      <p><strong>{titulo}</strong></p>
      <p className="sub">Enviado por: Natalia Simanovski</p>
    </div>
  </div>
);

const Consulta = () => (
  <div className="consulta">
    <img src="https://storage.googleapis.com/a1aa/image/d8bf69a3-6782-4a80-dd22-b760e88021a2.jpg" alt="Consulta" />
    <p><strong>1ª Consulta Online</strong></p>
    <p className="sub">Amanda Ferreira</p>
    <p className="data">Data da última consulta: 20/12/2022</p>
  </div>
);

export default function Perfil() {
  return (
    <div className="perfil-container">
<section className="perfil-header">
  <div className="perfil-header-centralizado">
    <p className="saudacao">Olá Amanda Ribeiro! Tudo bem?</p>
    <div className="foto-wrapper">
      <img src="https://storage.googleapis.com/a1aa/image/54216202-c467-43d3-29c6-1a460038de1e.jpg" alt="Amanda" />
    </div>
    <button className="editar-foto">
      <i className="fas fa-pencil-alt"></i> Editar
    </button>
  </div>
</section>


      <p className="nome-usuario">Amanda Ribeiro</p>

      <hr className="linha" />

      <section className="secao">
        <h2>Informações pessoais</h2>
        <form>
          <CampoEditavel label="Nome" type="text" value="Amanda Ribeiro Borges Da Silva" />
          <div className="grid3">
            <CampoEditavel label="Idade" type="number" value="24" />
            <CampoEditavel label="Peso" type="number" value="24" />
            <CampoEditavel label="Altura" type="number" value="24" />
          </div>
          <div className="campo">
            <label>Objetivo Nutricional:</label>
            <div className="objetivos">
              <Objetivo tipo="o1" texto="Emagrecimento e Obesidade" />
            </div>
          </div>
        </form>
      </section>

      <section className="secao">
        <h2>Configurações de Conta</h2>
        <form>
          <CampoEditavel label="Email" type="email" value="amanda.ribeiro@gmail.com" />
          <CampoSenha value="•••••••••••" />
        </form>
      </section>

      <section className="secao branco">
        <h3>Mídias e Docs:</h3>
        <div className="docs-area">
          <div className="doc-botoes">
            <button className="ativo"><i className="fas fa-clock"></i> Recentes</button>
            <button><i className="fas fa-th"></i> Todos</button>
          </div>
          <div className="doc-itens">
            <DocItem src="https://storage.googleapis.com/a1aa/image/3265eb94-ac5e-4d4f-56f0-ce5646dcb944.jpg" titulo="Plano Nutricional - Amanda Ribeiro" />
            <DocItem src="https://storage.googleapis.com/a1aa/image/61047127-af8d-489b-39ba-eeca995b628e.jpg" titulo="Receita do dia: Barraha Caseira de Cereal e Castanhas" />
          </div>
        </div>
      </section>

      <section className="secao">
        <h2>Últimas consultas:</h2>
        <div className="consultas">
          {[...Array(4)].map((_, i) => <Consulta key={i} />)}
        </div>
      </section>

      {/* Registro de refeições removido conforme solicitado */}

    </div>
  );
}
