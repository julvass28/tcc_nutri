import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Titulo from "../titulo/titulo";
import "../carrosel/desktop.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

function Carrosel({ titulo, subtitulo, dados }) {
  const [conteudo, setConteudo] = useState([]);

  useEffect(() => {
    setConteudo(dados);
  }, [dados]);

  function NextArrow({ onClick }) {
    return (
      <button
        type="button"
        className="c-carousel-desktop__arrow c-carousel-desktop__arrow--next"
        onClick={onClick}
        aria-label="Próximo"
      >
        <IoIosArrowDroprightCircle className="c-carousel-desktop__arrow-icon" />
      </button>
    );
  }

  function PrevArrow({ onClick }) {
    return (
      <button
        type="button"
        className="c-carousel-desktop__arrow c-carousel-desktop__arrow--prev"
        onClick={onClick}
        aria-label="Anterior"
      >
        <IoIosArrowDropleftCircle className="c-carousel-desktop__arrow-icon" />
      </button>
    );
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="c-carousel-desktop">
      <Titulo texto={titulo} subtitulo={subtitulo} mostrarLinha={true} />

      <div className="c-carousel-desktop__container">
        <div className="c-carousel-desktop__slick">
          <Slider {...settings}>
            {conteudo.map((item) => (
              <div className="c-carousel-desktop__card" key={item.id}>
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="c-carousel-desktop__img"
                />
                <div className="c-carousel-desktop__overlay">
                  <h3 className="c-carousel-desktop__title">{item.nome}</h3>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default Carrosel;
