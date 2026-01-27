import type { Metadata } from "next";
import { Icon, type IconName } from "../../components/Icons";

export const metadata: Metadata = {
  title: "Sou Luz Assessoria",
  description:
    "Gestão, auditoria e consultoria em saúde para clínicas e empreendimentos que buscam eficiência, conformidade e resultados.",
  icons: {
    icon: "/souluz/icone.png",
  },
};

const services: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Gestão em Saúde",
    description: "Estratégia, indicadores e processos para elevar performance clínica.",
    icon: "briefcase",
  },
  {
    title: "Assessoria em Saúde",
    description: "Suporte especializado para decisões e operação do dia a dia.",
    icon: "heart",
  },
  {
    title: "Credenciamento Médico",
    description: "Consultoria completa para credenciamento e expansão assistencial.",
    icon: "network",
  },
  {
    title: "Faturamento Médico/Hospitalar",
    description: "Organização do fluxo financeiro com foco em previsibilidade.",
    icon: "calendar",
  },
  {
    title: "Auditoria em Saúde",
    description: "Conformidade, redução de glosas e segurança nos processos.",
    icon: "check",
  },
];

const outcomes = [
  "Padronização de processos e melhoria contínua",
  "Redução de perdas financeiras e glosas",
  "Apoio estratégico para tomada de decisão",
  "Equipe alinhada e treinada para resultados sustentáveis",
];

const whatsappHref = "https://wa.me/5569999220012";

