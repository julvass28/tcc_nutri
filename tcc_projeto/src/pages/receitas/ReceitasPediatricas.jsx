import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importar useLocation para acessar a rota atual
import { LuStethoscope, LuBaby, LuDumbbell, LuHeartPulse, LuWheatOff } from 'react-icons/lu';
import '../../css/ReceitasClinicas.css';
import comida from '../../assets/comida.jpeg';
import panqueca from '../../assets/panqueca.png';
import bolinho from '../../assets/bolinho.png';
import nuggets from '../../assets/nuggets.png';
import smoothie from '../../assets/smoothie.png';
import SectionCalculators from '../../components/SectionCalculators';

const categorias = [
  { nome: 'Clínica', icone: <LuStethoscope size={22} />, link: '/receitas/clinica' },
  { nome: 'Pediátrica', icone: <LuBaby size={22} />, link: '/receitas/pediatrica' },
  { nome: 'Esportiva', icone: <LuDumbbell size={22} />, link: '/receitas/esportiva' },
  { nome: 'Emagrecimento', icone: <LuHeartPulse size={22} />, link: '/receitas/emagrecimento' },
  { nome: 'Intolerâncias', icone: <LuWheatOff size={22} />, link: '/receitas/intolerancias' },
];

function ReceitasPediatricas() {
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
        <img src={panqueca} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Panqueca de Banana e Aveia</h2>
          <p>Uma panqueca nutritiva, macia e naturalmente doce, sem açúcar refinado. A banana fornece energia e fibras, enquanto a aveia contribui para a saciedade e o bom funcionamento intestinal. Fácil de fazer, é uma excelente opção para café da manhã ou lanche da tarde.</p>
          <Link to="/receitas/info/PanquecaDeBananaEAveia" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={bolinho} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Bolinho de Cenoura Assado</h2>
          <p>Uma versão saudável do clássico bolo de cenoura, sem excesso de açúcar e assado em porções individuais. A cenoura é rica em vitamina A, essencial para a visão e a imunidade das crianças. O uso de farinhas integrais aumenta a quantidade de fibras, garantindo mais saciedade e equilíbrio nutricional.</p>
         <Link to="/receitas/info/BoloDeCenoura" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={nuggets} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Nuggets de Frango Saudáveis</h2>
          <p> Uma alternativa nutritiva e crocante aos nuggets industrializados, sem fritura e com ingredientes naturais. O frango fornece proteínas para o crescimento e desenvolvimento infantil, enquanto a batata-doce adiciona fibras e energia de qualidade. Perfeito para um almoço ou jantar equilibrado.</p>
        <Link to="/receitas/info/Nuggets" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={smoothie} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Smoothie de Morango e Iogurte</h2>
          <p>Uma bebida cremosa, refrescante e rica em cálcio, perfeita para um lanche nutritivo. O iogurte natural fortalece a saúde intestinal e os ossos, enquanto as frutas oferecem vitaminas e antioxidantes essenciais para a imunidade das crianças. Pode ser servido como sobremesa saudável ou como complemento no café da manhã.</p>
         <Link to="/receitas/info/SmoothieDeMorango" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>
      <SectionCalculators />
    </div>
  );
}

export default ReceitasPediatricas;
