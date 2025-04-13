import Header from "../components/Header";
import onda from '../assets/onda.png'
import '../css/Home.css'
import foto from '../assets/foto_nutri.png';
import Button from '../components/Button';





function Home(){
    return(
        <>
        <Header/>


         <div className="comeco">

        <div className="inicio">
        <img src={onda} alt="" className="onda"/>
        <h1 className="text-principal">Te ajudo a transformar sua alimentação <br/> de forma leve e sem complicações!</h1>
        </div>

        <div className="descricao">
            <img src={foto} alt="" className="foto" />
            <div className="sobre">
            <h2 id="primeiro-text">NUTRICIONISTA</h2>
           <h1 id="segundo-text">Natália Simanoviski</h1>
           <p id="terceiro-text">Cuidado nutricional personalizado para <br/> cada necessidade!</p>
           <Button className="botao"/>
           </div>
           
        </div>
        </div>
       

      
        
        </>
    )
}export default Home