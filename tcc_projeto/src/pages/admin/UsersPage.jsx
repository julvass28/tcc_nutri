// src/pages/admin/UsersPage.jsx
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../../components/ConfirmDialog";
import "../../css/admin-theme.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function fetchAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
}

export default function UsersPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState("");
  const [onlyAdmins, setOnlyAdmins] = useState(false);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // modal detalhe
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(false);

  // dialog remover
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    const r = await fetchAuth(`${API}/admin/users`);
    const data = await r.json();
    setList(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let data = [...list];
    const q = search.trim().toLowerCase();
    if (q) {
      data = data.filter(u =>
        (u.nome || "").toLowerCase().includes(q) ||
        (u.sobrenome || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
      );
    }
    if (onlyAdmins) data = data.filter(u => !!u.isAdmin);
    data.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === "nome") {
        va = `${a.nome || ""} ${a.sobrenome || ""}`.trim().toLowerCase();
        vb = `${b.nome || ""} ${b.sobrenome || ""}`.trim().toLowerCase();
      }
      if (sortKey === "createdAt" || sortKey === "updatedAt") {
        va = va ? new Date(va).getTime() : 0;
        vb = vb ? new Date(vb).getTime() : 0;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [list, search, onlyAdmins, sortKey, sortDir]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageSafe]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir(key === "nome" ? "asc" : "desc"); }
  };

  const openDetail = async (id) => {
    const r = await fetchAuth(`${API}/admin/users/${id}`);
    const data = await r.json();
    setSelected(data);
    setModal(true);
  };

  const askRemove = (u) => { setToDelete(u); setConfirmOpen(true); };

  const doRemove = async () => {
    if (!toDelete) return;
    const r = await fetchAuth(`${API}/admin/users/${toDelete.id}`, { method: "DELETE" });
    if (r.ok) {
      setList(prev => prev.filter(u => u.id !== toDelete.id));
      if (selected?.id === toDelete.id) setModal(false);
      setConfirmOpen(false); setToDelete(null);
    } else {
      const e = await r.json().catch(() => ({}));
      alert(e?.erro || "Falha ao remover");
    }
  };

  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => { if (e.key === "Escape") setModal(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="adm-users">
      <h2>Usuários ({total})</h2>

      <div className="adm-toolbar">
        <div className="adm-searchbox">
          <i className="fas fa-search" aria-hidden="true" />
          <input
            placeholder="Buscar por nome ou e-mail…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <label className="adm-users-chk">
          <input
            type="checkbox"
            checked={onlyAdmins}
            onChange={(e) => { setOnlyAdmins(e.target.checked); setPage(1); }}
          />
          Somente admins
        </label>
      </div>

      <div className="adm-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Avatar</th>
              <th role="button" onClick={() => toggleSort("nome")}>
                Nome {sortKey === "nome" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th role="button" onClick={() => toggleSort("email")}>
                Email {sortKey === "email" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th role="button" onClick={() => toggleSort("isAdmin")}>
                Admin {sortKey === "isAdmin" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th>Agendamento</th>
              <th>Pagamento</th>
              <th role="button" onClick={() => toggleSort("createdAt")}>
                Criado em {sortKey === "createdAt" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.fotoUrl ? (
                    <img
                      src={u.fotoUrl}
                      alt={u.nome || u.email}
                      style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }}
                    />
                  ) : ("—")}
                </td>
                <td>{u.nome || "—"} {u.sobrenome || ""}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`adm-badge ${u.isAdmin ? "adm-is-ok" : ""}`}>
                    {u.isAdmin ? "Sim" : "Não"}
                  </span>
                </td>
                <td><span className="adm-pill adm-is-muted">—</span></td>
                <td><span className="adm-pill adm-is-muted">—</span></td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                <td className="adm-actions">
                  <button onClick={() => openDetail(u.id)} className="adm-btn">Ver</button>
                  <button onClick={() => askRemove(u)} className="adm-btn adm-btn--danger">Remover</button>
                </td>
              </tr>
            ))}

            {slice.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#666" }}>
                  Nada encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="adm-pager">
        <button disabled={pageSafe <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="adm-btn">
          Anterior
        </button>
        <span>Página {pageSafe} de {totalPages}</span>
        <button disabled={pageSafe >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="adm-btn">
          Próxima
        </button>
      </div>

      {/* modal de perfil */}
      {modal && selected && (
        <div className="adm-users-modal-backdrop" onClick={() => setModal(false)}>
          <div className="adm-users-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="adm-users-modal-head">
              <h3>Perfil</h3>
              <button className="adm-users-x" onClick={() => setModal(false)} aria-label="Fechar">✕</button>
            </div>
            <div className="adm-users-profile-row">
              {selected.fotoUrl ? (
                <img
                  src={selected.fotoUrl}
                  alt={selected.nome || selected.email}
                  style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover" }}
                />
              ) : (<div className="adm-users-avatar-placeholder">?</div>)}
              <div>
                <p><b>Nome:</b> {selected.nome || "—"} {selected.sobrenome || ""}</p>
                <p><b>Email:</b> {selected.email}</p>
                <p><b>Admin:</b> {selected.isAdmin ? "Sim" : "Não"}</p>
                <p><b>Criado em:</b> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}</p>
                {selected.genero && <p><b>Gênero:</b> {selected.genero}</p>}
                {selected.data_nascimento && <p><b>Nascimento:</b> {String(selected.data_nascimento).slice(0,10)}</p>}
                {selected.altura != null && <p><b>Altura:</b> {selected.altura} m</p>}
                {selected.peso != null && <p><b>Peso:</b> {selected.peso} kg</p>}
                {selected.objetivo && <p><b>Objetivo:</b> {selected.objetivo}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* diálogo de confirmação (cd-* mantido) */}
      <ConfirmDialog
        open={confirmOpen}
        title="Remover login"
        message={toDelete ? `Tem certeza que deseja remover o login de "${toDelete.email}"?` : ""}
        confirmText="Remover"
        cancelText="Cancelar"
        onConfirm={doRemove}
        onClose={() => setConfirmOpen(false)}
      />

      {/* escopo local para evitar vazamento */}
      <style>{`
        .adm-users h2{margin:0 0 12px}
        .adm-users .adm-toolbar{margin-bottom:12px}

        .adm-users .adm-table-wrap{background:#fff;border:1px solid var(--border);border-radius:16px;overflow:auto}
        .adm-users .adm-table-wrap table{width:100%;border-collapse:collapse;min-width:760px}
        .adm-users .adm-table-wrap th, .adm-users .adm-table-wrap td{padding:12px;border-bottom:1px solid #f1eeec;text-align:left}
        .adm-users .adm-table-wrap th{background:#faf9f9;font-weight:600;user-select:none;color:#494949}
        .adm-users .adm-table-wrap th[role="button"]{cursor:pointer}

        /* base para botões desta página sem vazar global */
        .adm-users button{padding:8px 12px;border-radius:12px;border:1px solid var(--border);background:#fff;cursor:pointer}

        .adm-users .adm-pager{display:flex;align-items:center;gap:12px;justify-content:flex-end;margin-top:12px}

        /* modal */
        .adm-users-modal-backdrop{
          position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;padding:16px;z-index:60
        }
        .adm-users-modal-card{
          background:#fff;width:min(720px,100%);border-radius:16px;padding:20px;
          box-shadow:var(--shadow-md);border:1px solid var(--border)
        }
        .adm-users-modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
        .adm-users-x{border:none;background:transparent;font-size:18px;cursor:pointer}
        .adm-users-profile-row{display:flex;gap:16px;align-items:flex-start}
        .adm-users-avatar-placeholder{
          width:80px;height:80px;border-radius:12px;display:inline-grid;place-items:center;background:#f0f0f0;font-weight:700;color:#888
        }
      `}</style>
    </div>
  );
}
