const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { senha, ...resto } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await Usuario.create({ ...resto, senha: senhaCriptografada });
    res.status(201).json({ msg: "Usuário criado com sucesso", usuario: novoUsuario });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(500).json({ erro: "Erro ao registrar" });
  }
};