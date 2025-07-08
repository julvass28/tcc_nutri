import React, { useState, useMemo } from 'react';
import '../css/DetalheAlimento.css';
import { useLocation } from 'react-router-dom';
import baconImg from '../assets/bacon.jpg';

const unidadeParaGramas = {
  'Colher de sopa': 20,
  'Grama': 1,
  'Xícara': 100
};

const DetalheAlimento = () => {
  const { state: alimento } = useLocation();

  const mock = {
    nome: 'Bacon',
    marca: 'Tropeira',
    descricao: 'Bacon especial em cubos',
    imagem: baconImg,
    quantidade: 2,
    unidade: 'Colher de sopa',
    nutrientes: {
      calorias: 32,
      proteina: 5.8,
      gorduras: 0.8,
      carboidratos: 0.4
    }
  };

  const dados = alimento || mock;

  const [quantidade, setQuantidade] = useState(dados.quantidade);
  const [unidade, setUnidade] = useState(dados.unidade);

  // calcula a porção total em gramas
  const totalGramas = useMemo(() => {
    const gramasUnidade = unidadeParaGramas[unidade] || 0;
    return gramasUnidade * quantidade;
  }, [unidade, quantidade]);

  // calcula os nutrientes proporcionais
  const nutrientesTotais = useMemo(() => {
    const fator = totalGramas / (unidadeParaGramas[dados.unidade] * dados.quantidade);
    return {
      calorias: (dados.nutrientes.calorias * fator).toFixed(1),
      proteina: (dados.nutrientes.proteina * fator).toFixed(1),
      gorduras: (dados.nutrientes.gorduras * fator).toFixed(1),
      carboidratos: (dados.nutrientes.carboidratos * fator).toFixed(1)
    };
  }, [totalGramas, dados]);

  

  return (
    <div className="pagina-detalhe">
     <div className="cabecalho-detalhe">
  <div className="info-textos">
    <h1 className="nome-alimento">{dados.nome}</h1>
    <p className="marca">{dados.marca}</p>
    <p className="descricao">{dados.descricao}</p>
  </div>
  <img className="imagem-alimento" src={dados.imagem} alt={dados.nome} />
</div>


      <div className="quantidade-section">
        <div>
          <label>Quantidade</label>
          <input
            type="number"
            className="input-quantidade"
            value={quantidade}
            min={0}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />
          <p className="gramas-info">({totalGramas}g)</p>
        </div>
        <div>
          <label>Unidade</label>
          <select
            className="select-unidade"
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
          >
            {Object.keys(unidadeParaGramas).map((un) => (
              <option key={un} value={un}>{un}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="titulo-nutricional">Informações Nutricionais</p>
      <p className="subtitulo-nutricional">
        Para {quantidade} {unidade.toLowerCase()} ({totalGramas}g)
      </p>

      <div className="nutrientes">
        <div className="nutriente"><strong>{nutrientesTotais.calorias}</strong><span>Calorias</span></div>
        <div className="nutriente"><strong>{nutrientesTotais.proteina}g</strong><span>Proteína</span></div>
        <div className="nutriente"><strong>{nutrientesTotais.gorduras}g</strong><span>Gorduras</span></div>
        <div className="nutriente"><strong>{nutrientesTotais.carboidratos}g</strong><span>Carboidratos</span></div>
      </div>
    </div>
  );
};

export default DetalheAlimento;
