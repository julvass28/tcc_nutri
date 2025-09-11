// src/pages/admin/RecipeForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
const CATS = [
  { value:"clinica", label:"Clínica" },
  { value:"pediatrica", label:"Pediátrica" },
  { value:"esportiva", label:"Esportiva" },
  { value:"emagrecimento", label:"Emagrecimento" },
  { value:"intolerancias", label:"Intolerâncias" },
];

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

export default function RecipeForm(){
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo:"", slug:"", categoria:"clinica", resumo:"",
    bannerUrl:"", thumbUrl:"", ingredientes:[], passos:[], dicas:[], ativo:true,
  });
  const [loading, setLoading] = useState(isEdit);

  // textos multiline -> arrays
  const [ingrText, setIngrText] = useState("");
  const [passText, setPassText] = useState("");
  const [dicaText, setDicaText] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const r = await fetchAuth(`${API}/admin/receitas/${id}`);
      const data = await r.json();
      if (!r.ok) { alert(data?.erro || "Falha ao carregar"); return; }
      setForm({
        titulo: data.titulo || "",
        slug: data.slug || "",
        categoria: data.categoria || "clinica",
        resumo: data.resumo || "",
        bannerUrl: data.bannerUrl || "",
        thumbUrl: data.thumbUrl || "",
        ingredientes: Array.isArray(data.ingredientes) ? data.ingredientes : [],
        passos: Array.isArray(data.passos) ? data.passos : [],
        dicas: Array.isArray(data.dicas) ? data.dicas : [],
        ativo: !!data.ativo,
      });
      setIngrText((data.ingredientes||[]).join("\n"));
      setPassText((data.passos||[]).join("\n"));
      setDicaText((data.dicas||[]).join("\n"));
      setLoading(false);
    })();
  }, [isEdit, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.slug.trim() || !form.categoria) {
      alert("Preencha TÍTULO, SLUG e CATEGORIA.");
      return;
    }
    const payload = {
      ...form,
      ingredientes: ingrText.split("\n").map(s=>s.trim()).filter(Boolean),
      passos:       passText.split("\n").map(s=>s.trim()).filter(Boolean),
      dicas:        dicaText.split("\n").map(s=>s.trim()).filter(Boolean),
    };
    const url = isEdit ? `${API}/admin/receitas/${id}` : `${API}/admin/receitas`;
    const method = isEdit ? "PUT" : "POST";
    const r = await fetchAuth(url, { method, body: JSON.stringify(payload) });
    const data = await r.json();
    if (!r.ok) { alert(data?.erro || "Falha ao salvar"); return; }
    navigate("/admin/receitas");
  };

  if (loading) return <p>Carregando…</p>;

  return (
    <div className="recipe-form-page">
      <style>{`
        .recipe-form-page h2{ margin:0 0 12px }
        .card{ background:#fff; border:1px solid var(--border); border-radius:14px; padding:16px }
        .form-grid{ display:grid; gap:14px; grid-template-columns: 1fr 1fr }
        .form-grid .full{ grid-column: 1 / -1 }
        .field{ display:flex; flex-direction:column; gap:6px }
        .field label{ font-weight:600; color:#444 }
        .field input, .field select, .field textarea{
          border:1px solid var(--border); border-radius:10px; padding:10px; font:inherit; background:#fff
        }
        .muted{ color:#6B6B6B; font-size:12px }
        .row-actions{ display:flex; gap:10px; justify-content:flex-end; margin-top:14px }
        .btn{ padding:10px 14px; border-radius:12px; border:1px solid var(--border); background:#fff; cursor:pointer }
        .btn.primary{ border-color:var(--primary); color:var(--primary) }
        .btn.primary:hover{ background:var(--primary); color:#fff }
        @media (max-width:860px){ .form-grid{ grid-template-columns: 1fr } }
      `}</style>

      <h2>{isEdit ? "Editar receita" : "Nova receita"}</h2>

      <form className="card" onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Título *</label>
            <input
              value={form.titulo}
              onChange={(e)=>setForm({...form, titulo:e.target.value})}
              required
            />
          </div>

          <div className="field">
            <label>Slug (URL) *</label>
            <input
              value={form.slug}
              onChange={(e)=>setForm({...form, slug:e.target.value.replace(/\s+/g,"-").toLowerCase()})}
              required
            />
            <span className="muted">Ex.: bolo-de-cacau</span>
          </div>

          <div className="field">
            <label>Categoria *</label>
            <select
              value={form.categoria}
              onChange={(e)=>setForm({...form, categoria:e.target.value})}
              required
            >
              {CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Status *</label>
            <select
              value={form.ativo ? "1" : "0"}
              onChange={(e)=>setForm({...form, ativo: e.target.value==="1"})}
              required
            >
              <option value="1">Ativa</option>
              <option value="0">Inativa</option>
            </select>
          </div>

          <div className="field full">
            <label>Resumo</label>
            <textarea
              rows={3}
              value={form.resumo || ""}
              onChange={(e)=>setForm({...form, resumo:e.target.value})}
            />
          </div>

          <div className="field">
            <label>URL da imagem do banner (fundo do detalhe)</label>
            <input
              type="url"
              value={form.bannerUrl || ""}
              onChange={(e)=>setForm({...form, bannerUrl:e.target.value})}
              placeholder="https://exemplo.com/banner.jpg"
            />
          </div>

          <div className="field">
            <label>URL da imagem do card (thumbnail)</label>
            <input
              type="url"
              value={form.thumbUrl || ""}
              onChange={(e)=>setForm({...form, thumbUrl:e.target.value})}
              placeholder="https://exemplo.com/thumb.jpg"
            />
          </div>

          <div className="field full">
            <label>Ingredientes (um por linha)</label>
            <textarea rows={6} value={ingrText} onChange={(e)=>setIngrText(e.target.value)} />
          </div>

          <div className="field full">
            <label>Modo de preparo (um passo por linha)</label>
            <textarea rows={6} value={passText} onChange={(e)=>setPassText(e.target.value)} />
          </div>

          <div className="field full">
            <label>Dicas (uma por linha)</label>
            <textarea rows={4} value={dicaText} onChange={(e)=>setDicaText(e.target.value)} />
          </div>
        </div>

        <div className="row-actions">
          <button type="button" className="btn" onClick={()=>history.back()}>Cancelar</button>
          <button className="btn primary" type="submit">{isEdit ? "Salvar" : "Criar"}</button>
        </div>
      </form>
    </div>
  );
}
