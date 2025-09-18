// backend/seedFaq.js
require("dotenv").config();
const sequelize = require("../config/db");
const Faq = require("../models/Faq");

const perguntas = [
  {
    pergunta: "Como posso marcar uma consulta?",
    resposta: "Você pode marcar pelo site, telefone ou WhatsApp da clínica.",
  },
  {
    pergunta: "Quais métodos de pagamento são aceitos?",
    resposta: "Aceitamos PIX, cartão de crédito, débito e dinheiro.",
  },
  {
    pergunta: "As consultas são presenciais ou online?",
    resposta: "Oferecemos as duas modalidades: presencial e online.",
  },
  {
    pergunta: "Qual a duração média de uma consulta?",
    resposta: "Cada consulta dura em média 50 minutos.",
  },
  {
    pergunta: "A nutricionista atende crianças?",
    resposta: "Sim, atendemos desde pediatria até geriatria.",
  },
  {
    pergunta: "Posso remarcar uma consulta já agendada?",
    resposta: "Sim, desde que seja solicitado com 24h de antecedência.",
  },
  {
    pergunta: "Há algum plano mensal de acompanhamento?",
    resposta: "Sim, temos planos mensais e trimestrais de acompanhamento.",
  },
  {
    pergunta: "É possível receber a dieta por e-mail?",
    resposta: "Sim, enviamos todo o material personalizado por e-mail.",
  },
  {
    pergunta: "Quais especialidades a Dra. Natália possui?",
    resposta: "Nutrição clínica, esportiva, pediátrica e emagrecimento.",
  },
  {
    pergunta: "O atendimento é coberto por convênio?",
    resposta: "Não diretamente, mas fornecemos recibo para reembolso.",
  },
];

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com DB OK");

    // garante que a tabela existe
    await sequelize.sync();

    for (let i = 0; i < perguntas.length; i++) {
      await Faq.create({ ...perguntas[i], ordem: i + 1 });
    }

    console.log("🌱 10 perguntas inseridas com sucesso!");
    process.exit(0);
  } catch (e) {
    console.error("❌ Erro ao popular FAQ:", e);
    process.exit(1);
  }
})();
