"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "../../../components/portal/PortalShell";
import { PortalCard } from "../../../components/portal/PortalCard";
import { Modal } from "../../../components/portal/Modal";
import { apiFetch } from "../../../lib/api";
import type { Course } from "../../../lib/types";

const NAV_LINKS = [
  { label: "Home", href: "/portal-socio" },
  { label: "Cursos", href: "/portal-socio/cursos" },
  { label: "Antecipação", href: "/portal-socio/antecipacao" },
  { label: "Plano de Saúde", href: "/portal-socio/plano-saude" },
  { label: "Descontos", href: "/portal-socio/descontos" },
];

export default function PortalSocioCursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch<Course[]>("/portal/courses");
        setCourses(data);
      } catch (error) {
        setCourses([]);
      }
    };

    load();
  }, []);

  return (
    <PortalShell role="socio" loginPath="/portal-socio/login" title="Portal do Sócio" links={NAV_LINKS}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Cursos e treinamentos</div>
          <h1 className="mt-3 text-3xl font-bold text-[#1a2732]">Sua trilha de desenvolvimento</h1>
          <p className="mt-3 text-sm text-[#5b6b78]">
            Conteúdos técnicos e humanos para aprimorar sua atuação e fortalecer a assistência.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.length === 0 && (
            <div className="rounded-3xl border border-white/70 bg-white/90 p-6 text-sm text-[#5b6b78]">
              Nenhum curso disponível no momento.
            </div>
          )}
          {courses.map((course) => (
            <PortalCard
              key={course.id}
              title={course.title}
              description={course.description}
              imageUrl={course.image_url ?? undefined}
              imageAlt={`Imagem do curso ${course.title}`}
            >
              <button
                type="button"
                onClick={() => setActiveCourse(course)}
                className="inline-flex items-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
              >
                Ver detalhes
              </button>
              <a
                href={course.access_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff6b6b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#e85b5b]"
              >
                Acessar curso
              </a>
            </PortalCard>
          ))}
        </div>
      </div>

      <Modal
        open={Boolean(activeCourse)}
        title={activeCourse?.title}
        eyebrow="Curso e treinamento"
        iconName="course"
        tone="primary"
        onClose={() => setActiveCourse(null)}
      >
        {activeCourse?.image_url && (
          <div className="mb-4 overflow-hidden rounded-2xl border border-white/70 bg-white/80">
            <div className="relative">
              <img
                src={activeCourse.image_url}
                alt={`Imagem do curso ${activeCourse.title}`}
                className="h-40 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2732]/35 via-transparent to-transparent opacity-80" />
            </div>
          </div>
        )}
        <p className="text-sm leading-relaxed text-[#3b4b5a]">{activeCourse?.description}</p>
        {activeCourse?.access_url && (
          <a
            href={activeCourse.access_url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae]"
          >
            Acessar plataforma
          </a>
        )}
      </Modal>
    </PortalShell>
  );
}
