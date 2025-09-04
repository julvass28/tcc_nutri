const express = require('express');
const router = express.Router();
const agenda = require('../controllers/agendaController');
const auth =require('../middleware/auth');


router.get('/slots',agenda.listarhora);
router.post('/hold', agenda.criarHold);          // com login (opcional mas recomendável)
router.post('/confirmar', agenda.confirmarPagamento);  // normalmente chamado pelo webhook
//router.get('/agendamentos', auth, agenda.listarAgendamentosDia); // opcional pro demo

module.exports = router;