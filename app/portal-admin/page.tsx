"use client";

import { PortalShell } from "../../components/portal/PortalShell";
import { PortalCard } from "../../components/portal/PortalCard";
import { Icon } from "../../components/Icons";

const NAV_LINKS = [
  { label: "Dashboard", href: "/portal-admin" },
  { label: "Usuários", href: "/portal-admin/usuarios" },
  { label: "Comunicados", href: "/portal-admin/comunicados" },
  { label: "Cursos", href: "/portal-admin/cursos" },
  { label: "Benefícios", href: "/portal-admin/beneficios" },
];

const Badge = ({ label, icon, tone }: { label: string; icon: JSX.Element; tone: "primary" | "coral" | "muted" }) => {
  const tones = {
    primary: "border-[#1f6dd1]/30 bg-[#f2f6ff] text-[#1f6dd1]",
    coral: "border-[#ff6b6b]/30 bg-[#fff6f6] text-[#ff6b6b]",
    muted: "border-[#d6dde3] bg-white text-[#8a98a5]",
  };
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${tones[tone]}`}>
      {icon}
      {label}
    </div>
  );
};

export default function PortalAdminHomePage() {
  return (
    <PortalShell role="admin" loginPath="/portal-admin/login" title="Portal Administrativo" links={NAV_LINKS}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Gestão administrativa</div>
          <h1 className="mt-3 text-3xl font-bold text-[#1a2732]">Controle institucional</h1>
          <p className="mt-3 text-sm text-[#5b6b78]">
            Gerencie usuários, comunicados internos e cursos com eficiência e padrão profissional.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <PortalCard
            badge={<Badge label="Usuários" tone="primary" icon={<Icon name="network" className="h-4 w-4" />} />}
            title="Gestão de usuários"
            description="Crie acessos administrativos ou de sócios, mantenha informações atualizadas e controle de permissão."
          >
            <a
              href="/portal-admin/usuarios"
              className="inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae]"
            >
              <Icon name="network" className="h-4 w-4" />
              Acessar usuários
            </a>
          </PortalCard>

          <PortalCard
            badge={<Badge label="Comunicados" tone="coral" icon={<Icon name="chat" className="h-4 w-4" />} />}
            title="Gestão de comunicados"
            description="Crie, edite e publique comunicados internos com data e informações oficiais."
          >
            <a
              href="/portal-admin/comunicados"
              className="inline-flex items-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
            >
              <Icon name="chat" className="h-4 w-4" />
              Administrar comunicados
            </a>
          </PortalCard>

          <PortalCard
            badge={<Badge label="Cursos" tone="primary" icon={<Icon name="graduation" className="h-4 w-4" />} />}
            title="Gestão de treinamentos"
            description="Cadastre cursos, descrições e links de acesso para o portal do sócio."
          >
            <a
              href="/portal-admin/cursos"
              className="inline-flex items-center gap-2 rounded-full border border-[#ff6b6b]/40 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#ff6b6b] transition hover:-translate-y-0.5 hover:bg-[#ffe3e3]"
            >
              <Icon name="graduation" className="h-4 w-4" />
              Administrar cursos
            </a>
          </PortalCard>

          <PortalCard
            badge={<Badge label="Benefícios" tone="muted" icon={<Icon name="briefcase" className="h-4 w-4" />} />}
            title="Gestão de parceiros"
            description="Cadastre parceiros e benefícios para exibir no portal do sócio."
          >
            <a
              href="/portal-admin/beneficios"
              className="inline-flex items-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
            >
              <Icon name="briefcase" className="h-4 w-4" />
              Administrar benefícios
            </a>
          </PortalCard>
        </div>
      </div>
    </PortalShell>
  );
}
