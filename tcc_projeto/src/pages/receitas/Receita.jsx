import { useEffect, useState } from "react";

function Receitas() {
  const [receitas, setReceitas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/receitas")
      .then(res => res.json())
      .then(data => setReceitas(data))
      .catch(err => console.error("Erro:", err));
  }, []);

  return (
    <div>
      <h1>Receitas</h1>
      {receitas.map(r => (
        <div key={r.id}>{r.nome}</div>
      ))}
    </div>
  );
}

export default Receitas;
