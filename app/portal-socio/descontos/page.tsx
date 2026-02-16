"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "../../../components/portal/PortalShell";
import { apiFetch } from "../../../lib/api";
import type { Partner } from "../../../lib/types";

const NAV_LINKS = [
  { label: "Home", href: "/portal-socio" },
  { label: "Cursos", href: "/portal-socio/cursos" },
  { label: "Antecipação", href: "/portal-socio/antecipacao" },
  { label: "Plano de Saúde", href: "/portal-socio/plano-saude" },
  { label: "Descontos", href: "/portal-socio/descontos" },
];

export default function PortalSocioDescontosPage() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch<Partner[]>("/portal/partners");
        setPartners(data);
      } catch {
        setPartners([]);
      }
    };

    load();
  }, []);

  return (
    <PortalShell role="socio" loginPath="/portal-socio/login" title="Portal do Sócio" links={NAV_LINKS}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">Descontos</div>
          <h1 className="mt-3 text-3xl font-bold text-[#1a2732]">Parceiros exclusivos</h1>
          <p className="mt-3 text-sm text-[#5b6b78]">Benefícios ativos para o seu perfil no portal.</p>
        </div>

        {partners.length === 0 ? (
          <div className="rounded-3xl border border-[#e5e7eb] bg-white/90 p-8 text-sm text-[#8a98a5] shadow-lg shadow-[#1f6dd1]/5">
            Ainda não há benefícios disponíveis.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {partners.map((partner) => (
              <article
                key={partner.id}
                className="group overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-5 shadow-lg shadow-[#1f6dd1]/10 transition hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:shadow-2xl hover:shadow-[#1f6dd1]/15"
              >
                {partner.logo_url && (
                  <div className="mb-4 overflow-hidden rounded-2xl border border-white/70 bg-white/80">
                    <img
                      src={partner.logo_url}
                      alt={`Logo de ${partner.name}`}
                      className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <h2 className="text-xl font-bold text-[#1a2732]">{partner.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6b78]">{partner.description}</p>
                <a
                  href={partner.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae]"
                >
                  Acessar parceiro
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
