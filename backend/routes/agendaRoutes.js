const express = require('express');
const router = express.Router();
const agenda = require('../controllers/agendaController');
const auth =require('../middleware/auth');


router.get('/slots',agenda.listarhora);
router.post('/hold', auth, agenda.criarHold);
router.post('/confirmar', auth, agenda.confirmarPagamento);
//router.get('/agendamentos', auth, agenda.listarAgendamentosDia); // opcional pro demo

module.exports = router;