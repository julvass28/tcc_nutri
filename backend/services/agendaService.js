// services/agendaService.js
const { Op } = require('sequelize');
const { dayjs, makeDateTime, intervaloagen } = require('../utils/time');
const Bloqueio = require('../models/Bloqueio');

// (A) dow a partir de "YYYY-MM-DD" usando o truque do meio-dia
//(`${date} 12:00:00`) -> evita dar confuões em fuso, sempre pega 00h como referência porque nãao da erro
//exemplo se um fuso é -3 em segunda, pega 12:00-3 = 09h, continua sendo segunda, agr se eu colocasse 00h,
//  iria para dia anterior
//.day define 0=domingo, 1=segunda...
function getDow(date) {
  return dayjs(`${date} 12:00:00`).day(); // 0..6
}

// (B) range 00:00 -> 00:00 do dia seguinte
//criei duas const que vao puxar os horarios definidos no intevaloagen do time.js
//ou seja, pega a data da requisição e ve que o start é 00h e o end 00h tambem

function getDiaRange(date) {
  const { start, end } = intervaloagen(date);
  return { start, end };
}

// (C) expediente desse dia a partir da config (e passo)
//guarda o dia da requisição em formato que defininimos no makeDateTime(dia+hora)
//e hora que ela começa naquele dia 
function getExpediente(date, config) {
  const InicioDia = makeDateTime(date, config.inicio);
  const FimDia = makeDateTime(date, config.fim);
  const passo = Number(config.intervaloMin) || 30;
  return { InicioDia, FimDia, passo };
}

// (D) buscar bloqueios que tocam o dia
//      //cria const bloqueio que puxa a tabela bloqueio do models e pega todos os atributos se where encontar algo
//Op.or = OU, quer dizer que se qualquer das 3 operações for verdadeira, entra em bloqueios
async function fetchBloqueiosDoDia(start, end) {
  return Bloqueio.findAll({
    where: {
      [Op.or]: [
        //start 00h end00h, definida na const acima
        //se ela saiu 12h e volta 13h = almoço, entra em um bloquei do dia, nesse primeiro, ja que 
        //o tempo de bloquio ficou entre as 00h
        { inicio: { [Op.between]: [start.toDate(), end.toDate()] } },
        //bloquieio se ela saiu 23:30  e voltou 00:30, entra nesse bloqueio, porque o final ja passa
        //para outro dia, passou da 00h
        { fim: { [Op.between]: [start.toDate(), end.toDate()] } },
        //bloqueio de férias cobre o dia inteiro quando começa antes (ou exatamente)
        //  de start e termina depois (ou exatamente) de end
        { inicio: { [Op.lte]: start.toDate() }, fim: { [Op.gte]: end.toDate() } }
      ]
    }
  });
}

// (E) checar se um momento cai dentro de algum bloqueio
//    permitirNoFim: se true, 13:00 é permitido quando bloqueio é 12:00–13:00
//b.incio = incio do bloqueio  e b.fim= incio do bloqueio
//verifica se um dos horarios enrtre o expediente esta bloqueado
//ex(9:30, 10:00, 10:30...)esses horarios sao definidos pela const cur
//Horario bloquieo 12;00 ate 13:00
//12:00.isSame(12:00)...
function estaDentroDeBloqueio(moment, bloqueios, { permitirNoFim = false } = {}) {
  return bloqueios.some(b => {
    const bi = dayjs(b.inicio), bf = dayjs(b.fim);
    if (permitirNoFim) {
      return moment.isSame(bi) || (moment.isAfter(bi) && moment.isBefore(bf));
    }
    return moment.isSame(bi) || moment.isSame(bf) || (moment.isAfter(bi) && moment.isBefore(bf));
  });
}

module.exports = {
  getDow,
  getDiaRange,
  getExpediente,
  fetchBloqueiosDoDia,
  estaDentroDeBloqueio
};
