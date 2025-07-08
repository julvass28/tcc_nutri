import React, { createContext, useContext, useState } from 'react';

const HorarioContext = createContext();

export const HorarioProvider = ({ children }) => {
  const [refeicoes, setRefeicoes] = useState([
    { nome: 'Café da Manhã', horario: '08:00' },
    { nome: 'Lanche da Manhã', horario: '10:00' },
    { nome: 'Almoço', horario: '12:30' },
    { nome: 'Lanche da Tarde', horario: '16:00' },
    { nome: 'Jantar', horario: '19:30' }
  ]);

  const atualizarHorario = (nomeRefeicao, novoHorario) => {
    setRefeicoes((prev) =>
      prev.map((refeicao) =>
        refeicao.nome === nomeRefeicao
          ? { ...refeicao, horario: novoHorario }
          : refeicao
      )
    );
  };

  return (
    <HorarioContext.Provider value={{ refeicoes, atualizarHorario }}>
      {children}
    </HorarioContext.Provider>
  );
};

// 👇 ESTE é o hook que estava faltando exportar
export const useHorario = () => useContext(HorarioContext);
