import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/ReceitaDetalhada.css';
import bc from '../../assets/bc.png';

function BoloDeCenoura() {
  return (
    <div className="receitas-container">
      <div className="receitas-banner">
        <img src={bc} alt="Pudim de Chia" className="receitas-imagem-banner" />
        <h1 className="receitas-titulo-sobreposto">Bolinho de Cenoura Assado</h1>
      </div>

      <div className="receitas-conteudo">
        <Link to="/receitas/pediatrica" className="receitas-voltar">← Voltar</Link>

        <h2 className="receitas-subtitulo-rosa">Receita de Bolinho de Cenoura Assado:</h2>

        <h3 className="receitas-subtitulo-verde">Ingredientes:</h3>
       <ul className="receitas-ingredientes">
          <li>2 cenouras médias raladas</li>
          <li>2 ovos</li>
          <li>1/2 xícara de farinha de aveia</li>
          <li>1/2 xícara de farinha de trigo integral</li>
          <li>1/3 xícara de mel ou açúcar mascavo</li>
          <li>1/4 xícara de óleo de coco</li>
          <li>1 colher (chá) de fermento</li>
        </ul>

        <h3 className="receitas-subtitulo-verde">Modo de preparo:</h3>
        <ol className="receitas-passos">
          <li>Bata todos os ingredientes no liquidificador até formar uma massa homogênea.</li>
          <li>Despeje em forminhas de cupcake untadas.</li>
          <li>Asse em forno preaquecido a 180°C por 20-25 minutos.</li>
          <li>Deixe esfriar antes de servir.</li>
        </ol>

        <h3 className="receitas-subtitulo-verde">Dicas:</h3>
    <ul className="receitas-ingredientes">
          <li>Para uma versão sem glúten, use apenas farinha de aveia. </li>
            <li>Pode ser servido com um creme de cacau e abacate para uma cobertura saudável. </li>
        </ul>
      </div>
    </div>
  );
}

export default BoloDeCenoura;
