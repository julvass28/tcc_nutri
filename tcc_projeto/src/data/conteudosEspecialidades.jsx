
import e1 from '../assets/icons/e1.png';
import e2 from '../assets/icons/e2.png';
import e3 from '../assets/icons/e3.png';
import e4 from '../assets/icons/e4.png';
import e5 from '../assets/icons/e5.png';

// import growth from '../assets/icons/growth.svg';
// import nutrition from '../assets/icons/nutrition.svg';
// import brain from '../assets/icons/brain.svg';
// import immunity from '../assets/icons/immunity.svg';

import mito1 from '../assets/icons/mito1.png';
import mito2 from '../assets/icons/mito2.png';
import mito3 from '../assets/icons/mito3.png';
import mito4 from '../assets/icons/mito4.png';

import verdade1 from '../assets/icons/verdade1.png';
import verdade2 from '../assets/icons/verdade2.png';
import verdade3 from '../assets/icons/verdade3.png';
import verdade4 from '../assets/icons/verdade4.png';



// esportivaaaaaaaaaaa
const conteudosEspecialidades = {
  esportiva: {
    titulo: 'NUTRIÇÃO ESPORTIVA',
    descricao: `A nutrição esportiva foca em ajustar a alimentação para melhorar o desempenho físico, acelerar a recuperação e manter a saúde dos atletas. Ela envolve o equilíbrio de carboidratos, proteínas, gorduras, vitaminas, minerais e hidratação, adaptados às necessidades de cada pessoa conforme o tipo e intensidade da atividade física.`,
    sectionTitles: {
      beneficios: 'Benefícios da Nutrição Esportiva',
      precisaSaber: 'Avaliação Nutricional do Atleta',
      estrategias: 'Estratégias para Melhor Desempenho',
      dicas: 'Dicas para Atletas',
      mitosVerdades: 'Mitos e Verdades sobre a Nutrição Esportiva',
    },
    beneficios: [
      { titulo: 'Melhora do Desempenho Físico', icone: e1 },
      { titulo: 'Aumento da Massa Muscular',    icone: e2 },
      { titulo: 'Prevenção de Lesões',    icone: e3},
      { titulo: 'Recuperação Acelerada',   icone: e4 },
      { titulo: 'Melhora na Saúde Geral',   icone: e5 },
    ],
    avaliacaoTitulo: 'Nutrição Esportiva: O que você precisa saber',
    oQuePrecisaSaber: [ 
      { titulo: 'Exames e Análises',texto: 'Identificação de necessidades energéticas e deficiências nutricionais.' },
      { titulo: 'Metas Esportivas', texto: 'Estratégias personalizadas para performance, ganho de massa ou recuperação.'},
      { titulo: 'Planejamento Alimentar',texto: 'Ajustes na dieta para potencializar resultados.'},
    ], 
    estrategias:     [ 
      { titulo: 'Carboidratos para Energia',texto: 'Garantem resistência e evitam fadiga muscular.' },
      { titulo: 'Proteínas para Recuperação', texto: 'Essenciais para regeneração e crescimento muscular.'},
      { titulo: 'Hidratação Adequada',texto: 'Mantém o equilíbrio corporal e previne lesões.'},
    ],
    dicas: [
      { titulo: 'Evite Treinar em Jejum',texto: 'Energia certa melhora o rendimento e evita perda muscular.' },
      { titulo: 'Priorize Refeições Naturais', texto: 'Alimentos naturais aceleram a recuperação.'},
      { titulo: 'Durma Bem', texto: ' O descanso adequado otimiza os resultados da nutrição esportiva.'},
    ],
    mitos: [
      { titulo: '"Muito proteína = mais músculo"', texto: 'Não é bem assim! A quantidade ideal de proteína depende do seu treino. Exagerar não vai acelerar o ganho muscular.', icone: mito1 },
      { titulo: '"Carboidrato engorda"',  texto: 'Carboidrato é combustível! Escolher os certos e consumi-los nos momentos certos (antes e depois do treino) é chave para o desempenho.', icone: mito2 },
      { titulo: '"Suplementos substituem a alimentação"', texto: 'Suplementos são apenas complementos! A base da sua nutrição deve vir de alimentos naturais e equilibrados.', icone: mito3},
      { titulo: '"Comer muito antes do treino é fundamental"', texto: 'Um lanche leve, como uma fruta ou barra de cereais, já é suficiente para dar energia ao seu treino.', icone: mito4           },
    ],
    verdades: [
      { titulo: '"A recuperação pós-treino é essencial"',  texto: 'A combinação de proteínas e carboidratos após o treino ajuda a reparar músculos e reabastecer energia. Não pule essa fase!',icone: verdade1 },
      { titulo: '"Hidratação é vital para o desempenho"',texto: 'Ficar bem hidratado é essencial. A desidratação pode prejudicar o seu treino e aumentar o risco de lesões.',icone: verdade2},
      { titulo: '"Cada esporte pede uma dieta diferente"',texto: 'Atletas de maratona e musculação têm necessidades nutricionais distintas. A estratégia alimentar deve ser personalizada.', icone: verdade3 },
      { titulo: '"Gorduras saudáveis são essenciais"',    texto: 'Abacate, azeite, castanhas e peixes fornecem gorduras boas, que são importantes para hormônios e saúde cardiovascular.', icone: verdade4  },
    ],
    cta: {
    titulo: "Quer mais energia e resultados?",     
    subtitulo: "Então confira as receitas que preparei para você", 
    botaoTexto: "Ver Receitas",
    // botaoLink: "/receitas/esportiva"                      // ou para onde quiser navegar
  }

  },







  // pediatriaaaaaaaa
  pediatrica: {
    titulo: 'NUTRIÇÃO PEDIÁTRICA',
    descricao: `A nutrição pediátrica é a base para o crescimento e desenvolvimento saudável das crianças. Ela envolve desde a alimentação do recém-nascido até a fase da adolescência, garantindo que os pequenos recebam todos os nutrientes essenciais para fortalecer o sistema imunológico, desenvolver o cérebro e manter a energia necessária para as atividades diárias.`,
    sectionTitles: {
      beneficios: 'Benefícios da Nutrição Pediátrica',
      precisaSaber: 'Avaliação Nutricional Infantil',
      estrategias: 'Planos Alimentares Personalizados',
      dicas: 'Dicas para os Pais',
      mitosVerdades: 'Mitos e Verdades sobre a Nutrição Pediátria',
    },
    beneficios: [
      { titulo: 'Crescimento Saudável ', icone: e1 },
      { titulo: 'Fortalecimento do sistema imunológico',    icone: e2 },
      { titulo: 'Evolução cognitivo',    icone: e3},
      { titulo: 'Melhora no aprendizado',   icone: e4 },
      { titulo: ' Prevenção de doenças',   icone: e5 },
    ],
    avaliacaoTitulo: 'Nutrição Pediátrica: O que você precisa saber',
    oQuePrecisaSaber: [ 
      { titulo: 'Curvas de Crescimento',texto: 'Acompanhamento de peso, altura e IMC para monitorar o desenvolvimento.' },
      { titulo: 'Exames Laboratoriais', texto: 'Identificação de deficiências nutricionais ou excessos.'},
      { titulo: 'Anamnese Alimentar',texto: 'Análise do histórico alimentar para entender os hábitos da criança.'},
    ], 
    estrategias:     [ 
      { titulo: 'Dietas Balanceadas',texto: 'Planos adaptados às necessidades específicas de cada faixa etária.' },
      { titulo: 'Refeições Nutritivas', texto: 'Cardápios saborosos e saudáveis para crianças.'},
      { titulo: 'Promoção do Crescimento',texto: 'Garantia de ingestão adequada de todos os nutrientes essenciais.'},
    ],
    dicas: [
      { titulo: 'Estimule a Experimentação',texto: 'Ofereça alimentos novos de maneira divertida, sem pressão.' },
      { titulo: 'Crie uma Rotina Alimentar', texto: 'Estabeleça horários regulares para refeições e lanches saudáveis.'},
      { titulo: 'Evite Ultraprocessados', texto: 'Prefira alimentos frescos e naturais sempre que possível.'},
    ],
    mitos: [
      { titulo: '"Criança precisa comer muito para crescer forte"', texto: 'A quantidade não é o mais importante. O essencial é uma alimentação equilibrada e nutritiva. Comer demais pode causar obesidade e problemas digestivos.', icone: mito1 },
      { titulo: '"Crianças podem consumir açúcar sem problemas"',  texto: ' O açúcar deve ser evitado até os 2 anos e controlado depois disso. Excesso pode levar a obesidade, diabetes e cáries.', icone: mito2 },
      { titulo: '"Suco natural é tão saudável quanto a fruta inteira"', texto: 'O suco, mesmo natural, tem mais açúcar e menos fibras do que a fruta in natura. Comer a fruta inteira é sempre a melhor opção.', icone: mito3},
      { titulo: '"Criança pode comer  a mesma comida dos adultos"', texto: 'A comida da família precisa ser ajustada para a criança, com menos sal, menos temperos industrializados e evitando frituras.', icone: mito4           },
    ],
    verdades: [
      { titulo: '"Proteínas são essenciais para o desenvolvimento"',  texto: 'Carnes, ovos, feijões e laticínios ajudam no crescimento, na imunidade e na formação muscular.',icone: verdade1 },
      { titulo: '"Evite refrigerantes e sucos industrializados"',texto: 'Essas bebidas contêm alto teor de açúcar e aditivos químicos, podendo prejudicar a saúde a longo prazo. ',icone: verdade2},
      { titulo: '"Exposição repetida melhora a aceitação dos alimentos"',texto: 'A persistência na oferta de alimentos ajuda as crianças a se acostumarem e aceitarem novos sabores, sem forçar.', icone: verdade3 },
      { titulo: '"Comer devagar ajuda na saciedade e digestão"',    texto: 'Crianças que comem com calma aprendem a reconhecer melhor os sinais de fome e evitam excessos.', icone: verdade4  },
    ],
    cta: {
      subtitulo: "Descubra receitas que seus filhos vão adorar", 
      botaoTexto: "Ver Receitas",
      // botaoLink: "/receitas/esportiva"                      // ou para onde quiser navegar
    }
  },






  // clinicaaaaaaaaaaaaaaaaaaaaaaa
  clinica: {
    titulo: 'NUTRIÇÃO CLÍNICA',
    descricao: `A Nutrição Clínica usa a alimentação para prevenir, tratar e melhorar condições de saúde, com planos alimentares personalizados que buscam equilibrar a nutrição, controlar doenças e melhorar a qualidade de vida, ajustando a dieta conforme as necessidades individuais.`,
    sectionTitles: {
      beneficios: 'Benefícios da Nutrição Clínica',
      precisaSaber: ' Avaliação Nutricional Personalizada',
      estrategias: 'Nutrição no Tratamento de Doenças',
      dicas: ' Dicas para uma Alimentação Saudável e Eficiente',
      mitosVerdades: 'Mitos e Verdades sobre Nutrição Clínica',
    },
    beneficios: [
      { titulo: 'Melhora na qualidade de vida', icone: e1 },
      { titulo: 'Prevenção e tratamento de doenças',    icone: e2 },
      { titulo: 'Apoio no tratamento de doenças',    icone: e3},
      { titulo: 'Controle de Peso',   icone: e4 },
      { titulo: 'Atenção individualizada',   icone: e5 },
    ],
    avaliacaoTitulo: 'Intolerância Alimentar: O que você precisa saber',
    oQuePrecisaSaber: [ 
      { titulo: 'Análise de Energia e Nutrientes',texto: 'Identificação de deficiências e necessidades individuais.' },
      { titulo: 'Histórico Alimentar e Saúde', texto: 'Compreensão dos hábitos alimentares e impacto na saúde'},
      { titulo: 'Planejamento Dietético',texto: 'Estratégias para melhorar a nutrição e prevenir doenças.'},
    ], 
    estrategias:     [ 
      { titulo: 'Diabetes e Hipertensão',texto: 'Alimentação equilibrada para controle da glicemia e pressão arterial' },
      { titulo: 'Doenças Gastrointestinais', texto: 'Dietas ajustadas para intolerâncias, gastrite e refluxo.'},
      { titulo: 'Saúde Renal e Hepática',texto: 'Estratégias alimentares para preservar órgãos e evitar complicações'},
    ],
    dicas: [
      { titulo: 'Evite Dietas Extremas',texto: 'Aposte em mudanças alimentares duradouras e equilibradas.' },
      { titulo: 'Inclua Alimentos Integrais', texto: 'Prefira cereais, pães e massas integrais para maior saciedade e saúde digestiva.'},
      { titulo: 'Coma de Forma Consciente', texto: 'Preste atenção na quantidade e qualidade dos alimentos durante as refeições.'},
    ],
    mitos: [
      { titulo: '"Dietas restritivas são sempre a melhor opção"', 
      texto: 'Restrições excessivas podem levar a deficiências nutricionais. O ideal é uma alimentação balanceada e flexível.', icone: mito1 },
      { titulo: '"Vitaminas substituem uma alimentação saudável"',  
      texto: 'Suplementos não devem substituir uma dieta saudável. Alimentos inteiros oferecem nutrientes essenciais que os suplementos não podem replicar.', icone: mito2 },
      { titulo: '"Carboidratos são vilões da dieta"', 
      texto: ' Carboidratos são uma fonte importante de energia, desde que consumidos de forma equilibrada e proveniente de fontes saudáveis.', icone: mito3},
      { titulo: '"Se você não sente fome, não precisa comer"', 
      texto: 'A fome não é o único sinal de que o corpo precisa de comida; o equilíbrio nutricional e o fornecimento adequado de energia também são importantes.', icone: mito4           },
    ],
    verdades: [
      { titulo: '"Cada pessoa tem necessidades nutricionais únicas"',  texto: 'As necessidades variam com base em idade, sexo, atividade e saúde, por isso dietas personalizadas são importantes.',icone: verdade1 },
      { titulo: '"Frutas e vegetais são essenciais."',texto: 'Eles são ricos em vitaminas, minerais, fibras e antioxidantes, essenciais para a saúde geral.',icone: verdade2},
      { titulo: '"Alimentação equilibrada previne doenças"',texto: 'Uma dieta rica em nutrientes pode reduzir o risco de doenças como diabetes, hipertensão e problemas cardíacos.', icone: verdade3 },
      { titulo: '"Refeições regulares mantêm o metabolismo ativo"',    texto: 'Comer em intervalos regulares ajuda a manter os níveis de energia e evita picos de fome, o que pode auxiliar no controle do peso.', icone: verdade4  },
    ],
    cta: {
      titulo: "Quer emagrecer comendo bem?",            // linha grande
      subtitulo: "Então confira as receitas que preparei para você", // texto menor
      botaoTexto: "Ver Receitas",
      // botaoLink: "/receitas/esportiva"                      // ou para onde quiser navegar
    }
  },




  // emagrecimentooooooooooooooooo
  emagrecimento: {
    titulo: 'EMAGRECIMENTO E OBESIDADE',
    descricao: `A nutrição para emagrecimento busca promover uma perda de peso saudável, focada em hábitos alimentares sustentáveis e equilibrados, priorizando alimentos frescos e naturais. Evita dietas restritivas e promove o consumo de alimentos saudáveis para controlar o peso e melhorar a saúde.`,
    sectionTitles: {
      beneficios: 'Benefícios para Emagrecimento e Obesidade',
      precisaSaber: 'Avaliação Nutricional para Emagrecimento',
      estrategias: 'Estratégias para Perda de Peso Saudável',
      dicas: 'Dicas para o Sucesso no Emagrecimento',
      mitosVerdades: 'Mitos e Verdades sobre Emagrecimento e Obesidade',
    },
    beneficios: [
      { titulo: 'Redução da Gordura Corporal', icone: e1 },
      { titulo: 'Aumento de energia',    icone: e2 },
      { titulo: 'Controle do peso',    icone: e3},
      { titulo: 'Melhora da autoestima',   icone: e4 },
      { titulo: 'Melhora da Saúde',   icone: e5 },
    ],
    avaliacaoTitulo: 'Emagrecimento e Obesidade: O que você precisa saber',
    oQuePrecisaSaber: [ 
      { titulo: 'Comportamento Alimentar',texto: ' Identificação de padrões alimentares e fatores emocionais que influenciam o peso.' },
      { titulo: 'Exames Clínicos', texto: 'Avaliação de comorbidades associadas à obesidade, como hipertensão e diabetes.'},
      { titulo: 'Objetivos Personalizados',texto: 'Definição de metas realistas e saudáveis para o emagrecimento.'},
    ], 
    estrategias:     [ 
      { titulo: 'Dieta Balanceada',texto: 'Plano alimentar com redução de calorias e foco em nutrientes essenciais.' },
      { titulo: 'Atividade Física', texto: 'A importância da combinação de dieta e exercícios para resultados duradouros.'},
      { titulo: 'Mudanças no Estilo de Vida',texto: 'Como estabelecer hábitos saudáveis e sustentáveis a longo prazo.'},
    ],
    dicas: [
      { titulo: 'Estabeleça Metas Realistas',texto: 'Defina objetivos alcançáveis e celebre cada conquista.' },
      { titulo: 'Evite Dietas Restritivas', texto: 'Prefira mudanças alimentares duradouras em vez de soluções rápidas.'},
      { titulo: 'Mantenha a Consistência', texto: 'A chave para o emagrecimento está na persistência e na disciplina no dia a dia.'},
    ],
    mitos: [
      { titulo: ' "Dietas restritivas são a melhor forma de emagrecer"', 
      texto: 'Dietas restritivas causam deficiências e não são sustentáveis; o emagrecimento saudável exige mudanças graduais e duradouras', icone: mito1 },
      { titulo: '"Treinar em jejum queima mais gordura"',  
      texto: ' A queima de gordura depende do déficit calórico, não do treino em jejum.', icone: mito2 },
      { titulo: '"Glúten e lactose engordam"', 
      texto: 'O ganho de peso ocorre pelo excesso calórico, não por esses alimentos.', icone: mito3},
      { titulo: '"Beber água com limão em jejum emagrece"', 
      texto: 'A bebida pode ser saudável, mas não acelera a queima de gordura.', icone: mito4           },
    ],
    verdades: [
      { titulo: '"Proteínas ajudam no emagrecimento"',  texto: 'Alimentos ricos em proteína aumentam a saciedade e preservam a massa muscular.',icone: verdade1 },
      { titulo: '"Atividade física vai além do emagrecimento"',texto: 'Exercícios ajudam no bem-estar, fortalecem o coração e reduzem o estresse.',icone: verdade2},
      { titulo: '"Qualidade importa mais que calorias"',texto: 'Comer de forma equilibrada, priorizando alimentos nutritivos, é mais eficaz para a saúde e o emagrecimento do que apenas reduzir calorias.', icone: verdade3 },
      { titulo: '"Ganho de massa muscular acelera o metabolismo"',    texto: ' Quanto mais músculos, maior o gasto calórico do corpo em repouso, facilitando a queima de gordura e o controle do peso.', icone: verdade4  },
    ],
    cta: {
      titulo: "Quer se alimentar bem e sem desconforto? ",            // linha grande
      subtitulo: "Então confira as receitas que preparei para você!", // texto menor
      botaoTexto: "Ver Receitas",
      // botaoLink: "/receitas/esportiva"                      // ou para onde quiser navegar
    }
  },





  // intoleranciaaaaaaaaaaaaaaaaaaaaaaaaaa
  intolerancia: {
    titulo: 'INTOLERÂNCIA ALIMENTAR',
    descricao: `A intolerância alimentar ocorre quando o organismo tem dificuldade em digerir certos alimentos, geralmente devido à falta ou deficiência de enzimas digestivas. Diferente da alergia alimentar, que envolve o sistema imunológico, a intolerância alimentar afeta o sistema digestivo e pode causar sintomas como inchaço, diarreia, gases, fadiga e dores abdominais.`,
    sectionTitles: {
      beneficios: 'Benefícios de controlar a Intolerância Alimentar',
      precisaSaber: ' Diagnóstico e Avaliação',
      estrategias: 'Adaptação da Alimentação',
      dicas: 'Dicas para o Dia a Dia',
      mitosVerdades: 'Mitos e Verdades sobre Intolerância Alimentar',
    },
    beneficios: [
      { titulo: 'Melhora na qualidade de vida', icone: e1 },
      { titulo: 'Mais energia e disposição',    icone: e2 },
      { titulo: 'Digestão mais eficiente',    icone: e3},
      { titulo: ' Menos inflamação e dores',   icone: e4 },
      { titulo: 'Fortalecimento imunológico',   icone: e5 },
    ],
    avaliacaoTitulo: 'Intolerância Alimentar: O que você precisa saber',
    oQuePrecisaSaber: [ 
      { titulo: 'Identificação dos Sintomas',texto: 'Inchaço, dores abdominais, diarreia ou desconforto digestivo.' },
      { titulo: 'Testes e Exames', texto: 'Métodos para detectar intolerâncias alimentares específicas'},
      { titulo: 'Histórico Alimentar',texto: 'Definição de metas realistas e saudáveis para o emagrecimento.'},
    ], 
    estrategias:     [ 
      { titulo: 'Substituições Inteligentes',texto: 'Alternativas seguras para evitar desconfortos.' },
      { titulo: 'Leitura de Rótulos', texto: 'Como identificar ingredientes problemáticos nos alimentos.'},
      { titulo: 'Equilíbrio Nutricional',texto: 'Garantia de ingestão adequada de nutrientes sem restrições excessivas.'},
    ],
    dicas: [
      { titulo: 'Planeje suas Refeições',texto: 'Evite imprevistos escolhendo alimentos seguros com antecedência.' },
      { titulo: 'Experimente Novas Receitas', texto: 'Descubra opções saborosas sem os ingredientes que causam intolerância.'},
      { titulo: 'Tenha Sempre Alternativas', texto: ' Leve lanches seguros para evitar exposições acidentais.'},
    ],
    mitos: [
      { titulo: '"Intolerância alimentar causa reações imediatas"', 
      texto: 'As reações à intolerância alimentar podem ser retardadas e não ocorrer imediatamente, podendo surgir horas ou até dias depois de consumir o alimento.', icone: mito1 },
      { titulo: '"Intolerância não é causada pelo excesso"',  
      texto: ' A intolerância alimentar não é causada apenas pelo consumo excessivo, mas sim pela incapacidade do organismo de digerir ou processar certos alimentos.', icone: mito2 },
      { titulo: '"Intolerância alimentar não tem cura com remédios"', 
      texto: 'Não existe cura para intolerâncias alimentares. O melhor tratamento é evitar o alimento que causa os sintomas.', icone: mito3},
      { titulo: '"Intolerância alimentar é alergia alimentar"', 
      texto: 'A intolerância alimentar é quando o corpo não digere um alimento corretamente, enquanto a alergia alimentar envolve o sistema imunológico.', icone: mito4           },
    ],
    verdades: [
      { titulo: ' "A intolerância à lactose é uma das mais comuns"',  texto: 'Muitas pessoas têm intolerância à lactose, a principal causa sendo a deficiência da enzima lactase, que ajuda a digerir o açúcar presente no leite.',icone: verdade1 },
      { titulo: '"Sintomas de intolerância incluem dor e inchaço"',texto: ' Os sintomas mais comuns de intolerância alimentar incluem cólicas, gases, inchaço e até diarreia, dependendo do alimento.',icone: verdade2},
      { titulo: '"Intolerância não reduz expectativa de vida"',texto: 'Embora os sintomas possam ser incômodos, a intolerância alimentar geralmente não afeta a saúde a longo prazo, desde que o alimento seja evitado.', icone: verdade3 },
      { titulo: '"Dietas adaptadas melhoram a qualidade de vida"',    texto: 'Ajustar a alimentação conforme as intolerâncias pode reduzir sintomas e melhorar o bem-estar.', icone: verdade4  },
    ],
    cta: {
      titulo: "Quer uma alimentação saudável e equilibrada?",            // linha grande
      subtitulo: "Então confira as receitas que preparei para você!", // texto menor
      botaoTexto: "Ver Receitas",
      // botaoLink: "/receitas/esportiva"                      // ou para onde quiser navegar
    }
  },
};

export default conteudosEspecialidades;