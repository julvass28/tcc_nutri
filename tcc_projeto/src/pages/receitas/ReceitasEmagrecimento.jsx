import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importar useLocation para acessar a rota atual
import { LuStethoscope, LuBaby, LuDumbbell, LuHeartPulse, LuWheatOff } from 'react-icons/lu';
import '../../css/ReceitasClinicas.css';
import comida from '../../assets/comida.jpeg';
import suco from '../../assets/suco.png';
import salada from '../../assets/Salada.png';
import paoo from '../../assets/paoo.png';
import omelete from '../../assets/omelete.png';
import SectionCalculators from '../../components/SectionCalculators';

const categorias = [
  { nome: 'Clínica', icone: <LuStethoscope size={22} />, link: '/receitas/clinica' },
  { nome: 'Pediátrica', icone: <LuBaby size={22} />, link: '/receitas/pediatrica' },
  { nome: 'Esportiva', icone: <LuDumbbell size={22} />, link: '/receitas/esportiva' },
  { nome: 'Emagrecimento', icone: <LuHeartPulse size={22} />, link: '/receitas/emagrecimento' },
  { nome: 'Intolerâncias', icone: <LuWheatOff size={22} />, link: '/receitas/intolerancias' },
];

function ReceitasEmagrecimento() {
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
        <img src={suco} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Suco Detox de Couve com Limão</h2>
          <p>Esse suco é excelente para iniciar o dia, pois ajuda a desintoxicar o organismo, melhora a digestão e auxilia na eliminação de líquidos retidos. A couve é rica em fibras e antioxidantes, enquanto o limão contribui para a melhora da imunidade e do metabolismo.</p>
            <Link to="/Suco" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={salada} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Salada de Quinoa com Frango e Abacate</h2>
          <p>Essa salada é uma combinação perfeita de proteínas, gorduras boas e fibras, promovendo saciedade e fornecendo energia sem excessos calóricos. A quinoa é um superalimento rico em aminoácidos essenciais, e o abacate adiciona cremosidade e nutrientes essenciais.</p>
              <Link to="/SaladaDeQuinoa" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={paoo} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Pão Low Carb de Linhaça</h2>
          <p>Uma alternativa saudável ao pão tradicional, sem farinha refinada e rica em fibras e proteínas. A linhaça auxilia na regulação do intestino e ajuda a prolongar a saciedade, sendo ideal para quem busca perder peso.</p>
             <Link to="/PaoLowCarb" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={omelete} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Omelete de Claras com Espinafre </h2>
          <p>Uma opção proteica e de baixa caloria, perfeita para quem busca emagrecimento sem perder massa muscular. As claras são fonte de proteína pura, e o espinafre adiciona fibras, ferro e antioxidantes, auxiliando na saúde geral.</p>
             <Link to="/Omelete" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>
      <SectionCalculators />
    </div>
  );
}

export default ReceitasEmagrecimento;

