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
    // se veio um link legado tipo /receitas/clinica, manda para a listagem
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
    <div className="receitas-container">
      <div className="receitas-banner">
        <img className="receitas-imagem-banner" src={data.bannerUrl || "/noimg.jpg"} alt={data.titulo} />
        <h1 className="receitas-titulo-sobreposto">{data.titulo}</h1>
      </div>

      <div className="receitas-conteudo">
        <Link to={`/receitas/categoria/${data.categoria}`} className="receitas-voltar">← Voltar</Link>

        {data.resumo && <h2 className="receitas-subtitulo-rosa">{data.resumo}</h2>}

        {Array.isArray(data.ingredientes) && data.ingredientes.length > 0 && (
          <>
            <h3 className="receitas-subtitulo-verde">Ingredientes</h3>
            <ul className="receitas-ingredientes">
              {data.ingredientes.map((x,i)=><li key={i}>{x}</li>)}
            </ul>
          </>
        )}

        {Array.isArray(data.passos) && data.passos.length > 0 && (
          <>
            <h3 className="receitas-subtitulo-verde">Modo de preparo</h3>
            <ol className="receitas-passos">
              {data.passos.map((x,i)=><li key={i}>{x}</li>)}
            </ol>
          </>
        )}

        {Array.isArray(data.dicas) && data.dicas.length > 0 && (
          <>
            <h3 className="receitas-subtitulo-verde">Dicas</h3>
            <ul className="dicas">
              {data.dicas.map((x,i)=><li key={i}>{x}</li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
