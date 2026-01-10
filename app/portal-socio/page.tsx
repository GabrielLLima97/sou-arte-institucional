"use client";

import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "../../components/portal/PortalShell";
import { PortalCard } from "../../components/portal/PortalCard";
import { Modal } from "../../components/portal/Modal";
import { apiFetch } from "../../lib/api";
import type { Announcement, PortalLink } from "../../lib/types";

const NAV_LINKS = [
  { label: "Home", href: "/portal-socio" },
  { label: "Cursos", href: "/portal-socio/cursos" },
  { label: "Antecipação", href: "/portal-socio/antecipacao" },
  { label: "Plano de Saúde", href: "/portal-socio/plano-saude" },
  { label: "Descontos", href: "/portal-socio/descontos" },
];

const fallbackLinks: Record<string, PortalLink> = {
  plantao: {
    id: "local-plantao",
    slug: "plantao",
    title: "Pega plantão",
    description: "Acesse rapidamente o sistema de plantão disponível para novos atendimentos.",
    body: "Clique no link para consultar as oportunidades e registrar seu interesse em novos plantões.",
    link_url: "https://pegaplantao.com.br/",
  },
  antecipacao: {
    id: "local-antecipacao",
    slug: "antecipacao",
    title: "Antecipação",
    description: "Orientações para antecipação de pagamentos e fluxos financeiros.",
    body: "Siga as instruções oficiais e valide seus dados antes de solicitar a antecipação.",
    link_url: "https://souarte.tci-br.com/",
  },
  "plano-saude": {
    id: "local-plano",
    slug: "plano-saude",
    title: "Plano de saúde",
    description: "Informações sobre credenciamento e cobertura do plano de saúde.",
    body: "Confira os requisitos e acesse o portal para solicitar credenciamento.",
    link_url: "https://wa.me/5569999220012",
  },
};

type BadgeTone = "primary" | "coral" | "muted";

const BADGE_STYLES: Record<BadgeTone, string> = {
  primary: "border-[#1f6dd1]/30 bg-[#f2f6ff] text-[#1f6dd1]",
  coral: "border-[#ff6b6b]/30 bg-[#fff6f6] text-[#ff6b6b]",
  muted: "border-[#d6dde3] bg-white text-[#8a98a5]",
};

