"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "../../../components/portal/PortalShell";
import { apiFetch } from "../../../lib/api";
import type { PortalLink } from "../../../lib/types";

const NAV_LINKS = [
  { label: "Home", href: "/portal-socio" },
  { label: "Cursos", href: "/portal-socio/cursos" },
  { label: "Antecipação", href: "/portal-socio/antecipacao" },
  { label: "Plano de Saúde", href: "/portal-socio/plano-saude" },
  { label: "Descontos", href: "/portal-socio/descontos" },
];

export default function PortalSocioPlanoPage() {
  const [info, setInfo] = useState<PortalLink | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch<PortalLink>("/portal/links/plano-saude");
        setInfo(data);
      } catch (error) {
        setInfo(null);
      }
    };

    load();
  }, []);

  return (
    <PortalShell role="socio" loginPath="/portal-socio/login" title="Portal do Sócio" links={NAV_LINKS}>
      <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg shadow-[#1f6dd1]/10">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Plano de saúde</div>
        <h1 className="mt-3 text-3xl font-bold text-[#1a2732]">Credenciamento e cobertura</h1>
        <p className="mt-3 text-sm text-[#5b6b78]">
          {info?.description ?? "Veja os requisitos de credenciamento e os canais oficiais do plano."}
        </p>
        <div className="mt-6 rounded-3xl border border-[#1f6dd1]/15 bg-[#f2f6ff] p-6 text-sm text-[#3b4b5a]">
          {info?.body ?? "Acesse o portal oficial para completar seu cadastro e acompanhar sua situacao."}
        </div>
        {info?.link_url && (
          <a
            href={info.link_url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae]"
          >
            Portal de credenciamento
          </a>
        )}
      </div>
    </PortalShell>
  );
}
