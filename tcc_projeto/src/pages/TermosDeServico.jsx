// TermosDeServico.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export const TERMOS_VERSAO = "2025-11-10";
export const TERMOS_CONTATO = "dev.neven@gmail.com";

export function TermosStyles() {
  return (
    <style>{`
        .tos-main {
          max-width: 860px;
          margin: 0 auto;
          padding: 48px 18px 64px; /* Espaço superior confortável */
          line-height: 1.65;
          color: #222;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
        }
        .tos-topbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .tos-back-icon {
          font-size: 20px;
          cursor: pointer;
          line-height: 1;
        }
        .tos-back-icon:focus-visible {
          outline: 2px solid #9a9f85;
          outline-offset: 2px;
          border-radius: 4px;
        }
        .tos-main h1 {
          font-size: 1.3rem;
          margin: 2px 0 4px;
          font-weight: 600;
        }
        .tos-main .version {
          margin: 0 0 14px;
          color: #555;
          font-size: 0.98rem;
        }
        .tos-main h2 {
          font-size: 1.08rem;
          margin: 18px 0 6px;
          font-weight: 600;
        }
        .tos-main p,
        .tos-main li {
          font-size: 1rem;
        }
        .tos-main ul {
          margin: 8px 0 12px 18px;
        }
      `}</style>
  );
}

