"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../components/Icons";
import { Modal } from "../components/portal/Modal";
import { PublicHeader } from "../components/PublicHeader";

const practiceAreas: { title: string; icon: IconName }[] = [
  { title: "Enfermagem", icon: "stethoscope" },
  { title: "Nutrição", icon: "leaf" },
  { title: "Farmácia", icon: "pharmacy" },
  { title: "Biomedicina", icon: "flask" },
  { title: "Psicologia", icon: "brain" },
  { title: "Serviços Hospitalares e Home Care", icon: "hospital" },
  { title: "Gestão de Escalas e Serviços Administrativos", icon: "calendar" },
  { title: "Cursos e Treinamentos", icon: "graduation" },
];

const services: { title: string; description: string; icon: IconName; image?: string }[] = [
  {
    title: "Serviços Hospitalares",
    description:
      "Atuação em enfermagem, nutrição, farmácia, biomedicina, psicologia e outras áreas de apoio clínico.",
    icon: "hospital",
    image: "/images/servicos-hospitalares.png",
  },
  {
    title: "Serviços Domiciliares - Home Care",
    description: "Cuidado humanizado no lar, respeitando a história e a realidade de cada paciente.",
    icon: "home",
    image: "/images/home-care.png",
  },
  {
    title: "Gestão de Escalas",
    description: "Planejamento de equipes e cobertura assistencial com segurança e agilidade.",
    icon: "calendar",
    image: "/images/gestao-escalas.png",
  },
  {
    title: "Serviços Administrativos",
    description: "Suporte de bastidores para garantir fluidez, organização e compliance.",
    icon: "briefcase",
    image: "/images/servicos-administrativos.png",
  },
  {
    title: "Cursos e Treinamentos",
    description: "Formação prática e teórica para desenvolvimento técnico e humano.",
    icon: "graduation",
    image: "/images/cursos-treinamentos.png",
  },
  {
    title: "Atendimento Multidisciplinar",
    description: "Conexão entre profissionais e especialidades para cuidado integral.",
    icon: "network",
    image: "/images/atendimento-multidisciplinar.png",
  },
];

const segments: { title: string; description: string; cta: string; href: string; icon: IconName }[] = [
  {
    title: "Hospitais, Clínicas e Associações",
    description:
      "Estruturamos equipes completas para atendimento hospitalar, apoio administrativo e gestão de escalas.",
    cta: "Solicitar proposta",
    href: "#contato",
    icon: "building",
  },
  {
    title: "Home Care e Famílias",
    description:
      "Assistência domiciliar com protocolo científico e acolhimento verdadeiro, do primeiro contato ao acompanhamento.",
    cta: "Agendar conversa",
    href: "https://wa.me/5569999220012",
    icon: "home",
  },
];

const associateHighlights = [
  "Escalas organizadas com antecedência e alinhadas ao seu perfil",
  "Suporte administrativo para facilitar seu dia a dia",
  "Treinamentos e atualização contínua",
  "Ambiente ético, colaborativo e acolhedor",
];

type CityStatus = "ativo" | "em-breve";

type City = {
  name: string;
  state: string;
  status: CityStatus;
  image: string;
  description: string;
};

