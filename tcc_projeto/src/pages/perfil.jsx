import React from "react";
import "../css/perfil.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Perfil() {
  return (
    <div className="perfil-container">
      <div className="perfil-wave"></div>
      <section className="perfil-header">
        <p>Ola Amanda Ribeiro! Tudo bem?</p>
        <div className="foto-wrapper">
          <img
            src="https://storage.googleapis.com/a1aa/image/54216202-c467-43d3-29c6-1a460038de1e.jpg"
            alt="Amanda"
          />
          <button className="editar-foto">
            <i className="fas fa-pencil-alt"></i> Editar
          </button>
        </div>
        <p className="nome-usuario">Amanda Ribeiro</p>
      </section>
      <hr className="linha" />
      <section className="secao">
        <h2>Informações pessoais</h2>
        <form>
          <div className="campo">
            <label>Nome:</label>
            <input type="text" value="Amanda Ribeiro Borges Da Silva" readOnly />
          </div>
          <div className="grid3">
            <div className="campo-editavel">
              <input type="number" value="24" readOnly />
              <button><i className="fas fa-pencil-alt"></i></button>
            </div>
            <div className="campo-editavel">
              <input type="number" value="24" readOnly />
              <button><i className="fas fa-pencil-alt"></i></button>
            </div>
            <div className="campo-editavel">
              <input type="number" value="24" readOnly />
              <button><i className="fas fa-pencil-alt"></i></button>
            </div>
          </div>
          <div className="campo">
            <label>Objetivo Nutricional:</label>
            <div className="objetivos">
              <span className="objetivo o1"><i className="fas fa-seedling"></i> Emagrecer</span>
              <span className="objetivo o2"><i className="fas fa-seedling"></i> Ganhar Massa Muscular</span>
              <span className="objetivo o1"><i className="fas fa-seedling"></i> Melhorar a Saúde</span>
              <button>+ Add Objetivo</button>
            </div>
          </div>
        </form>
      </section>

      <section className="secao">
        <h2>Configurações de Conta</h2>
        <form>
          <div className="campo">
            <label>Email:</label>
            <div className="campo-editavel">
              <input type="email" value="amanda.ribeiro@gmail.com" readOnly />
              <button><i className="fas fa-pencil-alt"></i></button>
            </div>
          </div>
          <div className="campo-editavel">
            <label>Senha:</label>
            <span className="senha">•••••••••••</span>
            <button>Alterar Senha</button>
          </div>
        </form>
      </section>

      <section className="secao branco">
        <h3>Mídias e Docs:</h3>
        <div className="docs-area">
          <div className="doc-botoes">
            <button className="ativo"><i className="fas fa-clock"></i> Recentes</button>
            <button><i className="fas fa-th"></i> Todos</button>
          </div>
          <div className="doc-itens">
            <div className="doc">
              <img src="https://storage.googleapis.com/a1aa/image/3265eb94-ac5e-4d4f-56f0-ce5646dcb944.jpg" alt="PDF" />
              <div className="doc-info">
                <p><strong>Plano Nutricional - Amanda Ribeiro</strong></p>
                <p className="sub">Enviado por: Natalia Simanovski</p>
              </div>
            </div>
            <div className="doc">
              <img src="https://storage.googleapis.com/a1aa/image/61047127-af8d-489b-39ba-eeca995b628e.jpg" alt="Receita" />
              <div className="doc-info">
                <p><strong>Receita do dia: Barraha Caseira de Cereal e Castanhas</strong></p>
                <p className="sub">Enviado por: Natalia Simanovski</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="secao cards-calc">
        <div className="card">
          <h4>Calculadora de Gastos Calóricos</h4>
          <p>Descubra quantas calorias seu corpo gasta por dia</p>
          <i className="fas fa-running"></i>
        </div>
        <div className="card">
          <h4>Calculadora de IMC e Peso ideal</h4>
          <p>Verifique se está no peso adequado para sua altura</p>
          <i className="fas fa-balance-scale"></i>
        </div>
        <div className="card">
          <h4>Calculadora de Consumo diário de Água</h4>
          <p>Saiba quantos litros de água precisa beber diariamente</p>
          <i className="fas fa-tint"></i>
        </div>
      </section>

      <section className="secao">
        <h2>Últimas consultas:</h2>
        <div className="consultas">
          {[...Array(4)].map((_, i) => (
            <div className="consulta" key={i}>
              <img src="https://storage.googleapis.com/a1aa/image/d8bf69a3-6782-4a80-dd22-b760e88021a2.jpg" alt="Consulta" />
              <p><strong>1ª Consulta Online</strong></p>
              <p className="sub">Amanda Ferreira</p>
              <p className="data">Data da última consulta: 20/12/2022</p>
            </div>
          ))}
        </div>
      </section>

      <section className="secao text-center">
        <h2>Agende sua Consulta</h2>
        <div className="contato-opcoes">
          <div><i className="fas fa-phone-alt"></i><p>Ligue para nós<br />(11) 3071-1252</p></div>
          <div><i className="fas fa-comment-alt"></i><p>Mande uma mensagem<br />(11) 97612-0337</p></div>
          <div><i className="fas fa-envelope"></i><p>Envie um e-mail<br />dranatalia@simanovski.com</p></div>
        </div>
      </section>

      <section className="secao registro">
        <h2>Registro de Refeições do Dia</h2>
        <div className="registro-info">
          <div><p>Consumidas</p><h3>916 <span>kcal</span></h3></div>
          <div><p>Consumir</p><h2>2059 kcal</h2></div>
          <div><p>Restantes</p><h3>1146 <span>kcal</span></h3></div>
        </div>
        <button className="btn-refeicoes">
          Acessar Refeições <i className="fas fa-arrow-right"></i>
        </button>
      </section>
    </div>
  );
}
