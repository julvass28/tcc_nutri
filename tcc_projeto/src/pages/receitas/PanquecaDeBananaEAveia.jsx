import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/ReceitaDetalhada.css';
import pa from '../../assets/pa.png';

function Crepioca() {
  return (
    <div className="receitas-container">
      <div className="receitas-banner">
        <img src={pa} alt="Pudim de Chia" className="receitas-imagem-banner" />
        <h1 className="receitas-titulo-sobreposto">Panqueca de Banana e Aveia</h1>
      </div>

      <div className="receitas-conteudo">
        <Link to="/receitas/pediatrica" className="receitas-voltar">← Voltar</Link>

        <h2 className="receitas-subtitulo-rosa">Receita de Panqueca de Banana e Aveia:</h2>

        <h3 className="receitas-subtitulo-verde">Ingredientes:</h3>
      <ul class="receitas-ingredientes">
          <li> 1 banana madura</li>
          <li> 1 ovo</li>
          <li> 3 colheres (sopa) de aveia em flocos</li>
          <li>1 colher (chá) de canela (opcional)</li>
          <li>1 colher (chá) de fermento (opcional)</li>
        </ul>

        <h3 className="receitas-subtitulo-verde">Modo de preparo:</h3>
        <ol className="receitas-passos">
          <li> Amasse a banana e misture com o ovo.</li>
          <li>Adicione a aveia, a canela e o fermento, mexendo bem.</li>
          <li>Aqueça uma frigideira antiaderente e despeje pequenas porções da massa.</li>
          <li>Cozinhe em fogo baixo por 2 minutos de cada lado até dourar.</li>
          <li>Sirva com frutas frescas ou mel natural.</li>

        </ol>

        <h3 className="receitas-subtitulo-verde">Dicas:</h3>
       <ul class="receitas-ingredientes">
          <li>Para uma versão mais proteica, adicione 1 colher de chia.</li>
           <li>Substitua a banana por maçã ralada para variar o sabor.</li>
        </ul>
      </div>
    </div>
  );
}

export default Crepioca;
