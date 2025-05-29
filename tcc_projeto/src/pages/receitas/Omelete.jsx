import React from 'react';
import { Link } from 'react-router-dom';
import pudim from '../../assets/pudim.png'; // ajuste o caminho se estiver diferente


function PudimDeChia() {
  return (
    <div className="receita-detalhada">
      <Link to="/Receitas" className="voltar">← Voltar</Link>

      <h1>Pudim de Chia</h1>

      <img src={pudim} alt="Pudim de Chia" className="imagem-receita" />

      <p className="descricao">
        O pudim de chia é uma sobremesa saudável, feita com sementes de chia, leite (ou leite vegetal) e adoçante. 
        Ele é rico em fibras, ômega-3 e proteínas, formando uma textura cremosa e agradável ao paladar.
      </p>

      <h2>Ingredientes</h2>
      <ul>
        <li>3 colheres de sopa de sementes de chia</li>
        <li>1 xícara de leite vegetal (ou leite comum)</li>
        <li>1 colher de chá de mel ou outro adoçante</li>
        <li>Frutas frescas ou granola (opcional)</li>
      </ul>

      <h2>Modo de preparo</h2>
      <ol>
        <li>Misture todos os ingredientes em um pote com tampa.</li>
        <li>Deixe descansar por 5 minutos e mexa novamente.</li>
        <li>Leve à geladeira por pelo menos 4 horas (ou de um dia para o outro).</li>
        <li>Sirva com frutas ou granola por cima.</li>
      </ol>
    </div>
  );
}

export default PudimDeChia;
