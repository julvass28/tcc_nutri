import React from 'react';
import { Link } from 'react-router-dom';
import { LuListOrdered } from 'react-icons/lu';
import pdm from '../assets/pdm.png';
import '../css/ReceitaDetalhada.css';

function PudimDeChia() {
  return (
    <div className="receita-detalhada">
      <div className="topo">
        <img src={pdm} alt="Pudim de Chia" className="imagem-topo" />
        <h1 className="titulo-receita">Pudim de Chia</h1>
      </div>

      <Link to="/Receitas" className="voltar">← Voltar</Link>

      <h2 className="subtitulo-rosa">Receita de Pudim de Chia:</h2>

      <h3>Ingredientes:</h3>
      <ul>
        <li>3 colheres de sopa de sementes de chia</li>
        <li>1 xícara de leite (pode ser de vaca ou vegetal)</li>
        <li>1 colher de sopa de mel (ou outro adoçante a gosto)</li>
        <li>1/2 colher de chá de essência de baunilha (opcional)</li>
        <li>Frutas ou granola para decorar (opcional)</li>
      </ul>

      <h3>Modo de preparo:</h3>
      <ol className="passos">
        <li><LuListOrdered /> Misture todos os ingredientes (chia, leite, mel e baunilha) numa tigela ou jarra.</li>
        <li><LuListOrdered /> Deixe descansar na geladeira por pelo menos 2 horas ou durante a noite.</li>
        <li><LuListOrdered /> Sirva em taças ou potes individuais.</li>
        <li><LuListOrdered /> Decore com frutas frescas ou granola (opcional).</li>
      </ol>

      <h3>Dicas:</h3>
      <ul>
        <li>Para uma textura mais cremosa, bata no liquidificador antes de deixar na geladeira.</li>
        <li>Experimente outros sabores, como leite de coco ou cacau em pó para variações.</li>
      </ul>
    </div>
  );
}

export default PudimDeChia;
