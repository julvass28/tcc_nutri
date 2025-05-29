
import "../botao/botao.css";



function Botao({ children, className = "", ...props }) {
  return (
    <button className={`botao ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Botao;
