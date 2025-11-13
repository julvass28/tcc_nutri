import React, { useEffect, useState } from "react";
import "../css/faq_contato.css";
import FormularioContato from "../components/formulario/formulario";
import { API } from "../services/api";

const questionsFallback = [
  {
    pergunta: "Como marcar sua consulta?",
    resposta:
      "Você pode marcar sua consulta entrando em contato por telefone ou e-mail.",
  },
  {
    pergunta: "Qual é o horário de funcionamento?",
    resposta: "De segunda a sexta, das 8h às 18h.",
  },
  {
    pergunta: "A Dra. Natália aceita convênios?",
    resposta:
      "Não aceitamos convênios diretamente, mas fornecemos recibo para reembolso.",
  },
  {
    pergunta: "Quais são os métodos de pagamento aceitos?",
    resposta: "Aceitamos dinheiro, PIX e cartões de débito e crédito.",
  },
  {
    pergunta: "Posso ter um reembolso do convênio?",
    resposta:
      "Sim! Basta solicitar o recibo para apresentar ao seu plano de saúde.",
  },
];

export default function FAQContato() {
  const [openIndex, setOpenIndex] = useState(null);
  const [items, setItems] = useState(null); // null = ainda carregando
  const [error, setError] = useState("");
  const [contact, setContact] = useState(null); // NOVO

  useEffect(() => {
    let mounted = true;
    (async () => {
      // FAQ
      try {
        const r = await fetch(`${API}/faq`);
        const dataFaq = await r.json();
        if (!r.ok || !Array.isArray(dataFaq)) throw new Error();
        if (mounted) setItems(dataFaq);
      } catch {
        if (mounted) {
          setItems(
            questionsFallback.map((q, i) => ({ id: i + 1, ...q }))
          );
          setError(
            "Falha ao carregar FAQ online. Exibindo conteúdo padrão."
          );
        }
      }

      // Contato público (telefone/e-mail)
      try {
        const rc = await fetch(`${API}/config/contact-info`);
        if (rc.ok) {
          const dataContact = await rc.json();
          if (mounted) setContact(dataContact);
        }
      } catch {
        // silencioso
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const isLoading = items === null;

  return (
    <div className="faq-contato-wrapper">
      <section className="faq-banner">
        <div className="faq-banner-overlay">
          <div className="faq-card-front">
            <div className="faq-icon">
              <i className="fas fa-phone-alt"></i>
            </div>
            <h2 className="faq-title">Ligue para mim</h2>
            <p className="faq-text">
              Conte suas necessidades
              <br />
              e agende sua consulta
            </p>
            <p className="faq-contact">
              {contact?.telefone || contact?.whatsapp || "(11) 3071-3348"}
            </p>
            {contact?.whatsapp &&
              contact?.whatsapp !== contact?.telefone && (
                <p className="faq-contact">{contact.whatsapp}</p>
              )}
          </div>
          <div className="faq-card-front">
            <div className="faq-icon">
              <i className="far fa-envelope"></i>
            </div>
            <h2 className="faq-title">Escreva para mim</h2>
            <p className="faq-text">
              Tire suas dúvidas
              <br />
              por e-mail.
            </p>
            <p className="faq-contact">
              {contact?.email || "contato@nataliasimanoviski.com"}
            </p>
          </div>
        </div>
      </section>

      <main className="faq-main">
        <h1 className="faq-heading">Perguntas Frequentes</h1>
        <div className="faq-divider"></div>
        <p className="faq-subtitle">
          As perguntas mais comuns de pacientes no consultório
          <br />
          sobre consultas.
        </p>

        {isLoading && (
          <p style={{ textAlign: "center", margin: "8px 0" }}>
            Carregando…
          </p>
        )}
        {!isLoading && error && (
          <p
            style={{
              textAlign: "center",
              margin: "8px 0",
              color: "#a55",
            }}
          >
            {error}
          </p>
        )}
        {!isLoading && items?.length === 0 && (
          <p
            style={{
              textAlign: "center",
              margin: "8px 0",
              color: "#666",
            }}
          >
            Nenhuma pergunta disponível no momento.
          </p>
        )}

        {!isLoading && items?.length > 0 && (
          <div className="faq-list">
            {items.map((item, index) => (
              <div key={item.id ?? index} className="faq-item">
                <button
                  className={`faq-question ${
                    openIndex === index ? "active" : ""
                  }`}
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  aria-expanded={openIndex === index}
                >
                  {item.pergunta || item.question}
                  <svg
                    className={`faq-icon-toggle ${
                      openIndex === index ? "rotated" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="faq-answer-wrapper">
                    <div className="faq-answer">
                      {item.resposta || item.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <FormularioContato />
    </div>
  );
}
