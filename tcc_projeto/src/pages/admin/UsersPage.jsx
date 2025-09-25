// src/pages/admin/UsersPage.jsx
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../../components/ConfirmDialog";
import "../../css/admin-theme.css";
import { FaUser } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function Avatar({ src, size = "sm", alt = "avatar" }) {
  const [broken, setBroken] = useState(false);
  const cls =
    size === "lg" ? "adm-avatar adm-avatar-lg" : "adm-avatar adm-avatar-sm";

  if (!src || broken) {
    return (
      <div className={`${cls} is-icon`} aria-label={alt} title={alt}>
        <FaUser />
      </div>
    );
  }
  return (
    <img className={cls} src={src} alt={alt} onError={() => setBroken(true)} />
  );
}

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

export default function UsersPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState("");
  const [onlyAdmins, setOnlyAdmins] = useState(false);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [opLoading, setOpLoading] = useState({ open: false, text: "" });
const [me, setMe] = useState(null);            // quem está logado
const [busy, setBusy] = useState(false);       // overlay rosê de carregamento
// Filtros
const [papel, setPapel] = useState("all");            // 'all' | 'admin' | 'nonadmin'
const [datePreset, setDatePreset] = useState("all");  // 'all' | 'today' | '7d' | '30d' | 'custom'
const [dateFrom, setDateFrom] = useState("");
const [dateTo, setDateTo] = useState("");
const [hasPhoto, setHasPhoto] = useState("all");      // 'all' | 'yes' | 'no'

// confirmar promoção/despromoção
const [confirmRoleOpen, setConfirmRoleOpen] = useState(false);
const [roleTarget, setRoleTarget] = useState(null);
const [roleMakeAdmin, setRoleMakeAdmin] = useState(null);

  const pageSize = 10;

  const [notice, setNotice] = useState({
  open: false,
  title: "",
  message: "",
  tone: "error", // 'error' | 'info' | 'success'
});

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
  useEffect(() => {
    load();
  }, []);
