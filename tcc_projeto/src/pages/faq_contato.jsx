import React, { useState } from 'react';
import './faq_contato.css';
import '@fortawesome/fontawesome-free/css/all.css';

const questionsData = [
  {
    question: 'Como marcar sua consulta?',
    answer: 'Você pode marcar sua consulta entrando em contato por telefone ou e-mail.',
  },
  {
    question: 'Qual é o horário de funcionamento?',
    answer: 'De segunda a sexta, das 8h às 18h.',
  },
  {
    question: 'A Dra. Natália aceita convênios?',
    answer: 'Não aceitamos convênios diretamente, mas fornecemos recibo para reembolso.',
  },
  {
    question: 'Quais são os métodos de pagamento aceitos?',
    answer: 'Aceitamos dinheiro, PIX e cartões de débito e crédito.',
  },
  {
    question: 'Posso ter um reembolso do convênio?',
    answer: 'Sim! Basta solicitar o recibo para apresentar ao seu plano de saúde.',
  },
];

const FAQContato = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-contato-wrapper">
      <section className="faq-banner">
        <div className="faq-banner-overlay">
          <div className="faq-card">
            <div className="faq-icon">
              <i className="fas fa-phone-alt"></i>
            </div>
            <h2 className="faq-title">Ligue para mim</h2>
            <p className="faq-text">
              Conte suas necessidades e<br />
              agende sua consulta
            </p>
            <p className="faq-contact">(11) 3071-3348</p>
            <p className="faq-contact">(11) 99800-3064</p>
          </div>

          <div className="faq-card">
            <div className="faq-icon">
              <i className="far fa-envelope"></i>
            </div>
            <h2 className="faq-title">Escreva para mim</h2>
            <p className="faq-text">
              Tire suas dúvidas<br />
              por e-mail.
            </p>
            <p className="faq-contact">contato@Natália.com.br</p>
          </div>
        </div>
      </section>

      <main className="faq-main">
        <h1 className="faq-heading">Dúvidas Frequentes</h1>
        <div className="faq-divider"></div>
        <p className="faq-subtitle">
          As perguntas mais comuns de pacientes no consultório<br />
          sobre consultas.
        </p>

        <div className="faq-list">
          {questionsData.map((item, index) => (
            <div key={index} className="faq-item">
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleQuestion(index)}
                aria-expanded={openIndex === index}
              >
                {item.question}
                <span className="faq-icon-toggle">
                  {openIndex === index ? '>' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FAQContato;
