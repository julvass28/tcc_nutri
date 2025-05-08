import React from 'react';
import { useParams } from 'react-router-dom';
import './PaginaEspecialidade.css';
import conteudosEspecialidades from '../data/conteudosEspecialidades';
import { useNavigate } from 'react-router-dom';

import imagemEsportiva from '../assets/esportiva.png';
import imagemPediatrica from '../assets/pediatrica.png';
import imagemClinica from '../assets/clinica.png';
import imagemEmagrecimento from '../assets/emagrecimento.png';
import imagemIntolerancia from '../assets/intolerancia.png';


const imagens = {
  esportiva: imagemEsportiva,
  pediatrica: imagemPediatrica,
  clinica: imagemClinica,
  emagrecimento: imagemEmagrecimento,
  intolerancia: imagemIntolerancia,
};

const PaginaEspecialidade = () => {
  const { tipo } = useParams();
  const conteudo = conteudosEspecialidades[tipo];
  const navigate = useNavigate();
  if (!conteudo) return <h2>Especialidade não encontrada</h2>;

  const defaultSectionTitles = { /* ... */ };
  const st = conteudo.sectionTitles || defaultSectionTitles;
  const imagem = imagens[tipo];
  const { cta } = conteudo;

  return (
    <main className="pagina-especialidade">
      {/* 1. Introdução */}
      <section className="intro">
        <div className="texto">
          <h1>{conteudo.titulo}</h1>
          <p>{conteudo.descricao}</p>
        </div>
        {imagem && <img src={imagem} alt={conteudo.titulo} />}
      </section>

      {/* 2. Benefícios */}
      <section className="beneficios">
        <h2>{st.beneficios}</h2>
        <div className="grid-beneficios">
          {conteudo.beneficios.map((b, i) => (
            <div key={i} className="card-beneficio">
              <img src={b.icone} alt={b.titulo} />
              <span>{b.titulo}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Agendamento */}
      <section className="agendamento">
        <div className="box-agendar">
          <p>Agende sua Consulta e tenha um plano alimentar personalizado</p>
          <button>Agendar Consulta</button>
        </div>
      </section>

      <section className="avaliacao-nutricional">

  <h2>
    {conteudo.avaliacaoTitulo 
      ? conteudo.avaliacaoTitulo 
      : st.avaliacaoTitulo}
  </h2>
</section>

      {/* 4. O que você precisa saber */}
      <section className="o-que-precisa-saber">
        <h2>{st.precisaSaber}</h2>
        <div className="grid-cards">
          {conteudo.oQuePrecisaSaber.map((item, i) => (
            <div key={i} className="card-info">
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Estratégias */}
      <section className="estrategias">
        <h2>{st.estrategias}</h2>
        <div className="grid-cards">
          {conteudo.estrategias.map((item, i) => (
            <div key={i} className="card-info">
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Dicas */}
      <section className="dicas">
        <h2>{st.dicas}</h2>
        <div className="grid-cards">
          {conteudo.dicas.map((item, i) => (
            <div key={i} className="card-info">
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Mitos e Verdades (vertical) */}
<section className="mitos-verdades">
  <h2>{st.mitosVerdades}</h2>

  {/* Lista de Mitos */}
  <div className="lista-mitos-verdades">
    <h3>Mitos:</h3>
    {conteudo.mitos.map((m, i) => (
      <div key={i} className="item-lista">
        <img src={m.icone} alt="" />
        <div>
          <p className="titulo">{m.titulo}</p>
          <p className="descricao">{m.texto}</p>
        </div>
      </div>
    ))}
  </div>

  {/* Lista de Verdades */}
  <div className="lista-mitos-verdades">
    <h3>Verdades:</h3>
    {conteudo.verdades.map((v, i) => (
      <div key={i} className="item-lista">
        <img src={v.icone} alt="" />
        <div>
          <p className="titulo">{v.titulo}</p>
          <p className="descricao">{v.texto}</p>
        </div>
      </div>
    ))}
  </div>
</section>
{/*. dica final */}
<section className="dicafinal">
        <div className="box-dica">
          
          <p><strong>Dica Nutri:</strong> Para maximizar resultados, sempre ajuste sua alimentação com a ajuda de um nutricionista especializado. Cada corpo é único!</p>
        </div>
      </section>
      
{/* 8. CTA Receita */}
      {cta && (
        <section className="cta-receitas">
          <div className="cta-texto">
            <h2>{cta.titulo}</h2>
            <p>{cta.subtitulo}</p>
            <hr />
            <button onClick={() => navigate(cta.botaoLink)}>
              {cta.botaoTexto}
            </button>
          </div>
        </section>
      )}

    </main>
  );
};

export default PaginaEspecialidade;
