// tcc_projeto/src/pages/perfil.jsx
import React, { useState, useEffect, useContext } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/perfil.css';
import { AuthContext } from '../context/AuthContext';
import { objetivoLabel } from '../utils/objetivos';

export default function Perfil() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const { token, setUser } = useContext(AuthContext); // <<< pega setUser pra refletir no Header

  const [dados, setDados] = useState({
    nome: '',
    sobrenome: '',
    idade: '',
    peso: '',
    altura: '',
    email: '',
    senha: '********',
    foto: '',
    data_nascimento: '',
    genero: '',
    objetivo: ''
  });

  const [fotoPreview, setFotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('recentes');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const u = await res.json();
        setDados(prev => ({
          ...prev,
          nome: u.nome || '',
          sobrenome: u.sobrenome || '',
          email: u.email || '',
          altura: u.altura ?? '',
          peso: u.peso ?? '',
          data_nascimento: u.data_nascimento ? String(u.data_nascimento).slice(0,10) : '',
          genero: u.genero || '',
          objetivo: u.objetivo || '',
          foto: u.fotoUrl || ''
        }));
        setFotoPreview(u.fotoUrl || '');
      } catch {
        setError('Erro ao carregar dados.');
      }
    };
    if (token) fetchData();
  }, [API, token]);

  const handleChange = (campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const handleFotoInput = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFotoPreview(url);

    const form = new FormData();
    form.append('foto', file);
    try {
      const res = await fetch(`${API}/perfil/foto`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || 'Falha no upload');

      setDados(prev => ({ ...prev, foto: data.fotoUrl }));
      setFotoPreview(data.fotoUrl);

      // >>> reflete no Header instantaneamente
      setUser?.(prev => (prev ? { ...prev, fotoUrl: data.fotoUrl } : prev));

      alert("Foto atualizada!");
    } catch (err) {
      alert("Erro ao enviar foto. Use JPG/PNG/WebP até 2MB.");
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        nome: dados.nome,
        sobrenome: dados.sobrenome,
        email: dados.email,
        data_nascimento: dados.data_nascimento || null,
        genero: dados.genero,
        altura: dados.altura ? parseFloat(dados.altura) : null,
        peso: dados.peso ? parseFloat(dados.peso) : null,
        objetivo: dados.objetivo
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
      if (!res.ok) throw new Error(data?.erro || data?.message || 'Erro ao salvar perfil');

      alert("Alterações salvas com sucesso!");
    } catch (e) {
      setError("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  const primeiroNome = (dados.nome || '').split(' ')[0];

  const consultas = Array(3).fill({
    titulo: '1º Consulta Online - Exemplo',
    data: 'Consulta Online - 10/04/2024',
    img: 'https://storage.googleapis.com/a1aa/image/23110d1e-77f9-42be-e1f4-09dc241570e5.jpg',
  });

  return (
    <div className="perfil-container">
      <section className="perfil-header">
        <div className="foto-wrapper">
          <div className="foto-container">
            <div className="foto-box">
              <img
                src={fotoPreview || 'https://via.placeholder.com/160x160.png?text=Foto'}
                alt={dados.nome || 'Foto do usuário'}
              />
              <label className="btn-editar-foto" title="Trocar foto">
                <i className="fas fa-pen"></i>
                <span className="editar-texto">Editar</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleFotoInput}
                />
              </label>
            </div>
            <div className="nome-usuario">
              {primeiroNome?.trim() || '\u00A0'}
            </div>
          </div>
        </div>
      </section>

      <section className="secao perfil-conta-combinada">
        <div className="subsecao">
          <h2>Informações Pessoais</h2>
          {error && <p className="error-text">{error}</p>}

          <div className="input-wrapper">
            <label className="input-label">Nome:</label>
            <input type="text" value={dados.nome} onChange={e => handleChange("nome", e.target.value)} />
            <i className="fas fa-pen icon-dentro-input" />
          </div>

          <div className="input-wrapper">
            <label className="input-label">Sobrenome:</label>
            <input type="text" value={dados.sobrenome} onChange={e => handleChange("sobrenome", e.target.value)} />
            <i className="fas fa-pen icon-dentro-input" />
          </div>

          <div className="grid3">
            <div className="input-wrapper">
              <label className="input-label">Data de Nascimento:</label>
              <input type="date" value={dados.data_nascimento} onChange={e => handleChange("data_nascimento", e.target.value)} />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Peso(kg):</label>
              <input type="number" step="0.01" value={dados.peso} onChange={e => handleChange("peso", e.target.value)} />
              <i className="fas fa-pen icon-dentro-input" />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Altura(m):</label>
              <input type="number" step="0.01" value={dados.altura} onChange={e => handleChange("altura", e.target.value)} />
              <i className="fas fa-pen icon-dentro-input" />
            </div>
          </div>

          <div className="input-wrapper objetivo-fixo">
            <label className="input-label objetivo-label">Objetivo Nutricional:</label>
            <div className="objetivo o1 objetivo-conteudo">
              <i className="fas fa-weight"></i>
              {objetivoLabel(dados.objetivo) || "—"}
            </div>
          </div>
        </div>

        <div className="subsecao" id="configuracoes-conta">
          <h2>Configurações de Conta</h2>
          {error && <p className="error-text">{error}</p>}

          <div className="input-wrapper">
            <label className="input-label">Email:</label>
            <input type="email" value={dados.email} onChange={e => handleChange("email", e.target.value)} />
            <i className="fas fa-pen icon-dentro-input" />
          </div>

          <div className="input-wrapper">
            <label className="input-label">Senha:</label>
            <input type="password" value="********" readOnly />
            <i className="fas fa-pen icon-dentro-input" />
          </div>

          <button className="btn-save btn-save-account" onClick={handleSaveAll} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </section>

      <section className="secao">
        <div className="midias-container">{/* mock */}</div>
      </section>

      <section className="secao">
        <h2>Últimas consultas:</h2>
        <div className="consultas-list">
          {consultas.map((c, i) => (
            <div key={i} className="consulta-card">
              <div className="consulta-img-box"><img src={c.img} alt={c.titulo} className="consulta-img" /></div>
              <div className="consulta-text">{c.titulo}</div>
              <div className="consulta-data">{c.data}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
