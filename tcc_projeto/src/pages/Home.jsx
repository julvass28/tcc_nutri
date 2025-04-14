import Header from "../components/Header";
import onda from '../assets/img_png/onda.png'
import '../css/Home.css'
import foto from '../assets/img_png/foto_nutri.png';
import Button from '../components/Button';





function Home() {
    return (
        <>
            <Header />
            <div className="comeco">
                <div className="inicio">
                    <img src={onda} alt="" className="onda" />
                    <h1 className="text-principal">Te ajudo a transformar sua alimentação <br /> de forma leve e sem complicações!</h1>
                </div>

                <div className="descricao">
                    <div className="infos">
                        <img src={foto} alt="" className="foto" />
                        <h2 className="num">CRN : 37892</h2>
                    </div>
                    <div className="sobre">
                        <h2 className="primeiro-text">NUTRICIONISTA</h2>
                        <h1 className="segundo-text">Natália Simanoviski</h1>
                        <p className="terceiro-text">Cuidado nutricional personalizado para <br /> cada necessidade!</p>
                        <Button className="botao" />
                    </div>
                </div>
            </div>

            <div className="especialidades">
           <h2>Qual o seu objetivo?</h2>

          <div className="categorias">
        
          </div>
          
            </div>




        </>
    )
} export default Home;