import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ReceitaDetalhada.css';
import chp from '../assets/chp.png';

function Crepioca() {
  return (
    <div className="receita-container">
      <div className="banner">
        <img src={chp} alt="Pudim de Chia" className="imagem-banner" />
        <h1 className="titulo-sobreposto">Chips de Bata-Doce Assados</h1>
      </div>

      <div className="conteudo">
        <Link to="/Receitas" className="voltar">← Voltar</Link>

        <h2 className="subtitulo-rosa">Receita de Chips de Bata-doce Assados:</h2>

        <h3 className="subtitulo-verde">Ingredientes:</h3>
       <ul class="ingredientes">
          <li> 2 batatas-doces médias</li>
          <li> 1 colher de sopa de azeite de oliva</li>
          <li> Sal a gosto</li>
          <li>Pimenta-do-reino a gosto (opcional)</li>
          <li>Ervas finas ou temperos de sua preferência (como alecrim, orégano ou pimentão).</li>
        </ul>

        <h3 className="subtitulo-verde">Modo de preparo:</h3>
        <ol className="passos">
          <li> Preaqueça o forno a 180°C.</li>
          <li>Lave bem as batatas-doces e, se preferir, pode deixar a casca. Se não gostar da casca, pode descascar.</li>
          <li>Corte as batatas em fatias finas, o mais uniforme possível, para que as chips assem de forma igual.</li>
          <li>Coloque as fatias de batata-doce em uma tigela e regue com o azeite de oliva.</li>
          <li>Tempere com sal, pimenta-do-reino e as ervas ou temperos de sua preferência. Misture bem para que todas as fatias fiquem temperadas de maneira uniforme.</li>
          <li>Forre uma assadeira com papel manteiga e distribua as fatias de batata-doce de forma que não fiquem sobrepostas. Isso ajuda a ficarem crocantes.</li>
          <li>Leve ao forno preaquecido por cerca de 25-30 minutos. A cada 10 minutos, vire as fatias para garantir que as chips assem por igual. Fique de olho para evitar que queimem.</li>
          <li>Quando as chips estiverem douradas e crocantes, retire do forno e deixe esfriar por alguns minutos.Agora é só aproveitar! Essas chips de batata-doce assadas ficam crocantes, saborosas e são uma ótima opção de snack saudável.</li>
        </ol>

        <h3 className="subtitulo-verde">Dicas:</h3>
      <ul class="ingredientes">
          <li>Para chips mais crocantes, deixe as fatias secarem em papel-toalha antes de assar.</li>
           <li>Vire os chips na metade do tempo para dourar por igual.</li>
        </ul>
      </div>
    </div>
  );
}

export default Crepioca;
