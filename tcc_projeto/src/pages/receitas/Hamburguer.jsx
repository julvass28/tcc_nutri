import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/ReceitaDetalhada.css';
import hgb from '../../assets/hgb.png';

function Hamburguer() {
  return (
    <div className="receita-container">
      <div className="banner">
        <img src={hgb} alt="Pudim de Chia" className="imagem-banner" />
        <h1 className="titulo-sobreposto">Hambúrguer de Grão-de-Bico</h1>
      </div>

      <div className="conteudo">
        <Link to="/Receitas" className="voltar">← Voltar</Link>

        <h2 className="subtitulo-rosa">Receita de Hambúrguer de Grão-de-Bico:</h2>

        <h3 className="subtitulo-verde">Ingredientes:</h3>
       <ul class="ingredientes">
          <li>1 xícara de grão-de-bico cozido e amassado</li>
          <li>1/2 cebola picada</li>
          <li>1 dente de alho amassado</li>
          <li>2 colheres (sopa) de farinha de aveia</li>
          <li>Sal, pimenta e temperos a gosto</li>
          <li>1 colher (chá) de azeite</li>
        </ul>

        <h3 className="subtitulo-verde">Modo de preparo:</h3>
        <ol className="passos">
          <li>Misture todos os ingredientes e modele hambúrgueres. </li>
          <li>Grelhe com azeite até dourar dos dois lados.</li>
          <li>Sirva no pão integral ou com salada.</li>
        </ol>

        <h3 className="subtitulo-verde">Dicas:</h3>
     <ul class="ingredientes">
          <li> Substitua a farinha de aveia por quinoa para mais proteína. </li>
            <li>Combine com abacate e tomate para um sanduíche nutritivo. </li>
        </ul>
      </div>
    </div>
  );
}

export default  Hamburguer;
