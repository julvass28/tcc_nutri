import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LuStethoscope, LuBaby, LuDumbbell, LuHeartPulse, LuWheatOff } from 'react-icons/lu';
import '../css/BarraDeReceitas.css';


const categorias = [
  { nome: 'Clínica', icone: <LuStethoscope size={22} />, link: '/receitas' },
  { nome: 'Pediátrica', icone: <LuBaby size={22} />, link: '/receitas/pediatrica' },
  { nome: 'Esportiva', icone: <LuDumbbell size={22} />, link: '/receitas/esportiva' },
  { nome: 'Emagrecimento', icone: <LuHeartPulse size={22} />, link: '/receitas/emagrecimento' },
  { nome: 'Intolerâncias', icone: <LuWheatOff size={22} />, link: '/receitas/intolerancias' },
];

function BarraDeReceitas() {
  const [selecionada, setSelecionada] = useLocation('Clínica');

  return (
     <div className="barra-categorias">
            {categorias.map((cat, index) => (
              <Link
                key={index}
                to={cat.link}
                className={`categoria ${location.pathname === cat.link ? 'selecionada' : ''}`}
              >
                {cat.icone}
                <span>{cat.nome}</span>
              </Link>
            ))}
          </div>
  );
}

export default BarraDeReceitas;