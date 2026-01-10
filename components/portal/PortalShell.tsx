"use client";

import type { ReactNode } from "react";
import type { UserRole } from "../../lib/types";
import { PortalGuard } from "./PortalGuard";
import { PortalHeader, type PortalNavLink } from "./PortalHeader";

type PortalShellProps = {
  role: UserRole;
  loginPath: string;
  title: string;
  links: PortalNavLink[];
  children: ReactNode;
};

export function PortalShell({ role, loginPath, title, links, children }: PortalShellProps) {
  return (
    <PortalGuard role={role} loginPath={loginPath}>
      {({ user, loading, error }) => {
        if (loading || !user) {
          return (
            <div className="min-h-screen bg-[#f6f1e8]">
              <div className="mx-auto max-w-screen-xl px-6 py-24 text-center text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">
                Carregando portal...
              </div>
            </div>
          );
        }

        if (error) {
          return (
            <div className="min-h-screen bg-[#f6f1e8]">
              <div className="mx-auto max-w-screen-xl px-6 py-24 text-center text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">
                {error}
                <div className="mt-6">
                  <a
                    href={loginPath}
                    className="inline-flex items-center justify-center rounded-full border border-[#1f6dd1]/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
                  >
                    Ir para o login
                  </a>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="min-h-screen bg-[#f6f1e8]">
            <PortalHeader title={title} links={links} user={user} />
            <main className="mx-auto max-w-screen-xl px-6 pb-16 pt-8">{children}</main>
          </div>
        );
      }}
    </PortalGuard>
  );
}
