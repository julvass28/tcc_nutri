const {Op}= require('sequelize'); //chama operadores para while, igualdade nn precisa
const{nanoid} = require('nanoid'); // faz o token da requisição
const sequelize= require('../config/db');

const AgendaConfig= require('../models/AgendaConfig');
const Agendamentos = require('../models/Agendamentos');
const Bloqueio = require('../models/Bloqueio');
const {dayjs, makeDateTime, intervaloagen} = require ('../utils/time');

function* horarios(start,end,pausa){
    let horaAtual=start.startof('minute'); //startof vem de dayjs, desconsidera seguntos e arredonda para minuto mais proximo
    let horaFinal= end.startof('minute');
    //enquanto hora atual for menor que hora final. EX-> 09:00 e 18:00, mostra os horarios entre
    //ou horaAtual == horaFinal. EX 18:00 = 18:00 -> PARA
    while(horaAtual.isBefore(horaFinal) || horaAtual.isSame(horaFinal)){
        yield horaAtual; //mostra as horas
        horaAtual= horaAtual.add(pausa,'minute');// pega a horaAtual e adiciona 30, 09:30, 10:00...
    };
};