import React, { useState } from "react";
import "../css/IMCeAgua.css";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { MdBalance } from "react-icons/md";
import { LuGlassWater } from "react-icons/lu";
import { Link } from "react-router-dom";
import Botao from "../components/botao/Botao";
import { FaRunning } from "react-icons/fa";

function IMCCalculator() {
  const [sexo, setSexo] = useState("");
  const [idade, setIdade] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erros, setErros] = useState({});

  function calcularIMC() {
    const novosErros = {};
    if (!sexo) novosErros.sexo = true;
    if (!idade) novosErros.idade = true;
    if (!altura) novosErros.altura = true;
    if (!peso) novosErros.peso = true;
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const h = Number(altura) / 100;
    const imc = (Number(peso) / (h * h)).toFixed(1);
    const pesoIdeal = (22 * h * h).toFixed(1);

   let classificacao = "";
const imcNum = Number(imc);
if (imcNum < 18.5) classificacao = "Abaixo do peso";
else if (imcNum < 25) classificacao = "Peso adequado";
else if (imcNum < 30) classificacao = "Sobrepeso";
else if (imcNum < 35) classificacao = "Obesidade grau I";
else if (imcNum < 40) classificacao = "Obesidade grau II";
else classificacao = "Obesidade grau III";


    setResultado({ imc, classificacao, pesoIdeal });
  }

  function calcularNovamente() {
    setSexo(""); setIdade(""); setAltura(""); setPeso("");
    setResultado(null); setErros({});
  }

  function textoClassificacao(classificacao) {
    switch (classificacao) {
      case "Abaixo do peso":
  return "Seu IMC está abaixo do recomendado. Avalie ingestão calórica e composição corporal com acompanhamento profissional.";
case "Peso adequado":
  return "Seu IMC está dentro da faixa considerada saudável. Mantenha hábitos equilibrados de alimentação, sono e atividade física.";
case "Sobrepeso":
  return "Seu IMC está acima do recomendado. Ajustes graduais em alimentação e movimento podem ajudar a melhorar marcadores de saúde.";
case "Obesidade grau I":
  return "Faixa de obesidade grau I. É recomendável avaliação individualizada para plano de cuidado e metas realistas.";
case "Obesidade grau II":
  return "Faixa de obesidade grau II. Procure orientação profissional para estratégias personalizadas e monitoramento clínico.";
case "Obesidade grau III":
  return "Faixa de obesidade grau III. Indica maior risco metabólico; busque avaliação médica e nutricional.";
default:
  return "";

    }
  }

  return (
    <div className="imc-container">
      <div className="titulo-mais-icone">
        <div id="container-calculator-icon"><MdBalance id="img-calculator-icon" /></div>
        <h1 id="titulo-calculadora">Calculadora de IMC & Faixa de Peso Saudável</h1>
      </div>

      <h3 id="text-titulo-calculadora">
        Esta calculadora estima seu IMC a partir do peso e da altura. O resultado ajuda a identificar faixas de referência. O IMC não é diagnóstico e pode variar conforme composição corporal, idade e contexto clínico.
      </h3>

      <div className="info-imc-container info-pag-imc">
        {/* Sexo */}
        <div id="div-geral" className={`input-group ${erros.sexo ? "erro" : ""}`}>
          <label id="label-sexo-button" className={sexo ? "label ativa" : "label"}>Sexo:</label>
          <div id="sexo-buttons" className={sexo ? "input-container preenchido" : "input-container"}>
            <button onClick={()=>setSexo("Homem")}  className={sexo==="Homem" ? "active" : ""}>Homem</button>
            <button onClick={()=>setSexo("Mulher")} className={sexo==="Mulher" ? "active" : ""}>Mulher</button>
          </div>
          {erros.sexo && <span className="mensagem-erro">Campo obrigatório</span>}
        </div>

        <MdKeyboardDoubleArrowRight />

        {/* Idade */}
        <div id="div-geral" className={`input-group ${erros.idade ? "erro" : ""}`}>
          <label id="label-idade" className={idade ? "label ativa" : "label"}>Idade:</label>
          <div className={idade ? "input-container preenchido" : "input-container"}>
            <input id="input-idade" type="number" value={idade} onChange={(e)=>setIdade(e.target.value)} />
            <label id="label-anos">anos</label>
          </div>
          {erros.idade && <span className="mensagem-erro">Campo obrigatório</span>}
        </div>

        <MdKeyboardDoubleArrowRight />

        {/* Altura */}
        <div className={`input-group ${erros.altura ? "erro" : ""}`}>
          <label id="label-altura" className={altura ? "label ativa" : "label"}>Altura:</label>
          <div className={altura ? "input-container preenchido" : "input-container"}>
            <input id="input-altura" type="number" value={altura} onChange={(e)=>setAltura(e.target.value)} />
            <label id="label-cm">cm</label>
          </div>
          {erros.altura && <span className="mensagem-erro">Campo obrigatório</span>}
        </div>

        <MdKeyboardDoubleArrowRight />

        {/* Peso */}
        <div className={`input-group ${erros.peso ? "erro" : ""}`}>
          <label id="label-peso" className={peso ? "label ativa" : "label"}>Peso:</label>
          <div className={peso ? "input-container preenchido" : "input-container"}>
            <input id="input-peso" type="number" value={peso} onChange={(e)=>setPeso(e.target.value)} />
            <label id="label-kg">Kg</label>
          </div>
          {erros.peso && <span className="mensagem-erro">Campo obrigatório</span>}
        </div>
      </div>

      <div className="botao-calcular-container"><Botao onClick={calcularIMC}>Calcular</Botao></div>

      <div className="resultado-container">
        {resultado && (
          <div className="resultado">
            <div className="text-resultado"><h1>Resultado</h1></div>
            <div className="resultado-informacoes">
              <p><strong>Sexo:</strong> {sexo}</p>
              <p><strong>Seu IMC:</strong> {resultado.imc}</p>
              <p><strong>Classificação:</strong> {resultado.classificacao}</p>
              <p><strong>Peso estimado no ponto médio do IMC saudável:</strong> {resultado.pesoIdeal} kg</p>
            </div>

            <p className="texto-explicativo pagina-imc">{textoClassificacao(resultado.classificacao)}</p>

            <table className="tabela-imc">
              <thead><tr><th>Classificação:</th><th>IMC:</th></tr></thead>
             <tbody>
  <tr className={resultado.classificacao==="Abaixo do peso" ? "abaixo destaque" : "abaixo"}>
    <td>Abaixo do peso</td><td>&lt; 18,5</td>
  </tr>
  <tr className={resultado.classificacao==="Peso adequado" ? "normal destaque" : "normal"}>
    <td>Peso adequado</td><td>18,5 – 24,9</td>
  </tr>
  <tr className={resultado.classificacao==="Sobrepeso" ? "sobrepeso destaque" : "sobrepeso"}>
    <td>Sobrepeso</td><td>25,0 – 29,9</td>
  </tr>
  <tr className={resultado.classificacao==="Obesidade grau I" ? "obesidade1 destaque" : "obesidade1"}>
    <td>Obesidade grau I</td><td>30,0 – 34,9</td>
  </tr>
  <tr className={resultado.classificacao==="Obesidade grau II" ? "obesidade2 destaque" : "obesidade2"}>
    <td>Obesidade grau II</td><td>35,0 – 39,9</td>
  </tr>
  <tr className={resultado.classificacao==="Obesidade grau III" ? "obesidade3 destaque" : "obesidade3"}>
    <td>Obesidade grau III</td><td>≥ 40,0</td>
  </tr>
</tbody>

            </table>

            <div className="botao-calcular-container"><Botao onClick={calcularNovamente}>Calcular Novamente</Botao></div>
          </div>
        )}
      </div>

      {/* Mostrar as outras DUAS calculadoras */}
<div className="section-calculators">
  <Link to="/calculadoras/consumo-agua" className="link-calc-section-all">
    <div className="sectioncal calculadora-calorias-nutrientes">
      <h1 id="hum-cal-agua">Calculadora de Consumo diário de Água</h1>
      <p>Calcule a quantidade ideal de água que você deve consumir diariamente.</p>
      <div className="icon-section"><LuGlassWater id="img-calculator-icon" /></div>
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

export default IMCCalculator;
