import { useState } from "react";
import "../css/IMCeAgua.css";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdBalance } from "react-icons/md";
import { LuGlassWater } from "react-icons/lu";
import { PiForkKnifeFill } from "react-icons/pi";
import { FaRunning } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Botao from "../components/botao/Botao";

function AGUACalculator() {

    const [idade, setIdade] = useState("")
    const [peso, setPeso] = useState("")
    const [mlTotal, setMlTotal] = useState("")
    const [aguaLitros, setAguaLitros] = useState("")
    const [erros, setErros] = useState("")


    function calcularAgua() {

        const novosErros = {}
        if (!idade) novosErros.idade = true
        if (!peso) novosErros.peso = true
        setErros(novosErros)
        if (Object.keys(novosErros).length > 0) return;
        let ml = 0
        if (idade <= 8) {
            ml = 50
        } else if (idade <= 18) {
            ml = 40
        } else if (idade <= 55) {
            ml = 35
        } else if (idade <= 65) {
            ml = 30
        } else {
            ml = 25
        }
        const totalMl = peso * ml
        const totalLitros = (totalMl / 1000).toFixed(2)
        setMlTotal(totalMl)
        setAguaLitros(totalLitros)
    }

    function reCalcular() {
        setIdade("")
        setPeso("")
        setMlTotal("")
        setAguaLitros("")
        setErros({})
    }

    return (
        <div className="imc-container">
            <div className="titulo-mais-icone">
                <div id="container-calculator-icon"><LuGlassWater id="img-calculator-icon" /></div>
                <h1 id="titulo-calculadora">Calculadora de consumo diário de água</h1>
            </div>
            <h3 id="text-titulo-calculadora">Quer saber quantos litros de água precisa beber diariamente? Utilize nossa calculadora e descubra se está ingerindo a quantidade de água suficiente de acordo com sua idade e peso.</h3>
            <div className="info-imc-container info-pag-agua">

                <div id="div-geral" className={`input-group ${erros.idade ? "erro" : ""}`}>
                    <label id="label-idade" className={idade ? 'label ativa' : 'label'}>Idade:</label>
                    <div className={idade ? 'input-container preenchido' : 'input-container'}>

                        {/*aquiiiii*/}  <input
                            id="input-idade"
                            type="number"
                            value={idade}
                            onChange={(e) => setIdade(e.target.value)}
                        /><label id="label-anos">anos</label>
                    </div>
                    {erros.idade && <span className="mensagem-erro">Campo obrigatório</span>}
                </div>
                <MdKeyboardDoubleArrowRight />

                <div className={`input-group ${erros.peso ? "erro" : ""}`}>
                    <label id="label-peso" className={peso ? 'label ativa' : 'label'}>Peso:</label>
                    <div className={peso ? 'input-container preenchido' : 'input-container'}>
                        {/*aquiiiii*/} <input
                            id="input-peso"
                            type="number"
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}

                        /><label id="label-kg">Kg</label>
                    </div>
                    {erros.peso && <span className="mensagem-erro">Campo obrigatório</span>}
                </div>

            </div>
            <div className="botao-calcular-container">
                <Botao onClick={calcularAgua}>Calcular</Botao>
            </div>
            <div className="resultado-container">
                {aguaLitros && (
                    <div className="resultado">
                        <div className="text-resultado"><h1>Resultado</h1></div>
                        <h3 id="resultadoLitros">Você deve beber <span id="cor-resultadoLitros">{`${aguaLitros} Litros`}</span> de água por dia. 💦</h3>
                        <p className="texto-explicativo pagina-agua">Essa quantidade é calculada com base na sua idade e peso, garantindo uma hidratação ideal para o bom funcionamento do corpo, como na digestão e na regulação da temperatura</p>

                        {/* Botão de recalcular */}
                        <div className="botao-calcular-container">
                            <Botao onClick={reCalcular}>Calcular Novamente</Botao>
                        </div>
                    </div>
                )}
            </div>

            <div className="section-calculators">
                <Link to="/calculadoras/imc" className="link-calc-section-all">
                    <div className="sectioncal calculadora-calorias-nutrientes">
                        <h1 id="hum-cal-agua">Calculadora de IMC & Peso Ideal</h1>
                        <p>Verifique se esta no peso adequado para sua altura</p>
                        <div className="icon-section"><MdBalance id="img-calculator-icon" /></div>
                    </div>
                </Link>
                <Link to="/calculadoras/calorias-nutrientes"  className="link-calc-section-all">
                    <div className="sectioncal calculadora-calorias-nutrientes">
                        <h1 id="hum-cal-nutri">Calculadora de Calorias e Nutrientes</h1>
                        <p>Calcule as calorias e nutrientes dos alimentos consumidos no seu dia a dia.</p>
                        <div className="icon-section"><PiForkKnifeFill id="img-calculator-icon" /></div>
                    </div>
                </Link>
                <Link to="/calculadoras/gasto-calorico"  className="link-calc-section-all">
                    <div className="sectioncal calculadora-calorias-nutrientes">
                        <h1 id="hum-cal-gasto">Calculadora de Gastos Calorico</h1>
                        <p>Descubra quantas calorias seu corpo gasta por dia</p>

                        <div className="icon-section"><FaRunning id="img-calculator-icon" /></div>

                    </div>
                </Link>
            </div>

        </div>
    )
}

export default AGUACalculator