import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importar useLocation para acessar a rota atual
import { LuStethoscope, LuBaby, LuDumbbell, LuHeartPulse, LuWheatOff } from 'react-icons/lu';
import '../../css/ReceitasClinicas.css';
import comida from '../../assets/comida.jpeg';
import leite from '../../assets/leite.png';
import paodq from '../../assets/paodq.png';
import bolo from '../../assets/bolo.png';
import panquecab from '../../assets/panquecab.png';
import SectionCalculators from '../../components/SectionCalculators';

const categorias = [
  { nome: 'Clínica', icone: <LuStethoscope size={22} />, link: '/receitas/clinica' },
  { nome: 'Pediátrica', icone: <LuBaby size={22} />, link: '/receitas/pediatrica' },
  { nome: 'Esportiva', icone: <LuDumbbell size={22} />, link: '/receitas/esportiva' },
  { nome: 'Emagrecimento', icone: <LuHeartPulse size={22} />, link: '/receitas/emagrecimento' },
  { nome: 'Intolerâncias', icone: <LuWheatOff size={22} />, link: '/receitas/intolerancias' },
];

function ReceitasIntolerancias() {
  const location = useLocation(); // Usar useLocation para pegar a localização atual da rota

  return (
    <div>
      <div className='receitas-img'>
        <img className='receitas-comida-img'
          src={comida}
          alt="Imagem de comida"
          style={{ width: '100%', height: 'auto', display: 'block' }} />

        <div className="receitas-texto">
          <h3 className="receitas-titulo">Receitinhas</h3>
          <p className="receitas-subtitulo">Confira as receitas que preparei pra você</p>
        </div>
      </div>

      <div className="receitas-barra-categorias">
        {categorias.map((cat, index) => (
          <Link
            key={index}
            to={cat.link}
            className={`receitas-categoria ${location.pathname === cat.link ? 'selecionada' : ''}`}
          >
            {cat.icone}
            <span>{cat.nome}</span>
          </Link>
        ))}
      </div>

      <div className="receitas-frase">
        <h3 className="receitas-titulo-frase">
          Comer bem não precisa ser complicado. Com receitas nutritivas e equilibradas, <br />
          é possível manter uma alimentação saudável sem abrir mão do sabor.<br />
          Experimente novas combinações e descubra <br />
          receitinhas deliciosas!
        </h3>
      </div>

      <div className='receitas-linha'></div>

      <h1 className='receitas-sus'> Sugestões deliciosas </h1>

      {/* Sugestões de receitas */}
      <div className="pudim-container">
        <img src={leite} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Leite de Amêndoas Caseiro</h2>
          <p className="indicacao">Indicação: Intolerância à lactose</p> 
          <p>Uma alternativa vegetal ao leite de vaca, ideal para quem não pode consumir laticínios. Rico em gorduras boas e sem aditivos químicos.</p>
       <Link to="/LeiteDeAmendoas" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={paodq} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Pão de Queijo Vegano</h2>
          <p className="indicacao">Indicação:  Intolerância ao glúten e à lactose</p> 
          <p>Uma versão saudável do pão de queijo tradicional, sem queijo e sem farinha de trigo, mas com a mesma textura macia e saborosa.</p>
          <Link to="/PaoDeQueijo" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={bolo} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Bolo de Cacau Sem Ovo e Sem Leite</h2>
          <p className="indicacao">Indicação: Intolerância à lactose e alergia ao ovo</p> 
          <p>Um bolo fofinho e saboroso feito sem ovos ou leite, perfeito para quem tem restrições alimentares, mas não abre mão de um doce saudável.</p>
          <Link to="/BoloDeCacau" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={panquecab} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Panqueca de Banana  </h2>
          <p className="indicacao">Indicação: Intolerância ao glúten e à lactose</p> 
          <p>Essa panqueca é uma ótima opção para um café da manhã nutritivo e leve. Feita sem farinha de trigo e sem leite, é rica em fibras e energia natural da banana.</p>
          <Link to="/PanquecaDeBanana" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>
      <SectionCalculators />
    </div>
  );
}

export default ReceitasIntolerancias;