// src/pages/agendar_consulta.jsx
import React, { useContext } from "react";
import "../css/agendar_consulta.css";

import phoneImg from "../assets/phone_cuate.png";
import avocadoImg from "../assets/avocado_toast.png";
import Botao from "../components/botao/Botao";
import usePrecoConsulta from "../hooks/usePrecoConsulta";
import { formatBRLFromCents } from "../services/config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Agendamento() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { cents } = usePrecoConsulta();

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

  const handleContinuar = () => {
    if (!token) {
      navigate("/login", { state: { from: "/agendar" } });
      return;
    }
    navigate("/agendar");
  };

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
              Como funciona o <span>agendamento</span>
            </h2>
            <p>
              Você pode agendar consultas online com pagamento por cartão de
              crédito ou Pix. Os valores e condições são transparentes e
              informados antes da confirmação.
            </p>

            <div className="agc-hero-actions">
              <Botao onClick={scrollToConteudo}>Ver detalhes</Botao>
            </div>
          </div>
        </div>
      </section>

      <section className="agc-content" id="conteudo">
        <h3>
          <span>•</span> Valores e pagamento
        </h3>
        <p>
          Os valores e formas de pagamento são apresentados de forma clara antes
          da confirmação. Abaixo, você encontra a modalidade disponível e o
          respectivo valor.
        </p>

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
                Avaliação completa e plano alimentar personalizado
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
            Valor da consulta:{" "}
            <span>
              <strong>
                {Number.isFinite(cents)
                  ? formatBRLFromCents(cents)
                  : "—"}
              </strong>
            </span>
          </p>
        </article>

        <h3>
          <span>•</span> Anamnese
        </h3>
        <p>
          Após a confirmação do agendamento e do pagamento, você receberá um
          questionário (anamnese) para conhecer seu histórico, objetivos e
          rotina. É importante preencher para que a nutricionista prepare a sua
          consulta.
        </p>

        <div className="agc-cta">
          <p>Agende sua consulta e receba orientação personalizada</p>
          <Botao onClick={handleContinuar}>Continuar</Botao>
        </div>
      </section>
    </div>
  );
}
