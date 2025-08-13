import React, { useState } from 'react';
import './FormReceita.css';

const FormReceita = () => {
  const [titulo, setTitulo] = useState('');
  const [imagem, setImagem] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [modoPreparo, setModoPreparo] = useState('');
  const [dica, setDica] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [foto, setFoto] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      titulo,
      imagem,
      descricao,
      ingredientes,
      modoPreparo,
      dica,
      especialidade,
      foto,
    };

    console.log(formData);
  };

  return (
    <div className="form-receita-container">
      <h2 className="form-title">Nova Receita</h2>
      <form className="form-receita" onSubmit={handleSubmit}>
        
        <div class="form-container">
  <label for="titulo">Nome da Receita:</label>
  <input type="text" id="titulo" name="titulo" placeholder="Ex: Panqueca de Aveia" />

  <label for="imagem">URL da Imagem:</label>
  <input type="text" id="imagem" name="imagem" placeholder="Cole o link da imagem" />

  <label for="ingredientes">Ingredientes:</label>
  <textarea id="ingredientes" name="ingredientes" placeholder="Liste os ingredientes..."></textarea>

  <label for="modoPreparo">Modo de Preparo:</label>
  <textarea id="modoPreparo" name="modoPreparo" placeholder="Descreva o modo de preparo"></textarea>

  <label for="dicas">Dicas:</label>
  <textarea id="dicas" name="dicas" placeholder="Dicas para melhorar o preparo, servir, etc..."></textarea>

  <label for="especialidade">Especialidade:</label>
  <select id="especialidade" name="especialidade">
    <option value="clinica">Clínica</option>
    <option value="pediatrica">Pediátrica</option>
    <option value="esportiva">Esportiva</option>
    <option value="emagrecimento">Emagrecimento</option>
    <option value="intolerancias">Intolerâncias</option>
  </select>

  <button type="submit">Postar Receita</button>
</div>

      </form>
    </div>
  );
};

export default FormReceita;
