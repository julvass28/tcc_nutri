const { Op } = require('sequelize'); //chama operadores para where, igualdade nn precisa
const { nanoid } = require('nanoid'); // faz o token da requisição
const sequelize = require('../config/db');



const AgendaConfig = require('../models/AgendaConfig');
const Agendamentos = require('../models/Agendamentos');
const ReservaTemp = require('../models/ReservaTem');
const {
    getDow,
    getDiaRange,
    getExpediente,
    fetchBloqueiosDoDia,
    estaDentroDeBloqueio
} = require('../services/agendaService');

const { dayjs, makeDateTime } = require('../utils/time');


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
//vou conseguir exportar para outros arquivos 
// LISTAR HORÁRIOS
async function listarhora(req, res) {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Parâmetro "date" é obrigatório  (YYYY-MM-DD).' });
    }

    // limpa holds expirados (higiene)
    await ReservaTemp.destroy({ where: { expires_at: { [Op.lte]: new Date() } } });

    const diasSemana = getDow(date);
    const config = await AgendaConfig.findOne({ where: { dia_semana: diasSemana } });
    if (!config) return res.json({ date, slots: [] });

    const { InicioDia, FimDia, passo } = getExpediente(date, config);
    const { start: diaStart, end: diaEnd } = getDiaRange(date);

    const bloqueios = await fetchBloqueiosDoDia(diaStart, diaEnd);

    // agendamentos já confirmados/pendentes no dia
    const ags = await Agendamentos.findAll({
      where: {
        inicio: { [Op.gte]: diaStart.toDate(), [Op.lt]: diaEnd.toDate() },
        status: { [Op.in]: ['pendente', 'confirmada'] }
      },
      attributes: ['inicio']
    });
    const ocupados = new Set(ags.map(a => dayjs(a.inicio).format('HH:mm')));

    // holds ATIVOS no dia (não-expirados)
    const holds = await ReservaTemp.findAll({
      where: {
        inicio: { [Op.gte]: diaStart.toDate(), [Op.lt]: diaEnd.toDate() },
        expires_at: { [Op.gt]: new Date() }
      },
      attributes: ['inicio']
    });
    const holdSet = new Set(holds.map(h => dayjs(h.inicio).format('HH:mm')));

    const slots = [];

    for (const cur of horarios(InicioDia, FimDia, passo)) {
      const label = cur.format('HH:mm');
      const slotEnd = cur.add(passo, 'minute');

      const bloqueado = bloqueios.some(b => {
        const bi = dayjs(b.inicio);
        const bf = dayjs(b.fim);
        return cur.isBefore(bf) && slotEnd.isAfter(bi);
      });

      const ocupado = ocupados.has(label) || holdSet.has(label);

      slots.push({ time: label, available: !bloqueado && !ocupado });
    }

    return res.json({ date, slots });
  } catch (e) {
    console.error('listarhora erro:', e);
    return res.status(500).json({ erro: 'Falha ao gerar slots.' });
  }
}




