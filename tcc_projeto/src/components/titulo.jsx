import '../css/titulo.css';

function Titulo ({texto}){
    return(
        <>
         <h2 className="secao">{texto}</h2>
         <hr className="min-linha" />
        
        </>
    )
}export default Titulo