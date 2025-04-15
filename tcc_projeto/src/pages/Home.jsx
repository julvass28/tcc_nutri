import Header from "../components/Header";
import onda from '../assets/img_png/onda.png'
import '../css/Home.css'
import foto from '../assets/img_png/foto_nutri.png';
import Button from '../components/Button';
import IconClinic from '../assets/img_png/icon-clinic.png';
import IconPediatria from '../assets/img_png/icon-pediatria.png';
import IconEsportivo from '../assets/img_png/icon-esportivo.png'
import IconEmagrecer from '../assets/img_png/icon-emagrecimento.png'
import IconIntolerancia from '../assets/img_png/icon-intolerancia.png'





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

            <div>
                <h2 className="especialidade">Qual o seu objetivo?</h2>
                <hr className="min-linha"/>

                <div className="categorias">


                    <div className="linha">

                        <div className="categoria">
                            <img src={IconClinic} alt="" />
                            <p>Nutrição Clínica</p>
                        </div>

                        <div className="categoria">
                            <img src={IconPediatria} alt="" />
                            <p>Nutrição Pediátrica</p>
                        </div>

                        <div className="categoria">
                            <img src={IconEsportivo} alt="" />
                            <p>Nutrição Esportiva</p>
                        </div>

                    </div>


                    <div className="linha linha-menor">

                        <div className="categoria">
                            <img src={IconEmagrecer} alt="" />
                            <p>Emagrecimento e Obesidade</p>
                        </div>

                        <div className="categoria">
                            <img src={IconIntolerancia} alt="" />
                            <p>Intolerâncias <br /> Alimentares</p>
                        </div>

                    </div>

                </div>
            </div>


        </>
    )
} export default Home;