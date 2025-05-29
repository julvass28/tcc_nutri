import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/ReceitaDetalhada.css';
import sme from '../../assets/sme.png';

function SmoothieEnergetico() {
  return (
    <div className="receita-container">
      <div className="banner">
        <img src={sme} alt="Pudim de Chia" className="imagem-banner" />
        <h1 className="titulo-sobreposto">Smoothie Energético de Banana e Pasta de Amendoim</h1>
      </div>

      <div className="conteudo">
        <Link to="/Receitas" className="voltar">← Voltar</Link>

        <h2 className="subtitulo-rosa">Receita de Smoothie Energético de Banana e Pasta de Amendoim:</h2>

        <h3 className="subtitulo-verde">Ingredientes:</h3>
  <ul class="ingredientes">
          <li>1 banana madura </li>
          <li>1 colher de sopa de pasta de amendoim </li>
          <li>1/2 xícara de leite (pode ser de amêndoas, coco ou o de sua preferência)</li>
          <li>1 colher de chá de mel ou adoçante natural (opcional)</li>
          <li> 1/4 de xícara de aveia em flocos (opcional, para mais fibras) Gelo (a gosto)</li>
          <li>1/2 colher de chá de canela (opcional, para um toque de sabor extra)</li>
        </ul>

        <h3 className="subtitulo-verde">Modo de preparo:</h3>
        <ol className="passos">
          <li>Coloque todos os ingredientes no liquidificador: a banana, a pasta de amendoim, o leite, o mel (se estiver usando), a aveia, o gelo e a canela.</li>
          <li>Bata até que a mistura fique cremosa e homogênea.</li>
          <li> Se necessário, adicione mais leite para ajustar a consistência. Sirva imediatamente e aproveite!.</li>
        </ol>

        <h3 className="subtitulo-verde">Dicas:</h3>
        <ul class="ingredientes">
          <li> Use banana congelada para deixar o smoothie mais cremoso e geladinho. </li>
            <li>Adicione uma pitada de canela para dar um toque extra de sabor e ajudar no metabolismo. </li>
        </ul>
      </div>
    </div>
  );
}

export default SmoothieEnergetico;
