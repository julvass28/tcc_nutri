const { Op} = require('sequelize'); //chama operadores para where, igualdade nn precisa
const { nanoid } = require('nanoid'); // faz o token da requisição
const sequelize = require('../config/db');

const AgendaConfig = require('../models/AgendaConfig');
const Agendamentos = require('../models/Agendamentos');
const Bloqueio = require('../models/Bloqueio');
const { dayjs, makeDateTime, intervaloagen } = require('../utils/time');

function* horarios(start, end, pausa) {
    let horaAtual = start.startOf('minute'); //startof vem de dayjs, desconsidera seguntos e arredonda para minuto mais proximo
    let horaFinal = end.startOf('minute');
    //enquanto hora atual for menor que hora final. EX-> 09:00 e 18:00, mostra os horarios entre
    //ou horaAtual == horaFinal. EX 18:00 = 18:00 -> PARA
    while (horaAtual.isBefore(horaFinal) || horaAtual.isSame(horaFinal)) {
        yield horaAtual; //mostra as horas
        horaAtual = horaAtual.add(pausa, 'minute');// pega a horaAtual e adiciona 30, 09:30, 10:00...
    };
};

//START E END = 00h a 00h
//INCIO E FIM= hora inicial e final do bloqueio
//INICIODIA e FIMDIA = expediente nutri


//LISTAR HORARIOS
module.exports = { //vou conseguir exportar para outros arquivos 
    async listarhora(req, res) { // assicrona = faz algo no banco com req= requisiçaõ e res= resposta; await
        try {
            const { date } = req.query;// {date} const date= req.query.date
            //query pega o que vier depois do ? na URL da requisição (como a data)
            if (!date) {
                return res.status(400).json({ error: 'Parâmetro "date" é obrigatório  (YYYY-MM-DD).' });

            }
            //(`${date} 12:00:00`) -> evita dar confuões em fuso, sempre pega 00h como referência porque nãao da erro
            //exemplo se um fuso é -3 em segunda, pega 12:00-3 = 09h, continua sendo segunda, agr se eu colocasse 00h,
            //  iria para dia anterior
            //.day define 0=domingo, 1=segunda...
            const diasSemana = dayjs(`${date} 12:00:00`).day();

            //puxa os atributos da AgendaConfig apenas SE o where funcionar, ou seja se encontar o dia sa semana
            const config = await AgendaConfig.findOne({ where: { dia_semana: diasSemana } });
            if (!config) {
                return res.json({ date, slots: [] });
            }


            //guarda o dia da requisição em formato que defininimos no makeDateTime(dia+hora)
            //e hora que ela começa naquele dia 
            const InicioDia = makeDateTime(date, config.inicio);
            const FimDia = makeDateTime(date, config.fim)

            const { start: diaStart, end: diaEnd } = intervaloagen(date)
            //criei duas const que vao puxar os horarios definidos no intevaloagen do time.js
            //ou seja, pega a data da requisição e ve que o start é 00h e o end 00h tambem



            //cria const bloqueio que puxa a tabela bloqueio do models e pega todos os atributos se where encontar algo
            //Op.or = OU, quer dizer que se qualquer das 3 operações for verdadeira, entra em bloqueios

            const bloqueios = await Bloqueio.findAll({
                where: {
                    [Op.or]: [
                        //start 00h end00h, definida na const acima
                        //se ela saiu 12h e volta 13h = almoço, entra em um bloquei do dia, nesse primeiro, ja que 
                        //o tempo de bloquio ficou entre as 00h
                        { inicio: { [Op.between]: [diaStart.toDate(), diaEnd.toDate()] } },

                        //bloquieio se ela saiu 23:30  e voltou 00:30, entra nesse bloqueio, porque o final ja passa
                        //para outro dia, passou da 00h
                        { fim: { [Op.between]: [diaStart.toDate(), diaEnd.toDate()] } },

                        //ferias,
                        { inicio: { [Op.lte]: diaStart.toDate() }, fim: { [Op.gte]: diaEnd.toDate() } }
                        //bloqueio de férias cobre o dia inteiro quando começa antes (ou exatamente)
                        //  de start e termina depois (ou exatamente) de end
                    ]
                }

            });

            const ags = await Agendamentos.findAll({
                where: {
                    //pega todos os horarios do dia selecionado que estao pendentes ou confirmados
                    //(>= 00:00 e < 00:00 do dia seguinte)
                    inicio: { [Op.gte]: diaStart.toDate(), [Op.lt]: diaEnd.toDate() },
                    status: { [Op.in]: ['pendente', 'confirmada'] }
                },
                attributes: ['inicio']
            });
            // const que vai guardar um new Set → new = cria objeto; Set = conjunto sem duplicatas; has() verifica presença
            // map em ags: 'a' é cada agendamento; dayjs(a.inicio) cria um Dayjs; format('HH:mm') -> string "HH:mm"
            const ocupados = new Set(ags.map(a => dayjs(a.inicio).format('HH:mm')));

            const slots = [];//mostra horarios

            //cur guarda o horario de inicio e final de expediente indo de 30 em 30
            for (const cur of horarios(InicioDia, FimDia, config.intervaloMin)) {
                const mostrarHoras = cur.format('HH:mm');



                const bloqueado = bloqueios.some(b => {
                    //b.incio = incio do bloqueio  e b.fim= incio do bloqueio
                    //verifica se um dos horarios enrtre o expediente esta bloqueado
                    //ex(9:30, 10:00, 10:30...)esses horarios sao definidos pela const cur
                    //Horario bloquieo 12;00 ate 13:00
                    //12:00.isSame(12:00)...
                    const blockum = dayjs(b.inicio), blockdois = dayjs(b.fim);
                    return cur.isSame(blockum) || cur.isSame(blockdois) || (cur.isAfter(blockum) && cur.isBefore(blockdois));
                });


                //ocupado le todos os horarios do expediente (09:00,09:30...) e retorna true or false para aqueles
                //horarios que entao definidos como ocupados em ocupados (pendente ou confirmado)
                const ocupado = ocupados.has(mostrarHoras);
                //se nao tiver bloqueado e ocupado, o horarios aparece
                slots.push({ time: label, available: !bloqueado && !ocupado });
            }

            return res.json({ date, slots });
        } catch (e) {
            console.error('listarhora erro:', e);
            return res.status(500).json({ erro: 'Falha ao gerar slots.' });
        }
    }
};