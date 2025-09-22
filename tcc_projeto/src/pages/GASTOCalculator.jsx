import React, { useState, useEffect } from 'react';
import "../css/IMCeAgua.css";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { MdBalance } from "react-icons/md";
import { LuGlassWater } from "react-icons/lu";
import { PiForkKnifeFill } from "react-icons/pi";
import { FaRunning } from "react-icons/fa";
import Botao from "../components/botao/Botao";
import { Link } from 'react-router-dom';

function GASTOCalculator() {
  const [sexo, setSexo] = useState('');
  const [idade, setIdade] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [exercicio, setExercicio] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [showResultado, setShowResultado] = useState(false);
  const [formValidado, setFormValidado] = useState(false);
  const [erros, setErros] = useState({});


  useEffect(() => {
    if (showResultado) setShowResultado(false);
  }, [sexo, idade, altura, peso, exercicio, objetivo]);

  const niveisExercicio = {
    'Pouco ou nenhum exercício': 1.2,
    'Exercício leve/esportes 1 - 3 dias por semana': 1.375,
    'Exercício moderado/esportes 3-5 dias por semana': 1.55,
    'Exercício pesado/esportes 6-7 dias por semana': 1.725,
    'Exercício muito pesado/Trabalho físico intenso': 1.9
  };

  const objetivosFrases = {
    'Perda de Peso leve (-250kcal/dia)': -250,
    'Perda de peso moderada (-500kcal/dia)': -500,
    'Perda de peso rigorosa (-1000kcal/dia)': -1000,
    'Manutenção do peso atual': 0,
    'Ganho de peso (+500kcal/dia)': 500
  };

  const frasesObjetivo = {
    'Perda de Peso leve (-250kcal/dia)': 'perder peso de forma leve e gradual.',
    'Perda de peso moderada (-500kcal/dia)': 'perder peso de forma moderada.',
    'Perda de peso rigorosa (-1000kcal/dia)': 'perder peso de forma rápida e intensa.',
    'Manutenção do peso atual': 'manter o peso, fazendo regulagens equilibradas.',
    'Ganho de peso (+500kcal/dia)': 'ganhar peso de maneira saudável.'
  };

  const calcular = () => {
    const novosErros = {};
    if (!sexo) novosErros.sexo = true;
    if (!idade) novosErros.idade = true;
    if (!altura) novosErros.altura = true;
    if (!peso) novosErros.peso = true;
    if (!exercicio) novosErros.exercicio = true;
    if (!objetivo) novosErros.objetivo = true;

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      setFormValidado(true);
      return;
    }

    setFormValidado(false);

    const alturaCm = parseFloat(altura);
    const pesoKg = parseFloat(peso);
    const idadeAnos = parseInt(idade);

    let tmb = 0;

    if (sexo === 'Homem') {
      tmb = 88.362 + (13.397 * pesoKg) + (4.799 * alturaCm) - (5.677 * idadeAnos);
    } else if (sexo === 'Mulher') {
      tmb = 447.593 + (9.247 * pesoKg) + (3.098 * alturaCm) - (4.330 * idadeAnos);
    }

    const fatorAtividade = niveisExercicio[exercicio];
    const gastoDiario = tmb * fatorAtividade;
    const ajuste = objetivosFrases[objetivo];
    const gastoFinal = gastoDiario + ajuste;

    setResultado({
      tmb: Math.round(tmb),
      gasto: Math.round(gastoFinal),
      fraseObjetivo: frasesObjetivo[objetivo]
    });
    setShowResultado(true);
  };

  const resetForm = () => {
    setSexo('');
    setIdade('');
    setAltura('');
    setPeso('');
    setExercicio('');
    setObjetivo('');
    setShowResultado(false); // <- corrigido aqui
    setFormValidado(false);
    setErros({});
    setResultado(null);
  };

  return (

    <div className="imc-container">
      <div className="titulo-mais-icone">
        <div id="container-calculator-icon"><FaRunning id="img-calculator-icon" /></div>
        <h1 id="titulo-calculadora"> Calculadora de Gasto Calórico</h1>
      </div>
      <h3 id="text-titulo-calculadora">A calculadora de gasto calórico é importante para entender quantas calorias seu corpo gasta diariamente, ajudando em objetivos de perda de peso, manutenção ou ganho de massa.</h3>
      <div className="info-imc-container info-pag-imc info-pag-gasto">
        <div className="divisoria-pag-gasto">
          {/* Informações sobre Sexo */}
          <div id="div-geral" className={`input-group-gasto ${erros.sexo ? "erro" : ""}`}>
            <label id="label-sexo-button-gasto" className={sexo ? 'label ativa' : 'label'}>Sexo:</label>
            <div id="sexo-buttons-gasto" className={sexo ? 'input-container-gasto preenchido' : 'input-container-gasto'}> {/*aquiiiii*/}
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
          {/* Informações sobre Idade*/}
          <div id="div-geral" className={`input-group-gasto ${erros.idade ? "erro" : ""}`}>
            <label id="label-idade" className={idade ? 'label ativa' : 'label'}>Idade:</label>
            <div className={idade ? 'input-container-gasto preenchido' : 'input-container-gasto'}>

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
          {/* Informações sobre Altura */}
          <div className={`input-group-gasto ${erros.altura ? "erro" : ""}`}>
            <label id="label-altura" className={altura ? 'label ativa' : 'label'}>Altura:</label>
            <div className={altura ? 'input-container-gasto preenchido' : 'input-container-gasto'}>
              {/*aquiiiii*/}<input
                id="input-altura"
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}

              /><label id="label-cm">cm</label>
            </div>
            {erros.altura && <span className="mensagem-erro">Campo obrigatório</span>}
          </div>
        </div>
        <div className="divisoria-pag-gasto">
          {/* Informações sobre Peso*/}
          <div className={`input-group-gasto ${erros.peso ? "erro" : ""}`}>
            <label id="label-peso" className={peso ? 'label ativa' : 'label'}>Peso:</label>
            <div className={peso ? 'input-container-gasto preenchido' : 'input-container-gasto'}>
              {/*aquiiiii*/} <input
                id="input-peso"
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}

              /><label id="label-kg">Kg</label>
            </div>
            {erros.peso && <span className="mensagem-erro">Campo obrigatório</span>}
          </div>
          <MdKeyboardDoubleArrowRight />
          {/* Exercício Físico */}
          <div className={`input-group-gasto ${erros.exercicio ? "erro" : ""}`}>
            <label id="label-exercicio" className={exercicio ? 'label ativa' : 'label'}>Exercício:</label>
            <div className={exercicio ? 'input-container-gasto preenchido' : 'input-container-gasto'}>
              <select
                className={`gasto-calc-input`}
                value={exercicio}
                onChange={e => setExercicio(e.target.value)}
              >
                <option value="">Selecione</option>
                {Object.keys(niveisExercicio).map((op, index) => (
                  <option key={index} value={op}>{op}</option>
                ))}
              </select>
            </div>
            {erros.exercicio && <span className="mensagem-erro">Campo obrigatório</span>}
          </div>
          <MdKeyboardDoubleArrowRight />
          {/* Objetivo */}
          <div className={`input-group-gasto ${erros.exercicio ? "erro" : ""}`}>
            <label id="label-objetivo" className={objetivo ? 'label ativa' : 'label'}>Objetivo:</label>
            <div className={objetivo ? 'input-container-gasto preenchido' : 'input-container-gasto'}>
              <select
                className={`gasto-calc-input`}
                value={objetivo}
                onChange={e => setObjetivo(e.target.value)}
              >
                <option value="">Selecione</option>
                {Object.keys(objetivosFrases).map((op, index) => (
                  <option key={index} value={op}>{op}</option>
                ))}
              </select>
            </div>
            {erros.objetivo && <span className="mensagem-erro">Campo obrigatório</span>}
          </div>
        </div>
      </div>

      <div className="botao-calcular-container">
                <Botao onClick={calcular}>Calcular</Botao>
            </div>
      {showResultado && resultado && (
        <div className="gasto-calc-container">
          <div className="text-resultado"><h1>Resultado</h1></div>
          <div className="resultado-informacoes-gasto">
            <p id="objetivo-gasto-calc"><strong>Objetivo:</strong> {resultado.fraseObjetivo}</p>
          </div>
          <h3 className="resultadoGasto">Seu gasto calórico diário deve ser cerca de <span id='color-gasto-info'>{resultado.gasto} calorias (kcal).</span></h3>
          <p className="texto-explicativo-gasto">Essa é a quantidade de calorias que seu corpo necessita para manter o peso, considerando os dados preenchidos.</p>
          <h3 className="resultadoGasto">Sua taxa metabólica basal é de <span id='color-gasto-info'>{resultado.tmb} calorias (kcal).</span></h3>
          <p className="texto-explicativo-gasto">Este valor representa a quantidade de calorias que seu corpo precisa para realizar funções básicas em repouso, como respiração e circulação.</p>
          <div className="info-paragrafos calc-gasto">
            <p><IoMdInformationCircle id="info" /><strong>Observações:</strong></p>
            <li>Utilizamos a fórmula revisada de Harris-Benedict para cálculo de gasto calórico.</li>
            <li>Para uma alimentação equilibrada, é recomendado o consumo minímo de 1000 calorias por dia para mulheres e 1200 calorias por dia para homens.</li>
          </div>

          {/* Botão de recalcular */}
                        <div className="botao-calcular-container">
                            <Botao onClick={resetForm}>Calcular Novamente</Botao>
                        </div>
        </div>

      )}


      <div className="section-calculators">
        <Link to="/calculadoras/consumo-agua"  className="link-calc-section-all">
        <div className="sectioncal calculadora-calorias-nutrientes">
          <h1 id="hum-cal-agua">Calculadora de Consumo diário de Água</h1>
          <p>Calcule a quantidade ideal de água que você deve consumir diariamente.</p>
          <div className="icon-section"><LuGlassWater id="img-calculator-icon" /></div>
        </div>
        </Link>
        <Link to="/calculadoras/calorias-nutrientes"  className="link-calc-section-all">
        <div className="sectioncal calculadora-calorias-nutrientes">
          <h1 id="hum-cal-nutri">Calculadora de Calorias e Nutrientes</h1>
          <p>Calcule as calorias e nutrientes dos alimentos consumidos no seu dia a dia.</p>
          <div className="icon-section"><PiForkKnifeFill id="img-calculator-icon" /></div>
        </div>
        </Link>
        <Link to="/calculadoras/imc"  className="link-calc-section-all">
        <div className="sectioncal calculadora-calorias-nutrientes">
          <h1 id="hum-cal-gasto">Calculadora de IMC & Peso Ideal</h1>
          <p>Verifique se esta no peso adequado para sua altura</p>

          <div className="icon-section correr"><MdBalance id="img-calculator-icon" /></div>
        </div>
        </Link>
      </div>
    </div>
  );
}

export default GASTOCalculator;
