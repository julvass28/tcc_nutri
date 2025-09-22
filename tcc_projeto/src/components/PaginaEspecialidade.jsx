// src/components/PaginaEspecialidade.jsx
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./PaginaEspecialidade.css";
import conteudosEspecialidades from "../data/conteudosEspecialidades";
import Contato from "../components/Contato";
import imagemEsportiva from "../assets/esportiva.png";
import imagemPediatrica from "../assets/pediatrica.png";
import imagemClinica from "../assets/clinica.png";
import imagemEmagrecimento from "../assets/emagrecimento.png";
import imagemIntolerancia from "../assets/intolerancia.png";
import Formulario from "../components/formulario/formulario";

const imagens = {
  esportiva: imagemEsportiva,
  pediatrica: imagemPediatrica,
  clinica: imagemClinica,
  emagrecimento: imagemEmagrecimento,
  intolerancia: imagemIntolerancia,
};

export default function PaginaEspecialidade() {
  const { tipo } = useParams();
  const conteudo = conteudosEspecialidades[tipo];
  const navigate = useNavigate();
  if (!conteudo) return <h2>Especialidade não encontrada</h2>;

  const defaultSectionTitles = {
    /* ... */
  };
  const st = conteudo.sectionTitles || defaultSectionTitles;
  const imagem = imagens[tipo];
  const { cta } = conteudo;

  return (
    <main className="esp-page">
      {/* 1. Introdução */}
      <section className="esp-intro">
        <div className="esp-intro__text">
          <h1>{conteudo.titulo}</h1>
          <p>{conteudo.descricao}</p>
        </div>
        {imagem && (
          <img className="esp-intro__img" src={imagem} alt={conteudo.titulo} />
        )}
      </section>

      {/* 2. Benefícios */}
      <section className="esp-benefits">
        <h2>{st.beneficios}</h2>
        <div className="esp-benefits__grid">
          {conteudo.beneficios.map((b, i) => (
            <div key={i} className="esp-benefit-card">
              <img src={b.icone} alt={b.titulo} />
              <span>{b.titulo}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Agendamento */}
      <section className="esp-appoint">
        <div className="esp-appoint__box">
          <p>Agende sua Consulta e tenha um plano alimentar personalizado</p>
          
            <button><Link to="/agendar-consulta" className="link-especi-bnt">Agendar Consulta</Link></button>
          
        </div>
      </section>

      {/* 3.1 Avaliação */}
      <section className="esp-assessment">
        <h2>
          {conteudo.avaliacaoTitulo
            ? conteudo.avaliacaoTitulo
            : st.avaliacaoTitulo}
        </h2>
      </section>

      {/* 4. O que você precisa saber */}
      <section className="esp-needtoknow">
        <h2>{st.precisaSaber}</h2>
        <div className="esp-cards">
          {conteudo.oQuePrecisaSaber.map((item, i) => (
            <div key={i} className="esp-card">
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Estratégias */}
      <section className="esp-strategies">
        <h2>{st.estrategias}</h2>
        <div className="esp-cards">
          {conteudo.estrategias.map((item, i) => (
            <div key={i} className="esp-card">
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Dicas */}
      <section className="esp-tips">
        <h2>{st.dicas}</h2>
        <div className="esp-cards">
          {conteudo.dicas.map((item, i) => (
            <div key={i} className="esp-card">
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Mitos e Verdades */}
      <section className="esp-mv">
        <h2>{st.mitosVerdades}</h2>

        <div className="esp-mv__list">
          <h3>Mitos:</h3>
          {conteudo.mitos.map((m, i) => (
            <div key={i} className="esp-mv__item">
              <img src={m.icone} alt="" />
              <div>
                <p className="esp-mv__title">{m.titulo}</p>
                <p className="esp-mv__desc">{m.texto}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="esp-mv__list">
          <h3>Verdades:</h3>
          {conteudo.verdades.map((v, i) => (
            <div key={i} className="esp-mv__item">
              <img src={v.icone} alt="" />
              <div>
                <p className="esp-mv__title">{v.titulo}</p>
                <p className="esp-mv__desc">{v.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dica final */}
      <section className="esp-tipbox">
        <div className="esp-tipbox__box">
          <p>
            <strong>Dica Nutri:</strong> Para maximizar resultados, sempre
            ajuste sua alimentação com a ajuda de um nutricionista
            especializado. Cada corpo é único!
          </p>
        </div>
      </section>

      {/* 8. CTA Receita */}
      {cta && (
        <section className="esp-cta-recipes">
          <div className="esp-cta-recipes__text">
            <h2>{cta.titulo}</h2>
            <p>{cta.subtitulo}</p>
            <hr />
            <button onClick={() => navigate(cta.botaoLink)}>
              {cta.botaoTexto}
            </button>
          </div>
        </section>
      )}

      <Contato />
      <div className="form espacamento">
        <Formulario />
      </div>
    </main>
  );
}
