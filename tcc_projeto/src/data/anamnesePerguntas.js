const perguntasComum = [
    {
        titulo: '1: INFORMAÇÕES PESSOAIS',
        perguntas: [
            {
                pergunta: 'Nome Completo:',
                tipo: 'texto',
            },
            {
                pergunta: 'Data de Nascimento:',
                tipo: 'texto',
            },
            {
                pergunta: 'Idade:',
                tipo: 'texto',
                unidade: 'anos',
            },
            {
                pergunta: 'Gênero:',
                tipo: 'radio',
                opcoes: ['Feminino', 'Masculino', 'Outro']
            },
            {
                pergunta: 'Telefone:',
                tipo: 'texto',
            },
            {
                pergunta: 'Email:',
                tipo: 'texto',
            },
            {
                pergunta: 'Profissão:',
                tipo: 'texto',
            },
            {
                pergunta: 'Altura:',
                tipo: 'texto',
                unidade: 'cm',
            },
            {
                pergunta: 'Peso:',
                tipo: 'texto',
                unidade: 'kg',
            }, {
                pergunta: 'Percentual de Gordura (se souber)',
                tipo: 'texto',
            },
        ],
    },
];

const perguntasEspecificas = {
    'clinica': [
        {
            titulo: '2: HISTÓRICO MÉDICO',
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
                    subanamnese: ['Glicose', 'Colesterol', 'Pressão Arterial'],
                },

            ],
        },
    ],





    'esportiva': [
        {
            titulo: '2: OBJETIVO NUTRICIONAL',
            perguntas: [
                {
                    pergunta: 'Objetivo principal:',
                    tipo: 'radio',
                    opcoes: ['Ganho de massa muscular', 'Melhora do desempenho', 'Redução de gordura corporal', 'Manutenção do peso', 'Outros']
                },
                {
                    tipo: 'titulo',
                    texto:'3: TREINO E ATIVIDADE FÍSICA',
                },
                {
                    pergunta: 'Modalidade esportiva praticada:',
                    tipo: 'texto',
                },
                {
                    pergunta: 'Frequência dos treinos:',
                    tipo: 'texto',
                    unidade:'vezes por semana',
                },
                 {
                    pergunta: 'Duração média de cada treino:',
                    tipo: 'texto',
                    unidade:'minutos',
                },
                 {
                    pergunta: 'Possui acompanhamento com educador físico?',
                    tipo: 'radio',
                     opcoes: ['Sim', 'Não'],
                },

            ],
        },
    ],




};



