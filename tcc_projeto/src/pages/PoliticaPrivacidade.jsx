// src/pages/PoliticaPrivacidade.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { TermosStyles } from "./TermosDeServico";

export const PRIVACIDADE_VERSAO = "2025-11-10";
export const PRIVACIDADE_CONTATO = "dev.neven@gmail.com";

// 🔹 CONTEÚDO REUTILIZÁVEL (pra modal e pra página inteira)
export function PoliticaConteudo() {
  return (
    <>
      <p className="version">
        Versão {PRIVACIDADE_VERSAO} — Vigente a partir de 10 de novembro de 2025.
      </p>

      <h2>1. Informações que coletamos</h2>
      <p>
        Coletamos os dados que você informa ao criar uma conta ou utilizar o
        site, como nome, sobrenome, e-mail, data de nascimento, gênero, altura,
        peso e objetivo nutricional. Também podemos receber seu nome, e-mail e
        foto de perfil quando você utiliza login social (Google ou Facebook).
      </p>

      <h2>2. Como usamos seus dados</h2>
      <p>Seus dados são utilizados para:</p>
      <ul>
        <li>Criar e autenticar sua conta de acesso;</li>
        <li>Permitir o agendamento e o gerenciamento de consultas;</li>
        <li>Exibir informações relevantes no seu perfil e nas áreas restritas;</li>
        <li>Enviar e-mails operacionais (confirmações, avisos, recuperação de senha);</li>
        <li>Mantener a segurança da conta e do site.</li>
      </ul>

      <h2>3. Compartilhamento</h2>
      <p>
        Os dados podem ser acessados pela equipe Neven e pela Dra. Natália
        Simanoviski apenas para fins de atendimento e administração das
        consultas. Também utilizamos fornecedores de infraestrutura (como
        hospedagem e envio de e-mails), sempre com obrigações de
        confidencialidade e segurança.
      </p>

      <h2>4. Login social (Google e Facebook)</h2>
      <p>
        Quando você entra com Google ou Facebook, recebemos as informações
        básicas que essas plataformas autorizam (como nome, e-mail e foto de
        perfil). Não publicamos nada em seu nome nessas redes e não temos acesso
        à sua senha de Google ou Facebook.
      </p>

      <h2>5. Retenção e exclusão</h2>
      <p>
        Mantemos seus dados enquanto sua conta estiver ativa ou pelo tempo
        necessário para cumprir obrigações legais e de atendimento. Você pode
        solicitar a exclusão da conta, e, quando possível, removeremos ou
        anonimizaremos seus dados pessoais.
      </p>

      <h2>6. Direitos do titular de dados</h2>
      <p>
        Você pode solicitar acesso, correção ou exclusão de dados pessoais,
        bem como informações adicionais sobre o tratamento realizado. Para isso,
        entre em contato pelo e-mail {PRIVACIDADE_CONTATO}.
      </p>

      <h2>7. Segurança</h2>
      <p>
        Empregamos medidas técnicas e organizacionais para proteger seus dados,
        mas nenhum ambiente on-line é totalmente isento de riscos. Recomendamos
        que você mantenha sua senha em sigilo e utilize senhas fortes.
      </p>

      <h2>8. Atualizações desta Política</h2>
      <p>
        Esta Política de Privacidade pode ser atualizada para refletir melhorias
        no serviço ou exigências legais. Publicaremos a versão atualizada neste
        endereço, com a data de vigência revisada.
      </p>
    </>
  );
}

// 🔹 PÁGINA COMPLETA (rota /politica-privacidade)
export default function PoliticaPrivacidade() {
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
        <h1 style={{ margin: 0 }}>Política de Privacidade</h1>
      </div>

      <PoliticaConteudo />
    </main>
  );
}
