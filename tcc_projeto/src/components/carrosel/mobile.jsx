import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './mobile.css';
import Titulo from '../titulo/titulo';

function CarroselMobile({ titulo, tipo = '', dados = [] }) {
  const [ativo, setAtivo] = useState(null);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: false,
    swipe: true,
    touchMove: true,
    responsive: [
      {
        breakpoint: 912,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const handleClick = (id) => {
    setAtivo(id === ativo ? null : id);
  };

  return (
    <div className={`carrosel-wrapper ${tipo}`}>
      <Titulo texto={titulo} mostrarLinha={true} />
      <Slider {...settings}>
        {dados.map((item) => (
          <div key={item.id} className='slide-container'>
            <div
              onClick={() => handleClick(item.id)}
              className={`card-mobile ${tipo} ${ativo === item.id ? 'clicado' : ''}`}
            >
              <div className={`icone-mob ${tipo}`}>{item.icone}</div>
              <h3>{item.titulo}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CarroselMobile;
