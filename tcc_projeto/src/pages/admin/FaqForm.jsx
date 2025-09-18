// src/pages/admin/FaqForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAuth, API } from "../../services/api";

export default function FaqForm(){
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    pergunta: "",
    resposta: "",
    categoria: "",
    ordem: 0,
    ativo: true,
  });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async ()=>{
      const r = await fetchAuth(`${API}/admin/faq/${id}`);
      const data = await r.json();
      if (!r.ok) { alert(data?.erro || "Falha ao carregar"); return; }
      setForm({
        pergunta: data.pergunta || "",
        resposta: data.resposta || "",
        categoria: data.categoria || "",
        ordem: Number.isInteger(data.ordem) ? data.ordem : 0,
        ativo: !!data.ativo,
      });
      setLoading(false);
    })();
  }, [isEdit, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.pergunta.trim() || !form.resposta.trim()) {
      alert("Preencha PERGUNTA e RESPOSTA.");
      return;
    }
    const payload = {
      ...form,
      ordem: Number(form.ordem) || 0,
      ativo: !!form.ativo,
    };
    const url = isEdit ? `${API}/admin/faq/${id}` : `${API}/admin/faq`;
    const method = isEdit ? "PUT" : "POST";
    const r = await fetchAuth(url, { method, body: JSON.stringify(payload) });
    const data = await r.json();
    if (!r.ok) { alert(data?.erro || "Falha ao salvar"); return; }
    navigate("/admin/faq");
  };

  if (loading) return <p>Carregando…</p>;

  return (
    <div className="recipe-form-page">
      <style>{`
        .card{ background:#fff; border:1px solid var(--border); border-radius:14px; padding:16px }
        .form-grid{ display:grid; gap:14px; grid-template-columns: 1fr 1fr }
        .form-grid .full{ grid-column: 1 / -1 }
        .field{ display:flex; flex-direction:column; gap:6px }
        .field label{ font-weight:600; color:#444 }
        .field input, .field select, .field textarea{
          border:1px solid var(--border); border-radius:10px; padding:10px; font:inherit; background:#fff
        }
        .row-actions{ display:flex; gap:10px; justify-content:flex-end; margin-top:14px }
        .btn{ padding:10px 14px; border-radius:12px; border:1px solid var(--border); background:#fff; cursor:pointer }
        .btn.primary{ border-color:var(--primary); color:var(--primary) }
        .btn.primary:hover{ background:var(--primary); color:#fff }
      `}</style>

      <h2>{isEdit ? "Editar FAQ" : "Nova FAQ"}</h2>

      <form className="card" onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="field full">
            <label>Pergunta *</label>
            <input
              value={form.pergunta}
              onChange={(e)=>setForm({...form, pergunta:e.target.value})}
              required
            />
          </div>

          <div className="field full">
            <label>Resposta *</label>
            <textarea
              rows={6}
              value={form.resposta}
              onChange={(e)=>setForm({...form, resposta:e.target.value})}
              required
            />
          </div>

          <div className="field">
            <label>Categoria</label>
            <input
              placeholder="Ex.: Consultas"
              value={form.categoria || ""}
              onChange={(e)=>setForm({...form, categoria:e.target.value})}
            />
          </div>

          <div className="field">
            <label>Ordem</label>
            <input
              type="number"
              value={form.ordem}
              onChange={(e)=>setForm({...form, ordem: Number(e.target.value) })}
            />
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
        </div>

        <div className="row-actions">
          <button type="button" className="btn" onClick={()=>history.back()}>Cancelar</button>
          <button className="btn primary" type="submit">{isEdit ? "Salvar" : "Criar"}</button>
        </div>
      </form>
    </div>
  );
}
