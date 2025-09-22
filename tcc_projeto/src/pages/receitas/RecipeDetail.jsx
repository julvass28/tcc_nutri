// src/pages/receitas/RecipeDetail.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../css/ReceitaDetalhada.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
const CATS = new Set(["clinica","pediatrica","esportiva","emagrecimento","intolerancias"]);

export default function RecipeDetail(){
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if (CATS.has(slug)) {
      navigate(`/receitas/categoria/${slug}`, { replace: true });
      return;
    }
    (async()=>{
      setLoading(true);
      const r = await fetch(`${API}/receitas/${slug}`);
      const d = await r.json();
      setData(r.ok ? d : null);
      setLoading(false);
    })();
  }, [slug, navigate]);

  if (loading) return <p>Carregando…</p>;
  if (!data) return <p>Receita não encontrada.</p>;

  return (
    <div className="rec-detail">
      <div className="rec-detail-banner">
        <img className="rec-detail-banner-img" src={data.bannerUrl || "/noimg.jpg"} alt={data.titulo} />
        <h1 className="rec-detail-banner-title">{data.titulo}</h1>
      </div>

      <div className="rec-detail-content">
        <Link to={`/receitas/categoria/${data.categoria}`} className="rec-detail-back">← Voltar</Link>

        {data.resumo && <h2 className="rec-detail-subtitle-rose">{data.resumo}</h2>}

        {Array.isArray(data.ingredientes) && data.ingredientes.length > 0 && (
          <>
            <h3 className="rec-detail-subtitle-olive">Ingredientes</h3>
            <ul className="rec-detail-ingredients">
              {data.ingredientes.map((x,i)=><li key={i}>{x}</li>)}
            </ul>
          </>
        )}

        {Array.isArray(data.passos) && data.passos.length > 0 && (
          <>
            <h3 className="rec-detail-subtitle-olive">Modo de preparo</h3>
            <ol className="rec-detail-steps">
              {data.passos.map((x,i)=><li key={i}>{x}</li>)}
            </ol>
          </>
        )}

        {Array.isArray(data.dicas) && data.dicas.length > 0 && (
          <>
            <h3 className="rec-detail-subtitle-olive">Dicas</h3>
            <ul className="rec-detail-tips">
              {data.dicas.map((x,i)=><li key={i}>{x}</li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
