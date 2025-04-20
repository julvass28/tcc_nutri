import React, { useState } from 'react';
import {
    LuStethoscope,
    LuBaby,
    LuDumbbell,
    LuHeartPulse, // substituto aqui
    LuWheatOff,
  } from 'react-icons/lu';
  

import '../css/BarraDeReceitas.css';

const categorias = [
    { nome: 'Clínica', icone: <LuStethoscope size={22} /> },
    { nome: 'Pediátrica', icone: <LuBaby size={22} /> },
    { nome: 'Esportiva', icone: <LuDumbbell size={22} /> },
    { nome: 'Emagrecimento', icone: <LuHeartPulse size={22} /> }, // <-- aqui
    { nome: 'Intolerâncias', icone: <LuWheatOff size={22} /> },
  ];
  

 function BarraDeReceitas() {
  const [selecionada, setSelecionada] = useState('Clínica');

  return (
    <div className="barra-categorias">
      {categorias.map((cat, index) => (
        <button
          key={index}
          className={`categoria ${selecionada === cat.nome ? 'selecionada' : ''}`}
          onClick={() => setSelecionada(cat.nome)}
        >
          {cat.icone}
          <span>{cat.nome}</span>
        </button>
      ))}
    </div>
  );
}
export default BarraDeReceitas