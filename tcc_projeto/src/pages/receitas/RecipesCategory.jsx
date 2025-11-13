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
        <img src={comidaImg} alt="" className="rec-cat-hero-img" />
        <div className="rec-cat-hero-text">
          <h2 className="rec-cat-hero-title">
            {TITULOS[categoria] || "Receitas"}
          </h2>
          <p className="rec-cat-hero-subtitle">
            Selecione uma receita para ver o passo-a-passo.
          </p>
        </div>
      </div>

      {/* BARRA DE CATEGORIAS – modelo inspirado em Dicas */}
      <div className="rec-cat-nav-wrapper">
        <div className="rec-cat-nav-scroll">
          <nav
            className="rec-cat-nav"
            aria-label="Categorias de receitas"
          >
            <Link
              to="/receitas/categoria/clinica"
              className={`rec-cat-nav-btn ${
                categoria === "clinica" ? "is-active" : ""
              }`}
            >
              Clínica
            </Link>
            <Link
              to="/receitas/categoria/pediatrica"
              className={`rec-cat-nav-btn ${
                categoria === "pediatrica" ? "is-active" : ""
              }`}
            >
              Pediátrica
            </Link>
            <Link
              to="/receitas/categoria/esportiva"
              className={`rec-cat-nav-btn ${
                categoria === "esportiva" ? "is-active" : ""
              }`}
            >
              Esportiva
            </Link>
            <Link
              to="/receitas/categoria/emagrecimento"
              className={`rec-cat-nav-btn ${
                categoria === "emagrecimento" ? "is-active" : ""
              }`}
            >
              Emagrecimento
            </Link>
            <Link
              to="/receitas/categoria/intolerancias"
              className={`rec-cat-nav-btn ${
                categoria === "intolerancias" ? "is-active" : ""
              }`}
            >
              Intolerâncias
            </Link>
          </nav>
        </div>
      </div>

      <p className="rec-cat-tagline">
        Sugestões selecionadas pela nutricionista
      </p>
      <div className="rec-cat-sep" />

      <div className="rec-cat-list-wrapper">
        {loading ? (
          <p className="rec-cat-loading">Carregando…</p>
        ) : items.length === 0 ? (
          <p className="rec-cat-empty">
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
                <Link
                  className="rec-cat-readmore"
                  to={`/receitas/${r.slug}`}
                >
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