const ICONS = {
  course: (
    <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16v12H4z" />
      <path d="M8 6v12M12 10h4" />
    </svg>
  ),
  plantao: (
    <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
      <path d="M12 14v4M10 16h4" />
    </svg>
  ),
  antecipacao: (
    <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
      <path d="M12 8l4 4-4 4" />
    </svg>
  ),
  descontos: (
    <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12l-8 8-8-8 8-8z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  plano: (
    <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21c-4-3-7-6-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4-3 7-7 10z" />
      <path d="M12 8v4M10 10h4" />
    </svg>
  ),
};

const Badge = ({ label, tone, icon }: { label: string; tone: BadgeTone; icon: JSX.Element }) => (
  <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${BADGE_STYLES[tone]}`}>
    {icon}
    {label}
  </div>
);

export default function PortalSocioHomePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [links, setLinks] = useState<Record<string, PortalLink>>(fallbackLinks);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);
  const [activeLink, setActiveLink] = useState<PortalLink | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch<Announcement[]>("/portal/announcements");
        setAnnouncements(data);
      } catch (error) {
        setAnnouncements([]);
      }

      try {
        const data = await apiFetch<PortalLink[]>("/portal/links");
        const mapped = data.reduce<Record<string, PortalLink>>((acc, item) => {
          acc[item.slug] = item;
          return acc;
        }, {});
        setLinks((prev) => ({ ...prev, ...mapped }));
      } catch (error) {
        setLinks(fallbackLinks);
      }
    };

    load();
  }, []);

  const formattedAnnouncements = useMemo(() => {
    return announcements.map((item) => ({
      ...item,
      dateLabel: new Date(item.published_at).toLocaleDateString("pt-BR"),
      expiresLabel: item.expires_at ? new Date(item.expires_at).toLocaleDateString("pt-BR") : "Sem prazo",
      authorLabel: item.author_name ?? "Equipe Sou Arte",
      excerpt: item.body.length > 160 ? `${item.body.slice(0, 160)}...` : item.body,
    }));
  }, [announcements]);

  useEffect(() => {
    setActiveIndex((prev) => (formattedAnnouncements.length === 0 ? 0 : Math.min(prev, formattedAnnouncements.length - 1)));
  }, [formattedAnnouncements.length]);

  useEffect(() => {
    if (isPaused || formattedAnnouncements.length <= 1) {
      return;
    }
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % formattedAnnouncements.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [formattedAnnouncements.length, isPaused]);

  return (
    <PortalShell role="socio" loginPath="/portal-socio/login" title="Portal do Sócio" links={NAV_LINKS}>
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Dashboard</div>
          <h1 className="mt-3 text-3xl font-bold text-[#1a2732]">Bem-vindo ao seu portal</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#5b6b78]">
            Aqui você acompanha comunicados oficiais, cursos e acessos essenciais para sua rotina de plantão e evolução profissional.
          </p>
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">Comunicados</div>
              <h2 className="text-2xl font-bold text-[#1a2732]">Informações oficiais</h2>
              <p className="mt-2 text-sm text-[#5b6b78]">Atualizações importantes para sua rotina e alinhamentos da equipe.</p>
            </div>
            {formattedAnnouncements.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      formattedAnnouncements.length === 0
                        ? 0
                        : (prev - 1 + formattedAnnouncements.length) % formattedAnnouncements.length
                    )
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1f6dd1]/30 bg-white text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
                  aria-label="Comunicado anterior"
                >
                  <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      formattedAnnouncements.length === 0 ? 0 : (prev + 1) % formattedAnnouncements.length
                    )
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1f6dd1]/30 bg-white text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
                  aria-label="Próximo comunicado"
                >
                  <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            {formattedAnnouncements.length === 0 && (
              <div className="rounded-3xl border border-white/70 bg-white/90 p-6 text-sm text-[#5b6b78]">
                Nenhum comunicado publicado no momento.
              </div>
            )}
            {formattedAnnouncements.length > 0 && (
              <div
                className="rounded-3xl border border-white/70 bg-white/80 p-2 shadow-lg shadow-[#1f6dd1]/10"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="relative overflow-hidden rounded-3xl">
                  <div
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                  >
                    {formattedAnnouncements.map((item) => (
                      <div key={item.id} className="min-w-full px-2 py-2">
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setActiveAnnouncement(item)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              setActiveAnnouncement(item);
                            }
                          }}
                          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-6 shadow-lg shadow-[#1f6dd1]/10 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#1f6dd1]/15"
                        >
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(31,109,209,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,107,107,0.12),_transparent_60%)]" />
                          <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6b6b]/30 bg-[#fff6f6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff6b6b]">
                              <svg className="h-3.5 w-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h12l4 4v12a2 2 0 0 1-2 2H4V4z" />
                                <path d="M16 4v4h4" />
                              </svg>
                              Comunicado interno
                            </div>
                            <h3 className="mt-4 text-2xl font-bold text-[#1a2732]">{item.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#5b6b78]">{item.excerpt}</p>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                              <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8a98a5]">
                                {item.dateLabel} · {item.authorLabel} · {item.expiresLabel}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {formattedAnnouncements.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {formattedAnnouncements.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex ? "w-8 bg-[#1f6dd1]" : "w-2.5 bg-[#d6dde3] hover:bg-[#1f6dd1]/40"
                    }`}
                    aria-label={`Ir para comunicado ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <PortalCard
            badge={<Badge label="Cursos" tone="primary" icon={ICONS.course} />}
            title="Cursos e treinamentos"
            description="Acesse sua trilha de treinamento com conteúdos técnicos e humanos para evolução contínua."
            imageUrl="/images/portal/cursos.png"
            imageAlt="Cursos e treinamentos"
          >
            <a
              href="/portal-socio/cursos"
              className="inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae]"
            >
              Acessar cursos
            </a>
          </PortalCard>

          <PortalCard
            badge={<Badge label="Pega plantão" tone="primary" icon={ICONS.plantao} />}
            title={links.plantao?.title ?? "Pega plantão"}
            description={links.plantao?.description ?? ""}
            imageUrl="/images/portal/pega-plantao.png"
            imageAlt="Pega plantão"
          >
            <button
              type="button"
              onClick={() => setActiveLink(links.plantao)}
              className="inline-flex items-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
            >
              Ver detalhes
            </button>
          </PortalCard>

          <PortalCard
            badge={<Badge label="Antecipação" tone="coral" icon={ICONS.antecipacao} />}
            title={links.antecipacao?.title ?? "Antecipação"}
            description={links.antecipacao?.description ?? ""}
            imageUrl="/images/portal/antecipacao.png"
            imageAlt="Antecipação"
          >
            <a
              href="/portal-socio/antecipacao"
              className="inline-flex items-center gap-2 rounded-full bg-[#ff6b6b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#e85b5b]"
            >
              Ver orientações
            </a>
          </PortalCard>

          <PortalCard
            badge={<Badge label="Plano de saúde" tone="primary" icon={ICONS.plano} />}
            title={links["plano-saude"]?.title ?? "Plano de saúde"}
            description={links["plano-saude"]?.description ?? ""}
            imageUrl="/images/portal/plano-saude.png"
            imageAlt="Plano de saúde"
          >
            <a
              href="/portal-socio/plano-saude"
              className="inline-flex items-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
            >
              Informações do plano
            </a>
          </PortalCard>

          <PortalCard
            badge={<Badge label="Descontos" tone="muted" icon={ICONS.descontos} />}
            title="Descontos em parceiros"
            description="Benefícios exclusivos para associados em parceiros selecionados."
            className="border-[#e5e7eb] bg-white/80 opacity-70 hover:translate-y-0 hover:border-[#e5e7eb] hover:shadow-none"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d6dde3] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#8a98a5]">
              Em breve
            </div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#8a98a5]">
              Benefícios em construção
            </div>
          </PortalCard>
        </section>
      </div>

      <Modal
        open={Boolean(activeAnnouncement)}
        title={activeAnnouncement?.title}
        eyebrow="Comunicado interno"
        iconName="announcement"
        tone="coral"
        onClose={() => setActiveAnnouncement(null)}
      >
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {activeAnnouncement && (
            <div className="rounded-2xl border border-[#ffd1d1] bg-[#fff6f6] p-4">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#b85b5b]">
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M8 2v4M16 2v4M3 10h18" />
                  </svg>
                  {new Date(activeAnnouncement.published_at).toLocaleDateString("pt-BR")}
                </span>
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c2.5-4 13.5-4 16 0" />
                  </svg>
                  {activeAnnouncement.author_name ?? "Equipe Sou Arte"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                  {activeAnnouncement.expires_at
                    ? new Date(activeAnnouncement.expires_at).toLocaleDateString("pt-BR")
                    : "Sem prazo"}
                </span>
              </div>
            </div>
          )}
          <div className="mt-5 rounded-2xl border border-[#f0e4d7] bg-white/80 p-5 text-sm leading-relaxed text-[#3b4b5a]">
            {activeAnnouncement?.body}
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(activeLink)}
        title={activeLink?.title}
        eyebrow="Acesso rápido"
        iconName="link"
        tone="primary"
        onClose={() => setActiveLink(null)}
      >
        <p className="text-sm leading-relaxed text-[#3b4b5a]">{activeLink?.body}</p>
        {activeLink?.link_url && (
          <a
            href={activeLink.link_url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae]"
          >
            Acessar sistema
          </a>
        )}
      </Modal>
    </PortalShell>
  );
}
