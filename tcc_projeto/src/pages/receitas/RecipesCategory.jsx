// src/pages/receitas/RecipesCategory.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../css/ReceitasClinicas.css";
import comidaImg from "../../assets/comida.jpeg";
const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

const TITULOS = {
  clinica: "Receitas Clínicas",
  pediatrica: "Receitas Pediátricas",
  esportiva: "Receitas Esportivas",
  emagrecimento: "Receitas para Emagrecimento",
  intolerancias: "Receitas para Intolerâncias",
};

export default function RecipesCategory(){
  const { categoria } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const r = await fetch(`${API}/receitas?categoria=${categoria}`);
      const data = await r.json();
      setItems(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, [categoria]);

  return (
    <div>
      {/* BANNER/TEXTO conforme seu CSS */}
      <div className="receitas-comida-img">
        <img src={comidaImg} alt="" style={{width:"100%",height:"420px",objectFit:"cover"}} />
        <div className="receitas-texto">
          <h2 className="receitas-titulo">{TITULOS[categoria] || "Receitas"}</h2>
          <p className="receitas-subtitulo">Selecione uma receita para ver o passo-a-passo.</p>
        </div>
      </div>
<div style={{display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", margin:"20px 0"}}>
  <Link to="/receitas/categoria/clinica" className="btn-cat">Clínica</Link>
  <Link to="/receitas/categoria/pediatrica" className="btn-cat">Pediátrica</Link>
  <Link to="/receitas/categoria/esportiva" className="btn-cat">Esportiva</Link>
  <Link to="/receitas/categoria/emagrecimento" className="btn-cat">Emagrecimento</Link>
  <Link to="/receitas/categoria/intolerancias" className="btn-cat">Intolerâncias</Link>
</div>
<style>{`
  .btn-cat {
    background:#fff;
    border:1px solid var(--border);
    padding:8px 14px;
    border-radius:8px;
    text-decoration:none;
    color:#444;
    font-weight:600;
    transition:.2s;
  }
  .btn-cat:hover {
    background:#D1A0A0;
    color:#fff;
    border-color:#D1A0A0;
  }
`}</style>
      <p className="receitas-titulo-frase">Sugestões selecionadas pela nutricionista</p>
      <div className="receitas-linha" />

      <div style={{maxWidth:1000, margin:"40px auto"}}>
        {loading ? (
          <p>Carregando…</p>
        ) : items.length === 0 ? (
          <p style={{textAlign:"center", color:"#666"}}>Nenhuma receita nesta categoria.</p>
        ) : (
          items.map(r => (
            <div className="pudim-container" key={r.id}>
            
<img className="pudim-img" src={r.thumbUrl || r.bannerUrl || "/noimg.jpg"} alt={r.titulo} />

              <div className="pudim-conteudo">
                <h2>{r.titulo}</h2>
                <p>{r.resumo || "—"}</p>
                <Link className="receitas-leia-mais" to={`/receitas/${r.slug}`}>Ler mais</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
