import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/ReceitaDetalhada.css';
import br from '../../assets/br.png';

function BarrinhaDeCereal() {
  return (
    <div className="receita-container">
      <div className="banner">
        <img src={br} alt="Pudim de Chia" className="imagem-banner" />
        <h1 className="titulo-sobreposto">Barrinha Caseira de Cereal e Castanhas</h1>
      </div>

      <div className="conteudo">
        <Link to="/Receitas" className="voltar">← Voltar</Link>

        <h2 className="subtitulo-rosa">Receita de Barrinha Caseira de Cereal e Castanhas:</h2>

        <h3 className="subtitulo-verde">Ingredientes:</h3>
      <ul class="ingredientes">
          <li>1 xícara de aveia em flocos</li>
          <li>1/2 xícara de pasta de amendoim ou castanha</li>
          <li>1/4 xícara de mel ou xarope de agave</li>
          <li>1/2 xícara de castanhas picadas (amêndoas, nozes, castanha-do-pará)</li>
          <li>2 colheres (sopa) de sementes (chia, linhaça ou girassol)</li>
          <li>50g de chocolate 70% derretido (opcional)</li>
        </ul>

        <h3 className="subtitulo-verde">Modo de preparo:</h3>
        <ol className="passos">
          <li>Misture todos os ingredientes até formar uma massa firme. Espalhe sobre uma assadeira forrada com papel manteiga e leve à geladeira por 2 horas. </li>
          <li>Depois, corte em barrinhas e armazene na geladeira.</li>
        </ol>

        <h3 className="subtitulo-verde">Dicas:</h3>
       <ul class="ingredientes">
          <li> Para mais proteína, adicione whey protein ou colágeno à receita. </li>
            <li>Cubra com chocolate amargo derretido para um toque especial. </li>
        </ul>
      </div>
    </div>
  );
}

export default  BarrinhaDeCereal;
