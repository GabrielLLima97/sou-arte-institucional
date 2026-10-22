import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Plus } from "lucide-react";
import { AssessoriaHeader } from "../../components/assessoria/Header";
import { ServiceExplorer } from "../../components/assessoria/ServiceExplorer";
import { AssessoriaContact } from "../../components/assessoria/ContactForm";
import {
  assessoria,
  assessoriaContactHref,
  assessoriaFaqs,
  assessoriaServices,
} from "../../lib/assessoria";
import styles from "../../components/assessoria/assessoria.module.css";

const description =
  "Gestão, auditoria, faturamento e credenciamento em saúde. A Sou Luz Assessoria ajuda clínicas, consultórios e instituições a organizar sua operação.";

export const metadata: Metadata = {
  title: { absolute: "Sou Luz Assessoria | Gestão e consultoria em saúde" },
  description,
  alternates: { canonical: assessoria.url },
  icons: { icon: "/souluz/icone.png" },
  openGraph: {
    title: "Sou Luz Assessoria | Gestão e consultoria em saúde",
    description,
    url: assessoria.url,
    images: [
      {
        url: `${assessoria.url}/souluz/logo-retangular.png`,
        alt: assessoria.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: assessoria.name,
    description,
    images: [`${assessoria.url}/souluz/logo-retangular.png`],
  },
};

const steps = [
  {
    title: "Escutar e entender",
    phase: "Diagnóstico",
    text: "Conhecemos a realidade da sua instituição, seus processos e os desafios que merecem atenção.",
  },
  {
    title: "Definir o caminho",
    phase: "Plano de ação",
    text: "Transformamos a análise em prioridades, metas e ações alinhadas ao momento do seu negócio.",
  },
  {
    title: "Colocar em prática",
    phase: "Implementação",
    text: "Acompanhamos os ajustes na operação e o alinhamento da equipe com os novos processos.",
  },
  {
    title: "Acompanhar a evolução",
    phase: "Indicadores",
    text: "Monitoramos os resultados para orientar decisões e manter a melhoria como parte da rotina.",
  },
];

export default function SouLuzAssessoriaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: assessoria.name,
    description,
    url: assessoria.url,
    image: `${assessoria.url}/souluz/logo-retangular.png`,
    telephone: assessoria.telephone,
    areaServed: "BR",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Soluções em saúde",
      itemListElement: assessoriaServices.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
      })),
    },
  };

  return (
    <div className={styles.site}>
      <a className={styles.skipLink} href="#conteudo">
        Pular para o conteúdo
      </a>
      <AssessoriaHeader />
      <main id="conteudo">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <section
          className={styles.hero}
          id="inicio"
          aria-labelledby="hero-title"
        >
          <Image
            className={styles.heroImage}
            src="/souluz/assessoria-gestao.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={85}
          />
          <div className={styles.heroShade} />
          <div className={`${styles.container} ${styles.heroContent}`}>
            <p className={styles.heroEyebrow}>
              <span />
              Um olhar estratégico para a saúde
            </p>
            <h1 id="hero-title">
              Sou Luz
              <br />
              <em>Assessoria.</em>
            </h1>
            <p className={styles.heroSubtitle}>
              Você cuida de pessoas.
              <br />
              Nós ajudamos a cuidar da sua gestão.
            </p>
            <p className={styles.heroDescription}>
              Gestão, auditoria e consultoria para dar mais clareza às decisões
              e mais consistência à sua operação.
            </p>
            <a
              href={assessoriaContactHref()}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.button} ${styles.buttonHero}`}
            >
              Converse com um especialista{" "}
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            <div className={styles.heroBottom}>
              <span>Estratégia. Proximidade. Evolução.</span>
              <a href="#sobre">
                Conheça a Sou Luz <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <div className={styles.audienceBand}>
          <div className={`${styles.container} ${styles.audienceInner}`}>
            <p>
              Ao lado de quem
              <br />
              <strong>faz a saúde acontecer.</strong>
            </p>
            <span>Clínicas</span>
            <span>Consultórios</span>
            <span>Instituições de saúde</span>
          </div>
        </div>

        <section
          id="sobre"
          className={`${styles.container} ${styles.about}`}
          aria-labelledby="about-title"
        >
          <div className={styles.sectionLabel}>
            <span>01 / A Sou Luz</span>
            <span className={styles.labelLine} />
          </div>
          <div className={styles.aboutGrid}>
            <h2 id="about-title">
              Uma boa gestão
              <br />
              também é uma
              <br />
              <em>forma de cuidar.</em>
            </h2>
            <div className={styles.aboutText}>
              <p className={styles.introText}>
                Por trás de cada atendimento, existe uma operação que precisa
                funcionar bem.
              </p>
              <p>
                Processos, equipes, faturamento e decisões fazem parte dessa
                realidade. A Sou Luz conecta essas frentes com assessoria
                técnica e estratégica, respeitando o momento e as necessidades
                de cada empreendimento.
              </p>
              <p>
                Nosso trabalho começa pela escuta e se desenvolve com
                planejamento, implementação e acompanhamento próximo.
              </p>
              <a href="#metodo" className={styles.textLink}>
                Conheça nossa abordagem{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className={styles.principles}>
            <p>
              <Check size={18} aria-hidden="true" />
              Visão integrada da operação
            </p>
            <p>
              <Check size={18} aria-hidden="true" />
              Atenção à realidade do seu negócio
            </p>
            <p>
              <Check size={18} aria-hidden="true" />
              Acompanhamento em cada etapa
            </p>
          </div>
        </section>

        <section
          id="servicos"
          className={styles.servicesSection}
          aria-labelledby="services-title"
        >
          <div className={`${styles.container} ${styles.servicesGrid}`}>
            <div className={styles.servicesIntro}>
              <p className={styles.sectionLabel}>02 / Nossas soluções</p>
              <h2 id="services-title">
                O cuidado com <br />a sua operação, <br />
                <em>em cada detalhe.</em>
              </h2>
              <p>
                Da estratégia à rotina. Encontre o apoio que faz sentido para o
                seu momento.
              </p>
              <a href="#contato" className={styles.textLink}>
                Encontre sua solução{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <div className={styles.serviceSignature}>
                <img
                  src="/souluz/icone.png"
                  alt=""
                  width="74"
                  height="74"
                  loading="lazy"
                />
                <span>
                  Uma luz para o<br />
                  seu empreendimento.
                </span>
              </div>
            </div>
            <ServiceExplorer />
          </div>
        </section>

        <section
          id="metodo"
          className={`${styles.container} ${styles.method}`}
          aria-labelledby="method-title"
        >
          <div className={styles.sectionLabel}>
            <span>03 / Nossa abordagem</span>
            <span className={styles.labelLine} />
          </div>
          <div className={styles.sectionHeading}>
            <h2 id="method-title">
              Direção clara.
              <br />
              <em>Presença em cada etapa.</em>
            </h2>
            <p>
              Um processo estruturado, com espaço para ouvir, ajustar e evoluir
              junto com a sua instituição.
            </p>
          </div>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.phase}>
                <div className={styles.stepTop}>
                  <span>0{index + 1}</span>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </div>
                <span className={styles.stepPhase}>{step.phase}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <div className={styles.methodClosing}>
            <span>O ponto de partida é a sua realidade.</span>
            <a
              href={assessoriaContactHref()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.textLink}
            >
              Vamos entender o seu momento{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={`${styles.container} ${styles.faqGrid}`}>
            <div>
              <p className={styles.sectionLabel}>Antes de começarmos</p>
              <h2 id="faq-title">
                Uma conversa
                <br />
                <em>com clareza.</em>
              </h2>
              <p className={styles.faqIntro}>
                Algumas respostas para você conhecer melhor o nosso trabalho.
              </p>
            </div>
            <div className={styles.faqs}>
              {assessoriaFaqs.map((faq) => (
                <details key={faq.question} className={styles.faq}>
                  <summary>
                    {faq.question}
                    <Plus size={19} aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contato"
          className={styles.contact}
          aria-labelledby="contact-title"
        >
          <div className={`${styles.container} ${styles.contactGrid}`}>
            <div className={styles.contactIntro}>
              <p className={styles.sectionLabel}>04 / Vamos conversar</p>
              <h2 id="contact-title">
                Seu próximo passo
                <br />
                merece uma
                <br />
                <em>direção clara.</em>
              </h2>
              <p>
                Compartilhe o momento da sua instituição.
                <br />
                Vamos pensar no caminho juntos.
              </p>
              <a
                className={styles.contactPhone}
                href={`tel:${assessoria.telephone}`}
              >
                {assessoria.phone}
                <ArrowUpRight size={19} aria-hidden="true" />
              </a>
            </div>
            <AssessoriaContact />
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerTop}>
            <a
              href="#inicio"
              className={styles.brand}
              aria-label="Sou Luz Assessoria, início"
            >
              <img
                src="/souluz/logo-retangular.png"
                alt="Sou Luz"
                width="1700"
                height="500"
                loading="lazy"
              />
              <span>Assessoria em saúde</span>
            </a>
            <p>Uma luz para o seu empreendimento.</p>
            <a
              href="#inicio"
              className={styles.backTop}
              aria-label="Voltar ao início"
              title="Voltar ao início"
            >
              <ArrowUp size={20} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.footerBottom}>
            <span>
              © {new Date().getFullYear()} Sou Luz Assessoria. Todos os
              direitos reservados.
            </span>
            <nav aria-label="Navegação do rodapé">
              <a href="#servicos">Soluções</a>
              <a href="#metodo">Nossa abordagem</a>
              <a href="#contato">Contato</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
