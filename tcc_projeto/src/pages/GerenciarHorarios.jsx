// GerenciarHorarios.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/GerenciarHorarios.css';
import { Pencil } from 'lucide-react';
import { useHorario } from '../context/HorarioContext';

const GerenciarHorarios = () => {
  const { refeicoes } = useHorario();
  const navigate = useNavigate();

  const editarHorario = (nomeRefeicao) => {
    const encoded = encodeURIComponent(nomeRefeicao);
    navigate(`/editar-horario/${encoded}`);
  };

  return (
    <div className="pagina-horarios">
      <h1 className="titulo">Gerenciar horários</h1>
      <div className="lista-horarios">
        {refeicoes.map((refeicao, index) => (
          <div className="horario-card" key={index}>
            <div>
              <p className="refeicao">{refeicao.nome}</p>
              <p className="hora">{refeicao.horario}</p>
            </div>
            <Pencil className="icone-lapis" onClick={() => editarHorario(refeicao.nome)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GerenciarHorarios;
