const perguntasComum = [
    {
        titulo: '1. INFORMAÇÕES PESSOAIS',
        perguntas: [
            {
                pergunta: 'Nome Completo:',
                tipo: 'texto',
            },
            {
                pergunta: 'Data de Nascimento:',
                tipo: 'date',
            },
            {
                pergunta: 'Idade:',
                tipo: 'number',
                unidade: 'anos',
            },
            {
                pergunta: 'Gênero:',
                tipo: 'radio',
                opcoes: ['Feminino', 'Masculino', 'Outro']
            },
            {
                pergunta: 'Telefone:',
                tipo: 'telefone',
            },
            {
                pergunta: 'Email:',
                tipo: 'email',
            },
            {
                pergunta: 'Profissão:',
                tipo: 'texto',
            },
            {
                pergunta: 'Altura:',
                tipo: 'number',
                unidade: 'cm',
            },
            {
                pergunta: 'Peso:',
                tipo: 'number',
                unidade: 'kg',
            }, {
                pergunta: 'Percentual de Gordura (se souber)',
                tipo: 'number',
            },
        ],
    },
];

const perguntasEspecificas = {
    'clinica': [
        {
            titulo: '2. HISTÓRICO MÉDICO',
            perguntas: [
                {
                    pergunta: 'Possui alguma condição de saúde?',
                    tipo: 'checkbox',
                    opcoes: ['Diabetes', 'Hipertensão', 'Colesterol Alto', 'Problemas Gastrointestinais', 'Outros']
                },
                {
                    pergunta: 'Faz uso de medicamentos contínuos?',
                    tipo: 'radio',
                    opcoes: ['Sim', 'Não'],
                },
                {
                    pergunta: 'Como foram seus últimos exames laboratoriais?',
                    tipo: 'texto',
                    
                },

            ],
        },
    ],





    'esportiva': [
        {
            titulo: '2. OBJETIVO NUTRICIONAL',
            perguntas: [
                {
                    pergunta: 'Objetivo principal:',
                    tipo: 'radio',
                    opcoes: ['Ganho de massa muscular', 'Melhora do desempenho', 'Redução de gordura corporal', 'Manutenção do peso', 'Outros']
                },
                {
                    tipo: 'titulo',
                    texto: '3. TREINO E ATIVIDADE FÍSICA',
                },
                {
                    pergunta: 'Modalidade esportiva praticada:',
                    tipo: 'texto',
                },
                {
                    pergunta: 'Frequência dos treinos:',
                    tipo: 'texto',
                    unidade: 'vezes por semana',
                },
                {
                    pergunta: 'Duração média de cada treino:',
                    tipo: 'texto',
                    unidade: 'minutos',
                },
                {
                    pergunta: 'Possui acompanhamento com educador físico?',
                    tipo: 'radio',
                    opcoes: ['Sim', 'Não'],
                },
                {
                    tipo: 'titulo',
                    texto: '4. ALIMENTAÇÃO E SUPLEMENTAÇÃO',
                },
                {
                    pergunta: 'Como é sua alimentação antes e depois dos treinos?',
                    tipo: 'radio',
                    opcoes: ['Planejada e equilibrada', ' Como o que estiver disponível', ' Pulo refeições frequentemente'],
                },

                {
                    pergunta: 'Faz uso de suplementos?',
                    tipo: 'radio_condicional_texto',
                    opcoes: ['Sim', 'Não'],
                    condicao: 'Sim',
                    placeholder: 'Se sim, quais?'
                },
                {
                    pergunta: 'Tem alguma restrição alimentar ou intolerância?',
                    tipo: 'radio_condicional_texto',
                    opcoes: ['Sim', 'Não'],
                    condicao: 'Sim',
                    placeholder: 'Se sim, quais?'
                },
            ],
        },
    ],



pediatrica: [
    {
      titulo: '1. INFORMAÇÕES DA CRIANÇA',
      perguntas: [
        { pergunta: 'Nome da Criança:', tipo: 'texto' },
        { pergunta: 'Idade da Criança:', tipo: 'number', unidade: 'anos' },
        { pergunta: 'Relação com a criança', tipo: 'radio', opcoes: ['Pai/Mãe', 'Responsável Legal', 'Outro'] },
        { pergunta: 'Telefone:', tipo: 'telefone' },
        { pergunta: 'Email:', tipo: 'email' },
        { pergunta: 'Altura:', tipo: 'number', unidade: 'cm' },
        { pergunta: 'Peso:', tipo: 'number', unidade: 'kg' },
      ],
    },
    {
      titulo: '2. HÁBITOS ALIMENTARES',
      perguntas: [
        { pergunta: 'Como é o apetite da criança?', tipo: 'radio', opcoes: ['Come bem', 'Come pouco', 'Tem seletividade alimentar'] },
        { pergunta: 'Frequência de consumo de doces e industrializados:', tipo: 'radio', opcoes: ['Raramente', '1x por semana', 'Todos os dias'] },
        { pergunta: 'Como é a alimentação na escola/creche?', tipo: 'texto' },
      ],
    },
    {
      titulo: '3. SAÚDE E CRESCIMENTO',
      perguntas: [
        { pergunta: 'A criança tem alguma alergia ou intolerância alimentar?', tipo: 'radio', opcoes: ['Sim', 'Não'] },
        {
          pergunta: 'Toma vitaminas ou suplementos?',
          tipo: 'radio_condicional_texto',
          opcoes: ['Sim', 'Não'],
          condicao: 'Sim',
          placeholder: 'Se sim, quais?'
        },
      ],
    },
  ],






    'emagrecimento': [
        {
            titulo: '2. HISTÓRICO DE PESO',
            perguntas: [
                {
                    pergunta: 'Nos últimos 6 meses, seu peso:',
                    tipo: 'radio',
                    opcoes: ['Aumentou', 'Diminuiu', 'Manteve-se estável']
                },

                {
                    pergunta: 'Já tentou emagrecer antes?',
                    tipo: 'radio',
                    opcoes: ['Sim', 'Não'],
                },

                {
                    pergunta: 'Teve dificuldades?',
                    tipo: 'radio_condicional_texto',
                    opcoes: ['Sim', 'Não'],
                    condicao: 'Sim',
                    placeholder: 'Se sim, quais?'
                },


                {
                    tipo: 'titulo',
                    texto: '3. HÁBITOS ALIMENTARES',
                },
                {
                    pergunta: 'Quantas refeições faz por dia?',
                    tipo: 'number',
                },

                {
                    pergunta: 'Costuma pular refeições?',
                    tipo: 'radio',
                    opcoes: ['Sim', 'Não'],
                },

                {
                    pergunta: 'Consome frutas e vegetais diariamente?',
                    tipo: 'radio',
                    opcoes: ['Sim', 'Não'],
                },

                {
                    pergunta: 'Bebe água suficiente?',
                    tipo: 'radio_condicional_texto',
                    opcoes: ['Sim', 'Não'],
                    condicao: 'Sim',
                    placeholder: 'Quantos litros/dia?'
                },
                {
                    titulo: 'Frequência de Consumo',
                    tipo: 'frequencia_consumo',
                    itens: [
                        {
                            alimento: 'Fast Food e frituras',
                            opcoes: ['Nunca', '1x por semana', 'Frequentemente']
                        },
                        {
                            alimento: 'Doces e Chocolates',
                            opcoes: ['Nunca', '1x por semana', 'Frequentemente']
                        },
                        {
                            alimento: 'Bebidas Açucaradas',
                            opcoes: ['Nunca', '1x por semana', 'Frequentemente']
                        }
                    ]
                },
                {
                    tipo: 'titulo',
                    texto: '4. ROTINA E ESTILO DE VIDA',
                },
                {
                    pergunta: 'Pratica atividade física?',
                    tipo: 'radio_condicional_texto',
                    opcoes: ['Sim', 'Não'],
                    condicao: 'Sim',
                    placeholder: 'Se sim, qual a frequência?'
                },
                {

                    tipo: 'frequencia_consumo',
                    itens: [
                        {
                            alimento: 'Sono:',
                            opcoes: ['Menos de 5h', '5-7h', '7h+']
                        },
                        {
                            alimento: 'Estresse:',
                            opcoes: ['Alto', 'Moderado', 'Baixo']
                        },

                    ]
                },

                {
                    tipo: 'titulo',
                    texto: '5. SAÚDE E RELAÇÃO COM A COMIDA',
                },

                {
                    pergunta: 'Histórico de doenças?',
                    tipo: 'radio_condicional_texto',
                    opcoes: ['Sim', 'Não'],
                    condicao: 'Sim',
                    placeholder: 'Se sim, quais?'
                },

                {
                    pergunta: 'Uso de medicamentos?',
                    tipo: 'radio_condicional_texto',
                    opcoes: ['Sim', 'Não'],
                    condicao: 'Sim',
                    placeholder: 'Se sim, quais?'
                },

                {

                    tipo: 'frequencia_consumo',
                    itens: [
                        {
                            alimento: 'Belisca entre refeições?',
                            opcoes: ['Sim', 'Não']
                        },
                        {
                            alimento: 'Fome excessiva à noite?',
                            opcoes: ['Sim', 'Não']
                        },
                        {
                            alimento: 'Já sentiu culpa ao comer?',
                            opcoes: ['Sim', 'Não']
                        },

                    ]
                },



            ],
        },
    ],


    'intolerancias': [
        {
            titulo: '2. HISTÓRICO DE SAÚDE E SINTOMAS',
            perguntas: [
                {
                    pergunta: 'Tem diagnóstico confirmado de intolerância alimentar?',
                    tipo: 'radio_condicional_checkbox',
                    opcoes: ['Sim', 'Não'],
                    condicao: 'Sim',
                    subpergunta: {
                        texto: 'Se sim, qual(is)?',
                        tipo: 'checkbox_outros',
                        opcoes: ['Lactose', 'Glúten', 'Frutose', 'Outros']
                    }
                },
                {
                    pergunta: 'Quais sintomas surgem após consumir esses alimentos?',
                    tipo: 'checkbox',
                    opcoes: ['Náusea', 'Inchaço', 'Diarreia', 'Desconforto abdominais', 'Outros'],
                },
                {
                    pergunta: 'Há quanto tempo percebe esses sintomas?',
                    tipo: 'texto',

                },
                {
                    tipo: 'titulo',
                    texto: '3. HÁBITOS ALIMENTARES E ROTINA',
                },
                {
                    pergunta: 'Evita os alimentos que lhe causam desconforto?',
                    tipo: 'radio',
                    opcoes: ['Sim', 'Não'],
                },
                {
                    pergunta: 'Encontra dificuldades para substituir esses alimentos?',
                    tipo: 'radio',
                    opcoes: ['Sim', 'Não'],

                },
                {
                    pergunta: 'Faz uso de suplementos ou enzimas digestivas?',
                    tipo: 'radio_condicional_texto',
                    opcoes: ['Sim', 'Não'],
                    condicao: 'Sim',
                    placeholder: 'Se sim, quais?'
                },
                {
                    pergunta: 'Costuma verificar os rótulos dos alimentos?',
                    tipo: 'radio',
                    opcoes: ['Sim', 'Não'],

                },

                {
                    pergunta: 'Com que frequência faz refeições fora de casa?',
                    tipo: 'radio',
                    opcoes: ['Raramente', 'Algumas vezes por semana', 'Diariamente']
                },

                {
                    tipo: 'titulo',
                    texto: '4. OBJETIVOS E EXPECTATIVAS',
                },


                {
                    pergunta: 'O que deseja com o acompanhamento nutricional?',
                    tipo: 'radio',
                    opcoes: ['Adaptar a alimentação sem perder variedade', 'Reduzir sintomas e desconfortos', 'Aprender opções de substituição']
                },
            ]
        }
    ]





}; export { perguntasComum, perguntasEspecificas };



