const express = require('express');
const router = express.Router();
const receitaController = require('../controllers/receitaController');

router.post('/receitas', receitaController.criarReceita);
router.get('/receitas', receitaController.listarReceitas);
router.delete('/receitas/:id', receitaController.deletarReceita);

module.exports = router;
