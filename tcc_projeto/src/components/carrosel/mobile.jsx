import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './mobile.css';
import Titulo from '../titulo/titulo';

function CarroselMobile({ titulo, subtitulo, tipo = '', dados = [] }) {
  const [ativo, setAtivo] = useState(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    swipe: true,
    touchMove: true,

    ...(tipo === 'receitas'
      ? {
        variableWidth: true,
      }
      : {
        slidesToShow: 2.2, 
        slidesToScroll: 1,
      }),

    responsive: [
      {
        breakpoint: 912,
        settings: {
          ...(tipo === 'receitas'
            ? { variableWidth: true }
            : { slidesToShow: 1.8, slidesToScroll: 1 }),
        },
      },
      {
        breakpoint: 768,
        settings: {
          ...(tipo === 'receitas'
            ? { variableWidth: true }
            : { slidesToShow: 1.5, slidesToScroll: 1 }),
        },
      },
      {
        breakpoint: 480,
        settings: {
          ...(tipo === 'receitas'
            ? { variableWidth: true }
            : { slidesToShow: 1.4, slidesToScroll: 1 }),
        },
      },
    ],
  };


  const handleClick = (id) => {
    setAtivo(id === ativo ? null : id);
  };

  return (
    <div className={`carrosel-wrapper ${tipo}`}>
      <Titulo texto={titulo}subtitulo={subtitulo}  mostrarLinha={true} />
   
      <Slider {...settings}>
        {dados.map((item) => (
          <div
            key={item.id}
            className={`slide-container ${tipo} slick-slide ${tipo}`}
          >
            <div
              onClick={() => handleClick(item.id)}
              className={`card-mobile ${tipo} ${ativo === item.id ? 'clicado' : ''}`}
            >
              {item.imagem ? (
                <>
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="imagem-receita"
                  />
                </>
              ) : (
                <div className={`icone-mob ${tipo}`}>{item.icone}</div>
              )}
              <h3 className={`nome-titulo ${tipo}`}>{item.nome}</h3>

             
              <div className={`sobre-receita mobile ${tipo}`}>
                <h3 className={`nome-titulo-receita ${tipo}`}>{item.nome}</h3>

              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CarroselMobile;
