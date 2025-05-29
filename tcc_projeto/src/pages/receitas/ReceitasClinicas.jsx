import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importar useLocation para acessar a rota atual
import { LuStethoscope, LuBaby, LuDumbbell, LuHeartPulse, LuWheatOff } from 'react-icons/lu';
import '../../css/ReceitasClinicas.css';
import comida from '../../assets/comida.jpeg';
import pudim from '../../assets/pudim.png';
import chai from '../../assets/chai.png';
import crepe from '../../assets/crepe.png';
import chips from '../../assets/chips.png';

const categorias = [
  { nome: 'Clínica', icone: <LuStethoscope size={22} />, link: '/receitas/clinica' },
  { nome: 'Pediátrica', icone: <LuBaby size={22} />, link: '/receitas/pediatrica' },
  { nome: 'Esportiva', icone: <LuDumbbell size={22} />, link: '/receitas/esportiva' },
  { nome: 'Emagrecimento', icone: <LuHeartPulse size={22} />, link: '/receitas/emagrecimento' },
  { nome: 'Intolerâncias', icone: <LuWheatOff size={22} />, link: '/receitas/intolerancias' },
];

function ReceitasClinicas() {
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
          <p className="receitas-subtitulo">Confira as receitas que preparei para você</p>
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
        <img src={pudim} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Pudim de Chia</h2>
          <p>O pudim de chia é uma sobremesa saudável feita com sementes de chia, leite (ou leite vegetal) e adoçante. As sementes formam uma textura cremosa, rica em fibras, ômega-3 e proteínas. É uma opção nutritiva e versátil, podendo ser complementado com frutas ou granola.</p>
          <Link to="/receitas/info/PudimDeChia" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={chai} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Chai Latte</h2>
          <p>O chai latte é uma bebida de origem indiana feita com chá preto, especiarias (como canela e gengibre) e leite espumado. É cremosa, aromática e conhecida por seu sabor picante e reconfortante.</p>
          <Link to="/receitas/info/ChaiLatte" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={crepe} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Crepioca</h2>
          <p>A crepioca é uma mistura de tapioca e ovo, rápida e prática de fazer. É uma opção leve e versátil, podendo ser recheada com o que você preferir, como queijo, frango, legumes ou até doces.</p>
          <Link to="/receitas/info/Crepioca" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>

      <div className="pudim-container">
        <img src={chips} alt="Pudim de Chia" className="pudim-img" />
        <div className="pudim-conteudo">
          <h2>Chips de Batata-Doce Assados</h2>
          <p>Os chips de batata-doce assados são uma alternativa saudável e crocante aos salgadinhos tradicionais. Feitos no forno com azeite e temperos, são uma ótima opção de snack que combina sabor e nutrientes em um único prato.</p>
          <Link to="/receitas/info/ChipsDeBatata" className="receitas-leia-mais">Leia mais</Link>
        </div>
      </div>
    </div>
  );
}

export default ReceitasClinicas;
