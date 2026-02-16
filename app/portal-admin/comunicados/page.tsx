"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "../../../components/portal/PortalShell";
import { Modal } from "../../../components/portal/Modal";
import { apiFetch } from "../../../lib/api";
import type { Announcement, User } from "../../../lib/types";

const NAV_LINKS = [
  { label: "Dashboard", href: "/portal-admin" },
  { label: "Usuários", href: "/portal-admin/usuarios" },
  { label: "Comunicados", href: "/portal-admin/comunicados" },
  { label: "Cursos", href: "/portal-admin/cursos" },
  { label: "Benefícios", href: "/portal-admin/beneficios" },
];

type AnnouncementPayload = {
  title: string;
  body: string;
  published_at: string;
  expires_at: string;
  target_cities: string[];
  target_professions: string[];
};

const getToday = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().split("T")[0];
};

const toMultiSelectValues = (event: React.ChangeEvent<HTMLSelectElement>) =>
  Array.from(event.target.selectedOptions, (option) => option.value);

const uniqueOptions = (values: Array<string | null>) =>
  Array.from(new Set(values.map((value) => (value ?? "").trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );

export default function PortalAdminComunicadosPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [professionOptions, setProfessionOptions] = useState<string[]>([]);
  const [form, setForm] = useState<AnnouncementPayload>({
    title: "",
    body: "",
    published_at: "",
    expires_at: "",
    target_cities: [],
    target_professions: [],
  });
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAnnouncements = async () => {
    try {
      const data = await apiFetch<Announcement[]>("/admin/announcements");
      setAnnouncements(data);
    } catch {
      setAnnouncements([]);
    }
  };

  const loadAudienceOptions = async () => {
    try {
      const users = await apiFetch<User[]>("/admin/users");
      setCityOptions(uniqueOptions(users.map((user) => user.city)));
      setProfessionOptions(uniqueOptions(users.map((user) => user.profession)));
    } catch {
      setCityOptions([]);
      setProfessionOptions([]);
    }
  };

  useEffect(() => {
    loadAnnouncements();
    loadAudienceOptions();
  }, []);

  useEffect(() => {
    setForm((prev) => ({ ...prev, published_at: getToday() }));
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const publishedAt = getToday();

    try {
      await apiFetch<Announcement>("/admin/announcements", {
        method: "POST",
        body: JSON.stringify({ ...form, published_at: publishedAt }),
      });
      setForm({
        title: "",
        body: "",
        published_at: publishedAt,
        expires_at: "",
        target_cities: [],
        target_professions: [],
      });
      await loadAnnouncements();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar comunicado.";
      setError(message);
    }
  };

  const handleUpdate = async () => {
    if (!editing) {
      return;
    }
    if (!editing.expires_at) {
      setError("Informe até quando o comunicado ficará visível.");
      return;
    }
    setError(null);
    try {
      await apiFetch<Announcement>(`/admin/announcements/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editing.title,
          body: editing.body,
          published_at: editing.published_at,
          expires_at: editing.expires_at,
          target_cities: editing.target_cities,
          target_professions: editing.target_professions,
        }),
      });
      setEditing(null);
      await loadAnnouncements();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar comunicado.";
      setError(message);
    }
  };

  const handleDelete = async (announcementId: string) => {
    setError(null);
    try {
      await apiFetch(`/admin/announcements/${announcementId}`, { method: "DELETE" });
      await loadAnnouncements();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir comunicado.";
      setError(message);
    }
  };

  return (
    <PortalShell role="admin" loginPath="/portal-admin/login" title="Portal Administrativo" links={NAV_LINKS}>
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Comunicados internos</div>
          <h1 className="mt-3 text-3xl font-bold text-[#1a2732]">Gerencie comunicados</h1>
          <p className="mt-3 text-sm text-[#5b6b78]">Publique informações oficiais para o portal do sócio.</p>
        </div>

        <form onSubmit={handleCreate} className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">Novo comunicado</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-[#2f4050]">
              Título
              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Data de publicação
              <input
                type="date"
                value={form.published_at}
                disabled
                readOnly
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-[#f7f4ef] px-4 py-3 text-sm text-[#8a98a5]"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Visível até
              <input
                type="date"
                value={form.expires_at}
                onChange={(event) => setForm({ ...form, expires_at: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
          </div>

          <label className="mt-4 text-sm font-semibold text-[#2f4050]">
            Conteúdo
            <textarea
              value={form.body}
              onChange={(event) => setForm({ ...form, body: event.target.value })}
              required
              rows={4}
              className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
            />
          </label>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-[#2f4050]">
              Cidades visíveis (opcional)
              <select
                multiple
                value={form.target_cities}
                onChange={(event) => setForm({ ...form, target_cities: toMultiSelectValues(event) })}
                className="mt-2 min-h-[120px] w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs font-medium text-[#8a98a5]">Sem seleção: todas as cidades.</span>
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Profissões visíveis (opcional)
              <select
                multiple
                value={form.target_professions}
                onChange={(event) => setForm({ ...form, target_professions: toMultiSelectValues(event) })}
                className="mt-2 min-h-[120px] w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              >
                {professionOptions.map((profession) => (
                  <option key={profession} value={profession}>
                    {profession}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs font-medium text-[#8a98a5]">Sem seleção: todas as profissões.</span>
            </label>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae]"
          >
            Publicar comunicado
          </button>
        </form>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Comunicados ativos</div>
          <div className="mt-4 space-y-4">
            {announcements.length === 0 && (
              <div className="text-sm text-[#5b6b78]">Nenhum comunicado cadastrado.</div>
            )}
            {announcements.map((item) => (
              <div key={item.id} className="rounded-3xl border border-[#f0e4d7] bg-white/90 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">
                      {new Date(item.published_at).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-[#1a2732]">{item.title}</div>
                    <div className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8a98a5]">
                      Publicado por {item.author_name ?? "Equipe Sou Arte"} · Válido até{" "}
                      {item.expires_at ? new Date(item.expires_at).toLocaleDateString("pt-BR") : "Sem prazo"}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(item)}
                      className="rounded-full border border-[#1f6dd1]/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6dd1] transition hover:bg-[#f2f6ff]"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-full border border-[#ff6b6b]/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b6b] transition hover:bg-[#ffe3e3]"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.target_cities.length === 0 ? (
                    <span className="rounded-full bg-[#f2f6ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f6dd1]">
                      Todas as cidades
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#f2f6ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f6dd1]">
                      Cidades: {item.target_cities.join(", ")}
                    </span>
                  )}
                  {item.target_professions.length === 0 ? (
                    <span className="rounded-full bg-[#fff7ea] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b8741e]">
                      Todas as profissões
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#fff7ea] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b8741e]">
                      Profissões: {item.target_professions.join(", ")}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-[#5b6b78]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(editing)}
        title="Editar comunicado"
        eyebrow="Comunicados internos"
        iconName="edit"
        tone="coral"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <div className="space-y-4">
            <label className="text-sm font-semibold text-[#2f4050]">
              Título
              <input
                type="text"
                value={editing.title}
                onChange={(event) => setEditing({ ...editing, title: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Data de publicação
              <input
                type="date"
                value={editing.published_at.split("T")[0]}
                disabled
                readOnly
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-[#f7f4ef] px-4 py-3 text-sm text-[#8a98a5]"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Visível até
              <input
                type="date"
                value={editing.expires_at ? editing.expires_at.split("T")[0] : ""}
                onChange={(event) => setEditing({ ...editing, expires_at: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Conteúdo
              <textarea
                value={editing.body}
                onChange={(event) => setEditing({ ...editing, body: event.target.value })}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-[#2f4050]">
                Cidades visíveis (opcional)
                <select
                  multiple
                  value={editing.target_cities}
                  onChange={(event) => setEditing({ ...editing, target_cities: toMultiSelectValues(event) })}
                  className="mt-2 min-h-[120px] w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-[#2f4050]">
                Profissões visíveis (opcional)
                <select
                  multiple
                  value={editing.target_professions}
                  onChange={(event) =>
                    setEditing({ ...editing, target_professions: toMultiSelectValues(event) })
                  }
                  className="mt-2 min-h-[120px] w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                >
                  {professionOptions.map((profession) => (
                    <option key={profession} value={profession}>
                      {profession}
                    </option>
                  ))}
                </select>
              </label>
            </div>

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
