// backend/routes/adminAgendaRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const { Op } = require("sequelize");
const Agendamentos = require("../models/Agendamentos");
const ReservaTemp = require("../models/ReservaTemp");
const Bloqueio = require("../models/Bloqueio");
const Usuario = require("../models/Usuario");

const SLOT_MINUTES = 30;
const APPT_MINUTES = 60;

function dayWindows(dateISO) {
  // parse local para evitar o shift de fuso
  const [y, m, d] = String(dateISO).split("-").map(Number);
  const wd = new Date(y, (m || 1) - 1, d || 1).getDay(); // 0=Dom .. 6=Sáb

  if (wd === 0) return []; // domingo fechado
  if (wd === 6) return [{ start: "08:00", end: "12:00" }]; // sábado
  return [{ start: "08:00", end: "18:00" }]; // seg–sex
}
function toDate(dateStr, hhmm) { return new Date(`${dateStr}T${hhmm}:00`); }
function addMinutes(d, mins){ return new Date(d.getTime() + mins * 60000); }
function overlaps(aStart, aEnd, bStart, bEnd){ return aStart < bEnd && bStart < aEnd; }
function isoDate(d){ const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), dd=String(d.getDate()).padStart(2,"0"); return `${y}-${m}-${dd}`; }

// LISTAGEM (usada nas telas AdminAgendaSlots e AdminAgendaFull)
router.get("/slots", auth, adminOnly, async (req, res) => {
  const { de, ate } = req.query;
  if (!de || !ate) return res.status(400).json({ erro: "Informe ?de=YYYY-MM-DD&ate=YYYY-MM-DD" });

  const start = new Date(`${de}T00:00:00`);
  const end   = new Date(`${ate}T23:59:59`);

  const [ags, holds] = await Promise.all([
    Agendamentos.findAll({ where: { inicio: { [Op.gte]: start, [Op.lte]: end } }, raw: true }),
    ReservaTemp.findAll({ where: { inicio: { [Op.gte]: start, [Op.lte]: end }, expires_at: { [Op.gt]: new Date() } }, raw: true }),
  ]);

  const ids = [...new Set([...ags.map(a => a.usuario_id), ...holds.map(h => h.usuario_id)])];
  const users = ids.length
    ? await Usuario.findAll({ where: { id: ids }, attributes: ["id","nome","sobrenome","email"], raw: true })
    : [];
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  const out = [
    ...ags.map(a => ({
      tipo: "confirmado",
      inicio: a.inicio,
      fim: a.fim,
      status: a.status,
      paciente: userMap[a.usuario_id] || null,
      payment_ref: a.idempotency_key || null,
      reserved_at: a.createdAt || null, // só p/ manter shape (não usado p/ confirmados)
    })),
    ...holds.map(h => ({
      tipo: "hold",
      inicio: h.inicio,
      fim: h.fim,
      status: "pendente",
      paciente: userMap[h.usuario_id] || null,
      payment_ref: h.payment_ref || null,
      reserved_at: h.createdAt || h.updatedAt || null,
      expires_at: h.expires_at,
    })),
  ].sort((a,b)=> new Date(a.inicio) - new Date(b.inicio));

  res.json(out);
});

// BLOQUEAR FAIXA
router.post("/bloquear", auth, adminOnly, async (req, res) => {
  const { date, horaInicio, horaFim, motivo } = req.body;
  if (!date || !horaInicio || !horaFim) return res.status(400).json({ erro: "date, horaInicio, horaFim obrigatórios" });
  const row = await Bloqueio.create({ inicio: new Date(`${date}T${horaInicio}`), fim: new Date(`${date}T${horaFim}`), motivo: motivo || null });
  res.status(201).json(row);
});

// BLOQUEAR DIA INTEIRO
router.post("/bloquear-dia", auth, adminOnly, async (req, res) => {
  const { date, motivo } = req.body;
  if (!date) return res.status(400).json({ erro: "date obrigatório" });
  const row = await Bloqueio.create({ inicio: new Date(`${date}T00:00:00`), fim: new Date(`${date}T23:59:59`), motivo: motivo || "dia bloqueado" });
  res.status(201).json(row);
});

// REMOVER BLOQUEIO
router.delete("/bloqueio/:id", auth, adminOnly, async (req, res) => {
  const b = await Bloqueio.findByPk(req.params.id);
  if (!b) return res.status(404).json({ erro: "Bloqueio não encontrado" });
  await b.destroy();
  res.json({ ok: true });
});

