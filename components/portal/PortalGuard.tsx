"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import type { User, UserRole } from "../../lib/types";

type GuardState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

type PortalGuardProps = {
  role: UserRole;
  loginPath: string;
  children: (state: GuardState) => JSX.Element;
};

export function PortalGuard({ role, loginPath, children }: PortalGuardProps) {
  const router = useRouter();
  const [state, setState] = useState<GuardState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const user = await apiFetch<User>("/auth/me");
        if (!active) {
          return;
        }
        if (user.role !== role) {
          setState({
            user,
            loading: false,
            error: "Acesso não autorizado. Faça login com um usuário do perfil correto.",
          });
          return;
        }
        setState({ user, loading: false, error: null });
      } catch (error) {
        if (!active) {
          return;
        }
        router.replace(loginPath);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [role, loginPath, router]);

  return children(state);
}