//RESERVA TEMPORARIA e PAGAMENTO
async function criarHold(req, res) {
    try {
        //cria essas tres const que sao requiridas do body, ou seja front precisa me enviar essas informações
        const { date, time, usuario_id } = req.body;
        //pega uma const e se tiver login, usa dados login no user, se nao usuario_id é obrigatório
        const user_id = req.user?.id ?? usuario_id;
        if (!date || !time || !user_id) {
            return res.status(400).json({ erro: 'Campos obrigatórios: date, time, usuario_id.' });
        }

        //destroi horarios expirados pelo pagamento
        //Exemplo: se agora é 14:10, serão removidos holds que venciam 14:00, 14:09 e 14:10.
        await ReservaTemp.destroy({ where: { expires_at: { [Op.lte]: new Date() } } });

        const dow = getDow(date);
        const config = await AgendaConfig.findOne({ where: { dia_semana: dow } });
        if (!config) return res.status(400).json({ erro: 'Sem atendimento neste dia.' });



        const { InicioDia, FimDia, passo } = getExpediente(date, config);

        //slotInicio: exatamente o horário que a pessoa clicou (ex.: 2025-08-26 09:30).
        //slotFim: slotInicio + passo (ex.: 10:00).
        const slotInicio = makeDateTime(date, time).startOf('minute');
        const slotFim = slotInicio.add(passo, 'minute');

        if (slotInicio.isBefore(InicioDia) || slotFim.isAfter(FimDia)) {
            return res.status(400).json({ erro: 'Horário fora do expediente.' });
        }

        //diferença de minutos entre o horário escolhido (slotInicio) e o início do expediente (InicioDia).
        //Ex.: InicioDia = 09:00 slotInicio = 09:30 → diffMin = 30
        const diffMin = slotInicio.diff(InicioDia, 'minute');
        //% é o módulo (o “resto da divisão”).
        if (diffMin % passo !== 0) {
            return res.status(400).json({ erro: 'Horário não está no passo configurado.' });
        }



        const { start: diaStart, end: diaEnd } = getDiaRange(date);
        const bloqueios = await fetchBloqueiosDoDia(diaStart, diaEnd);



        const conflitaBloqueio = estaDentroDeBloqueio(slotInicio, bloqueios);
        if (conflitaBloqueio) return res.status(409).json({ erro: 'Horário bloqueado.' });




        const jaAgendado = await Agendamentos.findOne({
            where: { inicio: slotInicio.toDate(), status: { [Op.in]: ['pendente', 'confirmada'] } }
        });
        if (jaAgendado) return res.status(409).json({ erro: 'Horário já agendado.' });

        const jaHold = await ReservaTemp.findOne({
            where: { inicio: slotInicio.toDate(), expires_at: { [Op.gt]: new Date() } }
        });
        if (jaHold) return res.status(409).json({ erro: 'Horário temporariamente reservado.' });





        const paymentRef = nanoid(24);//gera uma string única (tipo Q3J9...) pra ser a referência de pagamento.
        const hold = await ReservaTemp.create({
            usuario_id: user_id,
            inicio: slotInicio.toDate(),
            fim: slotFim.toDate(),
            expires_at: dayjs().add(15, 'minute').toDate(),
            payment_ref: paymentRef
        });

        return res.status(201).json({
            hold_id: hold.id,
            payment_ref: paymentRef,
            expires_at: dayjs(hold.expires_at).toISOString()
        });
    } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ erro: 'Horário temporariamente reservado.' });
    }
    console.error('criarHold erro:', e);
    return res.status(500).json({ erro: 'Falha ao criar reserva temporária.' });
}


}


//CONFIRMADA

async function confirmarPagamento(req, res) {
    try {
        const { payment_ref } = req.body;
        if (!payment_ref) {
            return res.status(400).json({ erro: 'payment_ref é obrigatório.' });
        }

        const agendamentoExistente = await Agendamentos.findOne({
            where: { idempotency_key: payment_ref }
        });
        if (agendamentoExistente) {
            await ReservaTemp.destroy({ where: { payment_ref } });
            return res.status(200).json({ msg: 'Pagamento já confirmado.', agendamento: agendamentoExistente })
        }

        const hold = await ReservaTemp.findOne({
            where: { payment_ref, expires_at: { [Op.gt]: new Date() } }
        });
        if (!hold) {
            return res.status(404).json({ erro: 'Reserva temporária não encontrada ou expirada.' });
        }


        let agendamentoCriado;
        // Transaction É uma transação de banco: tudo que rola lá dentro é atômico.
        //Se qualquer passo falhar, o Sequelize dá rollback (volta tudo).
        await sequelize.transaction(async (t) => {
            agendamentoCriado = await Agendamentos.create({
                usuario_id: hold.usuario_id,
                inicio: hold.inicio,
                fim: hold.fim,
                status: 'confirmada',
                idempotency_key: payment_ref
            }, { transaction: t });

            await ReservaTemp.destroy({ where: { id: hold.id }, transaction: t });
        });

        return res.status(201).json({
            msg: 'Agendamento confirmado.',
            agendamento: agendamentoCriado
        });
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            const existente = await Agendamentos.findOne({ where: { idempotency_key: req.body?.payment_ref } });
            if (existente) {
                await ReservaTemp.destroy({ where: { payment_ref: req.body?.payment_ref } }); // limpeza defensiva
                return res.status(200).json({ msg: 'Pagamento já confirmado.', agendamento: existente });
            }
            return res.status(409).json({ erro: 'Conflito de agendamento.' });
        }

        console.error('confirmarPagamento erro:', e);
        return res.status(500).json({ erro: 'Falha ao confirmar pagamento.' });
    }
}




module.exports = { listarhora, criarHold, confirmarPagamento };



