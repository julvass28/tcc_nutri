import { useEffect, useState } from "react";
import FormReceita from "../../components/formulario/FormReceita";

export default function AdminReceitas() {
  const [receitas, setReceitas] = useState([]);

  // Buscar receitas no backend
  useEffect(() => {
    fetch("http://localhost:3000/receitas") // Troque pela URL do seu backend
      .then((res) => res.json())
      .then((data) => setReceitas(data))
      .catch((err) => console.error("Erro ao buscar receitas:", err));
  }, []);

  // Função para apagar uma receita
  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja apagar esta receita?")) {
      fetch(`http://localhost:3000/receitas/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          // Atualiza a lista removendo a receita apagada
          setReceitas((prev) => prev.filter((r) => r.id !== id));
        })
        .catch((err) => console.error("Erro ao apagar receita:", err));
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      {/* Formulário para adicionar nova receita */}
      <FormReceita />

      <h2 style={{ marginTop: "40px" }}>Receitas Publicadas:</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
        {receitas.map((receita) => (
          <div key={receita.id} style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "15px", background: "#fff" }}>
            <img
              src={receita.imagem}
              alt={receita.titulo}
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "10px" }}
            />
            <h3>{receita.titulo}</h3>
            <p>{receita.descricao}</p>
            <button
              onClick={() => handleDelete(receita.id)}
              style={{
                background: "#ff4d4d",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                cursor: "pointer",
                borderRadius: "5px",
                marginTop: "10px"
              }}
            >
              Apagar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
