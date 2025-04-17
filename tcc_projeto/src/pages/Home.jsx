import Header from "../components/Header";
import onda from '../assets/img_png/onda.png'
import '../css/Home.css'
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import foto from '../assets/img_png/foto_nutri.png';
import Button from '../components/Button';
import foto_nutri from '../assets/img_png/ft-nutri.png'
import { ReactComponent as Iconclinica } from '../assets/img_svg/clinic.svg';
import Titulo from "../components/titulo";
import { ReactComponent as Iconesportiva } from '../assets/img_svg/esportiva.svg';
import { ReactComponent as Iconemagrecer } from '../assets/img_svg/emagrecimento.svg';
import { ReactComponent as Iconintolerancia } from '../assets/img_svg/intolerancia.svg';
import dieta from '../assets/img_png/dieta.png';
import acompanhamento from '../assets/img_png/acompanhamento.png';
import peso from '../assets/img_png/peso.png';
import refeicao from '../assets/img_png/refeicao.png';




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
                        <Button />
                    </div>
                </div>
            </div>

            <div className="secao">
                <Titulo texto="Qual o seu bjetivo?" />

                <div className="categorias">


                    <div className="linha">

                        <div className="categoria">
                            <Iconclinica className="icone" />
                            <p>Nutrição Clínica</p>
                        </div>

                        <div className="categoria">

                            <p>Nutrição Pediátrica</p>
                        </div>

                        <div className="categoria">
                            <Iconesportiva className="icone" />
                            <p>Nutrição Esportiva</p>
                        </div>

                    </div>


                    <div className="linha linha-menor">

                        <div className="categoria">
                            <div className="conteudo-categoria">
                                <Iconemagrecer className="icone" />
                                <p>Emagrecimento <br />e Obesidade</p>
                            </div>
                        </div>

                        <div className="categoria">
                            <div className="conteudo-categoria">
                                <Iconintolerancia className="icone" />
                                <p>Intolerâncias <br /> Alimentares</p>
                            </div>
                        </div>
                    </div>
                    <Button className="btn-um" />
                </div>

            </div>

            <div className="sobre-nutri">
                <div className="infos-dois">
                    <h2 className="primeiro-text text-small">Olá, eu sou a</h2>
                    <h2 className="segundo-text text-medium">Nutricionista</h2>
                    <h2 className="segundo-text text-large">Natália Simanoviski</h2>
                    <p className="terceiro-text small">Sou nutricionista <span className="color-text"> apaixonada por transformar <br />
                        a alimentação em algo leve e equilibrado.</span> Além
                        <br /> de nutri, quero ser sua amiga nessa jornada.<br />
                        Vamos juntos?</p>
                    <Button className="btn-dois" text="+Sobre Mim" />
                </div>

                <div className="foto-nutri">
                    <img src={foto_nutri} alt="" />

                </div>
            </div>

            <div className="secao sobre-consulta">
                <Titulo texto="Plano Nutricional Feito Para Você!" />

                <div className="planejamento">

                    <div className="item">
                        <div className="img-wrapper">
                            <img src={dieta} alt="" />
                        </div>
                        <p>Dieta Personalizado</p>
                    </div>

                    <div className="item">
                        <div className="img-wrapper">
                            <img src={acompanhamento} alt="" />
                        </div>
                        <p>Acompanhamento Contínuo</p>
                    </div>


                    <div className="item">
                        <div className="img-wrapper">
                            <img src={peso} alt="" />
                        </div>
                        <p>Controle de Peso</p>
                    </div>


                    <div className="item">
                        <div className="img-wrapper">
                            <img src={refeicao} alt="" />
                        </div>
                        <p>Planejamento de Refeições</p>
                    </div>


                </div>
            </div>

            <div className="secao funcionamento">

                <div className="topic">

                    <Titulo className="text-topic" texto="Como Funciona Meu Atendimento Online?" />

                    <p><IoIosCheckmarkCircleOutline />Anamnese Nutricional</p>
                    <p><IoIosCheckmarkCircleOutline />Avaliação Física e Nutricional</p>
                    <p><IoIosCheckmarkCircleOutline />Consulta Online</p>
                    <p><IoIosCheckmarkCircleOutline />Estratégia Alimentar Individualizada</p>
                    <p><IoIosCheckmarkCircleOutline />Acompanhamento Contínuo</p>
                    <Button text="Saiba Mais" />
                </div>
            </div>

            <div className="dicas">


            </div>

        </>
    )
} export default Home;