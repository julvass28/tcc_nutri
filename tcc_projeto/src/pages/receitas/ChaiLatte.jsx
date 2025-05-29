import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/ReceitaDetalhada.css';
import ch from '../../assets/ch.png';

function ChaiLatte() {
  return (
    <div className="receita-container">
      <div className="banner">
        <img src={ch} alt="Pudim de Chia" className="imagem-banner" />
        <h1 className="titulo-sobreposto">Chai Latte</h1>
      </div>

      <div className="conteudo">
        <Link to="/Receitas" className="voltar">← Voltar</Link>

        <h2 className="subtitulo-rosa">Receita de Chai Latte:</h2>

        <h3 className="subtitulo-verde">Ingredientes:</h3>
      <ul class="ingredientes">
          <li>1 xícara de leite (pode ser leite de vaca ou leite vegetal, como amêndoa, aveia ou soja)</li>
          <li>1 sachê de chá chai (ou 1 colher de chá de chá preto misturado com especiarias como canela, cravo, gengibre e cardamomo)</li>
          <li>1/4 xícara de água</li>
          <li>1 colher de chá de mel ou açúcar (opcional, dependendo do seu gosto)</li>
          <li>Canela em pó para decorar (opcional)</li>
        </ul>

        <h3 className="subtitulo-verde">Modo de preparo:</h3>
        <ol className="passos">
          <li>Em uma panela pequena, adicione a água e o chá chai (ou as especiarias se estiver usando chá preto solto). Aqueça até começar a ferver.</li>
          <li>Deixe ferver por 3 a 5 minutos para que as especiarias liberem seu sabor.</li>
          <li>Enquanto o chá ferve, adicione o leite de sua escolha a outra panela e aqueça em fogo baixo até que comece a soltar vapor, mas sem ferver.</li>
          <li>Coe o chá para remover as folhas e as especiarias.</li>
          <li>Combine o chá coado com o leite aquecido e adicione o mel ou açúcar, se desejar.</li>
          <li>Misture bem e despeje em uma xícara.</li>
          <li>Polvilhe um pouco de canela por cima para decorar, se preferir.Agora é só aproveitar o seu chai latte! Ele é perfeito para relaxar, especialmente em dias mais frios.</li>
        </ol>

        <h3 className="subtitulo-verde">Dicas:</h3>
  <ul class="ingredientes">
          <li>
          Para um sabor mais intenso, deixe o chá e as especiarias em infusão por mais tempo.</li>
          <li>Use um mixer ou bata o leite para criar uma espuma cremosa no chai latte.</li>
        </ul>
      </div>
    </div>
  );
}

export default ChaiLatte;