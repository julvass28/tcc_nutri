import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/adm_configuracoes.css";

/**
 * Helpers de API (placeholder) — prontos para receber backend
 * Ajuste os endpoints e headers conforme seu servidor.
 */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function apiGetCurrentAdmin(authToken) {
  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Falha ao carregar perfil");
  return res.json();
}

async function apiUpdateProfile(authToken, payload) {
  const res = await fetch(`${API_BASE}/account`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json())?.message || "Falha ao salvar alterações");
  return res.json();
}

async function apiUpdatePassword(authToken, payload) {
  const res = await fetch(`${API_BASE}/account/password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json())?.message || "Falha ao atualizar senha");
  return res.json();
}

/**
 * Campo editável com ícone de lápis – reutilizável
 */
function ASCP_EditField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  readOnly,
  inputRef,
  onEdit,
}) {
  return (
    <div className="ascp-field">
      <label className="ascp-label" htmlFor={id}>{label}</label>
      <div className="ascp-input-wrap">
        <input
          id={id}
          ref={inputRef}
          type={type}
          className="ascp-input"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          aria-readonly={readOnly}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="ascp-input-edit"
          aria-label={`Editar ${label.toLowerCase()}`}
          title={`Editar ${label.toLowerCase()}`}
          onClick={onEdit}
        >
          <i className="fa-solid fa-pen" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function AdminAccountSettingsPage() {
  // Token de auth – ajuste conforme sua estratégia (contexto, cookie, etc.)
  const authToken = useMemo(() => localStorage.getItem("authToken"), []);

  // Estado do perfil
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  // Flags de edição
  const [editNome, setEditNome] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editTelefone, setEditTelefone] = useState(false);

  // Senhas
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // UI state
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [atualizandoSenha, setAtualizandoSenha] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success"); // success | error

  // Refs p/ focar inputs ao clicar no lápis
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const telefoneRef = useRef(null);

  const enableAndFocus = (setter, ref) => {
    setter(true);
    setTimeout(() => ref.current?.focus(), 0);
  };

  // Carrega dados do admin logado ao montar
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await apiGetCurrentAdmin(authToken);
        if (!mounted) return;
        setNome(me?.name || "");
        setEmail(me?.email || "");
        setTelefone(me?.phone || "");
      } catch (e) {
        setToastType("error");
        setToastMsg(e.message || "Não foi possível carregar os dados.");
      } finally {
        if (mounted) setLoadingPerfil(false);
      }
    })();
    return () => { mounted = false; };
  }, [authToken]);

  // Handler de salvar perfil
  const handleSubmitPerfil = async (e) => {
    e?.preventDefault?.();
    setSalvandoPerfil(true);
    try {
      await apiUpdateProfile(authToken, { name: nome, email, phone: telefone });
      setToastType("success");
      setToastMsg("Alterações salvas com sucesso!");
      setEditNome(false);
      setEditEmail(false);
      setEditTelefone(false);
    } catch (e) {
      setToastType("error");
      setToastMsg(e.message || "Erro ao salvar alterações.");
    } finally {
      setSalvandoPerfil(false);
      setTimeout(() => setToastMsg(""), 2200);
    }
  };

  // Handler de troca de senha
  const handleSubmitSenha = async (e) => {
    e.preventDefault();
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setToastType("error");
      setToastMsg("Preencha todos os campos de senha.");
      setTimeout(() => setToastMsg(""), 2200);
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setToastType("error");
      setToastMsg("As senhas não coincidem.");
      setTimeout(() => setToastMsg(""), 2200);
      return;
    }
    setAtualizandoSenha(true);
    try {
      await apiUpdatePassword(authToken, {
        currentPassword: senhaAtual,
        newPassword: novaSenha,
      });
      setToastType("success");
      setToastMsg("Senha atualizada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (e) {
      setToastType("error");
      setToastMsg(e.message || "Erro ao atualizar senha.");
    } finally {
      setAtualizandoSenha(false);
      setTimeout(() => setToastMsg(""), 2200);
    }
  };

  // Config dos campos
  const fields = [
    {
      id: "ascp-nome",
      label: "Nome completo",
      type: "text",
      placeholder: "Nome completo",
      value: nome,
      onChange: (e) => setNome(e.target.value),
      readOnly: !editNome,
      onEdit: () => enableAndFocus(setEditNome, nomeRef),
      inputRef: nomeRef,
    },
    {
      id: "ascp-email",
      label: "Email",
      type: "email",
      placeholder: "Email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      readOnly: !editEmail,
      onEdit: () => enableAndFocus(setEditEmail, emailRef),
      inputRef: emailRef,
    },
    {
      id: "ascp-telefone",
      label: "Telefone",
      type: "tel",
      placeholder: "Telefone",
      value: telefone,
      onChange: (e) => setTelefone(e.target.value),
      readOnly: !editTelefone,
      onEdit: () => enableAndFocus(setEditTelefone, telefoneRef),
      inputRef: telefoneRef,
    },
  ];

  return (
    <div className="adm-settings-config-page">
      <main className="ascp-container">
        {toastMsg ? (
          <div
            className={`ascp-toast ascp-toast--${toastType}`}
            role="status"
            aria-live="polite"
          >
            <i
              className={`fa-solid ${
                toastType === "success" ? "fa-check-circle" : "fa-triangle-exclamation"
              }`}
              aria-hidden="true"
            />
            <span>{toastMsg}</span>
          </div>
        ) : null}

        {/* ===== Informações da Conta ===== */}
        <section className="ascp-card">
          <h2 className="ascp-card__title">Informações da Conta</h2>

          {loadingPerfil ? (
            <p className="ascp-loading">Carregando dados…</p>
          ) : (
            <>
              {fields.map((f) => (
                <ASCP_EditField key={f.id} {...f} />
              ))}
            </>
          )}
        </section>

        {/* ===== Segurança da Conta ===== */}
        <form id="ascp-form-seguranca" className="ascp-card" onSubmit={handleSubmitSenha}>
          <h2 className="ascp-card__title">Segurança da Conta</h2>
          <p className="ascp-card__subtitle">
            Para alterar sua senha, preencha todos os campos abaixo.
          </p>

          <div className="ascp-field">
            <label className="ascp-label" htmlFor="ascp-senha-atual">Senha Atual</label>
            <input
              id="ascp-senha-atual"
              type="password"
              className="ascp-input"
              placeholder="Digite sua senha atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
          </div>

          <div className="ascp-field">
            <label className="ascp-label" htmlFor="ascp-nova-senha">Nova Senha</label>
            <input
              id="ascp-nova-senha"
              type="password"
              className="ascp-input"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </div>

          <div className="ascp-field">
            <label className="ascp-label" htmlFor="ascp-confirmar-senha">Confirmar Nova Senha</label>
            <input
              id="ascp-confirmar-senha"
              type="password"
              className="ascp-input"
              placeholder="Confirmar a nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>

          <div className="ascp-actions">
            {/* mantém navegação para /esqueci-senha e informa origem (ADMIN) */}
            <Link
              to="/esqueci-senha"
              state={{ from: "/admin/configuracoes" }}   // <-- atualizado aqui
              className="ascp-link"
            >
              Esqueci a senha
            </Link>
          </div>
        </form>

        {/* ===== Botão principal: salva PERFIL (nome/email/telefone) ===== */}
        <div className="ascp-footer-actions">
          <button
            type="button"
            className="ascp-save-btn"
            onClick={handleSubmitPerfil}
            disabled={loadingPerfil || salvandoPerfil}
            aria-busy={salvandoPerfil}
            title="Salvar Alterações"
          >
            {salvandoPerfil ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </main>
    </div>
  );
}