const cities: City[] = [
  {
    name: "Porto Velho",
    state: "RO",
    status: "ativo",
    image: "/images/cidades/porto-velho.jpg",
    description: "Atuação hospitalar e domiciliar com equipe multidisciplinar e gestão de escalas.",
  },
  {
    name: "Ji-Paraná",
    state: "RO",
    status: "ativo",
    image: "/images/cidades/ji-parana.jpg",
    description: "Cobertura assistencial integrada com foco em qualidade clínica e acolhimento.",
  },
  {
    name: "Cacoal",
    state: "RO",
    status: "ativo",
    image: "/images/cidades/cacoal.jpg",
    description: "Equipes alinhadas aos protocolos da Sou Arte para hospitais e home care.",
  },
  {
    name: "Vila Velha",
    state: "ES",
    status: "ativo",
    image: "/images/cidades/vila-velha.jpg",
    description: "Atendimento humanizado com suporte administrativo e treinamento contínuo.",
  },
  {
    name: "Rio Branco",
    state: "AC",
    status: "em-breve",
    image: "/images/cidades/rio-branco.jpg",
    description: "Expansão em andamento para trazer toda a estrutura da Sou Arte à região.",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"servicos" | "associados">("servicos");
  const servicesFormRef = useRef<HTMLFormElement | null>(null);
  const associatesFormRef = useRef<HTMLFormElement | null>(null);
  const [activeCity, setActiveCity] = useState<City | null>(null);
  const citiesCarouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const updateTabFromHash = () => {
      if (window.location.hash === "#form-associados") {
        setActiveTab("associados");
      } else if (window.location.hash === "#form-servicos") {
        setActiveTab("servicos");
      }
    };

    updateTabFromHash();
    window.addEventListener("hashchange", updateTabFromHash);
    return () => window.removeEventListener("hashchange", updateTabFromHash);
  }, []);

  useEffect(() => {
    const element = citiesCarouselRef.current;
    if (!element) {
      return;
    }

    const update = () => {
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 4);
    };

    update();
    element.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      element.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollCities = (direction: number) => {
    const element = citiesCarouselRef.current;
    if (!element) {
      return;
    }
    const amount = Math.max(260, Math.min(420, element.clientWidth - 120));
    element.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const buildWhatsAppMessage = (type: "servicos" | "associados", data: FormData) => {
    const getValue = (name: string) => {
      const value = data.get(name);
      return typeof value === "string" ? value.trim() : "";
    };

    const lines: string[] = [];
    const addLine = (label: string, value: string) => {
      if (value) {
        lines.push(`${label}: ${value}`);
      }
    };

    if (type === "servicos") {
      lines.push("Solicitação de serviços - Sou Arte em Cuidados");
      addLine("Nome", getValue("Nome"));
      addLine("Empresa/Instituição", getValue("Empresa ou Instituição"));
      addLine("E-mail", getValue("Email"));
      addLine("Telefone", getValue("Telefone"));
      addLine("Tipo de serviço", getValue("Tipo de serviço"));
      addLine("Cidade/Estado", getValue("Cidade"));
      addLine("Detalhes", getValue("Mensagem"));
      return lines.join("\n");
    }

    lines.push("Associação de profissionais - Sou Arte em Cuidados");
    addLine("Nome", getValue("Nome"));
    addLine("Profissão", getValue("Profissão"));
    addLine("Registro profissional", getValue("Registro profissional"));
    addLine("Telefone", getValue("Telefone"));
    addLine("E-mail", getValue("Email"));
    addLine("Cidade/Estado", getValue("Cidade"));
    addLine("Área de atuação", getValue("Área de atuação"));
    addLine("Disponibilidade", getValue("Disponibilidade"));
    addLine("Experiência", getValue("Mensagem"));
    return lines.join("\n");
  };

  const handleWhatsAppSubmit = (type: "servicos" | "associados") => {
    const form = type === "servicos" ? servicesFormRef.current : associatesFormRef.current;
    if (!form) {
      return;
    }

    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    const message = buildWhatsAppMessage(type, data);
    const url = `https://wa.me/5569999220012?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="bg-[#f6f1e8] text-[#1a2732]">
      <PublicHeader />
      <div className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#e6f0ff] blur-3xl opacity-80 -z-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-[#ffe1de] blur-3xl opacity-70 -z-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#e2ecff] blur-[120px] opacity-60 -z-10"
        />

        <section id="inicio" className="relative z-10 mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 pb-10 pt-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-7">
              <div className="space-y-5">
                <h1 className="font-[var(--font-display)] text-4xl font-bold leading-tight tracking-tight text-[#0f1111] sm:text-5xl lg:text-6xl">
                  Sou Arte em Cuidados: Onde a Ciência e a Sensibilidade se Encontram
                </h1>
                <p className="text-lg leading-relaxed text-[#0f1111]">
                  Empresa multinacional em cuidados com a saúde, unindo enfermagem, nutrição, farmácia, biomedicina,
                  psicologia e outras especialidades para oferecer suporte hospitalar, domiciliar, administrativo e
                  educacional.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <a
                  href="https://wa.me/5569999220012?text=Ol%C3%A1%20Sou%20Arte%20em%20Cuidados%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b6b] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-[#e85b5b] sm:text-sm"
                >
                  <Icon name="whatsapp" className="h-10 w-10" />
                  Atendimento via WhatsApp
                </a>
                <a
                  href="#form-servicos"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-white sm:text-sm"
                >
                  <Icon name="briefcase" className="h-10 w-10" />
                  Solicitar orçamento
                </a>
                <a
                  href="#form-associados"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1a2732]/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#1a2732] transition hover:-translate-y-0.5 hover:border-[#1f6dd1]/60 sm:text-sm"
                >
                  <Icon name="network" className="h-10 w-10" />
                  Quero me associar
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl shadow-[#1f6dd1]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:shadow-2xl hover:shadow-[#1f6dd1]/20">
                <img
                  src="/images/hero.png"
                  alt="Equipe de cuidados em saúde da Sou Arte em Cuidados"
                  className="h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2732]/45 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-90" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8" id="sobre">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-3">
                <div className="text-lg font-bold uppercase tracking-[0.32em] text-[#1f6dd1]">Sobre a empresa</div>
                <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#1a2732] sm:text-4xl">
                  Sou Arte em Cuidados
                </h2>
              </div>
              <blockquote className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-6 text-base italic text-[#3b4b5a] shadow-lg shadow-[#1f6dd1]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:shadow-2xl hover:shadow-[#1f6dd1]/20">
                "A enfermagem é uma arte, e para realizá-la como arte, requer uma devoção tão exclusiva, um preparo tão
                rigoroso, quanto a obra de qualquer pintor ou escultor."
                <span className="mt-3 block text-sm font-semibold not-italic text-[#1f6dd1]">Florence Nightingale</span>
              </blockquote>
              <p className="text-base leading-relaxed text-[#3b4b5a]">
                Cuidar é muito mais do que aplicar técnicas. É compreender que por trás de cada paciente existe uma
                história, uma alma e um coração que precisa ser acolhido. A enfermagem, para nós, é a arte mais bela de
                todas, porque lida com o corpo vivo, o templo do espírito de Deus.
              </p>
              <p className="text-base leading-relaxed text-[#3b4b5a]">
                Mas arte nenhuma se sustenta sem conhecimento. Florence mostrou ao mundo que ciência e sensibilidade
                caminham juntas. Foi com estatísticas e estudos que ela revolucionou a saúde, provando que o amor ao
                próximo pode e deve andar lado a lado com a técnica e a precisão.
              </p>
              <p className="text-base leading-relaxed text-[#3b4b5a]">
                É sobre esse equilíbrio que construímos nossa missão: unir excelência científica com delicadeza humana.
                A Sou Arte em Cuidados nasceu com esse propósito: oferecer um cuidado que cura o corpo e toca o coração.
              </p>
            </div>
            <div className="lg:col-span-5 space-y-5">
              <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:shadow-2xl hover:shadow-[#1f6dd1]/20">
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">Nossa atuação</div>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {practiceAreas.map((item) => (
                    <li
                      key={item.title}
                      className="flex items-center gap-3 rounded-2xl border border-[#e7d8c9] bg-white/80 px-4 py-3 text-sm font-semibold text-[#3b4b5a]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f0ff] text-[#1f6dd1] transition-colors duration-300 group-hover:bg-[#ff6b6b]/15 group-hover:text-[#ff6b6b]">
                        <Icon name={item.icon} className="h-5 w-5" />
                      </span>
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8" id="servicos">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <div className="text-lg font-bold uppercase tracking-[0.32em] text-[#1f6dd1]">Serviços</div>
              <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#1a2732] sm:text-4xl">
                O que entregamos
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-[#5b6b78]">
              Estrutura completa para hospitais, clínicas, associações e famílias, com foco em eficiência, acolhimento e
              consistência assistencial.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:bg-[#f2f6ff]/60 hover:shadow-2xl hover:shadow-[#1f6dd1]/20"
              >
                <div className="space-y-4">
                  {service.image && (
                    <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/80">
                      <img
                        src={service.image}
                        alt={`Imagem representando ${service.title}`}
                        className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2732]/35 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6f0ff] text-[#1f6dd1] transition-colors duration-300 group-hover:bg-[#ff6b6b]/15 group-hover:text-[#ff6b6b]">
                      <Icon name={service.icon} className="h-6 w-6" />
                    </span>
                    <div>
                      <div className="text-lg font-semibold text-[#1a2732] transition-colors duration-300 group-hover:text-[#1f6dd1]">
                        {service.title}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-[#5b6b78]">{service.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8" id="clientes">
          <div className="space-y-3">
            <div className="text-lg font-bold uppercase tracking-[0.32em] text-[#ff6b6b]">Nossos clientes</div>
            <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#1a2732] sm:text-4xl">
              Para quem cuidamos
            </h2>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {segments.map((segment) => (
              <div
                key={segment.title}
                className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-[#1f6dd1]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:shadow-2xl hover:shadow-[#1f6dd1]/20"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2f6ff] text-[#1f6dd1] transition-colors duration-300 group-hover:bg-[#ff6b6b]/15 group-hover:text-[#ff6b6b]">
                    <Icon name={segment.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <div className="text-lg font-semibold text-[#1a2732]">{segment.title}</div>
                    <p className="mt-3 text-sm leading-relaxed text-[#5b6b78]">{segment.description}</p>
                    <a
                      href={segment.href}
                      target={segment.href.startsWith("http") ? "_blank" : undefined}
                      rel={segment.href.startsWith("http") ? "noreferrer" : undefined}
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
                    >
                      {segment.href.includes("wa.me") && <Icon name="whatsapp" className="h-4 w-4" />}
                      {segment.cta}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8" id="cidades">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <div className="text-lg font-bold uppercase tracking-[0.32em] text-[#1f6dd1]">Presença Sou Arte</div>
              <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#1a2732] sm:text-4xl">
                Cidades onde estamos
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-[#5b6b78]">
              Estamos expandindo nossa atuação com equipes locais, atendimento humanizado e suporte completo às
              instituições e famílias.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollCities(-1)}
              disabled={!canScrollLeft}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1f6dd1]/30 bg-white text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Cidades anteriores"
            >
              <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollCities(1)}
              disabled={!canScrollRight}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1f6dd1]/30 bg-white text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Próximas cidades"
            >
              <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          <div
            ref={citiesCarouselRef}
            className="mt-4 flex gap-6 overflow-x-auto pb-3 pr-2 pt-2 snap-x snap-mandatory"
          >
            {cities.map((city) => {
              const isSoon = city.status === "em-breve";
              return (
                <div
                  key={`${city.name}-${city.state}`}
                  className={`group relative flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-lg shadow-[#1f6dd1]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:shadow-2xl hover:shadow-[#1f6dd1]/20 sm:w-[320px] lg:w-[360px] ${
                    isSoon ? "opacity-70 hover:translate-y-0 hover:shadow-lg" : ""
                  }`}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={city.image}
                      alt={`Vista de ${city.name} - ${city.state}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2732]/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#1a2732]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                      <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11z" />
                        <circle cx="12" cy="11" r="2.5" />
                      </svg>
                      {city.name} · {city.state}
                    </div>
                    {isSoon && (
                      <div className="absolute top-3 right-3 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#8a98a5]">
                        Em breve
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm leading-relaxed text-[#5b6b78]">{city.description}</p>
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => (!isSoon ? setActiveCity(city) : null)}
                        disabled={isSoon}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                          isSoon
                            ? "border-[#d6dde3] text-[#8a98a5]"
                            : "border-[#1f6dd1]/30 bg-white text-[#1f6dd1] hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
                        }`}
                      >
                        {isSoon ? "Em breve" : "Ver detalhes"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8" id="associados">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-lg font-bold uppercase tracking-[0.32em] text-[#ff6b6b]">Associados</div>
              <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#1a2732] sm:text-4xl">
                Associe-se a uma equipe que valoriza ciência e cuidado humano
              </h2>
              <p className="text-base leading-relaxed text-[#5b6b78]">
                Se você é profissional da saúde e busca organização, reconhecimento e suporte real, queremos conhecer
                você. Na Sou Arte em Cuidados, sua atuação é respeitada e sua evolução é incentivada.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-[#3b4b5a]">
                {associateHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#e6f0ff] text-[#1f6dd1]">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-3xl border border-[#1f6dd1]/20 bg-[#f2f6ff] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:shadow-2xl hover:shadow-[#1f6dd1]/20">
                <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/90">
                  <img
                    src="/images/associados.png"
                    alt="Profissionais associados da Sou Arte em Cuidados"
                    className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2732]/45 via-transparent to-transparent" />
                </div>
                <div className="mt-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">
                  Junte-se ao time
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#3b4b5a]">
                  Preencha o formulário para iniciarmos seu cadastro ou fale agora pelo WhatsApp. Nosso time responde
                  com as próximas etapas e orientações.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="#form-associados"
                    className="inline-flex items-center rounded-full bg-[#ff6b6b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#e85b5b]"
                  >
                    Quero me associar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8" id="contato">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-3">
                <div className="text-lg font-bold uppercase tracking-[0.32em] text-[#1f6dd1]">Contato</div>
                <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#1a2732] sm:text-4xl">
                  Fale com a Sou Arte
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[#5b6b78]">
                Vamos conversar sobre necessidades hospitalares, home care, gestão de escalas ou parcerias. Responderemos
                rapidamente para entender seu contexto.
              </p>
              <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:shadow-2xl hover:shadow-[#1f6dd1]/20">
                <div className="text-lg font-bold uppercase tracking-[0.32em] text-[#ff6b6b]">Canais diretos</div>
                <div className="mt-4 space-y-3 text-sm text-[#3b4b5a]">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-[#1f6dd1]">Telefone</div>
                    <a href="tel:+5569999220012" className="mt-1 block font-semibold hover:text-[#1f6dd1]">
                      69 99922-0012
                    </a>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-[#1f6dd1]">E-mail</div>
                    <a
                      href="mailto:souarteemcuidados@gmail.com"
                      className="mt-1 inline-flex items-center gap-2 font-semibold hover:text-[#1f6dd1]"
                    >
                      <Icon name="mail" className="h-4 w-4" />
                      souarteemcuidados@gmail.com
                    </a>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-[#1f6dd1]">Instagram</div>
                    <a
                      href="https://www.instagram.com/souarteemcuidados?igsh=MWw5eWNqNmZqbXU4cg=="
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block font-semibold hover:text-[#1f6dd1]"
                    >
                      @souarteemcuidados
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">
                    Formulários de contato
                  </div>
                  <h3 className="font-[var(--font-display)] text-2xl font-bold text-[#1a2732]">
                    Escolha o formulário ideal para você
                  </h3>
                  <p className="text-sm text-[#5b6b78]">
                    Atendimento direto para contratação de serviços ou para quem deseja se associar ao time.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-[#1f6dd1]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:shadow-2xl hover:shadow-[#1f6dd1]/20">
                <div
                  role="tablist"
                  aria-label="Formulários de contato"
                  className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#1f6dd1]/20 bg-[#f2f6ff] p-1"
                >
                  <button
                    type="button"
                    role="tab"
                    id="tab-servicos"
                    aria-selected={activeTab === "servicos"}
                    aria-controls="painel-servicos"
                    onClick={() => setActiveTab("servicos")}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] transition ${
                      activeTab === "servicos"
                        ? "bg-[#1f6dd1] text-white shadow-sm"
                        : "text-[#1a2732] hover:bg-white/80"
                    }`}
                  >
                    <Icon name="briefcase" className="h-4 w-4" />
                    Contratação de serviços
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="tab-associados"
                    aria-selected={activeTab === "associados"}
                    aria-controls="painel-associados"
                    onClick={() => setActiveTab("associados")}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] transition ${
                      activeTab === "associados"
                        ? "bg-[#1f6dd1] text-white shadow-sm"
                        : "text-[#1a2732] hover:bg-white/80"
                    }`}
                  >
                    <Icon name="network" className="h-4 w-4" />
                    Associação de profissionais
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  <div
                    role="tabpanel"
                    id="painel-servicos"
                    aria-labelledby="tab-servicos"
                    hidden={activeTab !== "servicos"}
                  >
                    <form
                      id="form-servicos"
                      ref={servicesFormRef}
                      action="mailto:souarteemcuidados@gmail.com?subject=Contato%20-%20Servi%C3%A7os"
                      method="post"
                      encType="text/plain"
                      className="space-y-4"
                    >
                      <input type="hidden" name="Tipo de contato" value="Contratação de serviços" />
                      <div className="space-y-2">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">
                          Contratar serviços
                        </div>
                        <h4 className="font-[var(--font-display)] text-xl font-bold text-[#1a2732]">
                          Solicitar proposta comercial
                        </h4>
                        <p className="text-sm text-[#5b6b78]">
                          Informe seus dados e o tipo de serviço que deseja contratar.
                        </p>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Nome completo
                          <input
                            name="Nome"
                            type="text"
                            placeholder="Seu nome"
                            required
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          />
                        </label>
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Empresa ou instituição
                          <input
                            name="Empresa ou Instituição"
                            type="text"
                            placeholder="Hospital, clínica ou associação"
                            required
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          />
                        </label>
                        <label className="text-sm font-semibold text-[#2f4050]">
                          E-mail
                          <input
                            name="Email"
                            type="email"
                            placeholder="você@email.com"
                            required
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          />
                        </label>
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Telefone
                          <input
                            name="Telefone"
                            type="tel"
                            placeholder="(69) 99922-0012"
                            required
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          />
                        </label>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Tipo de serviço
                          <select
                            name="Tipo de serviço"
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          >
                            <option>Serviços Hospitalares</option>
                            <option>Home Care</option>
                            <option>Gestão de Escalas</option>
                            <option>Serviços Administrativos</option>
                            <option>Cursos e Treinamentos</option>
                            <option>Atendimento Multidisciplinar</option>
                            <option>Outro</option>
                          </select>
                        </label>
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Cidade/estado
                          <input
                            name="Cidade"
                            type="text"
                            placeholder="Cidade, Estado"
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          />
                        </label>
                      </div>

                      <label className="mt-4 text-sm font-semibold text-[#2f4050]">
                        Detalhes da solicitação
                        <textarea
                          name="Mensagem"
                          placeholder="Conte o que sua empresa precisa e o prazo desejado."
                          rows={4}
                          className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                        />
                      </label>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <button
                          type="submit"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b6b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#e85b5b]"
                        >
                          <Icon name="mail" className="h-10 w-10" />
                          Enviar por e-mail
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWhatsAppSubmit("servicos")}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-white"
                        >
                          <Icon name="whatsapp" className="h-10 w-10" />
                          Enviar por WhatsApp
                        </button>
                      </div>
                    </form>
                  </div>

                  <div
                    role="tabpanel"
                    id="painel-associados"
                    aria-labelledby="tab-associados"
                    hidden={activeTab !== "associados"}
                  >
                    <form
                      id="form-associados"
                      ref={associatesFormRef}
                      action="mailto:souarteemcuidados@gmail.com?subject=Contato%20-%20Associados"
                      method="post"
                      encType="text/plain"
                      className="space-y-4"
                    >
                      <input type="hidden" name="Tipo de contato" value="Associação de profissionais" />
                      <div className="space-y-2">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">
                          Quero me associar
                        </div>
                        <h4 className="font-[var(--font-display)] text-xl font-bold text-[#1a2732]">
                          Cadastro de profissionais
                        </h4>
                        <p className="text-sm text-[#5b6b78]">
                          Preencha seus dados para iniciar seu cadastro no nosso time.
                        </p>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Nome completo
                          <input
                            name="Nome"
                            type="text"
                            placeholder="Seu nome"
                            required
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          />
                        </label>
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Profissão
                          <select
                            name="Profissão"
                            required
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          >
                            <option value="">Selecione</option>
                            <option>Enfermeiro(a)</option>
                            <option>Técnico(a) de Enfermagem</option>
                            <option>Psicólogo(a)</option>
                            <option>Biomédico(a)</option>
                            <option>Farmacêutico(a)</option>
                            <option>Nutricionista</option>
                          </select>
                        </label>
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Registro profissional
                          <input
                            name="Registro profissional"
                            type="text"
                            placeholder="COREN, CRN, CRP..."
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          />
                        </label>
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Telefone
                          <input
                            name="Telefone"
                            type="tel"
                            placeholder="(69) 99922-0012"
                            required
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          />
                        </label>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-semibold text-[#2f4050]">
                          E-mail
                          <input
                            name="Email"
                            type="email"
                            placeholder="você@email.com"
                            required
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          />
                        </label>
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Cidade/estado
                          <input
                            name="Cidade"
                            type="text"
                            placeholder="Cidade, Estado"
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          />
                        </label>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Área de atuação
                          <select
                            name="Área de atuação"
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          >
                            <option>Enfermagem</option>
                            <option>Nutrição</option>
                            <option>Farmácia</option>
                            <option>Biomedicina</option>
                            <option>Psicologia</option>
                            <option>Administrativo</option>
                            <option>Outra área</option>
                          </select>
                        </label>
                        <label className="text-sm font-semibold text-[#2f4050]">
                          Disponibilidade
                          <select
                            name="Disponibilidade"
                            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          >
                            <option>Plantões</option>
                            <option>Horário comercial</option>
                            <option>Turnos específicos</option>
                            <option>A combinar</option>
                          </select>
                        </label>
                      </div>

                      <label className="mt-4 text-sm font-semibold text-[#2f4050]">
                        Experiência e observações
                        <textarea
                          name="Mensagem"
                          placeholder="Conte sua experiência e disponibilidade."
                          rows={4}
                          className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/80 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                        />
                      </label>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <button
                          type="submit"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b6b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#e85b5b]"
                        >
                          <Icon name="mail" className="h-10 w-10" />
                          Enviar por e-mail
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWhatsAppSubmit("associados")}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-white"
                        >
                          <Icon name="whatsapp" className="h-10 w-10" />
                          Enviar por WhatsApp
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Modal
          open={Boolean(activeCity)}
          title={activeCity ? `${activeCity.name} · ${activeCity.state}` : undefined}
          eyebrow="Presença Sou Arte"
          iconName="info"
          tone="primary"
          onClose={() => setActiveCity(null)}
        >
          {activeCity && (
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/90">
                <img
                  src={activeCity.image}
                  alt={`Vista de ${activeCity.name} - ${activeCity.state}`}
                  className="h-56 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2732]/45 via-transparent to-transparent" />
              </div>
              <div className="rounded-2xl border border-[#f0e4d7] bg-white/80 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Atuação local</div>
                <p className="mt-3 text-sm leading-relaxed text-[#3b4b5a]">{activeCity.description}</p>
              </div>
            </div>
          )}
        </Modal>

        <footer className="border-t border-[#ead7c6] bg-white/70 backdrop-blur-2xl">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4 space-y-5">
                <div className="flex items-center gap-4">
                  <img
                    src="/brand/logo-retangular.png"
                    alt="Sou Arte em Cuidados"
                    className="h-12 w-auto"
                  />
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">
                  SOU ARTE EM CUIDADOS S/S LTDA
                </div>
                <p className="text-sm leading-relaxed text-[#5b6b78]">
                  Multinacional em cuidados com a saúde, com atuação hospitalar, domiciliar, administrativa e
                  educacional. Ciência e sensibilidade no cuidado de cada pessoa.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/5569999220012"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
                  >
                    <Icon name="whatsapp" className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href="mailto:souarteemcuidados@gmail.com"
                    className="inline-flex items-center gap-2 rounded-full border border-[#ff6b6b]/40 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b] transition hover:-translate-y-0.5 hover:bg-[#ffe3e3]"
                  >
                    <Icon name="mail" className="h-4 w-4" />
                    E-mail
                  </a>
                </div>
              </div>

              <div className="lg:col-span-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Navegação</div>
                  <div className="flex flex-col gap-2 text-sm text-[#3b4b5a]">
                    <a href="#sobre" className="inline-flex items-center gap-2 hover:text-[#1f6dd1]">
                      <Icon name="building" className="h-4 w-4" />
                      Sobre a empresa
                    </a>
                    <a href="#servicos" className="inline-flex items-center gap-2 hover:text-[#1f6dd1]">
                      <Icon name="briefcase" className="h-4 w-4" />
                      Serviços
                    </a>
                    <a href="#clientes" className="inline-flex items-center gap-2 hover:text-[#1f6dd1]">
                      <Icon name="hospital" className="h-4 w-4" />
                      Clientes
                    </a>
                    <a href="#cidades" className="inline-flex items-center gap-2 hover:text-[#1f6dd1]">
                      <Icon name="network" className="h-4 w-4" />
                      Cidades
                    </a>
                    <a href="#contato" className="inline-flex items-center gap-2 hover:text-[#1f6dd1]">
                      <Icon name="mail" className="h-4 w-4" />
                      Contato
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Portais</div>
                  <div className="flex flex-col gap-2 text-sm text-[#3b4b5a]">
                    <a href="/portal-socio/login" className="inline-flex items-center gap-2 hover:text-[#1f6dd1]">
                      <Icon name="network" className="h-4 w-4" />
                      Portal do Sócio
                    </a>
                    <a href="/portal-admin/login" className="inline-flex items-center gap-2 hover:text-[#1f6dd1]">
                      <Icon name="briefcase" className="h-4 w-4" />
                      Portal Administrativo
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Contato</div>
                  <div className="flex flex-col gap-2 text-sm text-[#3b4b5a]">
                    <a href="tel:+5569999220012" className="inline-flex items-center gap-2 hover:text-[#1f6dd1]">
                      <Icon name="chat" className="h-4 w-4" />
                      69 99922-0012
                    </a>
                    <a href="mailto:souarteemcuidados@gmail.com" className="inline-flex items-center gap-2 hover:text-[#1f6dd1]">
                      <Icon name="mail" className="h-4 w-4" />
                      souarteemcuidados@gmail.com
                    </a>
                    <a
                      href="https://www.instagram.com/souarteemcuidados?igsh=MWw5eWNqNmZqbXU4cg=="
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 hover:text-[#1f6dd1]"
                    >
                      <Icon name="heart" className="h-4 w-4" />
                      Instagram oficial
                    </a>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">
                      Cidades de atuação
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-[#5b6b78]">
                      <Icon name="building" className="h-4 w-4 text-[#ff6b6b]" />
                      Porto Velho · Ji-Paraná · Cacoal · Vila Velha · Rio Branco (em breve)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-white/60 pt-6 text-xs uppercase tracking-[0.3em] text-[#1f6dd1] md:flex-row md:items-center md:justify-between">
              <span>Sou Arte em Cuidados S/S LTDA</span>
              <span>A ciência que salva. A arte que transforma.</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
