import React from 'react';
import Contato from "../components/Contato";
import '../css/Home.css';
import '../css/Sobre.css';
import { Link } from 'react-router-dom';
import 'aos/dist/aos.css';
import foto_NUTRI from '../assets/ft_nutri.jpg';

import CarroselMobile from '../components/carrosel/mobile';

// Ícones (SVG como React)
import Iconclinica from '../assets/img_svg/clinic.svg?react';
import Iconesportiva from '../assets/img_svg/esportiva.svg?react';
import Iconemagrecer from '../assets/img_svg/emagrecimento.svg?react';
import Iconintolerancia from '../assets/img_svg/intolerancia.svg?react';
import Iconpediatria from '../assets/img_svg/pediatria.svg?react';

export default function Sobre() {
  return (
    <main className="sobre-main bg-branco">
      {/* HERO sem onda */}
      <section className="sobre-hero">
        <div className="sobre-hero-inner">
          <div className="cards-container">
            <div className="white-card" aria-hidden="true" />
            <div className="photo-card" aria-label="Foto Nutri">
              
                  <img className="photo-img" src={foto_NUTRI} alt="Foto da nutricionista" />
              
              
            </div>
          </div>

          <div className="sobre-text">
            <h1 className="sobre-title">
              Sobre Mim <span className="divider-dot" aria-hidden>•</span> Sua Nutricionista Online
            </h1>
            <p className="sobre-intro">
              <span className="sobre-highlight">Sou nutricionista por paixão</span>, e trabalho com cuidado individualizado, unindo ciência e acolhimento para construir hábitos sustentáveis, sem dietas extremas, com estratégias realistas para a sua rotina.
            </p>

            <div className="sobre-cta">
              <Link to="/agendar-consulta" className="btn-agendar">Agendar consulta</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="sobre-content">
        <article className="sobre-article">
          <h2 className="sobre-section-title">
            Nutricionista Natália Simanoviski <span className="crn">CRN 37892</span>
          </h2>

          <p className="lead">
            Nutricionista especializada em saúde e bem-estar, com um olhar atento às suas necessidades individuais. Meu compromisso
            é te ajudar a alcançar equilíbrio e qualidade de vida através da alimentação sem dietas restritivas, com estratégias
            eficazes e personalizadas.
          </p>

         
          <h3 className="sobre-section-title sobre-lustria-title">Formação e Especializações</h3>
          <ul className="sobre-list sobre-lustria-text">
            <li>Graduação em Nutrição — Centro Universitário São Camilo.</li>
            <li>Pós-graduação em Nutrição Clínica Pediátrica — Instituto da Criança (HCFMUSP).</li>
          </ul>

          <h3 className="sobre-section-title sobre-lustria-title">Minhas Áreas de Atuação</h3>
          <div className="sobre-areas">
            
            <div className="sobre-areas-carousel">
              <CarroselMobile
                tipo="servicos"
                dados={[
                  { id: 1, icone: <Iconclinica />, nome: "Nutrição Clínica",  link: "/especialidade/clinica" },
                  { id: 2, icone: <Iconpediatria />, nome: "Nutrição Pediátrica", link: "/especialidade/pediatrica" },
                  { id: 3, icone: <Iconesportiva />, nome: "Nutrição Esportiva", link: "/especialidade/esportiva" },
                  { id: 4, icone: <Iconemagrecer />, nome: "Emagrecimento e Obesidade", link: "/especialidade/emagrecimento" },
                  { id: 5, icone: <Iconintolerancia />, nome: "Intolerâncias Alimentares", link: "/especialidade/intolerancia" },
                ]}
              />
            </div>

            {/* Desktop/Tablet: duas fileiras centralizadas (Home) */}
            <div className="home-categorias sobre-areas-grid">
              <div className="home-linha">
                <Link to="/especialidade/clinica" className="home-categoria">
                  <Iconclinica className="home-icone" />
                  <p>Nutrição Clínica</p>
                </Link>

                <Link to="/especialidade/esportiva" className="home-categoria">
                  <Iconesportiva className="home-icone" />
                  <p>Nutrição Esportiva</p>
                </Link>

                <Link to="/especialidade/pediatrica" className="home-categoria">
                  <Iconpediatria className="home-icone" />
                  <p>Nutrição Pediátrica</p>
                </Link>
              </div>

              <div className="home-linha home-linha-menor">
                <Link to="/especialidade/emagrecimento" className="home-categoria">
                  <Iconemagrecer className="home-icone" />
                  <p>Emagrecimento e Obesidade</p>
                </Link>

                <Link to="/especialidade/intolerancia" className="home-categoria">
                  <Iconintolerancia className="home-icone" />
                  <p>Intolerâncias Alimentares</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Diferencial — Lustria */}
          <h3 className="sobre-section-title sobre-lustria-title">Meu diferencial</h3>
          <p className="sobre-paragraph sobre-lustria-text">
            Atendimento humanizado e baseado em evidências, com foco em educação nutricional, autonomia e resultados que cabem na sua rotina. Planos claros, acompanhamento próximo e ajustes inteligentes ao longo do caminho.
          </p>
        </article>
      </section>

      <Contato/>
    </main>
  );
}
