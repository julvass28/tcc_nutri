import { Link } from 'react-router-dom';
import "../botao/botao.css";

function Botao({ children, className = "", to, ...props }) {
  const classes = `botao ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Botao;
