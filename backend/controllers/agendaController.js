// backend/controllers/agendaController.js
const { Op } = require('sequelize');
const { nanoid } = require('nanoid');
const sequelize = require('../config/db');

const AgendaConfig = require('../models/AgendaConfig');
const Agendamentos = require('../models/Agendamentos');
const ReservaTemp = require('../models/ReservaTemp');
const Usuario = require("../models/Usuario");
const { sendConsultaConfirmadaEmail } = require("../services/emailService");

const {
  getDow,
  getDiaRange,
  getExpediente,
  fetchBloqueiosDoDia,
  estaDentroDeBloqueio
} = require('../services/agendaService');

const { dayjs, makeDateTime } = require('../utils/time');

function* horarios(start, end, pausa) {
  let horaAtual = start.startOf('minute');
  const horaFinal = end.startOf('minute');
  while (horaAtual.isBefore(horaFinal) || horaAtual.isSame(horaFinal)) {
    yield horaAtual;
    horaAtual = horaAtual.add(pausa, 'minute');
  }
}

// LISTAR HORÁRIOS
async function listarhora(req, res) {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Parâmetro "date" é obrigatório  (YYYY-MM-DD).' });
    }

    // 🔒 Bloqueia dias passados para a PÚBLICA (e evita ruído na Admin)
    const hoje = dayjs().startOf('day');
    const diaReq = dayjs(`${date} 12:00:00`).startOf('day'); // “meio-dia trick” evita fuso
    const isPastDay = diaReq.isBefore(hoje);
    if (isPastDay) {
      return res.json({ date, slots: [] }); // nenhum slot disponível em dias passados
    }

    // higiene
    await ReservaTemp.destroy({ where: { expires_at: { [Op.lte]: new Date() } } });

    const dow = getDow(date);
    const config = await AgendaConfig.findOne({ where: { dia_semana: dow } });
    if (!config) return res.json({ date, slots: [] });

    const { InicioDia, FimDia, passo } = getExpediente(date, config);
    const { start: diaStart, end: diaEnd } = getDiaRange(date);

    const bloqueios = await fetchBloqueiosDoDia(diaStart, diaEnd);

    // agendamentos confirmados/pendentes
    const ags = await Agendamentos.findAll({
      where: {
        inicio: { [Op.gte]: diaStart.toDate(), [Op.lt]: diaEnd.toDate() },
        status: { [Op.in]: ['pendente', 'confirmada'] }
      },
      attributes: ['inicio']
    });
    const ocupados = new Set(ags.map(a => dayjs(a.inicio).format('HH:mm')));

    // holds ativos
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

// RESERVA TEMPORÁRIA
async function criarHold(req, res) {
  try {
    const { date, time, usuario_id } = req.body;
    const user_id = req.user?.id ?? usuario_id;
    if (!date || !time || !user_id) {
      return res.status(400).json({ erro: 'Campos obrigatórios: date, time, usuario_id.' });
    }

    // impede criar hold em dias passados ou no passado do próprio dia
    const agora = dayjs();
    const slotInicioGuard = makeDateTime(date, time);
    if (slotInicioGuard.isBefore(agora)) {
      return res.status(409).json({ erro: 'Não é possível reservar horários passados.' });
    }

    await ReservaTemp.destroy({ where: { expires_at: { [Op.lte]: new Date() } } });

    const dow = getDow(date);
    const config = await AgendaConfig.findOne({ where: { dia_semana: dow } });
    if (!config) return res.status(400).json({ erro: 'Sem atendimento neste dia.' });

    const { InicioDia, FimDia, passo } = getExpediente(date, config);

    const slotInicio = makeDateTime(date, time).startOf('minute');
    const slotFim = slotInicio.add(passo, 'minute');

    if (slotInicio.isBefore(InicioDia) || slotFim.isAfter(FimDia)) {
      return res.status(400).json({ erro: 'Horário fora do expediente.' });
    }

    const diffMin = slotInicio.diff(InicioDia, 'minute');
    if (diffMin % passo !== 0) {
      return res.status(400).json({ erro: 'Horário não está no passo configurado.' });
    }

    const { start: diaStart, end: diaEnd } = getDiaRange(date);
    const bloqueios = await fetchBloqueiosDoDia(diaStart, diaEnd);

    if (estaDentroDeBloqueio(slotInicio, bloqueios)) {
      return res.status(409).json({ erro: 'Horário bloqueado.' });
    }

    const jaAgendado = await Agendamentos.findOne({
      where: { inicio: slotInicio.toDate(), status: { [Op.in]: ['pendente', 'confirmada'] } }
    });
    if (jaAgendado) return res.status(409).json({ erro: 'Horário já agendado.' });

    const jaHold = await ReservaTemp.findOne({
      where: { inicio: slotInicio.toDate(), expires_at: { [Op.gt]: new Date() } }
    });
    if (jaHold) return res.status(409).json({ erro: 'Horário temporariamente reservado.' });

    const paymentRef = nanoid(24);
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

// CONFIRMAR
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
      return res.status(200).json({ msg: 'Pagamento já confirmado.', agendamento: agendamentoExistente });
    }

    const hold = await ReservaTemp.findOne({
      where: { payment_ref, expires_at: { [Op.gt]: new Date() } }
    });
    if (!hold) {
      return res.status(404).json({ erro: 'Reserva temporária não encontrada ou expirada.' });
    }

    let agendamentoCriado;
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

    // e-mail de confirmação de consulta
    try {
      const usuario = await Usuario.findByPk(hold.usuario_id);
      if (usuario && usuario.email && agendamentoCriado) {
        await sendConsultaConfirmadaEmail({
          usuario,
          agendamento: agendamentoCriado,
        });
      }
    } catch (errMail) {
      console.error(
        "Erro ao enviar e-mail de confirmação (confirmarPagamento):",
        errMail.message || errMail
      );
    }

    return res.status(201).json({
      msg: 'Agendamento confirmado.',
      agendamento: agendamentoCriado
    });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      const existente = await Agendamentos.findOne({ where: { idempotency_key: req.body?.payment_ref } });
      if (existente) {
        await ReservaTemp.destroy({ where: { payment_ref: req.body?.payment_ref } });
        return res.status(200).json({ msg: 'Pagamento já confirmado.', agendamento: existente });
      }
      return res.status(409).json({ erro: 'Conflito de agendamento.' });
    }

    console.error('confirmarPagamento erro:', e);
    return res.status(500).json({ erro: 'Falha ao confirmar pagamento.' });
  }
}

module.exports = { listarhora, criarHold, confirmarPagamento };
