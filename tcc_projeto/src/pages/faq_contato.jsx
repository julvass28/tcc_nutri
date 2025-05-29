
import React, { useState } from 'react';
import '../css/faq_contato.css';

const questionsData = [
  { question: 'Como marcar sua consulta?', answer: 'Você pode marcar sua consulta entrando em contato por telefone ou e-mail.' },
  { question: 'Qual é o horário de funcionamento?', answer: 'De segunda a sexta, das 8h às 18h.' },
  { question: 'A Dra. Natália aceita convênios?', answer: 'Não aceitamos convênios diretamente, mas fornecemos recibo para reembolso.' },
  { question: 'Quais são os métodos de pagamento aceitos?', answer: 'Aceitamos dinheiro, PIX e cartões de débito e crédito.' },
  { question: 'Posso ter um reembolso do convênio?', answer: 'Sim! Basta solicitar o recibo para apresentar ao seu plano de saúde.' },
];

export default function FAQContato() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-contato-wrapper">
      <section className="faq-banner">
        <div className="faq-banner-overlay">
          <div className="faq-card">
            <div className="faq-icon"><i className="fas fa-phone-alt"></i></div>
            <h2 className="faq-title">Ligue para mim</h2>
            <p className="faq-text">Conte suas necessidades<br />e agende sua consulta</p>
            <p className="faq-contact">(11) 3071-3348</p>
            <p className="faq-contact">(11) 99800-3064</p>
          </div>
          <div className="faq-card">
            <div className="faq-icon"><i className="far fa-envelope"></i></div>
            <h2 className="faq-title">Escreva para mim</h2>
            <p className="faq-text">Tire suas dúvidas<br />por e-mail.</p>
            <p className="faq-contact">contato@Natália.com.br</p>
          </div>
        </div>
      </section>
      <main className="faq-main">
        <h1 className="faq-heading">Perguntas Frequentes</h1>
        <div className="faq-divider"></div>
        <p className="faq-subtitle">
          As perguntas mais comuns de pacientes no consultório<br />
          sobre consultas.
        </p>
        <div className="faq-list">
          {questionsData.map((item, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                {item.question}
                <svg
                  className={`faq-icon-toggle ${openIndex === index ? 'rotated' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="faq-answer-wrapper">
                  <div className="faq-answer">{item.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
