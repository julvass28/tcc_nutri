// src/pages/agendar_consulta.jsx
import React from "react";
import "../css/agendar_consulta.css";

import phoneImg from "../assets/phone_cuate.png";
import avocadoImg from "../assets/avocado_toast.png";
import Botao from "../components/botao/Botao";

export default function Agendamento() {
  const scrollToConteudo = () => {
    document.getElementById("conteudo")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const beneficios = [
    { icon: "fa-solid fa-user", texto: "Atendimento individualizado" },
    { icon: "fa-solid fa-apple-whole", texto: "Plano alimentar personalizado" },
    { icon: "fa-solid fa-envelope", texto: "Suporte por 30 dias via WhatsApp" },
    { icon: "fa-solid fa-book-open", texto: "Receitas e materiais de apoio" },
  ];

  return (
    <div className="agc">
      {/* Hero */}
      <section className="agc-hero">
        <div className="agc-hero-content">
          <img
            src={phoneImg}
            alt="Ilustração de mulher interagindo com celular"
            className="agc-hero-img"
            loading="lazy"
          />
          <div className="agc-hero-text">
            <h2>
              Como funcionam nossos <span>agendamentos?</span>
            </h2>
            <p>
              Nossos agendamentos possuem preços fixos baseados em seu objetivo
              nutricional. Trabalhamos com consultas online e aceitamos
              pagamento via cartão de crédito e Pix.
            </p>

            <div className="agc-hero-actions">
              <Botao onClick={scrollToConteudo}>Ver detalhes</Botao>
              {/* <Botao to="/selecionar-data">Agendar consulta</Botao> */}
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="agc-content" id="conteudo">
        <h3>
          <span>•</span> Pagamento
        </h3>
        <p>
          Nossos preços são fixos e baseados em seu objetivo nutricional.
          Abaixo, segue a tabela de preços referente a cada modalidade de
          consulta.
        </p>

        {/* Card de consulta (escopado) */}
        <article className="agc-card">
          <h4 className="agc-card__heading">Consulta de Nutrição</h4>

          <div className="agc-card__layout">
            <img
              src={avocadoImg}
              alt="Torrada com abacate e ovo frito"
              className="agc-card__img"
              loading="lazy"
            />

            <div className="agc-card__info">
              <p className="agc-highlight">
                Avaliação completa e plano personalizado
              </p>
              <ul>
                {beneficios.map(({ icon, texto }) => (
                  <li key={texto}>
                    <i className={`${icon} agc-icon`} aria-hidden="true" />
                    {texto}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="agc-card__price">
            preço fixo de: <span>R$ 80,00</span>
          </p>
        </article>

        <h3>
          <span>•</span> Anamnese
        </h3>
        <p>
          Após o agendamento da sua consulta ser confirmado, você receberá um
          questionário relacionado ao seu objetivo nutricional, nos referimos a
          esse questionário como <strong>anamnese</strong>. A anamnese permitirá
          que a nutricionista conheça suas necessidades antes mesmo da consulta,
          poupando seu tempo durante a mesma e preparando a profissional.
        </p>

        <div className="agc-cta">
          <p>Agende sua consulta e tenha dicas exclusivas</p>
          <Botao to="/agendar">Continuar</Botao>
        </div>
      </section>
    </div>
  );
}
