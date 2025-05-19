import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../carrosel/mobile.css';
import Iconclinica from '../../assets/img_svg/clinic.svg?react';
import Iconesportiva from '../../assets/img_svg/esportiva.svg?react';
import Iconemagrecer from '../../assets/img_svg/emagrecimento.svg?react';
import Iconintolerancia from '../../assets/img_svg/intolerancia.svg?react';
import Iconpediatria from '../../assets/img_svg/pediatria.svg?react';
import Titulo from '../titulo/titulo';


function CarroselMobile({titulo}) {

  const [ativo, setAtivo] = useState(null);

  const dados = [
    { id: 1, icone: <Iconclinica />, titulo: "Nutrição Clínica" },
    { id: 2, icone: <Iconpediatria />, titulo: "Nutrição Pediátrica" },
    { id: 3, icone: <Iconesportiva />, titulo: "Nutrição Esportiva" },
    { id: 4, icone: <Iconemagrecer />, titulo: "Emagrecimento e Obesidade" },
    { id: 5, icone: <Iconintolerancia />, titulo: "Intolerâncias Alimentares" },
  ];

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
  <div className="carrosel-wrapper">
    <Titulo texto={titulo} mostrarLinha={true} />
    <Slider {...settings}>
  {dados.map((item) => (
    <div key={item.id} className='slide-container'>
      <div
        onClick={() => handleClick(item.id)}
        className={`card-mobile ${ativo === item.id ? "clicado" : ""}`}
      >
        <div className="icone-mob">{item.icone}</div>
        <h3>{item.titulo}</h3>
      </div>
    </div>
  ))}
</Slider>

  </div>
);

}

export default CarroselMobile;
