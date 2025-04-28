import React from 'react';
import "../botao/botao.css";

function Botao({children, className = "", ...props }) {
    return (
      <button className={className} {...props}>
        {children}
        </button>
    );
  }
  export default Botao;