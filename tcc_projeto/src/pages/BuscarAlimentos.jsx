import React, { useState, useEffect } from 'react';
import '../css/BuscarAlimentos.css';
import lupaIcon from '../assets/lupa-rosa.png';
import { useNavigate } from 'react-router-dom';

const BuscarAlimentos = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleAbrirDetalhes = (item) => {
    // mock para a imagem e nutrientes (você pode mudar quando usar API)
    const itemComDados = {
      ...item,
      imagem: require('../assets/bacon.jpg'), // ⬅️ temporário
      quantidade: 2,
      unidade: 'Colher de sopa',
      nutrientes: {
        calorias: 32,
        proteina: 5.8,
        gorduras: 0.8,
        carboidratos: 0.4
      }
    };

    navigate('/detalhes-alimento', { state: itemComDados });
  };

  useEffect(() => {
    document.body.classList.add('buscar-alimentos-body');
    return () => {
      document.body.classList.remove('buscar-alimentos-body');
    };
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setResults([]);
      return;
    }

    // 🔄 Quando a API estiver pronta, substitua por uma chamada real:
    const fetchData = async () => {
      try {
        // const response = await fetch(`URL_DA_API?q=${search}`);
        // const data = await response.json();
        // setResults(data);

        // Simulação temporária
        const fakeData = [
         {
            nome: 'Arroz',
            marca: 'Tropeira',
            descricao: 'Bacon especial cubos',
            quantidade: '1 colher de sopa',
            kcal: '40'
          },
          {
            nome: 'Bacon',
            marca: 'Tropeira',
            descricao: 'Bacon especial cubos',
            quantidade: '1 colher de sopa',
            kcal: '40'
          },
          {
            nome: 'Bacon 2',
            marca: 'Tropeira',
            descricao: 'Bacon especial cubos',
            quantidade: '1 colher de sopa',
            kcal: '40'
          },
            {
            nome: 'Bacon 3',
            marca: 'Tropeira',
            descricao: 'Bacon especial cubos',
            quantidade: '1 colher de sopa',
            kcal: '40'
          }
        ];

        const filtered = fakeData.filter(item =>
          item.nome.toLowerCase().includes(search.toLowerCase())
        );

        setResults(filtered);
      } catch (error) {
        console.error('Erro ao buscar alimentos:', error);
      }
    };

    fetchData();
  }, [search]);

  return (
    
    <div className="pagina-busca">
      <h1>Café da Manhã</h1>

      <div className="search-box">
        <img src={lupaIcon} alt="Buscar" className="icon-img" />
        <input
          type="text"
          placeholder="Pesquise por um alimento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2 className="titulo-resultados">Resultados</h2>
      <div className="resultados">
        {results.map((item, index) => (
          <div className="item" key={index}>
            <div className="info">
              <strong>{item.nome}</strong>
              <p>{item.marca}</p>
              <p>{item.descricao}</p>
              <p>{item.quantidade} – {item.kcal} kcal</p>
            </div>
            <button className="add-button" onClick={() => handleAbrirDetalhes(item)}>+</button>

            {/* depois adionar oq o botão de + faz */}
          </div>
        ))}
      </div>
    </div>
  );
  



};

export default BuscarAlimentos;
