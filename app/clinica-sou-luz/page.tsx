import type { Metadata } from "next";
import { Icon, type IconName } from "../../components/Icons";

export const metadata: Metadata = {
  title: "Clínica Sou Luz",
  description:
    "Clínica de reabilitação multiprofissional com atendimento hospitalar, ambulatorial e domiciliar. Equipe integrada para cada etapa da vida.",
};

const services: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Fonoaudiologia",
    description: "Avaliação e terapias para comunicação, fala, voz e deglutição.",
    icon: "chat",
  },
  {
    title: "Fisioterapia",
    description: "Reabilitação e prevenção funcional com planos personalizados.",
    icon: "heart",
  },
  {
    title: "Nutrição",
    description: "Acompanhamento nutricional para saúde e qualidade de vida.",
    icon: "leaf",
  },
  {
    title: "Terapia Ocupacional",
    description: "Autonomia e desempenho nas atividades do dia a dia.",
    icon: "hand",
  },
  {
    title: "Psicopedagogia",
    description: "Apoio ao desenvolvimento e aos processos de aprendizagem.",
    icon: "graduation",
  },
  {
    title: "Psicologia",
    description: "Cuidado emocional com atendimento humanizado e sigiloso.",
    icon: "brain",
  },
  {
    title: "Clínica Médica",
    description: "Avaliação clínica ampla e direcionamentos em saúde.",
    icon: "stethoscope",
  },
  {
    title: "Exames Audiológicos",
    description: "Diagnóstico completo para saúde auditiva.",
    icon: "ear",
  },
];

const careModes: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Atendimento Hospitalar",
    description: "Equipe preparada para suporte clínico e terapêutico no ambiente hospitalar.",
    icon: "hospital",
  },
  {
    title: "Atendimento Ambulatorial",
    description: "Acompanhamento presencial com estrutura completa e acolhedora.",
    icon: "calendar",
  },
  {
    title: "Home Care",
    description: "Cuidado no conforto do lar, com segurança e sensibilidade.",
    icon: "home",
  },
];

const clinicalHighlights = [
  "Equipe multiprofissional integrada e alinhada às necessidades do paciente",
  "Planos terapêuticos personalizados para cada fase da vida",
  "Estrutura completa para reabilitação, prevenção e acompanhamento contínuo",
];

const whatsappContacts = [
  { label: "(69) 99957-9773", href: "https://wa.me/5569999579773" },
  { label: "(69) 99933-6717", href: "https://wa.me/5569999336717" },
];

const abaPlans = [
  "Select",
  "Innova",
  "Unimed Nacional",
  "Ameron Saúde",
  "CapeSesp",
  "Astir",
  "Unimed Porto Velho",
  "GEAP Saúde",
  "Postal Saúde",
];

const abaCare = ["Avaliação psicopedagógica", "Intervenção psicopedagógica"];