useEffect(() => {
  (async () => {
    const r = await fetchAuth(`${API}/me`);
    const data = await r.json();
    setMe(data);
  })();
}, []);
  useEffect(() => {
    if (!notice.open) return;
    const onKey = (e) =>
      e.key === "Escape" && setNotice((s) => ({ ...s, open: false }));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notice.open]);
  useEffect(() => {
    if (!notice.open) return;
    const t = setTimeout(() => setNotice((s) => ({ ...s, open: false })), 3500);
    return () => clearTimeout(t);
  }, [notice.open]);

 const filtered = useMemo(() => {
  const now = new Date();
  let fromMs = null, toMs = null;

  // período rápido
  if (datePreset === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    fromMs = start.getTime();
    toMs = start.getTime() + 24 * 60 * 60 * 1000;
  } else if (datePreset === "7d") {
    fromMs = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  } else if (datePreset === "30d") {
    fromMs = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  } else if (datePreset === "custom") {
    if (dateFrom) fromMs = new Date(dateFrom + "T00:00:00").getTime();
    if (dateTo)   toMs   = new Date(dateTo   + "T23:59:59").getTime();
  }

  let data = [...list];

  // busca
  const q = search.trim().toLowerCase();
  if (q) {
    data = data.filter(u =>
      (u.nome || "").toLowerCase().includes(q) ||
      (u.sobrenome || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  }

  // papel
  if (papel === "admin") data = data.filter(u => !!u.isAdmin);
  if (papel === "nonadmin") data = data.filter(u => !u.isAdmin);

  // período
  if (fromMs || toMs) {
    data = data.filter(u => {
      const t = u.createdAt ? new Date(u.createdAt).getTime() : 0;
      if (fromMs && t < fromMs) return false;
      if (toMs && t > toMs) return false;
      return true;
    });
  }

  // foto
  if (hasPhoto === "yes") data = data.filter(u => !!u.fotoUrl);
  if (hasPhoto === "no")  data = data.filter(u => !u.fotoUrl);

  // ordenação (mesma lógica que você já tinha)
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
}, [list, search, papel, datePreset, dateFrom, dateTo, hasPhoto, sortKey, sortDir]);


  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageSafe]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "nome" ? "asc" : "desc");
    }
  };

  const openDetail = async (id) => {
    const r = await fetchAuth(`${API}/admin/users/${id}`);
    const data = await r.json();
    setSelected(data);
    setModal(true);
  };

  const askRemove = (u) => {
    setToDelete(u);
    setConfirmOpen(true);
  };

  const doRemove = async () => {
    if (!toDelete) return;

    // abre o mini pop-up com spinner rosê
    setOpLoading({ open: true, text: "Removendo..." });
    const t0 = performance.now();

    try {
      const r = await fetchAuth(`${API}/admin/users/${toDelete.id}`, {
        method: "DELETE",
      });

      // garante pelo menos ~700ms para o feedback visual
      const left = Math.max(0, 700 - (performance.now() - t0));
      if (left) await new Promise((res) => setTimeout(res, left));

      setOpLoading({ open: false, text: "" });

      if (r.ok) {
        setList((prev) => prev.filter((u) => u.id !== toDelete.id));
        if (selected?.id === toDelete.id) setModal(false);
        setConfirmOpen(false);
        setToDelete(null);

        // toast VERDE de sucesso, “descendo”
        setNotice({
          open: true,
          title: "Removido",
          message: "Usuário removido com sucesso.",
          tone: "success",
        });
      } else {
        const e = await r.json().catch(() => ({}));
        setNotice({
          open: true,
          title: "Ação bloqueada",
          message: e?.erro || "Falha ao remover.",
          tone: "error",
        });
      }
    } catch {
      const left = Math.max(0, 700 - (performance.now() - t0));
      if (left) await new Promise((res) => setTimeout(res, left));
      setOpLoading({ open: false, text: "" });

      setNotice({
        open: true,
        title: "Erro",
        message: "Falha de rede ao remover.",
        tone: "error",
      });
    }
  };

  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => {
      if (e.key === "Escape") setModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  if (loading) return <p>Carregando...</p>;
function canPromote(actor, target) {
  if (!actor?.isAdmin) return false;
  if (actor?.id === target?.id) return false;         // não mexe em si mesmo
  if (target?.isOwner) return false;                  // nunca mexe no owner
  if (!!target?.isAdmin) return false;                // já é admin
  // sub-admin pode promover usuário comum
  return true;
}

function canDemote(actor, target) {
  if (!actor?.isAdmin) return false;
  if (actor?.id === target?.id) return false;         // não mexe em si mesmo
  if (target?.isOwner) return false;                  // nunca mexe no owner
  // só o Líder Geral pode despromover admin
  if (!!target?.isAdmin && actor?.isOwner) return true;
  return false;
}

async function updateRole(targetId, makeAdmin) {
  try {
    setBusy(true);
    const r = await fetchAuth(`${API}/admin/users/${targetId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ isAdmin: makeAdmin }),
    });
    const data = await r.json().catch(() => ({}));

    setBusy(false);

    if (!r.ok) {
      return setNotice({
        open: true,
        title: "Ação bloqueada",
        message: data?.erro || "Não foi possível alterar o papel.",
        tone: "error",
      });
    }

    // atualiza lista e modal
    setList((prev) => prev.map((u) => (u.id === targetId ? { ...u, isAdmin: makeAdmin } : u)));
    setSelected((s) => (s && s.id === targetId ? { ...s, isAdmin: makeAdmin } : s));

    setNotice({
      open: true,
      title: "Tudo certo",
      message: makeAdmin ? "Usuário promovido a administrador." : "Usuário despromovido.",
      tone: "success",
    });
  } catch {
    setBusy(false);
    setNotice({
      open: true,
      title: "Erro",
      message: "Falha ao comunicar com o servidor.",
      tone: "error",
    });
  }
}

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

  <div className="adm-filterbar">
    {/* Papel */}
    <label className="adm-filter">
      <span>Papel</span>
      <select value={papel} onChange={(e) => { setPapel(e.target.value); setPage(1); }}>
        <option value="all">Todos</option>
        <option value="admin">Admins</option>
        <option value="nonadmin">Não-admins</option>
      </select>
    </label>

    {/* Período */}
    <label className="adm-filter">
      <span>Período</span>
      <select
        value={datePreset}
        onChange={(e) => {
          const v = e.target.value;
          setDatePreset(v);
          if (v !== "custom") { setDateFrom(""); setDateTo(""); }
          setPage(1);
        }}
      >
        <option value="all">Todos</option>
        <option value="today">Hoje</option>
        <option value="7d">Últimos 7 dias</option>
        <option value="30d">Últimos 30 dias</option>
        <option value="custom">Personalizado</option>
      </select>
    </label>

    {datePreset === "custom" && (
      <div className="adm-filter custom-range">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          aria-label="Data inicial"
        />
        <span className="sep">—</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          aria-label="Data final"
        />
      </div>
    )}

    {/* Avatar */}
    <label className="adm-filter">
      <span>Foto</span>
      <select value={hasPhoto} onChange={(e) => { setHasPhoto(e.target.value); setPage(1); }}>
        <option value="all">Todas</option>
        <option value="yes">Com foto</option>
        <option value="no">Sem foto</option>
      </select>
    </label>

    <button
      type="button"
      className="adm-btn adm-btn--ghost"
      onClick={() => {
        setPapel("all");
        setDatePreset("all");
        setDateFrom("");
        setDateTo("");
        setHasPhoto("all");
        setSearch("");
        setSortKey("createdAt");
        setSortDir("desc");
        setPage(1);
      }}
    >
      Limpar filtros
    </button>
  </div>
</div>
<div className="adm-active-filters">
  {papel !== "all" && (
    <button className="adm-chip" onClick={() => { setPapel("all"); setPage(1); }}>
      Papel: {papel === "admin" ? "Admins" : "Não-admins"} <span>×</span>
    </button>
  )}
  {datePreset !== "all" && datePreset !== "custom" && (
    <button className="adm-chip" onClick={() => { setDatePreset("all"); setPage(1); }}>
      Período: {datePreset === "today" ? "Hoje" : datePreset === "7d" ? "7 dias" : "30 dias"} <span>×</span>
    </button>
  )}
  {datePreset === "custom" && (dateFrom || dateTo) && (
    <button className="adm-chip" onClick={() => { setDatePreset("all"); setDateFrom(""); setDateTo(""); setPage(1); }}>
      Período: {dateFrom || "…"} — {dateTo || "…"} <span>×</span>
    </button>
  )}
  {hasPhoto !== "all" && (
    <button className="adm-chip" onClick={() => { setHasPhoto("all"); setPage(1); }}>
      {hasPhoto === "yes" ? "Com foto" : "Sem foto"} <span>×</span>
    </button>
  )}
  {search.trim() && (
    <button className="adm-chip" onClick={() => { setSearch(""); setPage(1); }}>
      Busca: “{search.trim()}” <span>×</span>
    </button>
  )}
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
                Email{" "}
                {sortKey === "email" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th role="button" onClick={() => toggleSort("isAdmin")}>
                Admin{" "}
                {sortKey === "isAdmin" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th>Agendamento</th>
              <th>Pagamento</th>
              <th role="button" onClick={() => toggleSort("createdAt")}>
                Criado em{" "}
                {sortKey === "createdAt" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((u) => (
              <tr key={u.id}>
                <td>
                  <Avatar
                    src={u.fotoUrl}
                    alt={(u.nome || u.email) + " avatar"}
                  />
                </td>
                <td>
                  {u.nome || "—"} {u.sobrenome || ""}
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`adm-badge ${u.isAdmin ? "adm-is-ok" : ""}`}>
                    {u.isAdmin ? "Sim" : "Não"}
                  </span>
                </td>
                <td>
                  <span className="adm-pill adm-is-muted">—</span>
                </td>
                <td>
                  <span className="adm-pill adm-is-muted">—</span>
                </td>
                <td>
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="adm-actions">
                  <button onClick={() => openDetail(u.id)} className="adm-btn">
                    Ver
                  </button>
                  <button
                    onClick={() => askRemove(u)}
                    className="adm-btn adm-btn--danger"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}

            {slice.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: "center", padding: 24, color: "#666" }}
                >
                  Nada encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="adm-pager">
        <button
          disabled={pageSafe <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="adm-btn"
        >
          Anterior
        </button>
        <span>
          Página {pageSafe} de {totalPages}
        </span>
        <button
          disabled={pageSafe >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="adm-btn"
        >
          Próxima
        </button>
      </div>

      {/* modal de perfil */}
      {modal && selected && (
        <div
          className="adm-users-modal-backdrop"
          onClick={() => setModal(false)}
        >
          <div
            className="adm-users-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-users-modal-head">
              <h3>Perfil</h3>
              <button
                className="adm-users-x"
                onClick={() => setModal(false)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
            <div className="adm-users-profile-row">
         

                <Avatar
                  src={selected.fotoUrl}
                  size="lg"
                  alt={(selected.nome || selected.email) + " avatar"}
                />
           
              <div>
                <p>
                  <b>Nome:</b> {selected.nome || "—"} {selected.sobrenome || ""}
                </p>
                <p>
                  <b>Email:</b> {selected.email}
                </p>
                <p>
                  <b>Admin:</b> {selected.isAdmin ? "Sim" : "Não"}
                </p>
                <p>
                  <b>Criado em:</b>{" "}
                  {selected.createdAt
                    ? new Date(selected.createdAt).toLocaleString()
                    : "—"}
                </p>
                {selected.genero && (
                  <p>
                    <b>Gênero:</b> {selected.genero}
                  </p>
                )}
                {selected.data_nascimento && (
                  <p>
                    <b>Nascimento:</b>{" "}
                    {String(selected.data_nascimento).slice(0, 10)}
                  </p>
                )}
                {selected.altura != null && (
                  <p>
                    <b>Altura:</b> {selected.altura} m
                  </p>
                )}
                {selected.peso != null && (
                  <p>
                    <b>Peso:</b> {selected.peso} kg
                  </p>
                )}
                {selected.objetivo && (
                  <p>
                    <b>Objetivo:</b> {selected.objetivo}
                  </p>
                )}
              </div>
                  {selected && me && (
  <div className="adm-priv-actions">
    {canPromote(me, selected) && (
      <button
        className="adm-btn--promote"
        onClick={() => { setRoleTarget(selected); setRoleMakeAdmin(true); setConfirmRoleOpen(true); }}
      >
        Promover a administrador
      </button>
    )}

    {canDemote(me, selected) && (
      <button
        className="adm-btn--demote"
        onClick={() => { setRoleTarget(selected); setRoleMakeAdmin(false); setConfirmRoleOpen(true); }}
      >
        Remover privilégio admin
      </button>
    )}
  </div>
)}
            </div>
          </div>
        </div>
      )}
<ConfirmDialog
  open={confirmRoleOpen}
  title={roleMakeAdmin ? "Promover a administrador" : "Remover privilégio admin"}
  message={
    roleTarget
      ? roleMakeAdmin
        ? `Deseja promover "${roleTarget.email}" a administrador?`
        : `Deseja remover o privilégio de administrador de "${roleTarget.email}"?`
      : ""
  }
  confirmText={roleMakeAdmin ? "Promover" : "Remover privilégio"}
  cancelText="Cancelar"
  onConfirm={() => {
    setConfirmRoleOpen(false);
    if (roleTarget) updateRole(roleTarget.id, roleMakeAdmin);
  }}
  onClose={() => setConfirmRoleOpen(false)}
/>

      {/* diálogo de confirmação (cd-* mantido) */}
      <ConfirmDialog
        open={confirmOpen}
        title="Remover login"
        message={
          toDelete
            ? `Tem certeza que deseja remover o login de "${toDelete.email}"?`
            : ""
        }
        confirmText="Remover"
        cancelText="Cancelar"
        onConfirm={doRemove}
        onClose={() => setConfirmOpen(false)}
      />
      {notice.open && (
        <div
          className={`adm-notice-toaster ${confirmOpen || confirmRoleOpen ? "near-modal" : ""}`}
        >
          <div
            className={`adm-notice-toast ${
              notice.tone === "error" ? "is-error" : "is-info"
            }`}
            role="status"
            aria-live="polite"
          >
            <i
              className={`fas ${
                notice.tone === "error"
                  ? "fa-triangle-exclamation"
                  : "fa-circle-info"
              }`}
              aria-hidden="true"
            />
            <span>{notice.message}</span>
          </div>
        </div>
      )}
      {opLoading.open && (
        <div className="adm-op-overlay" role="status" aria-live="polite">
          <div className="adm-op-card">
            <i className="fas fa-spinner fa-spin" aria-hidden="true" />
            <span>{opLoading.text || "Processando..."}</span>
          </div>
        </div>
      )}

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
/* ===== Toast flutuante — moderno e central ===== */

/* Container centralizado (e desloca perto do modal quando precisar) */
.adm-notice-toaster{
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 14vh;                         /* posição padrão */
  z-index: 90;                       /* acima do modal (que usa ~60) */
  pointer-events: none;              /* container não captura clique */
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 12px;
}

.adm-notice-toaster.near-modal{
  top: calc(50vh - 220px);           /* “encosta” no popup de deletar */
}

/* Cartão: vidro (blur), sombra, leve “pop” ao entrar */
.adm-notice-toast{
  position: relative;
  pointer-events: auto;              /* permite clicar no X se você quiser depois */
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: min(92vw, 560px);
  padding: 14px 16px 18px;           /* espaço extra embaixo p/ barra de tempo */
  border-radius: 16px;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(10px) saturate(1.1);
  -webkit-backdrop-filter: blur(10px) saturate(1.1);
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow:
    0 18px 40px rgba(0,0,0,.18),
    0 2px 0 rgba(0,0,0,.04) inset;
  animation: toast-pop .24s ease-out both;
}

/* Barrinha de tempo (3.5s — combina com seu setTimeout) */
.adm-notice-toast::after{
  content:"";
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 8px;
  height: 3px;
  border-radius: 999px;
  background: rgba(0,0,0,.06);       /* trilho */
}
.adm-notice-toast::before{
  content:"";
  position: absolute;
  left: 10px;
  bottom: 8px;
  height: 3px;
  border-radius: 999px;
  width: 100%;
  animation: toast-countdown 1.5s linear forwards;
}

/* Ícone e texto */
.adm-notice-toast i{ font-size: 18px; }
.adm-notice-toast span{ font-size: 14px; font-weight: 600; line-height: 1.25; }

/* Estado: ERRO (vermelhinho chique) */
.adm-notice-toast.is-error{
  border-left: 8px solid #c89b9b;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  color: #454545ff;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.78) 0%,
    rgba(255,241,241,0.78) 100%
  );
}
.adm-notice-toast.is-error i{ color:#e35c5c; }
.adm-notice-toast.is-error::before{
  background: #c89b9b;               /* barra de tempo em vermelho */
}

/* Estado: INFO (oliva do seu tema) */
.adm-notice-toast.is-info{
  border-left: 8px solid var(--olive, #8A8F75);
  box-shadow:
    0 18px 40px rgba(138, 143, 117, .16),
    0 2px 0 rgba(138, 143, 117, .08) inset;
  color: #3f4636;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.78) 0%,
    rgba(242,245,239,0.78) 100%
  );
}
.adm-notice-toast.is-info i{ color: var(--olive, #8A8F75); }
.adm-notice-toast.is-info::before{
  background: var(--olive, #8A8F75);
}

/* Animações */
@keyframes toast-pop{
  from { opacity: 0; transform: translateY(-10px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes toast-countdown{
  from { width: 100%; }
  to   { width: 0%; }
}

/* Responsivo e acessibilidade */
@media (max-width: 520px){
  .adm-notice-toaster{ top: 12vh; padding: 0 10px; }
  .adm-notice-toast{ border-radius: 14px; min-width: 0; }
}
@media (prefers-reduced-motion: reduce){
  .adm-notice-toast{ animation: none; }
  .adm-notice-toast::before{ animation-duration: 0.01ms; }
}


/* ===== Overlay de operação (mini pop-up com spinner rosê) ===== */
.adm-op-overlay{
  position: fixed; inset: 0;
  background: rgba(236, 231, 230, 0.55); /* leve véu no tema */
  display: grid; place-items: center;
  z-index: 120; /* acima do modal (60) e do toast (90) */
  animation: fadeInOverlay .15s ease;
}
.adm-op-card{
  background: #fff;
  border-radius: 14px;
  padding: 12px 16px;
  min-width: 220px;
  display: inline-flex; align-items: center; gap: 10px;
  box-shadow: 0 12px 30px rgba(0,0,0,.14);
  border-left: 5px solid #c89b9b;      /* rosê */
  color: #4a4a4a;
  font-family: "Poppins", sans-serif;
}
.adm-op-card i{
  font-size: 18px;
  color: #c89b9b;
}
@keyframes fadeInOverlay{
  from{ opacity: 0 } to{ opacity: 1 }
}

/* ===== Toast de SUCESSO (verde) + animação “descendo” ===== */
.adm-notice-toast.is-success{
  border-left: 8px solid #10b916ff; /* verde sucesso */
  box-shadow:
    0 18px 40px rgba(18, 160, 20, 1),
    0 2px 0 rgba(30, 185, 16, 0.68) inset;
  color: #1a9d13ff;
  background: linear-gradient(
    180deg,
    rgba(0, 255, 17, 0.61) 0%,
    rgba(0, 247, 25, 0.68) 100%
  );
  animation: toast-drop .28s ease-out both; /* “desce” suave */
}
.adm-notice-toast.is-success i{ color:#10b981; }
.adm-notice-toast.is-success::before{
  background: #0c6110ff; /* barra de tempo verde */
}

/* animação de drop */
@keyframes toast-drop{
  from { opacity: 0; transform: translateY(-16px) scale(.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.adm-avatar{
  display:inline-grid;
  place-items:center;
  background:#f2f5ef;           /* fundo suave para o ícone */
  border:1px solid var(--border);
  box-shadow:0 1px 0 rgba(0,0,0,.04);
  overflow:hidden;               /* garante corte da imagem */
}

.adm-avatar-sm{ width:36px; height:36px; border-radius:8px; }
.adm-avatar-lg{ width:80px; height:80px; border-radius:12px; }

.adm-avatar img{
  width:100%; height:100%;
  object-fit:cover;
  display:block;
}

/* Ícone fallback (mesma “vibe” verde/oliva do tema) */
.adm-avatar.is-icon svg{
  width:60%; height:60%;
  color:#8A8F75;               /* verde/oliva do seu tema */
}


.adm-avatar-sm{ border-radius:50%; }
.adm-avatar-lg{ border-radius:50%; }
.adm-priv-actions{
  display:flex; gap:10px; margin-top:16px;
}
/* Barra de filtros */
.adm-filterbar{
  display:flex; flex-wrap:wrap; gap:10px;
}
.adm-filter{
  display:flex; align-items:center; gap:8px;
  background:#fff; border:1px solid var(--border); border-radius:12px;
  padding:6px 10px;
}
.adm-filter > span{
  color:#5a5a5a; font-size:.9rem;
}
.adm-filter select{
  border:none; outline:none; background:transparent; font-size:.95rem;
}
.adm-filter.custom-range{
  background:#fff; border:1px solid var(--border); border-radius:12px;
  padding:6px 10px; display:flex; align-items:center; gap:8px;
}
.adm-filter.custom-range input[type="date"]{
  border:1px solid #eee; border-radius:8px; padding:6px 8px;
}
.adm-filter.custom-range .sep{ color:#999 }

/* Chip de filtro ativo */
.adm-active-filters{
  display:flex; flex-wrap:wrap; gap:8px; margin:10px 0 8px;
}
.adm-chip{
  background:#f5f3f2; color:#444; border:1px solid #e7e0dd;
  border-radius:999px; padding:6px 10px; cursor:pointer;
  display:inline-flex; align-items:center; gap:8px;
}
.adm-chip span{ opacity:.8; font-weight:700 }

/* Botão fantasma (limpar filtros) */
.adm-btn--ghost{
  background:transparent; border:1px dashed var(--border);
}


      `}</style>
    </div>
  );
}