export default function SouLuzAssessoriaPage() {
  const assessoriaStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Sou Luz Assessoria",
    description:
      "Gestão, auditoria e consultoria em saúde para clínicas, consultórios e instituições que buscam eficiência e resultados.",
    url: "https://souluzassessoria.com.br",
    image: "https://souluzassessoria.com.br/souluz/logo-retangular.png",
    telephone: "+55-69-99922-0012",
    areaServed: "BR",
    serviceType: [
      "Gestão em Saúde",
      "Assessoria em Saúde",
      "Consultoria em Credenciamento Médico",
      "Faturamento Médico/Hospitalar",
      "Auditoria em Saúde",
    ],
  };

  return (
    <div className="bg-[#f6f1e8] text-[#0f2c4c]">
      <div className="fixed inset-x-0 top-0 z-40 border-b border-[#1a5fb8] bg-[#1f6dd1] shadow-[0_12px_30px_rgba(31,109,209,0.45)]">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-6 px-3 py-3 sm:px-5 lg:px-8">
          <a href="#inicio" className="flex items-center">
            <img
              src="/souluz/logo-retangular.png"
              alt="Sou Luz Assessoria"
              className="h-16 w-auto drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)] sm:h-20"
            />
          </a>
          <nav className="hidden items-center gap-5 text-sm font-semibold uppercase tracking-[0.25em] text-white/90 lg:flex">
            <a href="#servicos" className="transition hover:text-white">
              Serviços
            </a>
            <a href="#metodo" className="transition hover:text-white">
              Método
            </a>
            <a href="#contato" className="transition hover:text-white">
              Contato
            </a>
          </nav>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#0f2c4c]/30 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-[#0f2c4c]/45"
          >
            <Icon name="whatsapp" className="h-5 w-5" />
            WhatsApp
          </a>
        </div>
      </div>

      <main className="pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(assessoriaStructuredData) }} />
        <section id="inicio" className="relative overflow-hidden">
          <div className="absolute -left-20 top-16 h-56 w-56 rounded-full bg-[#1f6dd1]/20 blur-3xl" />
          <div className="absolute right-10 top-0 h-72 w-72 rounded-full bg-[#1f6dd1]/15 blur-3xl" />
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-3 py-10 sm:px-5 lg:flex-row lg:items-center lg:px-8">
            <div className="max-w-2xl">
              <div className="text-base font-bold uppercase tracking-[0.4em] text-[#1f6dd1]">
                Uma luz para o seu empreendimento
              </div>
              <h1 className="mt-4 font-[var(--font-display)] text-4xl font-extrabold text-[#0f2c4c] sm:text-5xl">
                Sou Luz Assessoria
              </h1>
              <p className="mt-4 text-lg text-[#2b3f5a]">
                Gestão e auditoria em saúde para clínicas, consultórios e instituições que buscam eficiência, conformidade e
                resultados sustentáveis.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-5 py-3 text-base font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae]"
                >
                  <Icon name="whatsapp" className="h-6 w-6" />
                  Falar com um especialista
                </a>
                <a
                  href="#servicos"
                  className="inline-flex items-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-5 py-3 text-base font-bold uppercase tracking-[0.25em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:border-[#1f6dd1]"
                >
                  Ver soluções
                </a>
              </div>
            </div>
            <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,44,76,0.18)] transition hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:bg-white hover:shadow-[0_24px_65px_rgba(15,44,76,0.24)]">
              <div className="text-base font-bold uppercase tracking-[0.3em] text-[#1f6dd1]">Foco em resultados</div>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl font-extrabold text-[#0f2c4c]">Gestão que transforma a operação</h2>
              <p className="mt-3 text-sm text-[#2b3f5a]">
                Diagnóstico, plano de ação e acompanhamento próximo para evoluir processos e ampliar a performance financeira.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-[#2b3f5a]">
                {outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-6 w-6 rounded-full bg-[#1f6dd1]/15 text-[#1f6dd1]">
                      <Icon name="check" className="m-1.5 h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="servicos" className="mx-auto w-full max-w-screen-2xl px-3 py-10 sm:px-5 lg:px-8">
          <div className="text-base font-bold uppercase tracking-[0.35em] text-[#1f6dd1]">Nossos serviços</div>
          <h2 className="mt-3 font-[var(--font-display)] text-3xl font-extrabold text-[#0f2c4c] sm:text-4xl">
            Soluções completas para a sua operação
          </h2>
          <p className="mt-4 max-w-3xl text-[#2b3f5a]">
            Atuação estratégica e técnica para garantir processos seguros, conformidade regulatória e crescimento sustentável.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_16px_40px_rgba(15,44,76,0.12)] transition hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:bg-white hover:shadow-[0_20px_45px_rgba(15,44,76,0.18)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f6dd1]/15 text-[#1f6dd1]">
                  <Icon name={service.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#0f2c4c]">{service.title}</h3>
                <p className="mt-2 text-sm text-[#2b3f5a]">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="metodo" className="mx-auto w-full max-w-screen-2xl px-3 py-10 sm:px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="text-base font-bold uppercase tracking-[0.35em] text-[#1f6dd1]">Método de trabalho</div>
              <h2 className="mt-3 font-[var(--font-display)] text-3xl font-extrabold text-[#0f2c4c] sm:text-4xl">
                Consultoria com início, meio e resultado
              </h2>
              <p className="mt-4 text-[#2b3f5a]">
                Atuamos de forma estruturada para garantir que cada etapa gere clareza, controle e evolução consistente.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Diagnóstico", text: "Análise de processos e indicadores." },
                  { title: "Plano de ação", text: "Definição de metas e prioridades." },
                  { title: "Implementação", text: "Ajustes operacionais com acompanhamento." },
                  { title: "Indicadores", text: "Monitoramento contínuo de resultados." },
                ].map((step) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-[#1f6dd1]/15 bg-white/80 p-4 transition hover:-translate-y-1 hover:border-[#1f6dd1]/30 hover:bg-white hover:shadow-[0_16px_35px_rgba(31,109,209,0.18)]"
                  >
                    <div className="text-base font-bold uppercase tracking-[0.3em] text-[#1f6dd1]">{step.title}</div>
                    <p className="mt-2 text-sm text-[#2b3f5a]">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f2c4c] via-[#153b69] to-[#0f2c4c] p-6 text-white shadow-[0_20px_45px_rgba(15,44,76,0.35)] transition hover:-translate-y-1 hover:shadow-[0_26px_55px_rgba(15,44,76,0.45)]">
              <div className="text-base font-bold uppercase tracking-[0.35em] text-white/60">Contato rápido</div>
              <h3 className="mt-3 font-[var(--font-display)] text-3xl font-extrabold">Vamos estruturar sua gestão</h3>
              <p className="mt-4 text-sm text-white/85">
                Fale com a nossa equipe e receba uma proposta alinhada ao momento da sua instituição.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-base font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-white/25"
              >
                <Icon name="whatsapp" className="h-6 w-6" />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section id="contato" className="mx-auto w-full max-w-screen-2xl px-3 pb-12 sm:px-5 lg:px-8">
          <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_16px_40px_rgba(15,44,76,0.12)] transition hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:bg-white hover:shadow-[0_20px_45px_rgba(15,44,76,0.18)]">
            <div className="text-base font-bold uppercase tracking-[0.35em] text-[#1f6dd1]">Contato</div>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-extrabold text-[#0f2c4c] sm:text-4xl">
              Direcione seu projeto com confiança
            </h2>
            <p className="mt-4 text-[#2b3f5a]">
              Atendimento direto pelo WhatsApp para diagnósticos, propostas e agendas.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-6 py-3 text-base font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae]"
            >
              <Icon name="whatsapp" className="h-6 w-6" />
              +55 69 99922-0012
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
