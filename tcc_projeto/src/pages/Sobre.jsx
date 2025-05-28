import React from 'react';
import '../css/Sobre.css';

export default function Sobre() {
  return (
    <main className="sobre-main">
      {/* Top curved background area */}
      <section className="sobre-top-section">
        <div className="curved-bg-container" aria-hidden="true">
          <svg
            className="curved-bg-svg"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1440 150"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 150C120 150 240 0 480 0C720 0 720 150 960 150C1200 150 1320 0 1440 0V150H0Z"
              className="curved-bg-path"
            />
          </svg>
        </div>

        <div className="sobre-top-content">
          {/* Wrapper for photo + white card */}
          <div className="cards-container">
            <div className="white-card" aria-hidden="true" />
            <div className="photo-card" aria-label="Foto Nutri">
              Foto<br />Nutri
            </div>
          </div>

          {/* Text content */}
          <div className="sobre-text">
            <h2 className="sobre-title">
              Sobre Mim<br />Sua Nutricionista Online
            </h2>
            <div className="sobre-divider" />
            <p className="sobre-intro">
              <span className="sobre-highlight">Sou nutricionista por paixão</span>, ajudando você a encontrar equilíbrio e saúde em cada refeição.
            </p>
          </div>
        </div>
      </section>

      {/* Content below curved area */}
      <section className="sobre-content">
        <article className="sobre-article">
          <h3 className="sobre-subtitle">
            Dra. Natália Simanoviski&nbsp;-&nbsp;CRN: 37892
          </h3>
          <p className="sobre-paragraph">
            Nutricionista especializada em saúde e bem-estar, com um olhar atento às suas necessidades individuais. Meu compromisso é te ajudar a alcançar equilíbrio e qualidade de vida através da alimentação – sem dietas restritivas, com estratégias eficazes e personalizadas.
          </p>

          <h3 className="sobre-subtitle">
            <svg className="sobre-icon arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 17l5-5-5-5v10zM5 19h2v-14H5v14z" />
            </svg>
            Formação e Especializações
          </h3>
          <ul className="sobre-list">
            <li>Graduação em Nutrição pelo Centro Universitário São Camilo.</li>
            <li>Pós-graduação em Nutrição Clínica Pediátrica pelo Instituto da Criança do HCFMUSP.</li>
            <li>Pós-graduação em Nutrição Clínica Pediátrica pelo Instituto da Criança do HCFMUSP.</li>
          </ul>

          <h3 className="sobre-subtitle">
            <svg className="sobre-icon arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 17l5-5-5-5v10zM5 19h2v-14H5v14z" />
            </svg>
            Minhas Áreas de Atuação
          </h3>
          <div className="sobre-areas">
            {/* Botões de áreas (mesma estrutura) */}
          </div>

          <h3 className="sobre-subtitle">
            <svg className="sobre-icon arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 17l5-5-5-5v10zM5 19h2v-14H5v14z" />
            </svg>
            Qual é o meu Diferencial?
          </h3>
          <p className="sobre-paragraph">
            Mais do que nutricionista, quero ser <span className="sobre-highlight-alt">sua amiga e parceira</span>. Com um atendimento humanizado e acolhedor, te guio para uma alimentação equilibrada e leve, respeitando sua individualidade.
          </p>
        </article>
      </section>
    </main>
  );
}
