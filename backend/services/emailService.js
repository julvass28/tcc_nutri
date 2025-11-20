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
    console.log("📩SMTP pronto para enviar emails (conexão OK✅)");
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

function mapEspecialidade(slug) {
  if (!slug) return "Nutrição";
  const s = String(slug).toLowerCase();
  return (
    {
      clinica: "Nutrição Clínica",
      emagrecimento: "Emagrecimento e Obesidade",
      esportiva: "Nutrição Esportiva",
      pediatrica: "Nutrição Pediátrica",
      intolerancias: "Intolerâncias Alimentares",
    }[s] || // fallback para labels legíveis
    slug
  );
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

  // map especialidade (espera-se que agendamento.especialidade seja o slug salvo)
  const especialidadeLabel = mapEspecialidade(agendamento.especialidade);

  const assunto = `Consulta confirmada - ${dataStr} às ${horaStr}`;

  const html = `
    <div style="background-color:#ECE7E6;padding:40px 20px;font-family:sans-serif;color:#8A8F75;max-width:600px;margin:auto;border-radius:12px;">
      <div style="background-color:#FFFFFF;padding:30px;border-radius:12px;box-shadow:0 4px 8px rgba(0,0,0,0.05);">
        <div style="text-align:center;">
          <img src="https://i.imgur.com/5Qr0Gqp.png" alt="Logo Natália Simanoviski" style="width:100px;margin-bottom:20px;" />
          <h2 style="color:#8A8F75;margin-bottom:10px;">Sua consulta está confirmada!</h2>
        </div>

        <p style="font-size:15px;margin-bottom:16px;">
          Olá, <strong>${nomePrimeiro}</strong>!
        </p>

        <p style="font-size:14px;margin-bottom:10px;">
          Sua consulta foi confirmada para:
        </p>

        <ul style="font-size:14px;line-height:1.6;margin:0 0 16px 18px;padding:0;">
          <li><strong>Data:</strong> ${dataStr}</li>
          <li><strong>Horário:</strong> ${horaStr} (horário de Brasília)</li>
          <li><strong>Modalidade:</strong> Online – via Google Meet</li>
          <li><strong>Especialidade:</strong> ${especialidadeLabel}</li>
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
          © 2025 Natália Simanoviski | Nutricionista <br/>
          Desenvolvido por Equipe Neven
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Natália Simanoviski" <${EMAIL_USER}>`,
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

async function sendConsultaCanceladaEmail({ usuario, agendamento }) {
  if (!usuario?.email) return;

  const data = new Date(agendamento.inicio);
  const dd = String(data.getDate()).padStart(2, "0");
  const mm = String(data.getMonth() + 1).padStart(2, "0");
  const yyyy = data.getFullYear();
  const hh = String(data.getHours()).padStart(2, "0");
  const mi = String(data.getMinutes()).padStart(2, "0");
  const dataBr = `${dd}/${mm}/${yyyy}`;
  const horaBr = `${hh}:${mi}`;

  const especialidadeLabel = mapEspecialidade(agendamento.especialidade);

  const html = `
    <div style="background-color:#ECE7E6;padding:40px 20px;font-family:sans-serif;color:#8A8F75;max-width:600px;margin:auto;border-radius:12px;">
      <div style="background-color:#FFFFFF;padding:30px;border-radius:12px;box-shadow:0 4px 8px rgba(0,0,0,0.05);">
        <div style="text-align:center;">
          <img src="https://i.imgur.com/5Qr0Gqp.png" alt="Logo Natália Simanoviski" style="width:100px;margin-bottom:20px;" />
          <h2 style="color:#8A8F75;margin-bottom:10px;">Consulta cancelada</h2>
        </div>

        <p style="font-size:16px;margin-top:0;">
          Olá, <strong>${usuario.nome || "Paciente"}</strong>.
        </p>

        <p style="font-size:15px;line-height:1.6;">
          Sua consulta de <strong>${especialidadeLabel}</strong> marcada para o dia <strong>${dataBr}</strong> às <strong>${horaBr}</strong> foi
          <strong>cancelada com sucesso</strong> pelo seu painel de paciente.
        </p>

        <p style="font-size:14px;line-height:1.6;">
          <strong>Importante:</strong> conforme informado no momento do agendamento, 
          <strong>o valor pago não será estornado</strong>. A vaga foi liberada na agenda da nutricionista.
        </p>

        <p style="font-size:14px;line-height:1.6;">
          Se desejar, você pode agendar um novo horário diretamente pelo site e continuar cuidando da sua saúde com 
          o acompanhamento da <strong>Nutricionista Natália Simanoviski</strong>.
        </p>

        <p style="margin-top:24px;font-size:14px;">
          Agradecemos a confiança e seguimos à disposição para te ajudar na sua evolução. 💚
        </p>

        <hr style="margin:30px 0;border:none;border-top:1px solid #EEE;" />

        <p style="text-align:center;font-size:12px;color:#8A8F75;">
          © 2025 Natália Simanoviski | Nutricionista <br/>
          Desenvolvido por Equipe Neven
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Natália Simanoviski" <${EMAIL_USER}>`,
      to: usuario.email,
      subject: `Sua consulta foi cancelada - Natália Simanoviski`,
      html,
    });
    console.log(`📧 E-mail de cancelamento enviado para ${usuario.email}`);
  } catch (err) {
    console.error("🛑 Erro ao enviar e-mail de cancelamento:", err.message || err);
  }
}

module.exports = {
  sendConsultaConfirmadaEmail,
  sendConsultaCanceladaEmail,
};
