// backend/services/emailService.js
const nodemailer = require("nodemailer");

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  TZ,
} = process.env;

// Aviso básico se faltar config
if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn(
    "[emailService] EMAIL_USER ou EMAIL_PASS não configurados. Envio de e-mail ficará desativado."
  );
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST || "smtp.gmail.com",
  port: Number(EMAIL_PORT || 587),
  secure: Number(EMAIL_PORT) === 465, // 465 = SSL, 587 = STARTTLS
  auth: EMAIL_USER && EMAIL_PASS ? { user: EMAIL_USER, pass: EMAIL_PASS } : undefined,
});

// Teste de conexão SMTP ao subir o servidor
transporter
  .verify()
  .then(() => {
    console.log("📧 SMTP pronto para uso (conexão OK)");
  })
  .catch((err) => {
    console.error(
      "🛑 Falha ao conectar no SMTP:",
      err.message || err,
      err?.response || ""
    );
  });

function formatarDataHoraBR(date) {
  const tz = TZ || "America/Sao_Paulo";

  const dataStr = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: tz,
  });

  const horaStr = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
  });

  return { dataStr, horaStr };
}

/**
 * Envia e-mail para o paciente com as instruções da consulta online.
 * @param {{ usuario: any, agendamento: any }} param0
 */
async function sendConsultaConfirmadaEmail({ usuario, agendamento }) {
  if (!usuario || !usuario.email || !agendamento || !agendamento.inicio) {
    console.warn(
      "[emailService] Dados insuficientes para enviar e-mail de consulta confirmada."
    );
    return;
  }

  const nomePrimeiro = (usuario.nome || "").split(" ")[0] || "Paciente";

  let dataStr = "";
  let horaStr = "";

  try {
    const inicioDate = new Date(agendamento.inicio);
    ({ dataStr, horaStr } = formatarDataHoraBR(inicioDate));
  } catch (e) {
    console.error(
      "[emailService] Erro ao formatar data/hora:",
      e.message || e
    );
    const inicioDate = new Date(agendamento.inicio);
    dataStr = inicioDate.toLocaleDateString("pt-BR");
    horaStr = inicioDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const assunto = `Consulta confirmada - ${dataStr} às ${horaStr}`;

  const html = `
    <div style="background-color:#ECE7E6;padding:40px 20px;font-family:sans-serif;color:#8A8F75;max-width:600px;margin:auto;border-radius:12px;">
      <div style="background-color:#FFFFFF;padding:30px;border-radius:12px;box-shadow:0 4px 8px rgba(0,0,0,0.05);">
        <div style="text-align:center;">
          <img src="https://i.imgur.com/5Qr0Gqp.png" alt="Logo Natália Simanovski" style="width:100px;margin-bottom:20px;" />
          <h2 style="color:#8A8F75;margin-bottom:10px;">Sua consulta está confirmada!</h2>
        </div>

        <p style="font-size:15px;margin-bottom:16px;">
          Olá, <strong>${nomePrimeiro}</strong>!
        </p>

        <p style="font-size:14px;margin-bottom:10px;">
          Sua consulta de nutrição foi confirmada para:
        </p>

        <ul style="font-size:14px;line-height:1.6;margin:0 0 16px 18px;padding:0;">
          <li><strong>Data:</strong> ${dataStr}</li>
          <li><strong>Horário:</strong> ${horaStr} (horário de Brasília)</li>
          <li><strong>Modalidade:</strong> Online – via Google Meet</li>
        </ul>

        <p style="font-size:14px;margin-bottom:10px;">
          Aproximadamente <strong>10 minutos antes</strong> do horário marcado, entrarei em contato:
        </p>
        <ul style="font-size:14px;line-height:1.6;margin:0 0 16px 18px;padding:0;">
          <li>pelo <strong>telefone informado na sua anamnese</strong> e</li>
          <li>pelo <strong>seu e-mail</strong>, enviando o link/código da reunião no Google Meet.</li>
        </ul>

        <p style="font-size:14px;margin-bottom:10px;">
          No horário combinado, acesse o link do Google Meet em um local tranquilo, com boa conexão à internet.
          Tenha seus exames (se houver), lista de medicamentos e dúvidas principais anotadas.
        </p>

        <p style="font-size:14px;margin-bottom:18px;">
          Se não encontrar o e-mail na caixa de entrada, lembre-se de verificar também o <strong>spam</strong> ou "lixo eletrônico".
        </p>

        <hr style="margin:24px 0;border:none;border-top:1px solid #EEE;" />

        <p style="font-size:12px;color:#8A8F75;margin-bottom:6px;">
          Qualquer dúvida antes da consulta, você pode responder este e-mail.
        </p>

        <p style="text-align:center;font-size:12px;color:#8A8F75;margin-top:18px;">
          © 2025 Natália Simanovski | Nutricionista <br/>
          Desenvolvido por Equipe Neven
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Natália Simanovski" <${EMAIL_USER}>`,
      to: usuario.email,
      subject: assunto,
      html,
    });
    console.log(`📧 E-mail de consulta confirmada enviado para ${usuario.email}`);
  } catch (err) {
    console.error(
      "🛑 Erro ao enviar e-mail de consulta confirmada:",
      err.message || err,
      err?.response || ""
    );
  }
}

module.exports = { sendConsultaConfirmadaEmail };
