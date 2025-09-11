// src/pages/admin/RecipesAdmin.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/admin-theme.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function fetchAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

export default function RecipesAdmin() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const [categoria, setCategoria] = useState("");
const load = async () => {
  setLoading(true);
  const url = categoria 
    ? `${API}/admin/receitas?categoria=${categoria}`
    : `${API}/admin/receitas`;
  const r = await fetchAuth(url);
  const data = await r.json();
  setItems(Array.isArray(data) ? data : []);
  setLoading(false);
};

// recarrega quando muda categoria
useEffect(() => { load(); }, [categoria]);

  const filtered = items.filter(r => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return (
      (r.titulo || "").toLowerCase().includes(term) ||
      (r.slug || "").toLowerCase().includes(term) ||
      (r.categoria || "").toLowerCase().includes(term)
    );
  });

  const removeOne = async (id) => {
    if (!confirm("Remover esta receita?")) return;
    const r = await fetchAuth(`${API}/admin/receitas/${id}`, { method: "DELETE" });
    if (r.ok) setItems(prev => prev.filter(x => x.id !== id));
    else alert("Falha ao remover");
  };

  return (
    <div className="recipes-admin">
      <style>{`
        .recipes-admin h2{ margin:0 0 12px }
        .recipes-toolbar{ display:flex; gap:12px; align-items:center; justify-content:space-between; margin-bottom:12px }
        .recipes-search{ flex:1; min-width:240px; display:flex; gap:8px; align-items:center; background:#fff; border:1px solid var(--border); border-radius:999px; padding:8px 12px }
        .recipes-search input{ border:none; outline:none; background:transparent; flex:1; font:inherit }
        .recipes-grid{ display:grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap:14px }
        .recipe-card{ background:#fff; border:1px solid var(--border); border-radius:14px; overflow:hidden; display:flex; flex-direction:column }
        .recipe-card img{ width:100%; height:140px; object-fit:cover }
        .recipe-card .body{ padding:12px }
        .recipe-card .meta{ display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:8px }
        .chip{ font-size:12px; border:1px solid var(--border); border-radius:999px; padding:2px 8px; background:#fff }
        .actions{ display:flex; gap:8px; }
        .actions button, .actions a{ padding:8px 10px; border-radius:10px; border:1px solid var(--border); background:#fff; cursor:pointer; text-decoration:none; color:inherit }
        .actions .danger{ border-color:var(--accent); color:var(--accent) }
        .empty{ padding:18px; text-align:center; color:#666; background:#fff; border:1px solid var(--border); border-radius:14px }
      `}</style>

      <h2>Receitas ({filtered.length})</h2>

      <div className="recipes-toolbar">
  <div className="recipes-search">
    <i className="fas fa-search" />
    <input
      placeholder="Buscar por título, slug, categoria…"
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
  </div>

  <select
    value={categoria}
    onChange={(e)=>setCategoria(e.target.value)}
    className="btn-top"
  >
    <option value="">Todas categorias</option>
    <option value="clinica">Clínica</option>
    <option value="pediatrica">Pediátrica</option>
    <option value="esportiva">Esportiva</option>
    <option value="emagrecimento">Emagrecimento</option>
    <option value="intolerancias">Intolerâncias</option>
  </select>

  <Link to="/admin/receitas/new" className="btn-top">+ Nova Receita</Link>
</div>

      {loading ? (
        <p>Carregando…</p>
      ) : filtered.length === 0 ? (
        <div className="empty">Nenhuma receita encontrada.</div>
      ) : (
        <div className="recipes-grid">
          {filtered.map((r) => (
            <div className="recipe-card" key={r.id}>
              {(r.thumbUrl || r.bannerUrl) ? (
                <img src={r.thumbUrl || r.bannerUrl} alt={r.titulo} />
              ) : (
                <div style={{height:140, display:"grid", placeItems:"center", color:"#aaa"}}>Sem imagem</div>
              )}
              <div className="body">
                <b>{r.titulo}</b>
                <div className="meta">
                  <span className="chip">{r.categoria}</span>
                  <span className="chip" style={{background:r.ativo ? "rgba(138,143,117,.10)" : "#fff"}}>
                    {r.ativo ? "Ativa" : "Inativa"}
                  </span>
                </div>
                <div className="actions" style={{marginTop:10}}>
                  <a onClick={() => navigate(`/admin/receitas/${r.id}/edit`)}>✏️ Editar</a>
                  <button className="danger" onClick={() => removeOne(r.id)}>🗑️ Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
