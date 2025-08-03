import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/perfil.css';

// === Funções simuladas da API ===
const mockFetchUserData = async () => {
  return {
    nome: 'Amanda Ribeiro',
    idade: '24',
    peso: '60',
    altura: '165',
    email: 'amanda@example.com',
    senha: '********',
    foto: 'https://storage.googleapis.com/a1aa/image/54216202-c467-43d3-29c6-1a460038de1e.jpg'
  };
};

const mockUpdateUserData = async (updatedData) => {
  console.log("Dados enviados para backend:", updatedData);
  return { success: true };
};

export default function Perfil() {
  const [dados, setDados] = useState({
    nome: '',
    idade: '',
    peso: '',
    altura: '',
    email: '',
    senha: '',
    foto: ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('recentes');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await mockFetchUserData();
        setDados(userData);
      } catch {
        setError('Erro ao carregar dados.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const handleFotoChange = () => {
    alert("Função de upload será implementada com backend.");
  };

  const primeiroNome = dados.nome.split(' ')[0] || '';

  // Função única para salvar todas as informações
  const handleSaveAll = async () => {
    setSaving(true);
    setError(null);
    try {
      const allData = {
        nome: dados.nome,
        idade: dados.idade,
        peso: dados.peso,
        altura: dados.altura,
        foto: dados.foto,
        email: dados.email,
        senha: dados.senha
      };
      await mockUpdateUserData(allData);
      alert("Alterações salvas com sucesso!");
    } catch {
      setError("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  const consultas = Array(3).fill({
    titulo: '1º Consulta Online - Amanda Ferreira',
    data: 'Consulta Online - 10/04/2024',
    img: 'https://storage.googleapis.com/a1aa/image/23110d1e-77f9-42be-e1f4-09dc241570e5.jpg',
  });

  return (
    <div className="perfil-container">

      {/* Header topo */}
      <section className="perfil-header">
        <div className="foto-wrapper">
          <div className="foto-container">
            <div className="foto-box">
              <img 
                src={dados.foto} 
                alt={dados.nome} 
              />
              <button className="btn-editar-foto" onClick={handleFotoChange}>
                <i className="fas fa-pen"></i>
                <span className="editar-texto">Editar</span>
              </button>
            </div>
            <div className="nome-usuario">
              {primeiroNome.trim() !== '' ? primeiroNome : '\u00A0'}
            </div>
          </div>
        </div>
      </section>

      {/* Informações Pessoais + Configurações de Conta juntas */}
      <section className="secao perfil-conta-combinada">

        {/* Informações pessoais */}
        <div className="subsecao">
          <h2>Informações Pessoais</h2>

          {error && <p className="error-text">{error}</p>}

          <div className="input-wrapper">
            <label className="input-label">Nome:</label>
            <input 
              type="text" 
              value={dados.nome} 
              onChange={e => handleChange("nome", e.target.value)} 
            />
            <i className="fas fa-pen icon-dentro-input" />
          </div>

          <div className="grid3">
            <div className="input-wrapper">
              <label className="input-label">Idade:</label>
              <input 
                type="number" 
                value={dados.idade} 
                onChange={e => handleChange("idade", e.target.value)} 
              />
              <i className="fas fa-pen icon-dentro-input" />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Peso(kg):</label>
              <input 
                type="text" 
                value={dados.peso} 
                onChange={e => handleChange("peso", e.target.value)} 
              />
              <i className="fas fa-pen icon-dentro-input" />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Altura(cm):</label>
              <input 
                type="text" 
                value={dados.altura} 
                onChange={e => handleChange("altura", e.target.value)} 
              />
              <i className="fas fa-pen icon-dentro-input" />
            </div>
          </div>

          {/* Aqui está a atualização para label fixa embutida */}
          <div className="input-wrapper objetivo-fixo">
            <label className="input-label objetivo-label">Objetivo Nutricional:</label>
            <div className="objetivo o1 objetivo-conteudo">
              <i className="fas fa-weight"></i>
              Emagrecimento e Obesidade
            </div>
          </div>
        </div>

        {/* Configurações de conta */}
        <div className="subsecao" id="configuracoes-conta">
          <h2>Configurações de Conta</h2>

          {error && <p className="error-text">{error}</p>}

          <div className="input-wrapper">
            <label className="input-label">Email:</label>
            <input 
              type="email" 
              value={dados.email} 
              onChange={e => handleChange("email", e.target.value)} 
            />
            <i className="fas fa-pen icon-dentro-input" />
          </div>
          <div className="input-wrapper">
            <label className="input-label">Senha:</label>
            <input 
              type="password" 
              value={dados.senha} 
              onChange={e => handleChange("senha", e.target.value)} 
            />
            <i className="fas fa-pen icon-dentro-input" />
          </div>

          <button 
            className="btn-save btn-save-account" 
            onClick={handleSaveAll} 
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>

      </section>

      {/* Mídias e Docs */}
      <section className="secao">
        <div className="midias-container">
          <section className="midias-box">
            <h2 className="midias-title">Mídias e Docs:</h2>

            <div className="midias-buttons">
              <button 
                className={selectedFilter === 'recentes' ? 'btn-selected' : 'btn-unselected'} 
                onClick={() => setSelectedFilter('recentes')}
              >
                <i className="far fa-clock"></i>
                <span>Recentes</span>
              </button>
              <button 
                className={selectedFilter === 'todos' ? 'btn-selected' : 'btn-unselected'} 
                onClick={() => setSelectedFilter('todos')}
              >
                <i className="fas fa-th-large"></i>
                <span>Todos</span>
              </button>
            </div>

            <div className="midias-list">
              <article className="midia-card">
                <time className="midia-time">Ontem às 17:34PM</time>
                <div className="midia-img-box">
                  <img
                    src="https://storage.googleapis.com/a1aa/image/7b1ca160-43f9-464d-f723-d23cef4e73fa.jpg"
                    alt="PDF documento"
                    className="midia-img"
                  />
                </div>
                <h3 className="midia-title">Plano Nutricional - Amanda Ribeiro</h3>
                <p className="midia-desc">Enviado por: <span className="midia-remetente">Natália Simanoviski</span></p>
              </article>

              <article className="midia-card">
                <time className="midia-time">Há 2 dias</time>
                <div className="midia-img-box">
                  <img
                    src="https://storage.googleapis.com/a1aa/image/da33d598-9f0c-4b37-8fa0-0b56d433ad90.jpg"
                    alt="Receita Barrinha de Cereal"
                    className="midia-img"
                  />
                </div>
                <h3 className="midia-title">Receita do dia - Barrinha Caseira de Cereal e Castanhas</h3>
                <p className="midia-desc">Enviado por: <span className="midia-remetente">Natália Simanoviski</span></p>
              </article>

              <div className="midia-empty">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <span className="empty-text">Não há mais nada...</span>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Últimas consultas */}
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
