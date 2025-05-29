import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importar useLocation para acessar a rota atual
import { LuStethoscope, LuBaby, LuDumbbell, LuHeartPulse, LuWheatOff } from 'react-icons/lu';
import '../../css/ReceitasClinicas.css';
import comida from '../../assets/comida.jpeg';
import smoothiee from '../../assets/smoothiee.png';
import barra from '../../assets/barra.png';
import bico from '../../assets/bico.png';
import pao from '../../assets/pao.png';

const categorias = [
  { nome: 'Clínica', icone: <LuStethoscope size={22} />, link: '/receitas/clinica' },
  { nome: 'Pediátrica', icone: <LuBaby size={22} />, link: '/receitas/pediatrica' },
  { nome: 'Esportiva', icone: <LuDumbbell size={22} />, link: '/receitas/esportiva' },
  { nome: 'Emagrecimento', icone: <LuHeartPulse size={22} />, link: '/receitas/emagrecimento' },
  { nome: 'Intolerâncias', icone: <LuWheatOff size={22} />, link: '/receitas/intolerancias' },
];


function ReceitasEsportivas() {
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
        <img src={smoothiee} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Smoothie Energético de Banana e Pasta de Amendoim</h2>
          <p>Um smoothie nutritivo e cremoso, perfeito para fornecer energia antes do treino ou recuperar os músculos após atividades intensas. A banana garante carboidratos naturais, enquanto a pasta de amendoim adiciona proteínas e gorduras boas.</p>
              <Link to="/SmoothieEnergetico" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={barra} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Barrinha Caseira de Cereal e Castanhas</h2>
          <p>Uma opção natural e saudável para lanches rápidos ou pré-treino. Diferente das versões industrializadas, essa barrinha é rica em fibras, proteínas e gorduras boas, garantindo energia e saciedade.</p>
             <Link to="/BarrinhaDeCereal" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={bico} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Hambúrguer de Grão-de-Bico</h2>
          <p>O hambúrguer de grão-de-bico é uma opção vegana e saudável, feito com grão-de-bico amassado, especiarias e outros ingredientes. Saboroso e nutritivo, é uma alternativa perfeita para quem busca uma refeição leve e rica em proteínas vegetais.</p>
              <Link to="/Hamburguer" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={pao} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Pão de Banana Fit</h2>
          <p>O Pão de Banana Fit é uma opção saudável, feito com bananas maduras, farinha integral e adoçante natural. É rico em fibras, vitaminas e minerais, perfeito para o café da manhã ou lanche. Além de ser fácil de preparar, pode ser feito sem glúten, sendo uma escolha nutritiva e saborosa.</p>
              <Link to="/PaoDeBanana" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>
    </div>
  );
}

export default ReceitasEsportivas;

