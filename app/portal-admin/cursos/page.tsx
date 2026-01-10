"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "../../../components/portal/PortalShell";
import { Modal } from "../../../components/portal/Modal";
import { apiFetch } from "../../../lib/api";
import type { Course } from "../../../lib/types";

const NAV_LINKS = [
  { label: "Dashboard", href: "/portal-admin" },
  { label: "Usuários", href: "/portal-admin/usuarios" },
  { label: "Comunicados", href: "/portal-admin/comunicados" },
  { label: "Cursos", href: "/portal-admin/cursos" },
  { label: "Benefícios", href: "/portal-admin/beneficios" },
];

type CoursePayload = {
  title: string;
  description: string;
  image_url: string;
  access_url: string;
};

export default function PortalAdminCursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<CoursePayload>({
    title: "",
    description: "",
    image_url: "",
    access_url: "",
  });
  const [editing, setEditing] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    try {
      const data = await apiFetch<Course[]>("/admin/courses");
      setCourses(data);
    } catch (err) {
      setCourses([]);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await apiFetch<Course>("/admin/courses", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ title: "", description: "", image_url: "", access_url: "" });
      await loadCourses();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar curso.";
      setError(message);
    }
  };

  const handleUpdate = async () => {
    if (!editing) {
      return;
    }
    setError(null);
    try {
      await apiFetch<Course>(`/admin/courses/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editing.title,
          description: editing.description,
          image_url: editing.image_url ?? "",
          access_url: editing.access_url,
        }),
      });
      setEditing(null);
      await loadCourses();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar curso.";
      setError(message);
    }
  };

  const handleDelete = async (courseId: string) => {
    setError(null);
    try {
      await apiFetch(`/admin/courses/${courseId}`, { method: "DELETE" });
      await loadCourses();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir curso.";
      setError(message);
    }
  };

  return (
    <PortalShell role="admin" loginPath="/portal-admin/login" title="Portal Administrativo" links={NAV_LINKS}>
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Cursos e treinamentos</div>
          <h1 className="mt-3 text-3xl font-bold text-[#1a2732]">Gestão de cursos</h1>
          <p className="mt-3 text-sm text-[#5b6b78]">Cadastre cursos para o portal do sócio.</p>
        </div>

        <form onSubmit={handleCreate} className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">Novo curso</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-[#2f4050]">
              Nome do curso
              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Link de acesso
              <input
                type="url"
                value={form.access_url}
                onChange={(event) => setForm({ ...form, access_url: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Link da imagem
              <input
                type="url"
                value={form.image_url}
                onChange={(event) => setForm({ ...form, image_url: event.target.value })}
                placeholder="https://"
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
          </div>
          {form.image_url && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/70 bg-white/80">
              <div className="relative">
                <img
                  src={form.image_url}
                  alt="Prévia do curso"
                  className="h-40 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2732]/35 via-transparent to-transparent opacity-80" />
              </div>
            </div>
          )}
          <label className="mt-4 text-sm font-semibold text-[#2f4050]">
            Descrição
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
            Cadastrar curso
          </button>
        </form>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Cursos cadastrados</div>
          <div className="mt-4 space-y-4">
            {courses.length === 0 && <div className="text-sm text-[#5b6b78]">Nenhum curso cadastrado.</div>}
            {courses.map((course) => (
              <div
                key={course.id}
                className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-4 shadow-lg shadow-[#1f6dd1]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:shadow-2xl hover:shadow-[#1f6dd1]/20"
              >
                {course.image_url && (
                  <div className="mb-4 overflow-hidden rounded-2xl border border-white/70 bg-white/80">
                    <div className="relative">
                      <img
                        src={course.image_url}
                        alt={`Imagem do curso ${course.title}`}
                        className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2732]/35 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-[#1a2732]">{course.title}</div>
                    <p className="mt-2 text-sm text-[#5b6b78]">{course.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(course)}
                      className="rounded-full border border-[#1f6dd1]/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6dd1] transition hover:bg-[#f2f6ff]"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(course.id)}
                      className="rounded-full border border-[#ff6b6b]/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b6b] transition hover:bg-[#ffe3e3]"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(editing)}
        title="Editar curso"
        eyebrow="Cursos e treinamentos"
        iconName="course"
        tone="primary"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <div className="space-y-4">
            <label className="text-sm font-semibold text-[#2f4050]">
              Nome do curso
              <input
                type="text"
                value={editing.title}
                onChange={(event) => setEditing({ ...editing, title: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Link de acesso
              <input
                type="url"
                value={editing.access_url}
                onChange={(event) => setEditing({ ...editing, access_url: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Link da imagem
              <input
                type="url"
                value={editing.image_url ?? ""}
                onChange={(event) => setEditing({ ...editing, image_url: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            {editing.image_url && (
              <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/80">
                <div className="relative">
                  <img
                    src={editing.image_url}
                    alt={`Imagem do curso ${editing.title}`}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2732]/35 via-transparent to-transparent opacity-80" />
                </div>
              </div>
            )}
            <label className="text-sm font-semibold text-[#2f4050]">
              Descrição
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
