// src/pages/PaginaRota.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import conteudosEspecialidades from '../data/conteudosEspecialidades';
import PaginaEspecialidade from '../components/PaginaEspecialidade';

const PaginaRota = () => {
  const { tipo } = useParams();              // pega “esportiva”, “pediatrica” etc.
  const dados = conteudosEspecialidades[tipo];

  if (!dados) {
    return (
      <div>
        <h2>Especialidade não encontrada</h2>
        <Link to="/">Voltar ao início</Link>
      </div>
    );
  }

  return <PaginaEspecialidade {...dados} />;
};

export default PaginaRota;
