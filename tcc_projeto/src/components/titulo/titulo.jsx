import './titulo.css';

function Titulo({ texto, className = "", subtitulo, mostrarLinha = true }) {
  return (
    <>
      <h2 className={`titulo-principal ${className}`}>{texto}</h2>
      {subtitulo && <p className="subtitulo">{subtitulo}</p>}
      {mostrarLinha && <hr className="min-linha" />}
    </>
  );
}

export default Titulo;
