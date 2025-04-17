import React from 'react';
import '../css/Botao.css';

function Botao({ text = "Agendar Consulta", className = "" }) {
    return (
      <button className={className}>{text}</button>
    );
  }
  export default Botao