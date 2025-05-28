import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ReceitaDetalhada.css';
import s from '../assets/s.png';

function SmoothieDeMorangoEIogurt() {
  return (
    <div className="receita-container">
      <div className="banner">
        <img src={s} alt="Pudim de Chia" className="imagem-banner" />
        <h1 className="titulo-sobreposto">Smoothie de Morango e Iogurte  </h1>
      </div>

      <div className="conteudo">
        <Link to="/Receitas" className="voltar">← Voltar</Link>

        <h2 className="subtitulo-rosa">Receita de Smoothie de Morango e Iogurte :</h2>

        <h3 className="subtitulo-verde">Ingredientes:</h3>
       <ul class="ingredientes">
          <li>1 copo de iogurte natural</li>
          <li>5 morangos picados</li>
          <li>1 banana</li>
          <li>1 colher (sopa) de aveia</li>
          <li>Mel a gosto (opcional)</li>
         
        </ul>

        <h3 className="subtitulo-verde">Modo de preparo:</h3>
        <ol className="passos">
          <li>Bata todos os ingredientes no liquidificador até obter uma textura cremosa. Sirva gelado e aproveite!</li>
      
        </ol>

        <h3 className="subtitulo-verde">Dicas:</h3>
        <ul class="ingredientes">
          <li>Para uma versão mais refrescante, adicione gelo. </li>
            <li>Substitua os morangos por manga ou mamão para variar os sabores. </li>
        </ul>
      </div>
    </div>
  );
}

export default SmoothieDeMorangoEIogurt;

