import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/perfil.css';

export default function Perfil() {
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
          <img 
            src="https://storage.googleapis.com/a1aa/image/54216202-c467-43d3-29c6-1a460038de1e.jpg" 
            alt="Amanda" 
          />
        </div>
      </section>

      <hr className="linha" />

      {/* Informações pessoais */}
      <section className="secao">
        <h2>Informações Pessoais</h2>
        <div className="input-wrapper">
          <input type="text" value="Nome: Amanda Ribeiro" readOnly />
          <i className="fas fa-pencil-alt icon-dentro-input" />
        </div>
        <div className="grid3">
          {['Idade: 24', 'Peso: 60kg', 'Altura: 1,65m'].map((campo, i) => (
            <div className="input-wrapper" key={i}>
              <input type="text" value={campo} readOnly />
              <i className="fas fa-pencil-alt icon-dentro-input" />
            </div>
          ))}
        </div>

        <h3 className="objetivo-title">Objetivo Nutricional</h3>
        <div className="objetivos">
          <div className="objetivo o1">
            <i className="fas fa-weight"></i>
            Emagrecimento e Obesidade
          </div>
        </div>
      </section>

      {/* Configurações de conta */}
      <section className="secao">
        <h2>Configurações de Conta</h2>
        <div className="input-wrapper">
          <input type="text" value="Email: amanda@example.com" readOnly />
          <i className="fas fa-pencil-alt icon-dentro-input" />
        </div>
        <div className="input-wrapper">
          <input type="text" value="Senha: ********" readOnly />
          <i className="fas fa-pencil-alt icon-dentro-input" />
        </div>
      </section>

      {/* Mídias e Docs */}
      <section className="secao">
        <div className="midias-container">
          <section className="midias-box">
            <h2 className="midias-title">Mídias e Docs:</h2>

            <div className="midias-buttons">
              <button className="btn-selected">
                <i className="far fa-clock"></i>
                <span>Recentes</span>
              </button>
              <button className="btn-unselected">
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
                <p className="midia-desc">Enviado por: <strong>Natália Simanoviski</strong></p>
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
                <p className="midia-desc">Enviado por: <strong>Natália Simanoviski</strong></p>
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
