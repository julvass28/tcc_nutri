// src/pages/admin/FaqAdmin.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "../../css/admin-faq.css";
import ConfirmDialog from "../../components/ConfirmDialog";
import { fetchAuth, API } from "../../services/api";

export default function FaqAdmin(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  // === seu CRUD atual (mantido) ===
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ pergunta:"", resposta:"" });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try{
      const r = await fetchAuth(`${API}/admin/faq`);
      const data = await r.json();
      setItems(Array.isArray(data) ? data : []);
    }catch{
      setItems([]);
    }finally{
      setLoading(false);
    }
  };
  useEffect(()=>{ load(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(x =>
      (x.pergunta || "").toLowerCase().includes(term) ||
      (x.resposta || "").toLowerCase().includes(term)
    );
  }, [items, q]);

  const openCreate = () => { setEditing(null); setForm({pergunta:"", resposta:""}); setModalOpen(true); };
  const openEdit   = (it) => { setEditing(it); setForm({pergunta:it.pergunta||"", resposta:it.resposta||""}); setModalOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.pergunta.trim() || !form.resposta.trim()){
      alert("Preencha PERGUNTA e RESPOSTA.");
      return;
    }
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/admin/faq/${editing.id}` : `${API}/admin/faq`;
    const r = await fetchAuth(url, { method, body: JSON.stringify(form) });
    const data = await r.json();
    if (!r.ok){ alert(data?.erro || "Falha ao salvar"); return; }
    setModalOpen(false); load();
  };

  const askRemove = (it) => { setToDelete(it); setConfirmOpen(true); };
  const doRemove = async () => {
    if (!toDelete) return;
    const r = await fetchAuth(`${API}/admin/faq/${toDelete.id}`, { method:"DELETE" });
    if (!r.ok){
      const e = await r.json().catch(()=> ({}));
      alert(e?.erro || "Falha ao remover");
    }else{
      setItems(prev => prev.filter(x => x.id !== toDelete.id));
    }
    setConfirmOpen(false); setToDelete(null);
  };

  // === REORDENAR ===
  const [sortOpen, setSortOpen] = useState(false);
  const [sortList, setSortList] = useState([]);
  const dragIndexRef = useRef(null);

  const openSort = () => {
    setSortList(items.map(x => ({...x}))); // cópia para edição
    setSortOpen(true);
  };

  const onDragStart = (idx) => () => { dragIndexRef.current = idx; };
  const onDragOver  = (e) => { e.preventDefault(); };
  const onDrop      = (toIdx) => (e) => {
    e.preventDefault();
    const fromIdx = dragIndexRef.current;
    if (fromIdx === null || fromIdx === toIdx) return;

    setSortList(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    dragIndexRef.current = null;
  };

  const saveOrder = async () => {
    const ids = sortList.map(x => x.id);
    const r = await fetchAuth(`${API}/admin/faq/reordenar`, {
      method: "POST",
      body: JSON.stringify({ ids })
    });
    const data = await r.json();
    if (!r.ok){ alert(data?.erro || "Falha ao reordenar"); return; }
    setSortOpen(false);
    load();
  };

  return (
    <div className="adm-faq">
      <h2>Perguntas Frequentes ({filtered.length})</h2>

      <div className="adm-faq-toolbar">
        <div className="adm-faq-search">
          <i className="fas fa-search" />
          <input
            placeholder="Buscar por pergunta ou resposta…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div style={{display:"flex", gap:10}}>
          <button className="adm-faq-btn-primary" onClick={openSort}>
            <i className="fas fa-arrows-alt" /> Reordenar
          </button>
          <button className="adm-faq-btn-primary" onClick={openCreate}>
            <i className="fas fa-plus" /> Nova pergunta
          </button>
        </div>
      </div>

      {loading ? (
        <div className="adm-faq-empty">
          <i className="fas fa-spinner fa-spin" style={{marginRight:8}} />
          Carregando…
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-faq-empty">Nenhum item encontrado.</div>
      ) : (
        <div className="adm-faq-grid">
          {filtered.map((it) => (
            <div key={it.id} className="adm-faq-card">
              <div className="adm-faq-q">{it.pergunta}</div>
              <div className="adm-faq-a">{it.resposta}</div>
              <div className="adm-faq-meta">
                <span className="adm-faq-chip">ordem: {it.ordem ?? "-"}</span>
                <div className="adm-faq-actions">
                  <button onClick={() => openEdit(it)}>Editar</button>
                  <button className="adm-faq-danger" onClick={() => askRemove(it)}>Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Modal CRUD (mantido) === */}
      {modalOpen && (
        <div className="adm-faq-modal-back" onClick={()=>setModalOpen(false)}>
          <div className="adm-faq-modal" onClick={(e)=>e.stopPropagation()}>
            <h3>{editing ? "Editar Pergunta" : "Nova Pergunta"}</h3>
            <form className="adm-faq-form" onSubmit={save}>
              <div className="adm-faq-field">
                <label>Pergunta *</label>
                <input
                  value={form.pergunta}
                  onChange={(e)=>setForm({...form, pergunta:e.target.value})}
                  required
                />
              </div>
              <div className="adm-faq-field">
                <label>Resposta *</label>
                <textarea
                  value={form.resposta}
                  onChange={(e)=>setForm({...form, resposta:e.target.value})}
                  required
                />
              </div>
              <div className="adm-faq-modal-actions">
                <button type="button" className="adm-faq-btn" onClick={()=>setModalOpen(false)}>Cancelar</button>
                <button type="submit" className="adm-faq-btn adm-is-primary">{editing ? "Salvar" : "Criar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === Modal Reordenar === */}
      {sortOpen && (
        <div className="adm-faq-sort-backdrop" onClick={()=>setSortOpen(false)}>
          <div className="adm-faq-sort-modal" onClick={(e)=>e.stopPropagation()}>
            <div className="adm-faq-sort-head">
              <h3>Reordenar Perguntas</h3>
              <span style={{color:"#666", fontSize:13}}>Arraste o “pegador” e solte na posição desejada</span>
            </div>

            <div className="adm-faq-sort-list">
              {sortList.map((it, idx) => (
                <div
                  key={it.id}
                  className="adm-faq-sort-item"
                  draggable
                  onDragStart={onDragStart(idx)}
                  onDragOver={onDragOver}
                  onDrop={onDrop(idx)}
                >
                  <div className="adm-faq-sort-handle">
                    <i className="fas fa-grip-vertical" />
                  </div>
                  <div style={{flex:1}}>
                    <b>#{it.id}</b> — {it.pergunta}
                  </div>
                </div>
              ))}
              {sortList.length === 0 && (
                <div className="adm-faq-empty">Nada para reordenar.</div>
              )}
            </div>

            <div className="adm-faq-sort-actions">
              <button className="adm-faq-btn" onClick={()=>setSortOpen(false)}>Fechar</button>
              <button className="adm-faq-btn adm-is-primary" onClick={saveOrder}>Salvar ordem</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      <ConfirmDialog
        open={confirmOpen}
        title="Remover FAQ"
        message={toDelete ? `Deseja remover "${toDelete.pergunta}"?` : ""}
        confirmText="Remover"
        cancelText="Cancelar"
        onConfirm={doRemove}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
