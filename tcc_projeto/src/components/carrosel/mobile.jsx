import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./mobile.css";
import Titulo from "../titulo/titulo";
import { Link } from "react-router-dom";

function CarroselMobile({ titulo, subtitulo, tipo = "", dados = [] }) {
  const [ativo, setAtivo] = useState(null);

  const base =
    tipo === "receitas"
      ? { variableWidth: true }
      : { slidesToShow: 2.2, slidesToScroll: 1 };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    swipe: true,
    touchMove: true,
    ...base,
    responsive: [
      {
        breakpoint: 912,
        settings:
          tipo === "receitas"
            ? { variableWidth: true }
            : { slidesToShow: 1.8, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings:
          tipo === "receitas"
            ? { variableWidth: true }
            : { slidesToShow: 1.5, slidesToScroll: 1 },
      },
      {
        breakpoint: 480,
        settings:
          tipo === "receitas"
            ? { variableWidth: true }
            : { slidesToShow: 1.4, slidesToScroll: 1 },
      },
    ],
  };

  const handleClick = (id) => setAtivo(id === ativo ? null : id);

  return (
    <section className={`c-carousel-mobile c-carousel-mobile--${tipo}`}>
      <Titulo texto={titulo} subtitulo={subtitulo} mostrarLinha={true} />

      <Slider {...settings}>
        {dados.map((item) => (
          <div className="c-carousel-mobile__slide" key={item.id}>
            <Link to={item.link} className="c-carousel-mobile__link-to">
              <div
                onClick={() => handleClick(item.id)}
                className={`c-carousel-mobile__card c-carousel-mobile__card--${tipo} ${
                  ativo === item.id ? "is-active" : ""
                }`}
              >
                {item.imagem ? (
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="c-carousel-mobile__img"
                  />
                ) : (
                  <div className="c-carousel-mobile__icon">{item.icone}</div>
                )}

                {/* título “fora” (usado nos serviços) */}
                <h3
                  className={`c-carousel-mobile__title c-carousel-mobile__title--${tipo}`}
                >
                  {item.nome}
                </h3>

                {/* overlay para receitas */}
                <div
                  className={`c-carousel-mobile__overlay c-carousel-mobile__overlay--${tipo}`}
                >
                  <h3 className="c-carousel-mobile__overlay-title">
                    {item.nome}
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default CarroselMobile;
