// backend/routes/agendaRoutes.js
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Agendamento = require("../models/Agendamentos");
const ReservaTemp = require("../models/ReservaTemp");
const Bloqueio = require("../models/Bloqueio");
const auth = require("../middleware/auth");

// ===== Config =====
const SLOT_MINUTES = 30;   // grade visual
const APPT_MINUTES = 60;   // consulta ocupa 60 min
const HOLD_MINUTES = 60;
const HOLD_EXPIRES_MIN = 10;

// expediente (ajuste como quiser)
// Substitua a função dayWindows atual por ESTA versão (parse local, sem UTC):
function dayWindows(dateISO) {
  // parse local para evitar o shift de fuso
  const [y, m, d] = String(dateISO).split("-").map(Number);
  const wd = new Date(y, (m || 1) - 1, d || 1).getDay(); // 0=Dom .. 6=Sáb

  // Domingo fechado
  if (wd === 0) return [];

  // Sábado 08:00 - 12:00
  if (wd === 6) return [{ start: "08:00", end: "12:00" }];

  // Seg–Sex 08:00 - 18:00
  return [{ start: "08:00", end: "18:00" }];
}

// helpers
function toDate(dateStr, hhmm) { return new Date(`${dateStr}T${hhmm}:00`); }
function addMinutes(d, mins) { return new Date(d.getTime() + mins * 60000); }
function overlaps(aStart, aEnd, bStart, bEnd) { return aStart < bEnd && bStart < aEnd; }
function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function hhmm(d) { return d.toTimeString().slice(0, 5); }

// === núcleo que calcula os slots (grade 30, ocupação 60) ===
async function buildSlotsForDate(dateISO) {
  const dayStart = new Date(`${dateISO}T00:00:00`);
  const dayEnd   = new Date(`${dateISO}T23:59:59`);
  const now = new Date();

  const [agends, holds, blocks] = await Promise.all([
    Agendamento.findAll({
      where: { inicio: { [Op.lte]: dayEnd }, fim: { [Op.gte]: dayStart }, status: { [Op.ne]: "cancelada" } },
      raw: true,
    }),
    ReservaTemp.findAll({
      where: { inicio: { [Op.lte]: dayEnd }, fim: { [Op.gte]: dayStart }, expires_at: { [Op.gt]: new Date() } },
      raw: true,
    }),
    Bloqueio.findAll({
      where: { inicio: { [Op.lte]: dayEnd }, fim: { [Op.gte]: dayStart } },
      raw: true,
    }),
  ]);

  const windows = dayWindows(dateISO);
  const slots = [];

  for (const w of windows) {
    const wStart = toDate(dateISO, w.start);
    const wEnd   = toDate(dateISO, w.end);

    // cada “ponto” de 30 min só é válido se a janela de 60 min couber no expediente
    for (let t = new Date(wStart); addMinutes(t, APPT_MINUTES) <= wEnd; t = addMinutes(t, SLOT_MINUTES)) {
      const start = new Date(t);
      const end   = addMinutes(start, APPT_MINUTES);

      // impede horários passados (no próprio dia)
      const past = end <= now;

      const hitAg   = agends.some(a => overlaps(start, end, new Date(a.inicio), new Date(a.fim)));
      const hitHold = holds .some(h => overlaps(start, end, new Date(h.inicio), new Date(h.fim)));
      const hitBloq = blocks.some(b => overlaps(start, end, new Date(b.inicio), new Date(b.fim)));

      slots.push({ time: hhmm(start), available: !(past || hitAg || hitHold || hitBloq) });
    }
  }
  return slots;
}

// === PUBLIC: lista de slots do dia ===
router.get("/slots", async (req, res) => {
  try {
    const date = (req.query.date || "").slice(0, 10);
    if (!date || isNaN(new Date(`${date}T00:00:00`).getTime())) {
      return res.status(400).json({ erro: "Informe ?date=YYYY-MM-DD" });
    }
    const slots = await buildSlotsForDate(date);
    return res.json({ date, slots });
  } catch (err) {
    console.error("GET /agenda/slots erro:", err);
    // devolve shape estável para o front (evita quebrar .slots)
    return res.status(200).json({ date: req.query.date || null, slots: [] });
  }
});

// === PUBLIC (autenticado): cria hold 60min ===
router.post("/hold", auth, async (req, res) => {
  try {
    const { date, time } = req.body || {};
    if (!date || !time) return res.status(400).json({ erro: "date e time são obrigatórios." });

    const inicio = toDate(date, time);
    const fim    = addMinutes(inicio, HOLD_MINUTES);

    // valida expediente
    const fitsWindow = dayWindows(date).some(w => {
      const wStart = toDate(date, w.start);
      const wEnd   = toDate(date, w.end);
      return inicio >= wStart && fim <= wEnd;
    });
    if (!fitsWindow) return res.status(400).json({ erro: "Horário fora do expediente." });

    // impede passado
    if (fim <= new Date()) return res.status(400).json({ erro: "Horário no passado." });

    // conflito?
    const [agends, holds, blocks] = await Promise.all([
      Agendamento.findAll({
        where: { inicio: { [Op.lte]: fim }, fim: { [Op.gte]: inicio }, status: { [Op.ne]: "cancelada" } },
        raw: true,
      }),
      ReservaTemp.findAll({
        where: { inicio: { [Op.lte]: fim }, fim: { [Op.gte]: inicio }, expires_at: { [Op.gt]: new Date() } },
        raw: true,
      }),
      Bloqueio.findAll({ where: { inicio: { [Op.lte]: fim }, fim: { [Op.gte]: inicio } }, raw: true }),
    ]);

    const conflitou =
      agends.some(a => overlaps(inicio, fim, new Date(a.inicio), new Date(a.fim))) ||
      holds .some(h => overlaps(inicio, fim, new Date(h.inicio), new Date(h.fim))) ||
      blocks.some(b => overlaps(inicio, fim, new Date(b.inicio), new Date(b.fim)));

    if (conflitou) return res.status(409).json({ erro: "Horário indisponível no momento." });

    // cria hold
    const expires_at = addMinutes(new Date(), HOLD_EXPIRES_MIN);
    const hold = await ReservaTemp.create({
      usuario_id: req.user.id,
      inicio,
      fim,
      expires_at,
      payment_ref: `p_${req.user.id}_${Date.now()}`,
    });

    return res.status(201).json({
      hold_id: hold.id,
      payment_ref: hold.payment_ref,
      expires_at: hold.expires_at,
    });
  } catch (err) {
    console.error("POST /agenda/hold erro:", err);
    return res.status(500).json({ erro: "Falha ao criar reserva" });
  }
});

module.exports = router;
