import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/ReceitaDetalhada.css';
import pb from '../../assets/pb.png';

function PaoDeBanana() {
  return (
    <div className="receita-container">
      <div className="banner">
        <img src={pb} alt="Pudim de Chia" className="imagem-banner" />
        <h1 className="titulo-sobreposto">Pão de Banana Fit </h1>
      </div>

      <div className="conteudo">
        <Link to="/Receitas" className="voltar">← Voltar</Link>

        <h2 className="subtitulo-rosa">Receita de Pão de Banana Fit:</h2>

        <h3 className="subtitulo-verde">Ingredientes:</h3>
     <ul class="ingredientes">
          <li>2 bananas maduras amassadas</li>
          <li>2 ovos</li>
          <li>1 xícara de aveia em flocos</li>
          <li>1 colher (chá) de canela</li>
          <li>1 colher (chá) de fermento</li>
          <li>1 colher (sopa) de mel (opcional)</li>
        </ul>

        <h3 className="subtitulo-verde">Modo de preparo:</h3>
        <ol className="passos">
          <li>Misture todos os ingredientes até obter uma massa homogênea. </li>
          <li>Despeje em uma forma untada.</li>
          <li>Asse a 180°C por 30 minutos.</li>
        </ol>

        <h3 className="subtitulo-verde">Dicas:</h3>
       <ul class="ingredientes">
          <li> Adicione castanhas ou chocolate 70% para mais sabor. </li>
            <li>Sirva com pasta de amendoim para mais energia.</li>
        </ul>
      </div>
    </div>
  );
}

export default  PaoDeBanana;
