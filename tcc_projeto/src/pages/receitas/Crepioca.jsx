import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/ReceitaDetalhada.css';
import cp from '../../assets/cp.png';

function Crepioca() {
  return (
    <div className="receita-container">
      <div className="banner">
        <img src={cp} alt="Pudim de Chia" className="imagem-banner" />
        <h1 className="titulo-sobreposto">Crepioca</h1>
      </div>

      <div className="conteudo">
        <Link to="/Receitas" className="voltar">← Voltar</Link>

        <h2 className="subtitulo-rosa">Receita de Crepioca:</h2>

        <h3 className="subtitulo-verde">Ingredientes:</h3>
      <ul class="ingredientes">
          <li>2 colheres de sopa de goma de tapioca</li>
          <li>1 ovo</li>
          <li>Sal a gosto</li>
          <li>Óleo ou manteiga para untar a frigideira</li>
        </ul>

        <h3 className="subtitulo-verde">Modo de preparo:</h3>
        <ol className="passos">
          <li>Em uma tigela, bata o ovo e adicione as 2 colheres de goma de tapioca. Misture bem até que a massa fique homogênea. Se quiser, pode adicionar uma pitada de sal para dar um gostinho.</li>
          <li>Aqueça uma frigideira antiaderente em fogo médio e unte com um pouco de óleo ou manteiga.</li>
          <li>Despeje a mistura de tapioca e ovo na frigideira e espalhe bem para cobrir todo o fundo.</li>
          <li>Cozinhe por cerca de 2-3 minutos de cada lado, até que fique dourada e firme.</li>
        </ol>

        <h3 className="subtitulo-verde">Dicas:</h3>
      <ul class="ingredientes">
          <li> Você pode comer assim mesmo ou recheá-la com o que quiser, como queijo, frango, legumes, ou até mesmo algo doce, como mel ou frutas.</li>
        </ul>
      </div>
    </div>
  );
}

export default Crepioca;
