// backend/services/preco.js
const SiteConfig = require("../models/SiteConfig");

const DEFAULT_PRECO_CENTS = 8000; // 80,00

async function getPrecoCents() {
  const row = await SiteConfig.findOne({ where: { key: "consulta_preco_cents" }, raw: true });
  const cents = row ? Number(row.value) : DEFAULT_PRECO_CENTS;
  return Number.isFinite(cents) ? cents : DEFAULT_PRECO_CENTS;
}

async function setPrecoCents(n) {
  const cents = Math.max(0, Math.round(Number(n) || 0));
  const [row, created] = await SiteConfig.findOrCreate({
    where: { key: "consulta_preco_cents" },
    defaults: { value: String(cents) },
  });
  if (!created) await row.update({ value: String(cents) });
  return cents;
}

module.exports = { getPrecoCents, setPrecoCents, DEFAULT_PRECO_CENTS };
