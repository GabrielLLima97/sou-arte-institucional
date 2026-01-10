"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import type { User, UserRole } from "../../lib/types";

type LoginCardProps = {
  title: string;
  subtitle: string;
  role: UserRole;
  successPath: string;
};

export function LoginCard({ title, subtitle, role, successPath }: LoginCardProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const user = await apiFetch<User>("/auth/me");
      if (user.role !== role) {
        setError("Seu perfil não tem acesso a este portal.");
        return;
      }
      router.replace(successPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha no login.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl border border-white/80 bg-white/90 p-8 shadow-xl shadow-[#1f6dd1]/10">
      <div className="space-y-3 text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">{title}</div>
        <h1 className="text-3xl font-bold text-[#1a2732]">Acesso seguro</h1>
        <p className="text-sm text-[#5b6b78]">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="text-sm font-semibold text-[#2f4050]">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="seuemail@dominio.com"
            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
          />
        </label>
        <label className="text-sm font-semibold text-[#2f4050]">
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="********"
            className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
          />
        </label>

        {error && (
          <div className="rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#1f6dd1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
