// tcc_projeto/src/pages/perfil.jsx
import React, { useState, useEffect, useContext } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/perfil.css';
import { AuthContext } from '../context/AuthContext';
import { objetivoLabel } from '../utils/objetivos';
import { Link, useNavigate } from 'react-router-dom';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function Toast({ show, children }) {
  if (!show) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <i className="fas fa-check-circle toast-icone" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

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

export default function Perfil() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const { token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    nome: '', sobrenome: '', email: '', foto: '',
    data_nascimento: '', genero: '', altura: '', peso: '', objetivo: ''
  });

  const [fotoPreview, setFotoPreview] = useState('');
  const [error, setError] = useState(null);

  // overlays/toast
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState("Carregando...");
  const [showToast, setShowToast] = useState(false);

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
        if (!res.ok) throw new Error();
        const u = await res.json();
        setDados({
          nome: u.nome || '',
          sobrenome: u.sobrenome || '',
          email: u.email || '',
          altura: u.altura ?? '',
          peso: u.peso ?? '',
          data_nascimento: u.data_nascimento ? String(u.data_nascimento).slice(0,10) : '',
          genero: u.genero || '',
          objetivo: u.objetivo || '',
          foto: u.fotoUrl || ''
        });
        setFotoPreview(u.fotoUrl || '');
      } catch {
        setError('Erro ao carregar dados.');
      }
    })();
  }, [API, token, navigate]);

  // Upload da foto com overlay + toast
  const handleFotoInput = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOverlayText("Enviando foto...");
    setShowOverlay(true);

    const localURL = URL.createObjectURL(file);
    setFotoPreview(localURL);

    try {
      const form = new FormData();
      form.append('foto', file);

      const res = await fetch(`${API}/perfil/foto`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || 'Falha no upload');

      setDados(prev => ({ ...prev, foto: data.fotoUrl }));
      setFotoPreview(data.fotoUrl);
      setUser?.(prev => (prev ? { ...prev, fotoUrl: data.fotoUrl } : prev));

      // mantém o overlay amigável por ~700ms e mostra toast
      await sleep(700);
      setShowOverlay(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    } catch {
      setShowOverlay(false);
      // fallback discreto
      setShowToast(false);
      alert("Erro ao enviar foto. Use JPG/PNG/WebP até 2MB.");
    }
  };

  // Ir para edição com overlay
  const handleGoEdit = async () => {
    setOverlayText("Abrindo edição de perfil...");
    setShowOverlay(true);
    await sleep(700);
    navigate('/perfil/editar');
  };

  const primeiroNome = (dados.nome || '').split(' ')[0];

  // (por enquanto sempre mostra CTA — quando tiver histórico real, você troca)
  const temConsultas = false;

  return (
    <div className="perfil-container">
      <Toast show={showToast}>Foto atualizada com sucesso!</Toast>
      <LoadingOverlay show={showOverlay} text={overlayText} />

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

      {/* BLOCO INFORMATIVO (somente leitura) - visual renovado */}
      <section className="secao">
        <div className="perfil-view-grid pretty">
          <div className="perfil-view-item">
            <span className="perfil-view-label">Nome</span>
            <span className="perfil-view-value">{dados.nome || '—'}</span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Sobrenome</span>
            <span className="perfil-view-value">{dados.sobrenome || '—'}</span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">E-mail</span>
            <span className="perfil-view-value mono">{dados.email || '—'}</span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Data de nascimento</span>
            <span className="perfil-view-value">{dados.data_nascimento || '—'}</span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Gênero</span>
            <span className="perfil-view-value">{dados.genero || '—'}</span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Altura</span>
            <span className="perfil-view-value">{dados.altura ? `${dados.altura} m` : '—'}</span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Peso</span>
            <span className="perfil-view-value">{dados.peso ? `${dados.peso} kg` : '—'}</span>
          </div>
          <div className="perfil-view-item">
            <span className="perfil-view-label">Objetivo</span>
            <span className="perfil-view-value">{objetivoLabel(dados.objetivo) || '—'}</span>
          </div>
        </div>

        <div className="perfil-actions">
          <button className="btn-save" onClick={handleGoEdit} aria-label="Editar perfil">
            <i className="fas fa-pen" style={{ marginRight: 8 }} /> Editar perfil
          </button>
        </div>

        {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}
      </section>

      {/* CTA quando não há consultas */}
      <section className="secao">
        <h2>Consultas</h2>
        {temConsultas ? (
          <div> {/* futuramente lista real */}</div>
        ) : (
          <div className="consultas-cta">
            <div className="consultas-cta-badge">Você ainda não possui consultas</div>
            <p className="consultas-cta-text">
              Que tal dar o primeiro passo? Agende uma consulta para receber um plano alimentar
              personalizado e começar sua evolução com segurança.
            </p>
            <Link to="/contato" className="consultas-cta-btn">
              <i className="fas fa-calendar-plus" style={{ marginRight: 8 }} />
              Agendar minha primeira consulta
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