// MAPA DE BLOQUEIOS (por dia)
router.get("/bloqueios", auth, adminOnly, async (req, res) => {
  const { de, ate } = req.query;
  if (!de || !ate) return res.status(400).json({ erro: "Informe ?de=YYYY-MM-DD&ate=YYYY-MM-DD" });

  const start = new Date(`${de}T00:00:00`);
  const end   = new Date(`${ate}T23:59:59`);

  const rows = await Bloqueio.findAll({ where: { inicio: { [Op.lte]: end }, fim: { [Op.gte]: start } }, raw: true });

  const outMap = {};
  rows.forEach(b => {
    let c = new Date(b.inicio);
    while (c <= b.fim) {
      const key = isoDate(c);
      if (!outMap[key]) outMap[key] = [];
      outMap[key].push({ id: b.id, inicio: b.inicio, fim: b.fim, motivo: b.motivo || null });
      c.setDate(c.getDate() + 1);
    }
  });

  res.json(outMap);
});

// INDICADOR DE DISPONIBILIDADE (para o calendário admin full)
router.get("/disponibilidade", auth, adminOnly, async (req, res) => {
  const { de, ate } = req.query;
  if (!de || !ate) return res.status(400).json({ erro: "Informe ?de=YYYY-MM-DD&ate=YYYY-MM-DD" });

  const start = new Date(`${de}T00:00:00`);
  const end   = new Date(`${ate}T23:59:59`);

  const [agends, holds, blocks] = await Promise.all([
    Agendamentos.findAll({
      where: {
        inicio: { [Op.lte]: end },
        fim: { [Op.gte]: start },
        status: { [Op.in]: ["pendente", "confirmada"] }, // 👈 aqui ajustado
      },
      raw: true
    }),
    ReservaTemp.findAll({
      where: {
        inicio: { [Op.lte]: end },
        fim: { [Op.gte]: start },
        expires_at: { [Op.gt]: new Date() }
      },
      raw: true
    }),
    Bloqueio.findAll({
      where: {
        inicio: { [Op.lte]: end },
        fim: { [Op.gte]: start }
      },
      raw: true
    }),
  ]);

  const byDay = {};
  const push = (day, type, row) => {
    if (!byDay[day]) byDay[day] = { ag: [], h: [], b: [] };
    byDay[day][type].push(row);
  };
  const spanEachDay = (ini, fim, cb) => {
    const c = new Date(ini);
    while (c <= fim) { cb(isoDate(c)); c.setDate(c.getDate() + 1); }
  };

  agends.forEach(a => spanEachDay(new Date(a.inicio), new Date(a.fim), k => push(k,"ag",a)));
  holds .forEach(h => spanEachDay(new Date(h.inicio), new Date(h.fim), k => push(k,"h",h)));
  blocks.forEach(b => spanEachDay(new Date(b.inicio), new Date(b.fim), k => push(k,"b",b)));

  const out = {};
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = isoDate(d);
    const w = dayWindows(key);
    let tem = false;

    if (w.length === 0) { out[key] = { temAlgumSlotDisponivel: false }; continue; }

    const ag = (byDay[key]?.ag || []).map(x => ({ s:new Date(x.inicio), e:new Date(x.fim) }));
    const hh = (byDay[key]?.h  || []).map(x => ({ s:new Date(x.inicio), e:new Date(x.fim) })).filter(x => x.e > new Date());
    const bb = (byDay[key]?.b  || []).map(x => ({ s:new Date(x.inicio), e:new Date(x.fim) }));

    outer:
    for (const win of w) {
      const wStart = toDate(key, win.start);
      const wEnd   = toDate(key, win.end);
      for (let t = new Date(wStart); addMinutes(t, APPT_MINUTES) <= wEnd; t = addMinutes(t, SLOT_MINUTES)) {
        const s = new Date(t);
        const e = addMinutes(s, APPT_MINUTES);
        const hit = ag.some(x => overlaps(s,e,x.s,x.e)) || hh.some(x => overlaps(s,e,x.s,x.e)) || bb.some(x => overlaps(s,e,x.s,x.e));
        if (!hit) { tem = true; break outer; }
      }
    }
    out[key] = { temAlgumSlotDisponivel: tem };
  }

  res.json(out);
});

// === NOVO: liberar um HOLD pelo payment_ref (usado no menu "⋯") ===
router.delete("/hold/:payment_ref", auth, adminOnly, async (req, res) => {
  const { payment_ref } = req.params;
  const row = await ReservaTemp.findOne({ where: { payment_ref } });
  if (!row) return res.status(404).json({ erro: "Reserva não encontrada." });
  await row.destroy();
  res.json({ ok: true });
});

module.exports = router;
