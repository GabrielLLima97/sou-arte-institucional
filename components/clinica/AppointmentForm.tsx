"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../Icons";

type AppointmentFormProps = {
  specialists: string[];
  whatsappNumber: string;
};

export function AppointmentForm({ specialists, whatsappNumber }: AppointmentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState(specialists[0] ?? "");

  const specialistSet = useMemo(() => new Set(specialists), [specialists]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const specialistFromQuery = url.searchParams.get("especialista");
    if (specialistFromQuery && specialistSet.has(specialistFromQuery)) {
      setSelectedSpecialist(specialistFromQuery);
    }
  }, [specialistSet]);

  const buildWhatsAppMessage = (data: FormData) => {
    const getValue = (name: string) => {
      const value = data.get(name);
      return typeof value === "string" ? value.trim() : "";
    };

    const lines: string[] = ["Agendamento - Clínica Sou Luz"];
    const addLine = (label: string, value: string) => {
      if (value) {
        lines.push(`${label}: ${value}`);
      }
    };

    addLine("Nome", getValue("Nome"));
    addLine("Telefone", getValue("Telefone"));
    addLine("Especialista", getValue("Especialista"));
    addLine("Necessidade", getValue("Necessidade"));
    return lines.join("\n");
  };

  const handleWhatsAppSubmit = () => {
    const form = formRef.current;
    if (!form || !form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    const message = buildWhatsAppMessage(data);
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(31,109,209,0.14)] transition hover:-translate-y-1 hover:border-[#1e6f78]/30 hover:bg-white hover:shadow-[0_22px_50px_rgba(31,109,209,0.2)]">
      <div className="text-base font-bold uppercase tracking-[0.35em] text-[#1e6f78]">Agende um horário</div>
      <h2 className="mt-3 font-[var(--font-display)] text-3xl font-extrabold text-[#1a2732] sm:text-4xl">
        Agendamento direcionado por especialidade
      </h2>
      <p className="mt-3 text-sm text-[#3a5250]">
        Preencha os dados e envie no WhatsApp com a especialidade selecionada para agilizar o atendimento.
      </p>

      <form ref={formRef} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-[#2f4050]">
            Nome
            <input
              name="Nome"
              type="text"
              placeholder="Seu nome completo"
              required
              className="mt-2 w-full rounded-2xl border border-[#d8e3e2] bg-white px-4 py-3 text-sm focus:border-[#1e6f78] focus:outline-none focus:ring-2 focus:ring-[#1e6f78]/20"
            />
          </label>

          <label className="text-sm font-semibold text-[#2f4050]">
            Telefone
            <input
              name="Telefone"
              type="tel"
              placeholder="(69) 99999-9999"
              required
              className="mt-2 w-full rounded-2xl border border-[#d8e3e2] bg-white px-4 py-3 text-sm focus:border-[#1e6f78] focus:outline-none focus:ring-2 focus:ring-[#1e6f78]/20"
            />
          </label>
        </div>

        <label className="text-sm font-semibold text-[#2f4050]">
          Especialista
          <select
            name="Especialista"
            required
            value={selectedSpecialist}
            onChange={(event) => setSelectedSpecialist(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#d8e3e2] bg-white px-4 py-3 text-sm focus:border-[#1e6f78] focus:outline-none focus:ring-2 focus:ring-[#1e6f78]/20"
          >
            {specialists.map((specialist) => (
              <option key={specialist} value={specialist}>
                {specialist}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-[#2f4050]">
          Necessidade
          <textarea
            name="Necessidade"
            rows={4}
            placeholder="Conte brevemente o motivo do atendimento e como podemos ajudar."
            required
            className="mt-2 w-full rounded-2xl border border-[#d8e3e2] bg-white px-4 py-3 text-sm focus:border-[#1e6f78] focus:outline-none focus:ring-2 focus:ring-[#1e6f78]/20"
          />
        </label>

        <button
          type="button"
          onClick={handleWhatsAppSubmit}
          className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1e6f78] px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-[#165a61]"
        >
          <Icon name="whatsapp" className="h-6 w-6" />
          Enviar agendamento no WhatsApp
        </button>
      </form>
    </div>
  );
}
