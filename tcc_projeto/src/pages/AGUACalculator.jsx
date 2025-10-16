import { useState } from "react";
import "../css/IMCeAgua.css";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { LuGlassWater } from "react-icons/lu";
import { MdBalance } from "react-icons/md";
import { Link } from "react-router-dom";
import Botao from "../components/botao/Botao";
import { FaRunning } from "react-icons/fa";

function AGUACalculator() {
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [aguaLitros, setAguaLitros] = useState("");
  const [erros, setErros] = useState({});

  function calcularAgua() {
    const novosErros = {};
    if (!idade) novosErros.idade = true;
    if (!peso) novosErros.peso = true;
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const i = Number(idade);
    let ml = 0;
    if (i <= 8) ml = 50;
    else if (i <= 18) ml = 40;
    else if (i <= 55) ml = 35;
    else if (i <= 65) ml = 30;
    else ml = 25;

    const totalLitros = ((Number(peso) * ml) / 1000).toFixed(2);
    setAguaLitros(totalLitros);
  }

  function reCalcular() {
    setIdade(""); setPeso(""); setAguaLitros(""); setErros({});
  }

  return (
    <div className="imc-container">
      <div className="titulo-mais-icone">
        <div id="container-calculator-icon"><LuGlassWater id="img-calculator-icon" /></div>
        <h1 id="titulo-calculadora">Calculadora de consumo diário de água</h1>
      </div>

      <h3 id="text-titulo-calculadora">
        Esta calculadora estima a ingestão diária de água com base na sua idade e no seu peso. Use como referência inicial e ajuste conforme rotina, clima e nível de atividade física.
      </h3>

      <div className="info-imc-container info-pag-agua">
        <div id="div-geral" className={`input-group ${erros.idade ? "erro" : ""}`}>
          <label id="label-idade" className={idade ? "label ativa" : "label"}>Idade:</label>
          <div className={idade ? "input-container preenchido" : "input-container"}>
            <input id="input-idade" type="number" value={idade} onChange={(e)=>setIdade(e.target.value)} />
            <label id="label-anos">anos</label>
          </div>
          {erros.idade && <span className="mensagem-erro">Campo obrigatório</span>}
        </div>

        <MdKeyboardDoubleArrowRight />

        <div className={`input-group ${erros.peso ? "erro" : ""}`}>
          <label id="label-peso" className={peso ? "label ativa" : "label"}>Peso:</label>
          <div className={peso ? "input-container preenchido" : "input-container"}>
            <input id="input-peso" type="number" value={peso} onChange={(e)=>setPeso(e.target.value)} />
            <label id="label-kg">Kg</label>
          </div>
          {erros.peso && <span className="mensagem-erro">Campo obrigatório</span>}
        </div>
      </div>

      <div className="botao-calcular-container"><Botao onClick={calcularAgua}>Calcular</Botao></div>

      <div className="resultado-container">
        {aguaLitros && (
          <div className="resultado">
            <div className="text-resultado"><h1>Resultado</h1></div>
            <h3 id="resultadoLitros">Consuma cerca de <span id="cor-resultadoLitros">{`${aguaLitros} litros`}</span> de água por dia (valor estimado).</h3>
            <p className="texto-explicativo pagina-agua">
              Este valor é uma estimativa baseada na idade e no peso. A hidratação adequada varia conforme atividade física, temperatura/umidade do ambiente e condições individuais. Parte da ingestão hídrica também vem de alimentos e outras bebidas.
            </p>
            <ul className="info-paragrafos pagina-agua" style={{ marginTop: "12px" }}>
  <li>Regra de bolso usada: ml de água por kg de peso variam com a idade (crianças/adolescentes tendem a precisar mais por kg; idosos, um pouco menos).</li>
  <li>Pratique exercícios? Considere acrescentar ~300–700 ml por hora de treino, conforme intensidade e sudorese.</li>
  <li>Gestantes e lactantes, pessoas com doenças renais, cardíacas ou uso de diuréticos devem seguir orientação profissional individualizada.</li>
  <li>Evite ingestões muito elevadas em curto período de tempo. Em caso de sede excessiva ou urina muito escura/pouca, procure avaliação.</li>
</ul>

            <div className="botao-calcular-container"><Botao onClick={reCalcular}>Calcular Novamente</Botao></div>
          </div>
        )}
      </div>

<div className="section-calculators">
  <Link to="/calculadoras/imc" className="link-calc-section-all">
    <div className="sectioncal calculadora-calorias-nutrientes">
      <h1 id="hum-cal-agua">Calculadora de IMC & Peso Ideal</h1>
      <p>Verifique se está no peso adequado para sua altura</p>
      <div className="icon-section"><MdBalance id="img-calculator-icon" /></div>
    </div>
  </Link>

  <Link to="/calculadoras/gasto-calorico" className="link-calc-section-all">
    <div className="sectioncal calculadora-calorias-nutrientes">
      <h1 id="hum-cal-gasto">Calculadora de Gasto Calórico</h1>
      <p>Descubra quantas calorias seu corpo gasta por dia</p>
      <div className="icon-section correr"><FaRunning id="img-calculator-icon" /></div>
    </div>
  </Link>
</div>

    </div>
  );
}

export default AGUACalculator;
