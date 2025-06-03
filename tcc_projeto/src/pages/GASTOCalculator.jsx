import React, { useState, useEffect } from 'react';


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
    if (!sexo || !idade || !altura || !peso || !exercicio || !objetivo) {
      setFormValidado(true);
      return;
    }

    setFormValidado(false);

    const alturaCm = parseFloat(altura);
    const pesoKg = parseFloat(peso);
    const idadeAnos = parseInt(idade);

    let tmb = 0;

    if (sexo === 'homem') {
      tmb = 88.362 + (13.397 * pesoKg) + (4.799 * alturaCm) - (5.677 * idadeAnos);
    } else if (sexo === 'mulher') {
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

  return (
    <div className="gasto-calc-container">
      <h2 className="gasto-calc-title">Calculadora de Gasto Calórico</h2>

      {/* Sexo */}
      <div className="gasto-calc-field">
        <label className="gasto-calc-label">Sexo:</label>
        <div className="gasto-calc-sexo-buttons">
          <button 
            className={`gasto-calc-button ${sexo === 'homem' ? 'ativo' : ''}`} 
            onClick={() => setSexo('homem')}
          >Homem</button>
          <button 
            className={`gasto-calc-button ${sexo === 'mulher' ? 'ativo' : ''}`} 
            onClick={() => setSexo('mulher')}
          >Mulher</button>
        </div>
        {formValidado && !sexo && <span className="gasto-calc-error">Campo obrigatório</span>}
      </div>

      {/* Idade */}
      <div className="gasto-calc-field">
        <label className="gasto-calc-label">Idade:</label>
        <input 
          className={`gasto-calc-input ${formValidado && !idade ? 'erro' : ''}`} 
          type="number" 
          value={idade} 
          onChange={e => setIdade(e.target.value)}
        />
        {formValidado && !idade && <span className="gasto-calc-error">Campo obrigatório</span>}
      </div>

      {/* Altura e Peso */}
      <div className="gasto-calc-field">
        <label className="gasto-calc-label">Altura (cm):</label>
        <input 
          className={`gasto-calc-input ${formValidado && !altura ? 'erro' : ''}`} 
          type="number" 
          value={altura} 
          onChange={e => setAltura(e.target.value)}
        />
        {formValidado && !altura && <span className="gasto-calc-error">Campo obrigatório</span>}
      </div>
      <div className="gasto-calc-field">
        <label className="gasto-calc-label">Peso (kg):</label>
        <input 
          className={`gasto-calc-input ${formValidado && !peso ? 'erro' : ''}`} 
          type="number" 
          value={peso} 
          onChange={e => setPeso(e.target.value)}
        />
        {formValidado && !peso && <span className="gasto-calc-error">Campo obrigatório</span>}
      </div>

      {/* Exercício Físico */}
      <div className="gasto-calc-field">
        <label className="gasto-calc-label">Exercício Físico:</label>
        <select 
          className={`gasto-calc-input ${formValidado && !exercicio ? 'erro' : ''}`} 
          value={exercicio} 
          onChange={e => setExercicio(e.target.value)}
        >
          <option value="">Selecione</option>
          {Object.keys(niveisExercicio).map((op, index) => (
            <option key={index} value={op}>{op}</option>
          ))}
        </select>
        {formValidado && !exercicio && <span className="gasto-calc-error">Campo obrigatório</span>}
      </div>

      {/* Objetivo */}
      <div className="gasto-calc-field">
        <label className="gasto-calc-label">Objetivo:</label>
        <select 
          className={`gasto-calc-input ${formValidado && !objetivo ? 'erro' : ''}`} 
          value={objetivo} 
          onChange={e => setObjetivo(e.target.value)}
        >
          <option value="">Selecione</option>
          {Object.keys(objetivosFrases).map((op, index) => (
            <option key={index} value={op}>{op}</option>
          ))}
        </select>
        {formValidado && !objetivo && <span className="gasto-calc-error">Campo obrigatório</span>}
      </div>

      <button className="gasto-calc-button calcular" onClick={calcular}>Calcular</button>

      {showResultado && resultado && (
        <div className="gasto-calc-resultado">
          <h3>Seu objetivo é {resultado.fraseObjetivo}</h3>
          <p className="gasto-calc-destaque">Seu gasto calórico diário deve ser cerca de {resultado.gasto} calorias (kcal).</p>
          <div className="gasto-calc-info">Essa é a quantidade de calorias que seu corpo necessita para manter o peso, considerando os dados preenchidos.</div>
          <p className="gasto-calc-destaque">Sua taxa metabólica basal é de {resultado.tmb} calorias (kcal).</p>
          <div className="gasto-calc-info">Este valor representa a quantidade de calorias que seu corpo precisa para realizar funções básicas em repouso, como respiração e circulação.</div>
        </div>
      )}
    </div>
  );
}

export default GASTOCalculator;
