import React from "react";
import "../css/ConfiguracoesAdm.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function ConfiguracoesAdm() {
  return (
    <div className="config-page">
      <header className="config-header">
        <img
          src="https://storage.googleapis.com/a1aa/image/637644a3-4cf0-4fa3-19c0-b52f3799d54f.jpg"
          alt=""
        />
        <a href="#" className="voltar">
          <i className="fas fa-arrow-left"></i>
        </a>
        <h1>Painel do Administrador - Configurações</h1>
      </header>

      <main className="config-main">
        <section>
          <h2>Informações da Conta</h2>
          <form>
            <div className="campo-editar">
              <input type="text" value="Natália Simanoviski" readOnly />
              <button><i className="fas fa-pencil-alt"></i></button>
            </div>
            <div className="campo-editar">
              <input type="email" value="contato@natalia.com.br" readOnly />
              <button><i className="fas fa-pencil-alt"></i></button>
            </div>
            <div className="campo-editar">
              <input type="tel" value="(11) 98765-4321" readOnly />
              <button><i className="fas fa-pencil-alt"></i></button>
            </div>
          </form>
        </section>

        <section>
          <h2>Segurança da Conta</h2>
          <p>Para alterar sua senha, preencha todos os campos abaixo.</p>
          <form>
            <input type="password" placeholder="Digite sua senha atual" />
            <input type="password" placeholder="Nova senha" />
            <input type="password" placeholder="Confirmar a nova senha" />
          </form>
        </section>

        <div className="salvar">
          <button type="submit">Salvar Alterações</button>
        </div>
      </main>
    </div>
  );
}
