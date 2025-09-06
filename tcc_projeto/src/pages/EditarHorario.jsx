// EditarHorario.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHorario } from '../context/HorarioContext';
import '../css/EditarHorario.css';

const EditarHorario = () => {
  const { nome } = useParams(); // pegando da URL
  const { refeicoes, atualizarHorario } = useHorario();
  const navigate = useNavigate();

  const refeicao = refeicoes.find((r) => r.nome === nome);

  const [novoHorario, setNovoHorario] = useState(refeicao?.horario || '');

  const salvar = () => {
    if (novoHorario.trim() === '') return;

    atualizarHorario(nome, novoHorario);
    navigate('/gerenciar-horarios');
  };

  if (!refeicao) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Refeição não encontrada 😕</div>;
  }

  return (
    <div className="pagina-editar-horario">
      <h1>Editar horário</h1>
      <p className="nome-refeicao">{refeicao.nome}</p>
      <input
        type="time"
        value={novoHorario}
        onChange={(e) => setNovoHorario(e.target.value)}
      />
      <button onClick={salvar}>Salvar</button>
    </div>
  );
};

export default EditarHorario;
