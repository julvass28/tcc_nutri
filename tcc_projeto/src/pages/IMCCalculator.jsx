import React, { useState } from "react";
import "../pages/IMCCalculator.css";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { MdBalance } from "react-icons/md";
import { LuGlassWater } from "react-icons/lu";
import { PiForkKnifeFill } from "react-icons/pi";
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

    const alturaMetros = altura / 100;
    const imc = (peso / (alturaMetros * alturaMetros)).toFixed(1);
    const pesoIdeal = (22 * alturaMetros * alturaMetros).toFixed(1);

    let classificacao = "";
    if (imc < 18.6) classificacao = "Abaixo do normal";
    else if (imc < 25) classificacao = "Normal";
    else if (imc < 30) classificacao = "Sobrepeso";
    else if (imc < 35) classificacao = "Obesidade grau 1";
    else if (imc < 40) classificacao = "Obesidade grau 2";
    else classificacao = "Obesidade grau 3";

    setResultado({ imc, classificacao, pesoIdeal });
  }

  function calcularNovamente() {
    setSexo("");
    setIdade("");
    setAltura("");
    setPeso("");
    setResultado(null);
    setErros({});
  }

  function textoClassificacao(classificacao) {
    switch (classificacao) {
      case "Abaixo do normal":
        return " 😕Seu IMC indica que você está abaixo do peso ideal de acordo com a OMS (Organização Mundial da Saúde). Isso pode significar que seu corpo não está recebendo todos os nutrientes necessários para funcionar de forma otimizada. Pode ser importante considerar ajustes na sua alimentação ou buscar orientação de um profissional de saúde.";
      case "Normal":
        return "Parabéns!🎉 Seu IMC está dentro do intervalo considerado saudável de acordo com a OMS (Organização Mundial da Saúde). Isso sugere que seu peso é adequado para a sua altura e que você está em uma boa posição para manter sua saúde a longo prazo.";
      case "Sobrepeso":
        return "😯Seu IMC indica que você está com sobrepeso. Isso pode ser um sinal de que é hora de prestar mais atenção à sua alimentação e ao seu nível de atividade física. Fazer pequenas mudanças agora pode ajudar a evitar problemas de saúde mais sérios no futuro.";
      case "Obesidade grau 1":
        return "⚠️Seu IMC mostra que você está no início da faixa de obesidade. Isso pode aumentar o risco de alguns problemas de saúde, como doenças cardíacas e diabetes. Considere falar com um profissional de saúde para desenvolver um plano que ajude a alcançar um peso mais saudável.";
      case "Obesidade grau 2":
        return "⚠️‼️Seu IMC está na faixa de obesidade severa. Nesta fase, o risco de complicações de saúde é maior, e é essencial que você tome medidas para cuidar da sua saúde. Uma abordagem estruturada, com apoio médico, é essencial para alcançar melhorias significativas.";
      case "Obesidade grau 3":
        return "🚫Seu IMC indica obesidade mórbida, o que significa que sua saúde pode estar em risco sério. É extremamente importante que você procure orientação médica para avaliar as opções de tratamento que devem incluir mudanças significativas no estilo de vida.";
      default:
        return "";
    }
  }

  return (
    
    <div className="imc-container">
      <div className="titulo-mais-icone">
        <div id="container-calculator-icon"><MdBalance id="img-calculator-icon" /></div>
        <h1 id="titulo-calculadora"> Calculadora de IMC & Peso Ideal</h1>
      </div>
      <h3 id="text-titulo-calculadora">Nossa calculadora de IMC e peso ideal ajuda você a avaliar se está com o peso adequado em relação à sua altura, além de descobrir o intervalo de peso saudável para uma melhor qualidade de vida.</h3>
      <div className="info-imc-container">


        <div id="div-geral" className={`input-group ${erros.sexo ? "erro" : ""}`}>
          <label id="label-sexo-button" className={sexo ? 'label ativa' : 'label'}>Sexo:</label>
          <div id="sexo-buttons" className={sexo ? 'input-container preenchido' : 'input-container'}> {/*aquiiiii*/}
            <button
              onClick={() => setSexo("Homem")}
              className={sexo === "Homem" ? "active" : ""}
            >
              Homem
            </button>
            <button
              onClick={() => setSexo("Mulher")}
              className={sexo === "Mulher" ? "active" : ""}
            >
              Mulher
            </button>
          </div>
          {erros.sexo && <span className="mensagem-erro">Campo obrigatório</span>}
        </div>
        <MdKeyboardDoubleArrowRight />
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
        <div className={`input-group ${erros.altura ? "erro" : ""}`}>
          <label id="label-altura" className={altura ? 'label ativa' : 'label'}>Altura:</label>
          <div className={altura ? 'input-container preenchido' : 'input-container'}>
            {/*aquiiiii*/}<input
              id="input-altura"
              type="number"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}

            /><label id="label-cm">cm</label>
          </div>
          {erros.altura && <span className="mensagem-erro">Campo obrigatório</span>}
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
        <button className="calcular-btn" onClick={calcularIMC}>
          Calcular IMC e Peso Ideal
        </button>
      </div>
      <div className="resultado-container">
        {resultado && (


          <div className="resultado">
            <div className="text-resultado"><h1>Resultado</h1></div>
            <div className="resultado-informacoes">
              <p><strong>Sexo:</strong> {sexo}</p>
              <p><strong>Seu IMC:</strong> {resultado.imc}</p>
              <p><strong>Classificação:</strong> {resultado.classificacao}</p>
              <p><strong>Peso Ideal:</strong> {resultado.pesoIdeal} kg</p>
            </div>
            <p className="texto-explicativo">{textoClassificacao(resultado.classificacao)}</p>

            {/* Tabela */}
            <table className="tabela-imc">
              <thead>
                <tr>
                  <th>Classificação:</th>
                  <th>IMC:</th>
                </tr>
              </thead>
              <tbody>
                <tr className={resultado.classificacao === "Abaixo do normal" ? "abaixo destaque" : "abaixo"}>
                  <td>Abaixo do normal</td>
                  <td>Menor que 18.6</td>
                </tr>
                <tr className={resultado.classificacao === "Normal" ? "normal destaque" : "normal"}>
                  <td>Normal</td>
                  <td>18.6 - 24.9</td>
                </tr>
                <tr className={resultado.classificacao === "Sobrepeso" ? "sobrepeso destaque" : "sobrepeso"}>
                  <td>Sobrepeso</td>
                  <td>25 - 29.9</td>
                </tr>
                <tr className={resultado.classificacao === "Obesidade grau 1" ? "obesidade1 destaque" : "obesidade1"}>
                  <td>Obesidade grau 1</td>
                  <td>30 - 34.9</td>
                </tr>
                <tr className={resultado.classificacao === "Obesidade grau 2" ? "obesidade2 destaque" : "obesidade2"}>
                  <td>Obesidade grau 2</td>
                  <td>35 - 39.9</td>
                </tr>
                <tr className={resultado.classificacao === "Obesidade grau 3" ? "obesidade3 destaque" : "obesidade3"}>
                  <td>Obesidade grau 3</td>
                  <td>Maior que 40</td>
                </tr>
              </tbody>
            </table>

            {/* Parágrafos informativos */}
            <div className="info-paragrafos">
              <p id="legenda-tabela"> <IoMdInformationCircle id="info" /> Tabela de classificação de IMC, de acordo com a Organização Mundial da Saúde.</p>
              <p><strong>Observação sobre o IMC:</strong> O cálculo do IMC não distingue entre gordura e músculo. Assim, pessoas com alta densidade muscular, como alguns atletas, podem apresentar<br /> um IMC elevado, mesmo estando em boa forma física.</p>
              <p><strong>Observação sobre o Peso Ideal:</strong> Utilizamos a fórmula de Devine para cálculo de peso ideal.</p>
            </div>

            {/* Botão de recalcular */}
            <div className="botao-calcular-container">
              <button className="recalcular-btn" onClick={calcularNovamente}>
                Calcular novamente
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="section-calculators">
        <div className="sectioncal calculadora-calorias-nutrientes">
          <h1 id="hum-cal-agua">Calculadora de Consumo diário de Água</h1>
          <p>Calcule a quantidade ideal de água que você deve consumir diariamente.</p>
          <div className="icon-section"><LuGlassWater id="img-calculator-icon" /></div>
        </div>
        <div className="sectioncal calculadora-calorias-nutrientes">
          <h1 id="hum-cal-nutri">Calculadora de Calorias e Nutrientes</h1>
          <p>Calcule as calorias e nutrientes dos alimentos consumidos no seu dia a dia.</p>
          <div className="icon-section"><PiForkKnifeFill id="img-calculator-icon" /></div>
        </div>
        <div className="sectioncal calculadora-calorias-nutrientes">
          <h1 id="hum-cal-gasto">Calculadora de Gastos Calorico</h1>
          <p>Descubra quantas calorias seu corpo gasta por dia</p>

          <div className="icon-section"><FaRunning id="img-calculator-icon" /></div>

        </div>
      </div>
      
    </div>
   
  );
}

export default IMCCalculator;
