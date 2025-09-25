const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { senha, ...resto } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await Usuario.create({
      ...resto,
      senha: senhaCriptografada,
    });
    res
      .status(201)
      .json({ msg: "Usuário criado com sucesso", usuario: novoUsuario });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(500).json({ erro: "Erro ao registrar" });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, isAdmin: !!usuario.isAdmin, isOwner: !!usuario.isOwner },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      msg: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        email: usuario.email,
        fotoUrl: usuario.fotoUrl,
        isAdmin: !!usuario.isAdmin,
        isOwner: !!usuario.isOwner
      },
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ erro: "Erro no servidor" });
  }
};
