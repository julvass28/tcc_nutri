import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ReceitaDetalhada.css';
import bc from '../assets/bc.png';

function BoloDeCenoura() {
  return (
    <div className="receita-container">
      <div className="banner">
        <img src={bc} alt="Pudim de Chia" className="imagem-banner" />
        <h1 className="titulo-sobreposto">Bolinho de Cenoura Assado</h1>
      </div>

      <div className="conteudo">
        <Link to="/Receitas" className="voltar">← Voltar</Link>

        <h2 className="subtitulo-rosa">Receita de Bolinho de Cenoura Assado:</h2>

        <h3 className="subtitulo-verde">Ingredientes:</h3>
       <ul class="ingredientes">
          <li>2 cenouras médias raladas</li>
          <li>2 ovos</li>
          <li>1/2 xícara de farinha de aveia</li>
          <li>1/2 xícara de farinha de trigo integral</li>
          <li>1/3 xícara de mel ou açúcar mascavo</li>
          <li>1/4 xícara de óleo de coco</li>
          <li>1 colher (chá) de fermento</li>
        </ul>

        <h3 className="subtitulo-verde">Modo de preparo:</h3>
        <ol className="passos">
          <li>Bata todos os ingredientes no liquidificador até formar uma massa homogênea.</li>
          <li>Despeje em forminhas de cupcake untadas.</li>
          <li>Asse em forno preaquecido a 180°C por 20-25 minutos.</li>
          <li>Deixe esfriar antes de servir.</li>
        </ol>

        <h3 className="subtitulo-verde">Dicas:</h3>
    <ul class="ingredientes">
          <li>Para uma versão sem glúten, use apenas farinha de aveia. </li>
            <li>Pode ser servido com um creme de cacau e abacate para uma cobertura saudável. </li>
        </ul>
      </div>
    </div>
  );
}

export default BoloDeCenoura;
