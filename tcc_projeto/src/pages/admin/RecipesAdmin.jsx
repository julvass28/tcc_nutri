// src/pages/admin/RecipesAdmin.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/admin-theme.css";
import ConfirmDialog from "../../components/ConfirmDialog";
import { FaHandshakeAltSlash } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fetchAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
}

export default function RecipesAdmin() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const [categoria, setCategoria] = useState("");
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const load = async () => {
    setLoading(true);
    const url = categoria ? `${API}/admin/receitas?categoria=${categoria}` : `${API}/admin/receitas`;
    const r = await fetchAuth(url);
    const data = await r.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [categoria]);

  const filtered = items.filter((r) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return (
      (r.titulo || "").toLowerCase().includes(term) ||
      (r.slug || "").toLowerCase().includes(term) ||
      (r.categoria || "").toLowerCase().includes(term)
    );
  });

  const handleEdit = async (id) => {
    if (editingId || deletingId) return;
    setEditingId(id);
    await sleep(200);
    navigate(`/admin/receitas/${id}/edit`);
  };

  const askRemove = (id) => setConfirm({ open: true, id });

  const doRemove = async () => {
    if (!confirm.id) return;
    setDeletingId(confirm.id);
    try {
      const r = await fetchAuth(`${API}/admin/receitas/${confirm.id}`, { method: "DELETE" });
      if (r.ok) setItems((prev) => prev.filter((x) => x.id !== confirm.id));
      else alert("Falha ao remover");
    } finally {
      setDeletingId(null);
      setConfirm({ open: false, id: null });
    }
  };

  const cancelConfirm = () => {
    if (deletingId) return;
    setConfirm({ open: false, id: null });
  };

  return (
    <div className="adm-recipes">
      <style>{`
        .adm-recipes h2{ margin:0 0 12px }
        .adm-recipes-toolbar{ display:flex; gap:12px; align-items:center; justify-content:space-between; margin-bottom:12px }
        .adm-recipes-search{ flex:1; min-width:240px; display:flex; gap:8px; align-items:center; background:#fff; border:1px solid var(--border); border-radius:999px; padding:8px 12px }
        .adm-recipes-search input{ border:none; outline:none; background:transparent; flex:1; font:inherit }

        .adm-recipes-grid{ display:grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap:14px }
        .adm-recipe-card{ background:#fff; border:1px solid var(--border); border-radius:14px; overflow:hidden; display:flex; flex-direction:column }
        .adm-recipe-card img{ width:100%; height:140px; object-fit:cover }
        .adm-recipe-body{ padding:12px }
        .adm-recipe-meta{ display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:8px }
        .adm-recipe-chip{ font-size:12px; border:1px solid var(--border); border-radius:999px; padding:2px 8px; background:#fff }
        .adm-actions{ display:flex; gap:8px; }
        .adm-empty{ padding:18px; text-align:center; color:#666; background:#fff; border:1px solid var(--border); border-radius:14px }
        .adm-btn-icon-gap{ display:inline-flex; align-items:center; gap:6px }
        .adm-is-busy{ opacity:.7; pointer-events:none }
      `}</style>

      <h2>Receitas ({filtered.length})</h2>

      <div className="adm-recipes-toolbar">
        <div className="adm-recipes-search">
          <i className="fas fa-search" />
          <input
            placeholder="Buscar por título, slug, categoria…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="adm-btn"
        >
          <option value="">Todas categorias</option>
          <option value="clinica">Clínica</option>
          <option value="pediatrica">Pediátrica</option>
          <option value="esportiva">Esportiva</option>
          <option value="emagrecimento">Emagrecimento</option>
          <option value="intolerancias">Intolerâncias</option>
        </select>

        <Link to="/admin/receitas/new" className="adm-btn">+ Nova Receita</Link>
      </div>

      {loading ? (
        <p aria-live="polite">
          <i className="fas fa-spinner fa-spin" aria-hidden="true" style={{marginRight:8}}/>
          Carregando…
        </p>
      ) : filtered.length === 0 ? (
        <div className="adm-empty">Nenhuma receita encontrada.</div>
      ) : (
        <div className="adm-recipes-grid">
          {filtered.map((r) => {
            const isEditing = editingId === r.id;
            const isDeleting = deletingId === r.id;
            return (
              <div className={`adm-recipe-card ${isDeleting ? "adm-is-busy":""}`} key={r.id}>
                {(r.thumbUrl || r.bannerUrl) ? (
                  <img src={r.thumbUrl || r.bannerUrl} alt={r.titulo} />
                ) : (
                  <div style={{height:140, display:"grid", placeItems:"center", color:"#aaa"}}>Sem imagem</div>
                )}
                <div className="adm-recipe-body">
                  <b>{r.titulo}</b>
                  <div className="adm-recipe-meta">
                    <span className="adm-recipe-chip">{r.categoria}</span>
                    <span className="adm-recipe-chip" style={{background:r.ativo ? "rgba(138,143,117,.10)" : "#fff"}}>
                      {r.ativo ? "Ativa" : "Inativa"}
                    </span>
                  </div>

                  <div className="adm-actions" style={{marginTop:10}}>
                    <button
                      className="adm-btn"
                      onClick={() => handleEdit(r.id)}
                      disabled={!!editingId || !!deletingId}
                      aria-busy={isEditing ? "true" : "false"}
                    >
                      <span className="adm-btn-icon-gap">
                        {isEditing && <i className="fas fa-spinner fa-spin" aria-hidden="true" />}
                        Editar
                      </span>
                    </button>

                    <button
                      className="adm-btn adm-btn--danger"
                      onClick={() => askRemove(r.id)}
                      disabled={!!editingId || !!deletingId}
                      aria-busy={isDeleting ? "true" : "false"}
                    >
                      <span className="adm-btn-icon-gap">
                        {isDeleting && <i className="fas fa-spinner fa-spin" aria-hidden="true" />}
                        {isDeleting ? "Excluindo..." : "Excluir"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirm.open}
        title="Remover receita"
        message="Essa ação não pode ser desfeita. Deseja remover esta receita?"
        confirmText={deletingId ? "Removendo..." : "Remover"}
        cancelText="Cancelar"
        onConfirm={doRemove}
        onClose={cancelConfirm}
      />
    </div>
  );
}
