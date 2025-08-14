const Receita = require('../models/Receita');

module.exports = {
  async criarReceita(req, res) {
    try {
      const { nome, imagem, ingredientes, preparo, dicas } = req.body;
      const novaReceita = await Receita.create({ nome, imagem, ingredientes, preparo, dicas });
      res.status(201).json(novaReceita);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar receita', details: error.message });
    }
  },

  async listarReceitas(req, res) {
    try {
      const receitas = await Receita.findAll();
      res.json(receitas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar receitas', details: error.message });
    }
  },

  async deletarReceita(req, res) {
    try {
      const { id } = req.params;
      const deletado = await Receita.destroy({ where: { id } });

      if (deletado) {
        res.json({ message: 'Receita deletada com sucesso!' });
      } else {
        res.status(404).json({ message: 'Receita não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar receita', details: error.message });
    }
  }
};
