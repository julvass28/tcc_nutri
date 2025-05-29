import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/ReceitaDetalhada.css';
import ng from '../../assets/ng.png';

function Nuggets() {
  return (
    <div className="receita-container">
      <div className="banner">
        <img src={ng} alt="Pudim de Chia" className="imagem-banner" />
        <h1 className="titulo-sobreposto">Nuggets de Frango Saudáveis </h1>
      </div>

      <div className="conteudo">
        <Link to="/Receitas" className="voltar">← Voltar</Link>

        <h2 className="subtitulo-rosa">Receita de Nuggets de Frango Saudáveis :</h2>

        <h3 className="subtitulo-verde">Ingredientes:</h3>
       <ul class="ingredientes">
          <li>1 peito de frango cozido e desfiado</li>
          <li>1 batata-doce cozida e amassada</li>
          <li>1 colher (sopa) de azeite de oliva</li>
          <li>1/2 xícara de farinha de aveial</li>
          <li>Temperos naturais a gosto (orégano, cúrcuma, alho em pó)</li>
         
        </ul>

        <h3 className="subtitulo-verde">Modo de preparo:</h3>
        <ol className="passos">
          <li>Misture todos os ingredientes até formar uma massa moldável.</li>
          <li>Modele os nuggets e passe em mais um pouco de farinha de aveia para empanar.</li>
          <li>Leve ao forno preaquecido a 180°C por 20 minutos ou até dourar.</li>
          <li>Sirva com molho natural de iogurte. </li>
        </ol>

        <h3 className="subtitulo-verde">Dicas:</h3>
     <ul class="ingredientes">
          <li>Para deixar mais crocante, passe os nuggets em farinha de linhaça antes de assar. </li>
            <li>Adicione cenoura ralada à massa para mais nutrientes. </li>
        </ul>
      </div>
    </div>
  );
}

export default Nuggets;