export function TermosConteudo() {
  return (
    <>
      <p className="version">
        Versão {TERMOS_VERSAO} — Vigente a partir de 10 de novembro de 2025.
      </p>

      <h2>1. Aceite e Objeto</h2>
      <p>
        Estes Termos de Serviço (“Termos”) regem o uso do website e dos serviços
        disponibilizados (o “Site”), operado pela equipe de desenvolvimento Neven
        para a profissional Dra. Natália Simanoviski (“Profissional”). Ao criar uma
        conta, acessar ou utilizar o Site, você declara ter lido, compreendido e
        concordado com estes Termos.
      </p>

      <h2>2. Elegibilidade e Conta</h2>
      <p>
        Para utilizar o Site, o Usuário deve ter, no mínimo, 13 anos. O cadastro
        é pessoal e intransferível. O Usuário é responsável pela veracidade dos
        dados fornecidos, pela segurança de suas credenciais e por todas as ações
        realizadas na conta.
      </p>

      <h2>3. Coleta de Dados e Autenticação</h2>
      <p>Ao criar a conta, poderemos solicitar os seguintes dados:</p>
      <ul>
        <li>Nome e sobrenome;</li>
        <li>E-mail e criação de senha;</li>
        <li>Data de nascimento e gênero;</li>
        <li>Altura, peso e objetivo nutricional;</li>
        <li>Opcionalmente, autenticação por Google ou Facebook (social login).</li>
      </ul>
      <p>
        O e-mail poderá ser utilizado em processo de verificação em duas etapas (2FA),
        quando habilitado, e para validação de operações sensíveis (ex.: redefinição de senha).
      </p>

      <h2>4. Uso das Informações</h2>
      <p>Os dados coletados são utilizados para:</p>
      <ul>
        <li>Criação, autenticação e manutenção da conta do Usuário;</li>
        <li>Preparação e execução de agendamentos de consulta com a Profissional;</li>
        <li>Comunicações relacionadas às consultas (confirmações, remarcações, instruções);</li>
        <li>Medidas de segurança, incluindo 2FA, prevenção a fraudes e auditoria.</li>
      </ul>
      <p>
        Não realizamos envio de propaganda ou spam. As comunicações por e-mail têm
        caráter operacional e de segurança.
      </p>

      <h2>5. Compartilhamento</h2>
      <p>
        As informações de conta e perfil podem ser visualizadas por administradores
        autorizados do Site e pela Profissional, estritamente para fins de atendimento
        e gestão de consultas. Não compartilhamos dados com terceiros para fins de marketing.
      </p>
      <p>
        Poderá haver compartilhamento com fornecedores de infraestrutura e serviços técnicos
        necessários ao funcionamento do Site (por exemplo, provedores de hospedagem e de autenticação),
        sempre sob obrigações de confidencialidade e segurança compatíveis.
      </p>

      <h2>6. Consultas e Serviços Prestados</h2>
      <p>
        As consultas são realizadas online, por plataforma de terceiros (como Google Meet),
        conforme orientações disponibilizadas ao Usuário. O Site facilita o agendamento e a comunicação,
        mas a execução do atendimento ocorre na plataforma indicada.
      </p>

      <h2>7. Responsabilidades do Usuário</h2>
      <ul>
        <li>Fornecer dados exatos, completos e atualizados;</li>
        <li>Manter a confidencialidade da senha e dos meios de 2FA;</li>
        <li>Utilizar o Site de forma lícita, ética e compatível com estes Termos;</li>
        <li>Não inserir conteúdos ilícitos, ofensivos ou que violem direitos de terceiros.</li>
      </ul>

      <h2>8. Limitações de Responsabilidade</h2>
      <p>
        O Site é disponibilizado “no estado em que se encontra”. Empregamos esforços razoáveis
        de segurança e disponibilidade, sem garantia de funcionamento ininterrupto. Em nenhuma hipótese
        seremos responsáveis por danos indiretos, incidentais, especiais, punitivos ou lucros cessantes
        decorrentes do uso ou da impossibilidade de uso do Site.
      </p>

      <h2>9. Disponibilidade e Infraestrutura</h2>
      <p>
        O Site é hospedado na Vercel. Não utilizamos Google Analytics. Eventuais janelas de manutenção
        ou interrupções poderão ocorrer para melhorias e correções.
      </p>

      <h2>10. Propriedade Intelectual</h2>
      <p>
        Todos os direitos relativos a marcas, logotipos, layout, design, código e conteúdos do Site
        pertencem à Neven, à Profissional ou a seus licenciadores, sendo vedado seu uso sem autorização
        prévia e por escrito.
      </p>

      <h2>11. Encerramento e Suspensão</h2>
      <p>
        Podemos suspender ou encerrar o acesso do Usuário em caso de violação destes Termos, ordem legal,
        riscos à segurança ou integridade do Site e de outros Usuários, ou mediante solicitação do próprio Usuário.
      </p>

      <h2>12. Comunicações</h2>
      <p>
        As comunicações ocorrerão pelos canais informados no cadastro, com prevalência do e-mail.
        O Usuário deve manter seus dados de contato atualizados para receber avisos relevantes
        (ex.: 2FA, confirmações de consulta).
      </p>

      <h2>13. Alterações destes Termos</h2>
      <p>
        Poderemos atualizar estes Termos para refletir melhorias, exigências legais ou mudanças operacionais.
        Quando aplicável, notificaremos o Usuário por meio do Site e/ou e-mail. O uso contínuo do Site após a vigência
        da nova versão implica concordância com as alterações.
      </p>

      <h2>14. Contato</h2>
      <p>Dúvidas: {TERMOS_CONTATO}</p>

      <h2>15. Disposições Finais</h2>
      <p>
        A eventual nulidade de alguma cláusula não prejudicará as demais.
        O não exercício de direitos não implica renúncia. Estes Termos constituem
        o acordo integral entre as partes quanto ao uso do Site.
      </p>
    </>
  );
}

export default function TermosDeServico() {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") handleBack();
  };

  return (
    <main className="tos-main">
      <TermosStyles />
      <div className="tos-topbar">
        <i
          className="fas fa-arrow-left tos-back-icon"
          role="button"
          tabIndex={0}
          aria-label="Voltar à página anterior"
          title="Voltar"
          onClick={handleBack}
          onKeyDown={handleKey}
        />
        <h1 style={{ margin: 0 }}>Termos de Serviço e Política de Privacidade</h1>
      </div>

      <TermosConteudo />
    </main>
  );
}