export default function ClinicaSouLuzPage() {
  return (
    <div className="bg-[#f6f1e8] text-[#1a2732]">
      <div className="fixed inset-x-0 top-0 z-40 border-b border-white/35 bg-gradient-to-r from-[#1e6f78]/30 via-white/70 to-[#1e6f78]/20 backdrop-blur-2xl shadow-[0_10px_30px_rgba(30,111,120,0.18)]">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-6 px-3 py-3 sm:px-5 lg:px-8">
          <a href="#inicio" className="flex items-center">
            <img
              src="/souluz/logo-retangular.png"
              alt="Clínica Sou Luz"
              className="h-16 w-auto sm:h-20"
            />
          </a>
          <nav className="hidden items-center gap-5 text-base font-bold uppercase tracking-[0.25em] text-[#1a2732] lg:flex">
            <a href="#servicos" className="transition hover:text-[#1e6f78]">
              Serviços
            </a>
            <a href="#nucleo-aba" className="transition hover:text-[#1e6f78]">
              Núcleo ABA
            </a>
            <a href="#corpo-clinico" className="transition hover:text-[#1e6f78]">
              Corpo clínico
            </a>
            <a href="#atendimento" className="transition hover:text-[#1e6f78]">
              Atendimento
            </a>
            <a href="#contato" className="transition hover:text-[#1e6f78]">
              Contato
            </a>
          </nav>
          <a
            href={whatsappContacts[0].href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#1e6f78] px-4 py-2 text-base font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-[#165a61]"
          >
            <Icon name="whatsapp" className="h-5 w-5" />
            WhatsApp
          </a>
        </div>
      </div>

      <main className="pt-20">
        <section id="inicio" className="relative overflow-hidden">
          <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#f6a63b]/30 blur-3xl" />
          <div className="absolute right-10 top-0 h-72 w-72 rounded-full bg-[#1e6f78]/20 blur-3xl" />
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-3 py-10 sm:px-5 lg:flex-row lg:items-center lg:px-8">
            <div className="max-w-2xl">
              <div className="text-base font-bold uppercase tracking-[0.4em] text-[#f6a63b]">Saúde para a sua família</div>
              <h1 className="mt-4 font-[var(--font-display)] text-4xl font-extrabold text-[#1a2732] sm:text-5xl">
                Clínica Sou Luz
              </h1>
              <p className="mt-4 text-lg text-[#334b4a]">
                Clínica de reabilitação multiprofissional com atendimento hospitalar, ambulatorial e domiciliar (Home Care).
                Cada plano terapêutico é pensado para acompanhar o paciente com ciência, sensibilidade e continuidade.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={whatsappContacts[0].href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f6a63b] px-5 py-3 text-base font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-[#e8932f]"
                >
                  <Icon name="whatsapp" className="h-6 w-6" />
                  Agendar atendimento
                </a>
                <a
                  href="#servicos"
                  className="inline-flex items-center gap-2 rounded-full border border-[#1e6f78]/30 bg-white px-5 py-3 text-base font-bold uppercase tracking-[0.25em] text-[#1e6f78] transition hover:-translate-y-0.5 hover:border-[#1e6f78]"
                >
                  Conheça os serviços
                </a>
              </div>
            </div>
            <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(31,109,209,0.15)] transition hover:-translate-y-1 hover:border-[#1e6f78]/35 hover:bg-white hover:shadow-[0_24px_65px_rgba(31,109,209,0.2)]">
              <div className="text-base font-bold uppercase tracking-[0.3em] text-[#1e6f78]">Atendimento via WhatsApp</div>
              <div className="mt-4 space-y-3">
                {whatsappContacts.map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-[#f6a63b]/40 bg-[#fff7ea] px-4 py-3 text-sm font-semibold text-[#1a2732] transition hover:-translate-y-0.5 hover:border-[#f6a63b]"
                  >
                    <span>{contact.label}</span>
                    <Icon name="whatsapp" className="h-5 w-5 text-[#1e6f78]" />
                  </a>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-[#1e6f78]/20 bg-[#eef7f6] p-4 text-sm text-[#2b4a48]">
                Em parceria com o SINJUR, oferecemos desconto de 15% a 20% para conveniados e convênio com outras operadoras de
                saúde.
              </div>
              <div className="mt-4 text-base font-bold uppercase tracking-[0.3em] text-[#f05d5e]">Mateus 5:14 e 16</div>
            </div>
          </div>
        </section>

        <section id="servicos" className="mx-auto w-full max-w-screen-2xl px-3 py-10 sm:px-5 lg:px-8">
          <div className="flex flex-col gap-3">
            <div className="text-base font-bold uppercase tracking-[0.35em] text-[#1e6f78]">Serviços</div>
            <h2 className="font-[var(--font-display)] text-3xl font-extrabold text-[#1a2732] sm:text-4xl">
              Especialidades que cuidam de cada etapa
            </h2>
            <p className="max-w-3xl text-[#3a5250]">
              Atendimento integrado com foco em reabilitação, prevenção e acompanhamento contínuo, respeitando a história de cada
              paciente.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_16px_40px_rgba(31,109,209,0.12)] transition hover:-translate-y-1 hover:border-[#1e6f78]/35 hover:bg-white hover:shadow-[0_20px_45px_rgba(31,109,209,0.18)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6a63b]/15 text-[#1e6f78]">
                  <Icon name={service.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#1a2732]">{service.title}</h3>
                <p className="mt-2 text-sm text-[#3a5250]">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="nucleo-aba" className="mx-auto w-full max-w-screen-2xl px-3 py-10 sm:px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-gradient-to-br from-[#e7f6ff] via-[#fff1f1] to-[#fff8dd] p-6 shadow-[0_20px_50px_rgba(10,134,196,0.2)] sm:p-8">
            <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#0A86C4]/20 blur-3xl" />
            <div className="absolute -right-10 top-12 h-32 w-32 rounded-full bg-[#39B7A5]/25 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#FFD54A]/30 blur-3xl" />
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative z-10">
                <div className="group relative h-full min-h-[420px] overflow-hidden rounded-[36px] border border-white/80 bg-gradient-to-br from-[#0A86C4]/25 via-[#FFD54A]/25 to-[#E94B4B]/20 p-6 shadow-[0_24px_55px_rgba(10,134,196,0.25)] transition hover:-translate-y-1 hover:shadow-[0_28px_65px_rgba(10,134,196,0.3)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#39B7A5]/30 via-transparent to-[#FFD54A]/30 opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-[#0A86C4] shadow-[0_10px_25px_rgba(10,134,196,0.2)]">
                    <Icon name="brain" className="h-5 w-5" />
                  </div>
                  <div className="absolute right-6 top-24 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#E94B4B] shadow-[0_10px_25px_rgba(233,75,75,0.2)]">
                    <Icon name="heart" className="h-4 w-4" />
                  </div>
                  <div className="absolute bottom-6 left-6 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-[#39B7A5] shadow-[0_10px_25px_rgba(57,183,165,0.2)]">
                    <Icon name="hand" className="h-5 w-5" />
                  </div>
                  <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 text-center">
                    <img
                      src="/souluz/icone.png"
                      alt="Ícone Sou Luz"
                      className="-translate-x-4 h-44 w-auto transition duration-500 group-hover:-translate-y-2 group-hover:scale-105"
                    />
                    <img
                      src="/souluz/logo-aba.png"
                      alt="Logo do Núcleo ABA"
                      className="h-52 w-auto transition duration-500 group-hover:translate-y-2 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
              <div className="relative z-10">
                <div className="text-base font-bold uppercase tracking-[0.35em] text-[#0A86C4]">Núcleo ABA Sou Luz</div>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl font-extrabold text-[#1a2732] sm:text-4xl">
                  Terapias infantis com foco em autonomia e possibilidades
                </h2>
                <p className="mt-4 text-[#2b4a48]">
                  Clínica especializada em autismo (TEA) com abordagem ABA, unindo ciência, acolhimento e intervenções
                  personalizadas para cada pequeno universo.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#0A86C4]/15 px-3 py-1.5 text-xs font-semibold text-[#0A86C4]">
                    Clínica de terapias infantis
                  </span>
                  <span className="rounded-full bg-[#39B7A5]/15 px-3 py-1.5 text-xs font-semibold text-[#39B7A5]">
                    Especializada em autismo (TEA) - ABA
                  </span>
                  <span className="rounded-full bg-[#FFD54A]/70 px-3 py-1.5 text-xs font-semibold text-[#7a5b00]">
                    “Construindo um mundo de possibilidades para cada pequeno universo”
                  </span>
                </div>
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="group rounded-3xl border border-white/80 bg-white/85 p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#0A86C4]/30 hover:bg-white hover:shadow-[0_16px_35px_rgba(10,134,196,0.18)]">
                    <div className="text-base font-bold uppercase tracking-[0.3em] text-[#0A86C4]">Planos de saúde</div>
                    <div className="relative mt-4 overflow-hidden">
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/90 to-transparent" />
                      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/90 to-transparent" />
                      <div className="flex w-max gap-2 text-xs font-semibold text-[#1a2732] aba-scroll">
                        {abaPlans.map((plan, index) => (
                          <span
                            key={`plan-${plan}`}
                            className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5"
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: ["#0A86C4", "#E94B4B", "#FFD54A", "#39B7A5"][index % 4],
                              }}
                            />
                            {plan}
                          </span>
                        ))}
                        {abaPlans.map((plan, index) => (
                          <span
                            key={`plan-dup-${plan}`}
                            aria-hidden="true"
                            className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5"
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: ["#0A86C4", "#E94B4B", "#FFD54A", "#39B7A5"][index % 4],
                              }}
                            />
                            {plan}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="group rounded-3xl border border-white/80 bg-white/85 p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#39B7A5]/35 hover:bg-white hover:shadow-[0_16px_35px_rgba(57,183,165,0.2)]">
                    <div className="text-base font-bold uppercase tracking-[0.3em] text-[#E94B4B]">
                      Atendimento psicopedagógico
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-[#2b4a48]">
                      {abaCare.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-1 h-5 w-5 rounded-full bg-[#E94B4B]/15 text-[#E94B4B]">
                            <Icon name="check" className="m-1 h-3 w-3" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes aba-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .aba-scroll {
              animation: aba-scroll 48s linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .aba-scroll {
                animation: none;
              }
            }
          `}</style>
        </section>

        <section id="corpo-clinico" className="mx-auto w-full max-w-screen-2xl px-3 py-10 sm:px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="text-base font-bold uppercase tracking-[0.35em] text-[#f6a63b]">Corpo clínico</div>
              <h2 className="mt-3 font-[var(--font-display)] text-3xl font-extrabold text-[#1a2732] sm:text-4xl">
                Equipe multiprofissional integrada
              </h2>
              <p className="mt-4 text-[#3a5250]">
                Nossa atuação conecta especialistas para oferecer um cuidado completo, planejado e alinhado a cada necessidade.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[#314443]">
                {clinicalHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-6 w-6 rounded-full bg-[#1e6f78]/15 text-[#1e6f78]">
                      <Icon name="check" className="m-1.5 h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_45px_rgba(31,109,209,0.12)] transition hover:-translate-y-1 hover:border-[#1e6f78]/30 hover:bg-white hover:shadow-[0_22px_50px_rgba(31,109,209,0.18)]">
              <h3 className="text-lg font-bold text-[#1a2732]">Áreas de atuação clínica</h3>
              <p className="mt-3 text-sm text-[#3a5250]">
                Psicologia, fisioterapia, nutrição, terapia ocupacional, psicopedagogia, clínica médica, fonoaudiologia e exames
                audiológicos.
              </p>
              <div className="mt-6 rounded-2xl border border-[#1e6f78]/20 bg-[#eef7f6] p-4 text-sm text-[#2b4a48]">
                Atendimento humanizado, com acompanhamento terapêutico planejado e adequado para cada fase da vida.
              </div>
            </div>
          </div>
        </section>

        <section id="atendimento" className="mx-auto w-full max-w-screen-2xl px-3 py-10 sm:px-5 lg:px-8">
          <div className="text-base font-bold uppercase tracking-[0.35em] text-[#1e6f78]">Atendimento</div>
          <h2 className="mt-3 font-[var(--font-display)] text-3xl font-extrabold text-[#1a2732] sm:text-4xl">
            Hospitalar, ambulatorial e domiciliar
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {careModes.map((mode) => (
              <div
                key={mode.title}
                className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_16px_40px_rgba(31,109,209,0.1)] transition hover:-translate-y-1 hover:border-[#1e6f78]/35 hover:bg-white hover:shadow-[0_20px_45px_rgba(31,109,209,0.18)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1e6f78]/15 text-[#1e6f78]">
                  <Icon name={mode.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#1a2732]">{mode.title}</h3>
                <p className="mt-2 text-sm text-[#3a5250]">{mode.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contato" className="mx-auto w-full max-w-screen-2xl px-3 pb-12 sm:px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_16px_40px_rgba(31,109,209,0.12)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(31,109,209,0.18)]">
              <div className="text-base font-bold uppercase tracking-[0.35em] text-[#1e6f78]">Localização e horário</div>
              <h2 className="mt-3 font-[var(--font-display)] text-3xl font-extrabold text-[#1a2732]">Visite a Clínica Sou Luz</h2>
              <p className="mt-3 text-sm text-[#3a5250]">
                Estrutura acolhedora e equipe preparada para acompanhar cada paciente com cuidado e atenção.
              </p>
              <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative overflow-hidden rounded-3xl border border-[#1e6f78]/20 bg-gradient-to-br from-[#eef7f6] via-white to-white p-5 transition hover:-translate-y-1 hover:border-[#1e6f78]/35 hover:bg-white hover:shadow-[0_16px_35px_rgba(30,111,120,0.18)]">
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#1e6f78]/15 blur-2xl" />
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1e6f78] shadow-sm">
                      <Icon name="pin" className="h-6 w-6" />
                    </span>
                    <div className="flex-1">
                      <div className="text-base font-bold uppercase tracking-[0.3em] text-[#1e6f78]">Endereço</div>
                      <div className="mt-3 rounded-2xl bg-white/85 px-4 py-3">
                        <p className="text-base font-bold text-[#1a2732]">Av. Amazonas, n.º 4000</p>
                        <p className="text-sm text-[#2b4a48]">Bairro Agenor de Carvalho, Porto Velho</p>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-base font-bold uppercase tracking-[0.25em] text-[#f6a63b]">
                        <span className="h-2 w-2 rounded-full bg-[#f6a63b]" />
                        Fácil acesso e atendimento acolhedor
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-3xl border border-[#f6a63b]/20 bg-gradient-to-br from-[#fff7ea] via-white to-white p-5 transition hover:-translate-y-1 hover:border-[#f6a63b]/35 hover:bg-white hover:shadow-[0_16px_35px_rgba(246,166,59,0.2)]">
                  <div className="absolute -left-12 -bottom-12 h-28 w-28 rounded-full bg-[#f6a63b]/20 blur-2xl" />
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#f6a63b] shadow-sm">
                      <Icon name="clock" className="h-6 w-6" />
                    </span>
                    <div className="flex-1">
                      <div className="text-base font-bold uppercase tracking-[0.3em] text-[#f6a63b]">Horários</div>
                      <div className="mt-2 text-sm font-semibold text-[#2b4a48]">Segunda a sexta-feira</div>
                      <div className="mt-3 space-y-2 text-sm text-[#2b4a48]">
                        <div className="flex items-center justify-between rounded-2xl bg-white/85 px-3 py-2">
                          <span className="font-semibold">Manhã</span>
                          <span className="font-semibold text-[#1a2732]">08:00 – 12:00</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-white/85 px-3 py-2">
                          <span className="font-semibold">Tarde</span>
                          <span className="font-semibold text-[#1a2732]">14:00 – 18:00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/70 bg-[#1e6f78] p-6 text-white shadow-[0_20px_45px_rgba(30,111,120,0.35)] transition hover:-translate-y-1 hover:bg-[#1a6670] hover:shadow-[0_26px_55px_rgba(30,111,120,0.45)]">
              <div className="text-base font-bold uppercase tracking-[0.35em] text-white/70">Contato imediato</div>
              <h3 className="mt-3 font-[var(--font-display)] text-3xl font-extrabold">Estamos prontos para cuidar de você</h3>
              <p className="mt-4 text-sm text-white/85">
                Fale conosco pelo WhatsApp e receba orientação sobre atendimentos, convênios e disponibilidade de horários.
              </p>
              <div className="mt-6 space-y-3">
                {whatsappContacts.map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white/20"
                  >
                    <span>{contact.label}</span>
                    <Icon name="whatsapp" className="h-6 w-6 text-white" />
                  </a>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="https://www.instagram.com/clinica_souluz"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-base font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-white/25"
                >
                  <Icon name="instagram" className="h-5 w-5" />
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
