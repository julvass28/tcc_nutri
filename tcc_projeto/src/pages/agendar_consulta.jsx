// src/pages/agendar_consulta.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/agendar_consulta.css";

import phoneImg from "../assets/phone_cuate.png";
import avocadoImg from "../assets/avocado_toast.png";
import Botao from "../components/botao/Botao";

export default function Agendamento() {
  const navigate = useNavigate();

  const scrollToConteudo = () => {
    document.getElementById("conteudo")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // lista de benefícios (evita repetição no JSX)
  const beneficios = [
    { icon: "fa-solid fa-user", texto: "Atendimento individualizado" },
    { icon: "fa-solid fa-apple-whole", texto: "Plano alimentar personalizado" },
    { icon: "fa-solid fa-envelope", texto: "Suporte por 30 dias via WhatsApp" },
    { icon: "fa-solid fa-book-open", texto: "Receitas e materiais de apoio" },
  ];

  return (
    <div className="agendamento-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <img
            src={phoneImg}
            alt="Ilustração de mulher interagindo com celular"
            className="hero-img"
            loading="lazy"
          />
          <div className="hero-text">
            <h2>
              Como funcionam nossos <span>agendamentos?</span>
            </h2>
            <p>
              Nossos agendamentos possuem preços fixos baseados em seu objetivo
              nutricional. Trabalhamos com consultas online e aceitamos
              pagamento via cartão de crédito e Pix.
            </p>

            <div className="hero-actions">
              <Botao onClick={scrollToConteudo}>Ver detalhes</Botao>
              {/* <Botao onClick={() => navigate("/selecionar-data")}>Agendar consulta</Botao> */}
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="conteudo" id="conteudo">
        <h3>
          <span>•</span> Pagamento
        </h3>
        <p>
          Nossos preços são fixos e baseados em seu objetivo nutricional.
          Abaixo, segue a tabela de preços referente a cada modalidade de
          consulta.
        </p>

        <article className="card">
          <h4>Consulta de Nutrição</h4>

          <div className="card-layout">
            <img
              src={avocadoImg}
              alt="Torrada com abacate e ovo frito"
              className="card-img"
              loading="lazy"
            />

            <div className="card-info">
              <p className="destaque">Avaliação completa e plano personalizado</p>

              <ul>
                {beneficios.map(({ icon, texto }) => (
                  <li key={texto}>
                    <i className={`${icon} icon`} aria-hidden="true" />
                    {texto}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="preco">
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

        <div className="cta">
          <p>Agende sua consulta e tenha dicas exclusivas</p>
          <Botao to="/consulta">Continuar</Botao>
        </div>
      </section>
    </div>
  );
}
