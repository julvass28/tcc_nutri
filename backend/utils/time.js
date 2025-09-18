const dayjs = require('dayjs'); // importa biblioteca

function makeDateTime(date, time) {
  const formatacao = time.length === 5 ? `${time}:00` : time; // "HH:mm" -> "HH:mm:ss"
  return dayjs(`${date} ${formatacao}`);
}

function intervaloagen(date) {
  const inicio = dayjs(`${date} 00:00:00`);
  const fim = inicio.add(1, 'day');
  return { start: inicio, end: fim }; // retorna OBJETO com início/fim do dia
}

module.exports = { dayjs, makeDateTime, intervaloagen };
