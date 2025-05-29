import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/ReceitaDetalhada.css';
import pdm from '../../assets/pdm.png';

function PudimDeChia() {
  return (
    <div className="receitas-container">
      <div className="receitas-banner">
        <img src={pdm} alt="Pudim de Chia" className="receitas-imagem-banner" />
        <h1 className="receitas-titulo-sobreposto">Pudim de Chia</h1>
      </div>

      <div className="receitas-conteudo">
        <Link to="/receitas/clinica" className="receitas-voltar">← Voltar</Link>

        <h2 className="receitas-subtitulo-rosa">Receita de Pudim de Chia:</h2>

        <h3 className="receitas-subtitulo-verde">Ingredientes:</h3>
     <ul className="receitas-ingredientes">
          <li>3 colheres de sopa de sementes de chia</li>
          <li>1 xícara de leite (pode ser de vaca ou vegetal)</li>
          <li>1 colher de sopa de mel (ou outro adoçante a gosto)</li>
          <li>1/2 colher de chá de essência de baunilha (opcional)</li>
          <li>Frutas ou granola para decorar (opcional)</li>
        </ul>

        <h3 className="receitas-subtitulo-verde">Modo de preparo:</h3>
        <ol className="receitas-passos">
          <li>Misture todos os ingredientes (chia, leite, mel e baunilha) numa tigela ou jarra.</li>
          <li>Deixe descansar na geladeira por pelo menos 2 horas ou durante a noite.</li>
          <li>Sirva em taças ou potes individuais.</li>
          <li>Decore com frutas frescas ou granola (opcional).</li>
        </ol>

        <h3 className="receitas-subtitulo-verde">Dicas:</h3>
       <ul className="receitas-ingredientes">
          <li>Para uma textura mais cremosa, bata no liquidificador antes de deixar na geladeira.</li>
          <li>Experimente outros sabores, como leite de coco ou cacau em pó para variações.</li>
        </ul>
      </div>
    </div>
  );
}

export default PudimDeChia;
