"use client";

import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import type { User } from "../../lib/types";

export type PortalNavLink = {
  label: string;
  href: string;
};

type PortalHeaderProps = {
  title: string;
  links: PortalNavLink[];
  user: User;
};

export function PortalHeader({ title, links, user }: PortalHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      router.replace(user.role === "admin" ? "/portal-admin/login" : "/portal-socio/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <img src="/brand/logo-retangular.png" alt="Sou Arte em Cuidados" className="h-12 w-auto" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">{title}</div>
            <div className="text-lg font-bold text-[#1a2732]">Bem-vindo(a), {user.name}</div>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#1a2732]">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-full border px-3 py-2 transition ${
                  active
                    ? "border-[#1f6dd1] bg-[#f2f6ff] text-[#1f6dd1]"
                    : "border-transparent hover:border-[#1f6dd1]/30 hover:text-[#1f6dd1]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-[#ff6b6b]/40 px-3 py-2 text-[#ff6b6b] transition hover:bg-[#ffe3e3]"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
