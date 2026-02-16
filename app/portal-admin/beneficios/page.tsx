"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "../../../components/portal/PortalShell";
import { Modal } from "../../../components/portal/Modal";
import { MultiOptionChecklist } from "../../../components/portal/MultiOptionChecklist";
import { apiFetch } from "../../../lib/api";
import {
  buildAudienceOptions,
  DEFAULT_CITY_OPTIONS,
  DEFAULT_PROFESSION_OPTIONS,
} from "../../../lib/audience-options";
import type { Partner, User } from "../../../lib/types";

const NAV_LINKS = [
  { label: "Dashboard", href: "/portal-admin" },
  { label: "Usuários", href: "/portal-admin/usuarios" },
  { label: "Comunicados", href: "/portal-admin/comunicados" },
  { label: "Cursos", href: "/portal-admin/cursos" },
  { label: "Benefícios", href: "/portal-admin/beneficios" },
];

type BenefitPayload = {
  name: string;
  description: string;
  link_url: string;
  logo_url: string;
  target_cities: string[];
  target_professions: string[];
};

export default function PortalAdminBeneficiosPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [professionOptions, setProfessionOptions] = useState<string[]>([]);
  const [form, setForm] = useState<BenefitPayload>({
    name: "",
    description: "",
    link_url: "",
    logo_url: "",
    target_cities: [],
    target_professions: [],
  });
  const [editing, setEditing] = useState<Partner | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPartners = async () => {
    try {
      const data = await apiFetch<Partner[]>("/admin/partners");
      setPartners(data);
    } catch {
      setPartners([]);
    }
  };

  const loadAudienceOptions = async () => {
    try {
      const users = await apiFetch<User[]>("/admin/users");
      setCityOptions(buildAudienceOptions(users.map((user) => user.city), DEFAULT_CITY_OPTIONS));
      setProfessionOptions(
        buildAudienceOptions(users.map((user) => user.profession), DEFAULT_PROFESSION_OPTIONS),
      );
    } catch {
      setCityOptions(DEFAULT_CITY_OPTIONS);
      setProfessionOptions(DEFAULT_PROFESSION_OPTIONS);
    }
  };

  useEffect(() => {
    loadPartners();
    loadAudienceOptions();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await apiFetch<Partner>("/admin/partners", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({
        name: "",
        description: "",
        link_url: "",
        logo_url: "",
        target_cities: [],
        target_professions: [],
      });
      await loadPartners();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar benefício.";
      setError(message);
    }
  };

  const handleUpdate = async () => {
    if (!editing) {
      return;
    }
    setError(null);
    try {
      await apiFetch<Partner>(`/admin/partners/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editing.name,
          description: editing.description,
          link_url: editing.link_url,
          logo_url: editing.logo_url ?? "",
          target_cities: editing.target_cities,
          target_professions: editing.target_professions,
        }),
      });
      setEditing(null);
      await loadPartners();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar benefício.";
      setError(message);
    }
  };

  const handleDelete = async (partnerId: string) => {
    setError(null);
    try {
      await apiFetch(`/admin/partners/${partnerId}`, { method: "DELETE" });
      await loadPartners();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir benefício.";
      setError(message);
    }
  };

  return (
    <PortalShell role="admin" loginPath="/portal-admin/login" title="Portal Administrativo" links={NAV_LINKS}>
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Benefícios e parceiros</div>
          <h1 className="mt-3 text-3xl font-bold text-[#1a2732]">Gestão de benefícios</h1>
          <p className="mt-3 text-sm text-[#5b6b78]">Cadastre parceiros e benefícios para exibir no portal do sócio.</p>
        </div>

        <form onSubmit={handleCreate} className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">Novo benefício</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-[#2f4050]">
              Nome do parceiro
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Link do parceiro
              <input
                type="url"
                value={form.link_url}
                onChange={(event) => setForm({ ...form, link_url: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Link do logo
              <input
                type="url"
                value={form.logo_url}
                onChange={(event) => setForm({ ...form, logo_url: event.target.value })}
                placeholder="https://"
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <MultiOptionChecklist
              label="Cidades visíveis (opcional)"
              options={cityOptions}
              selected={form.target_cities}
              onChange={(next) => setForm({ ...form, target_cities: next })}
              helperText="Sem seleção: todas as cidades."
              emptyText="Cadastre usuários com cidade para listar opções."
            />
            <MultiOptionChecklist
              label="Profissões visíveis (opcional)"
              options={professionOptions}
              selected={form.target_professions}
              onChange={(next) => setForm({ ...form, target_professions: next })}
              helperText="Sem seleção: todas as profissões."
              emptyText="Cadastre usuários com profissão para listar opções."
            />
          </div>

          <label className="mt-4 text-sm font-semibold text-[#2f4050]">
            Descrição do benefício
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
              rows={4}
              className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
            />
          </label>
          {error && (
            <div className="mt-4 rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae]"
          >
            Cadastrar benefício
          </button>
        </form>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Benefícios cadastrados</div>
          <div className="mt-4 space-y-4">
            {partners.length === 0 && <div className="text-sm text-[#5b6b78]">Nenhum benefício cadastrado.</div>}
            {partners.map((partner) => (
              <div key={partner.id} className="rounded-3xl border border-[#f0e4d7] bg-white/90 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-[#1a2732]">{partner.name}</div>
                    <p className="mt-2 text-sm text-[#5b6b78]">{partner.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {partner.target_cities.length === 0 ? (
                        <span className="rounded-full bg-[#f2f6ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f6dd1]">
                          Todas as cidades
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#f2f6ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f6dd1]">
                          Cidades: {partner.target_cities.join(", ")}
                        </span>
                      )}
                      {partner.target_professions.length === 0 ? (
                        <span className="rounded-full bg-[#fff7ea] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b8741e]">
                          Todas as profissões
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#fff7ea] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b8741e]">
                          Profissões: {partner.target_professions.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(partner)}
                      className="rounded-full border border-[#1f6dd1]/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6dd1] transition hover:bg-[#f2f6ff]"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(partner.id)}
                      className="rounded-full border border-[#ff6b6b]/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b6b] transition hover:bg-[#ffe3e3]"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
                <a
                  href={partner.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6dd1]"
                >
                  Visitar parceiro
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(editing)}
        title="Editar benefício"
        eyebrow="Benefícios e parceiros"
        iconName="benefit"
        tone="primary"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <div className="space-y-4">
            <label className="text-sm font-semibold text-[#2f4050]">
              Nome do parceiro
              <input
                type="text"
                value={editing.name}
                onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Link do parceiro
              <input
                type="url"
                value={editing.link_url}
                onChange={(event) => setEditing({ ...editing, link_url: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Link do logo
              <input
                type="url"
                value={editing.logo_url ?? ""}
                onChange={(event) => setEditing({ ...editing, logo_url: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <MultiOptionChecklist
                label="Cidades visíveis (opcional)"
                options={cityOptions}
                selected={editing.target_cities}
                onChange={(next) => setEditing({ ...editing, target_cities: next })}
                helperText="Sem seleção: todas as cidades."
                emptyText="Cadastre usuários com cidade para listar opções."
              />
              <MultiOptionChecklist
                label="Profissões visíveis (opcional)"
                options={professionOptions}
                selected={editing.target_professions}
                onChange={(next) => setEditing({ ...editing, target_professions: next })}
                helperText="Sem seleção: todas as profissões."
                emptyText="Cadastre usuários com profissão para listar opções."
              />
            </div>

            <label className="text-sm font-semibold text-[#2f4050]">
              Descrição do benefício
              <textarea
                value={editing.description}
                onChange={(event) => setEditing({ ...editing, description: event.target.value })}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <button
              type="button"
              onClick={handleUpdate}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae]"
            >
              Salvar alterações
            </button>
          </div>
        )}
      </Modal>
    </PortalShell>
  );
}
