import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Titulo from '../titulo/titulo'; 
import '../carrosel/desktop.css'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";

function Carrosel({ titulo, subtitulo, dados }) {
  const [conteudo, setConteudo] = useState([]);

  useEffect(() => {
    setConteudo(dados);
  }, [dados]);

  function SampleNextArrow({ onClick }) {
    return (
      <div className="custom-arrow next-arrow" onClick={onClick}>
        <IoIosArrowDroprightCircle className="icone-seta" />
      </div>
    );
  }

  function SamplePrevArrow({ onClick }) {
    return (
      <div className="custom-arrow prev-arrow" onClick={onClick}>
        <IoIosArrowDropleftCircle className="icone-seta" />
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  return (
    <div className="receitas">
      <Titulo texto={titulo} mostrarLinha={false} />
      <p>{subtitulo}</p>
      <Slider {...settings}>
        {conteudo.map((item) => (
          <div className="card-receita" key={item.id}>
            <img src={item.imagem} alt={item.nome} className="img-receita" />
            <div className="sobre-receita">
              <h3>{item.nome}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Carrosel;