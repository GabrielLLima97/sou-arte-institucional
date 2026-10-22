export const assessoria = {
  name: "Sou Luz Assessoria",
  url: "https://souluzassessoria.com.br",
  phone: "+55 69 99922-0012",
  telephone: "+55-69-99922-0012",
  whatsappNumber: "5569999220012",
};

export function assessoriaContactHref(service?: string) {
  const message = service
    ? `Olá! Gostaria de conversar com a Sou Luz sobre ${service}.`
    : "Olá! Gostaria de conhecer a assessoria da Sou Luz para o meu empreendimento em saúde.";
  return `https://wa.me/${assessoria.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const assessoriaServices = [
  {
    id: "gestao",
    title: "Gestão em saúde",
    short: "Clareza para decidir. Estrutura para crescer.",
    description:
      "Um olhar integrado sobre pessoas, processos e indicadores para organizar a operação e orientar as decisões da sua instituição.",
    scope: [
      "Análise de processos e rotinas",
      "Definição de prioridades e plano de ação",
      "Acompanhamento de indicadores",
    ],
    focus:
      "Para quem precisa transformar a rotina em uma operação mais organizada e previsível.",
  },
  {
    id: "assessoria",
    title: "Assessoria em saúde",
    short: "Suporte próximo para os desafios do dia a dia.",
    description:
      "Apoio técnico e estratégico para conectar o planejamento à prática, com acompanhamento das necessidades da sua operação.",
    scope: [
      "Orientação para decisões operacionais",
      "Organização de fluxos de trabalho",
      "Alinhamento de processos com a equipe",
    ],
    focus:
      "Para gestores que buscam apoio especializado para conduzir sua instituição.",
  },
  {
    id: "credenciamento",
    title: "Credenciamento médico",
    short: "Novas possibilidades para a sua atuação.",
    description:
      "Consultoria para organizar o processo de credenciamento, desde a preparação da documentação até o acompanhamento das etapas.",
    scope: [
      "Orientação sobre requisitos e documentos",
      "Organização do processo de credenciamento",
      "Acompanhamento das etapas e pendências",
    ],
    focus:
      "Para clínicas e profissionais que desejam estruturar sua expansão assistencial.",
  },
  {
    id: "faturamento",
    title: "Faturamento médico e hospitalar",
    short: "Mais controle sobre o caminho da sua receita.",
    description:
      "Organização do fluxo de faturamento para dar visibilidade às etapas, identificar inconsistências e apoiar a previsibilidade financeira.",
    scope: [
      "Revisão das rotinas de faturamento",
      "Organização e conferência de informações",
      "Identificação de perdas e oportunidades de melhoria",
    ],
    focus:
      "Para operações que precisam de mais consistência no faturamento e no controle financeiro.",
  },
  {
    id: "auditoria",
    title: "Auditoria em saúde",
    short: "Um olhar criterioso sobre cada processo.",
    description:
      "Análise técnica de processos e registros para identificar riscos, apoiar a conformidade e orientar ações de melhoria.",
    scope: [
      "Análise de processos e documentação",
      "Identificação de inconsistências e glosas",
      "Recomendações para melhoria contínua",
    ],
    focus:
      "Para instituições que buscam processos mais seguros e redução de perdas evitáveis.",
  },
];

export const assessoriaFaqs = [
  {
    question: "Para quem são os serviços da Sou Luz?",
    answer:
      "Atendemos clínicas, consultórios e instituições de saúde que buscam organizar a gestão, aprimorar processos, estruturar o faturamento ou receber apoio em auditoria e credenciamento.",
  },
  {
    question: "Preciso contratar todos os serviços?",
    answer:
      "A conversa inicial ajuda a identificar as necessidades da sua operação. A proposta é construída a partir desse contexto, com escopo e prioridades definidos para o seu empreendimento.",
  },
  {
    question: "Como funciona o início do trabalho?",
    answer:
      "O primeiro passo é conversar com a nossa equipe. A partir do entendimento da sua operação, alinhamos as necessidades, o escopo da proposta e as etapas de trabalho.",
  },
  {
    question: "A consultoria também acompanha a implementação?",
    answer:
      "O método de trabalho contempla diagnóstico, plano de ação, implementação e acompanhamento de indicadores. As atividades e a frequência do acompanhamento são definidas na proposta.",
  },
];
