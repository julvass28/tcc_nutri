// backend/scripts/seedUsers.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
require("../models/Usuario");
const Usuario = require("../models/Usuario");

const FIRST = ["Ana","Bruno","Carla","Diego","Eduarda","Felipe","Giovana","Hugo","Isabela","João","Katia","Lucas","Marina","Natan","Olivia","Paulo","Quésia","Renan","Sofia","Thiago","Úrsula","Vitor","Wesley","Yasmin","Zeca"];
const LAST  = ["Almeida","Barbosa","Campos","Dias","Esteves","Ferreira","Gomes","Hernandes","Ibrahim","Jesus","Klein","Lopes","Moura","Nascimento","Oliveira","Pereira","Queiroz","Ramos","Silva","Teixeira","Uchoa","Vieira","Wagner","Xavier","Yamamoto","Zanetti"];
const GENEROS = ["Feminino","Masculino","Outro"];

function rand(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
function rfloat(min, max, dec = 2){ return Number((Math.random() * (max - min) + min).toFixed(dec)); }
function rint(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }
function randDate(days = 120){
  const now = Date.now();
  const past = now - rint(0, days) * 24 * 60 * 60 * 1000;
  return new Date(past);
}

async function main() {
  const total = Number(process.argv[2] || 30);     // ex.: node scripts/seedUsers.js 50
  const addAdmin = process.argv.includes("--admin"); // adiciona 1 admin de teste
  const password = "Teste@123"; // senha padrão dos seeds

  console.log(`→ Gerando ${total} usuários de teste${addAdmin ? " (+1 admin)" : ""}...`);
  const senhaHash = await bcrypt.hash(password, 10);

  const baseEmailTag = `seed${Date.now()}`;
  const payload = [];

  for (let i = 0; i < total; i++) {
    const nome = rand(FIRST);
    const sobrenome = rand(LAST);
    const email = `${nome.toLowerCase()}.${sobrenome.toLowerCase()}.${baseEmailTag}.${i}@exemplo.com`;

    payload.push({
      nome,
      sobrenome,
      email,
      senha: senhaHash,
      fotoUrl: null,
      data_nascimento: new Date(rint(1975, 2012), rint(0, 11), rint(1, 28)),
      genero: rand(GENEROS),
      altura: rfloat(1.50, 1.95, 2),
      peso: rfloat(50, 110, 1),
      objetivo: String(rint(1, 5)),   // 1..5
      isAdmin: false,
      createdAt: randDate(120),
      updatedAt: new Date(),
    });
  }

  if (addAdmin) {
    payload.push({
      nome: "Admin",
      sobrenome: "Seed",
      email: `admin.${baseEmailTag}@exemplo.com`,
      senha: senhaHash,
      fotoUrl: null,
      data_nascimento: new Date(1995, 5, 10),
      genero: "Outro",
      altura: 1.75,
      peso: 75,
      objetivo: "1",
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  try {
    await sequelize.authenticate();
    console.log("✅ Conexão OK");
    await Usuario.bulkCreate(payload, { validate: true });
    console.log(`✅ Inseridos ${payload.length} registros.`);
    console.log(`ℹ️ E-mail de exemplo: ${payload[0].email} | senha: ${password}`);
  } catch (e) {
    console.error("🛑 Erro ao semear:", e.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

main();
