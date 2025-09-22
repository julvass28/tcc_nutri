import React from "react";
import "../css/SectionCalculators.css";
import { MdBalance } from "react-icons/md";
import { LuGlassWater } from "react-icons/lu";
import { PiForkKnifeFill } from "react-icons/pi";
import { FaRunning } from "react-icons/fa";
import { Link } from "react-router-dom";

function SectionCalculators() {
    return (
        <div className="container-total-calculadoras">
            <h1 id="titulo-principal-cal">Explore nossas Calculadoras Nutricionais!</h1>
            <section className="sessao-calculadoras-container">
                <div className="sessao-calculadoras-um">
                    <Link to="/calculadoras/consumo-agua" className="a-link-calculadoras">
                        <div className="sessao-calculadoras calculadora-agua">
                            <h1 id="titulo-agua">Calculadora de Consumo diário de Água</h1>
                            <p>Saiba quantos litros de agua precisa beber diariamente</p>
                            <div className="cont-bloco-icone-section">
                                <div className="bloco-icone"><LuGlassWater id="img-calculadoras" /></div>
                            </div>
                        </div>
                    </Link>
                    <Link to="/calculadoras/calorias-nutrientes" className="a-link-calculadoras">
                        <div className="sessao-calculadoras calculadora-nutrientes">
                            <h1 id="titulo-nutrientes">Calculadora de Calorias e Nutrientes</h1>
                            <p>Calcule as calorias e nutrientes dos alimentos consumidos no seu dia a dia.</p>
                            <div className="cont-bloco-icone-section">
                                <div className="bloco-icone"><PiForkKnifeFill id="img-calculadoras" /></div>
                            </div>
                        </div>
                    </Link>

                </div>
                <div className="sessao-calculadoras-dois">
                    <Link to="/calculadoras/gasto-calorico" className="a-link-calculadoras">
                        <div className="sessao-calculadoras calculadora-gasto">
                            <h1 id="titulo-gasto">Calculadora de Gastos Calorico</h1>
                            <p>Descubra quantas calorias seu corpo gasta por dia</p>
                            <div className="cont-bloco-icone-section">
                                <div className="bloco-icone"><FaRunning id="img-calculadoras" /></div>
                            </div>
                            
                        </div>
                    </Link>
                    <Link to="/calculadoras/imc" className="a-link-calculadoras">
                        <div className="sessao-calculadoras calculadora-imc">
                            <h1 id="titulo-imc">Calculadora de IMC & Peso Ideal</h1>
                            <p>Verifique se esta no peso adequado para sua altura</p>
                            <div className="cont-bloco-icone-section">
                                <div className="bloco-icone"><MdBalance id="img-calculadoras" /></div>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default SectionCalculators;