// tcc_projeto/src/pages/PerfilEditar.jsx
import React, { useEffect, useState, useContext } from 'react';
import '../css/perfil.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { OBJETIVOS } from '../utils/objetivos';
import { Link } from 'react-router-dom';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function LoadingOverlay({ show, text = "Carregando..." }) {
  if (!show) return null;
  return (
    <div className="auth-loading-overlay" role="status" aria-live="polite">
      <div className="auth-loading-card">
        <i className="fas fa-spinner fa-spin" aria-hidden="true" />
        <span>{text}</span>
      </div>
    </div>
  );
}

export default function PerfilEditar() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '', sobrenome: '', email: '',
    data_nascimento: '', genero: '',
    altura: '', peso: '', objetivo: ''
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const u = await res.json();
        setForm({
          nome: u.nome || '',
          sobrenome: u.sobrenome || '',
          email: u.email || '',
          data_nascimento: u.data_nascimento ? String(u.data_nascimento).slice(0,10) : '',
          genero: u.genero || '',
          altura: u.altura ?? '',
          peso: u.peso ?? '',
          objetivo: u.objetivo || ''
        });
      } catch {
        setErro('Erro ao carregar dados.');
      } finally {
        await sleep(400);
        setShowOverlay(false);
      }
    })();
  }, [API, token, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const salvar = async () => {
    setErro('');
    setSalvando(true);
    
    try {
      const payload = {
        nome: form.nome,
        sobrenome: form.sobrenome,
        data_nascimento: form.data_nascimento || null,
        genero: form.genero,
        altura: form.altura ? parseFloat(form.altura) : null,
        peso: form.peso ? parseFloat(form.peso) : null,
        objetivo: form.objetivo
      };

      const res = await fetch(`${API}/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || data?.message || 'Erro ao salvar');

      navigate('/perfil');
    } catch {
      setErro('Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  };

  const irTrocarSenha = async () => {
    setShowOverlay(true);
    await sleep(500);
    navigate('/esqueci-senha', { state: { from: '/perfil/editar', email: form.email } });
  };

  return (
    <div className="perfil-container perfil-editar">
      <LoadingOverlay show={showOverlay} text="Carregando edição..." />

      {/* Barra de voltar fixa/simples */}
      <div className="editar-topbar">
        <Link to="/perfil"><button className="editar-back">
          <i className="fas fa-arrow-left" /> Voltar
        </button>
        </Link>
        <h2>Editar perfil</h2>
      </div>

      <section className="secao">
        <div className="grid2">
          <div className="input-wrapper">
            <label className="input-label">Nome:</label>
            <input name="nome" type="text" value={form.nome} onChange={onChange} />
          </div>

          <div className="input-wrapper">
            <label className="input-label">Sobrenome:</label>
            <input name="sobrenome" type="text" value={form.sobrenome} onChange={onChange} />
          </div>
        </div>

        <div className="grid3">
          <div className="input-wrapper">
            <label className="input-label">Data de Nascimento:</label>
            <input name="data_nascimento" type="date" value={form.data_nascimento} onChange={onChange} />
          </div>

          <div className="input-wrapper">
            <label className="input-label">Gênero:</label>
            <input name="genero" type="text" placeholder="Feminino, Masculino…" value={form.genero} onChange={onChange} />
          </div>

          {/* Objetivo como SELECT amigável */}
          <div className="input-wrapper">
            <label className="input-label">Objetivo:</label>
            <select
              name="objetivo"
              className="select-input-editar"
              value={String(form.objetivo || '')}
              onChange={onChange}
              
            >
              <option value="">Selecione...</option>
              {Object.entries(OBJETIVOS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid3">
          <div className="input-wrapper">
            <label className="input-label">Altura (m):</label>
            <input name="altura" type="number" step="0.01" value={form.altura} onChange={onChange} />
          </div>
          <div className="input-wrapper">
            <label className="input-label">Peso (kg):</label>
            <input name="peso" type="number" step="0.01" value={form.peso} onChange={onChange} />
          </div>

          {/* Espaço para alinhar grids bonitinho */}
          <div className="input-wrapper" style={{ visibility: 'hidden' }}>
            <input readOnly />
          </div>
        </div>

        {/* Linha final: E-mail (exibição) + Senha (readOnly) + botão alterar senha ao lado */}
        <div className="grid-email-senha">
          <div className="display-box">
            <span className="display-label">E-mail</span>
            <span className="display-value mono">{form.email || '—'}</span>
          </div>

          <div className="input-wrapper">
            <label className="input-label">Senha:</label>
            <input type="password" value="********" readOnly />
          </div>

          <button className="btn-outline" onClick={irTrocarSenha} title="Alterar senha">
            <i className="fas fa-key" /> Alterar senha
          </button>
        </div>

        {/* Ações principais */}
        <div className="editar-actions">
          <button className="btn-save" onClick={salvar} disabled={salvando}>
            {salvando ? <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }} /> : null}
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>

        {erro && <p className="error-text" style={{ marginTop: 12 }}>{erro}</p>}
      </section>
    </div>
  );
}
