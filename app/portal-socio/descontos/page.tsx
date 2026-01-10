"use client";

import { PortalShell } from "../../../components/portal/PortalShell";

const NAV_LINKS = [
  { label: "Home", href: "/portal-socio" },
  { label: "Cursos", href: "/portal-socio/cursos" },
  { label: "Antecipação", href: "/portal-socio/antecipacao" },
  { label: "Plano de Saúde", href: "/portal-socio/plano-saude" },
  { label: "Descontos", href: "/portal-socio/descontos" },
];

export default function PortalSocioDescontosPage() {
  return (
    <PortalShell role="socio" loginPath="/portal-socio/login" title="Portal do Sócio" links={NAV_LINKS}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">Descontos</div>
          <h1 className="mt-3 text-3xl font-bold text-[#1a2732]">Parceiros exclusivos</h1>
          <p className="mt-3 text-sm text-[#5b6b78]">
            Esta área está em construção para oferecer benefícios exclusivos aos associados.
          </p>
        </div>

        <div className="rounded-3xl border border-[#e5e7eb] bg-white/80 p-8 text-sm text-[#8a98a5] shadow-lg shadow-[#1f6dd1]/5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d6dde3] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#8a98a5]">
            <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12l-8 8-8-8 8-8z" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            Em breve
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#8a98a5]">
            Estamos finalizando os parceiros e condições especiais. Em breve, este espaço estará disponível no portal.
          </p>
        </div>
      </div>
    </PortalShell>
  );
}
