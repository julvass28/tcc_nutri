const dayjs = require("dayjs"); //importa biblioteca de dia e data


 function makeDateTime(date, time){
 const formatacao = time.lenght === 5? `${time}:00` : time; // se tiver apenas 5 caracteres 09:00, adiciona segundos
 return dayjs (`${date} ${formatacao}`);
 }

 function intervaloagen(date){
    const inicio = dayjs (`${date} 00:00:00`);
    const fim = inicio.add(1,'day');
    return(inicio,fim);
 }

 module.exports(dayjs, makeDateTime, intervaloagen)


