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

export default function RecipesCategory() {
  const { categoria } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await fetch(`${API}/receitas?categoria=${categoria}`);
      const data = await r.json();
      setItems(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, [categoria]);

  return (
    <div className="rec-cat">
      {/* BANNER/TEXTO */}
      <div className="rec-cat-hero">
        <img
          src={comidaImg}
          alt=""
          style={{ width: "100%", height: "420px", objectFit: "cover" }}
        />
        <div className="rec-cat-hero-text">
          <h2 className="rec-cat-hero-title">
            {TITULOS[categoria] || "Receitas"}
          </h2>
          <p className="rec-cat-hero-subtitle">
            Selecione uma receita para ver o passo-a-passo.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
          margin: "20px 0",
        }}
      >
        <Link to="/receitas/categoria/clinica" className="rec-cat-btn">
          Clínica
        </Link>
        <Link to="/receitas/categoria/pediatrica" className="rec-cat-btn">
          Pediátrica
        </Link>
        <Link to="/receitas/categoria/esportiva" className="rec-cat-btn">
          Esportiva
        </Link>
        <Link to="/receitas/categoria/emagrecimento" className="rec-cat-btn">
          Emagrecimento
        </Link>
        <Link to="/receitas/categoria/intolerancias" className="rec-cat-btn">
          Intolerâncias
        </Link>
      </div>

      <style>{`
        .rec-cat-btn {
          background:#fff;
          border:1px solid var(--border);
          padding:8px 14px;
          border-radius:8px;
          text-decoration:none;
          color:#444;
          font-weight:600;
          transition:.2s;
        }
        .rec-cat-btn:hover {
          background:#D1A0A0;
          color:#fff;
          border-color:#D1A0A0;
        }
      `}</style>

      <p className="rec-cat-tagline">
        Sugestões selecionadas pela nutricionista
      </p>
      <div className="rec-cat-sep" />

      <div style={{ maxWidth: 1000, margin: "40px auto" }}>
        {loading ? (
          <p>Carregando…</p>
        ) : items.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            Nenhuma receita nesta categoria.
          </p>
        ) : (
          items.map((r) => (
            <div className="rec-cat-card" key={r.id}>
              <img
                className="rec-cat-card-img"
                src={r.thumbUrl || r.bannerUrl || "/noimg.jpg"}
                alt={r.titulo}
              />
              <div className="rec-cat-card-body">
                <h2>{r.titulo}</h2>
                <p>{r.resumo || "—"}</p>
                <Link className="rec-cat-readmore" to={`/receitas/${r.slug}`}>
                  Ler mais
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
