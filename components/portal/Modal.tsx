"use client";

import { ReactNode, useEffect } from "react";

type ModalIconName = "announcement" | "course" | "link" | "edit" | "benefit" | "info";
type ModalTone = "primary" | "coral";

type ModalProps = {
  open: boolean;
  title?: string;
  eyebrow?: string;
  iconName?: ModalIconName;
  tone?: ModalTone;
  onClose: () => void;
  children: ReactNode;
};

const ICONS: Record<ModalIconName, JSX.Element> = {
  announcement: (
    <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h12l4 4v12a2 2 0 0 1-2 2H4V4z" />
      <path d="M16 4v4h4" />
      <path d="M7 12h10M7 16h6" />
    </svg>
  ),
  course: (
    <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16v12H4z" />
      <path d="M8 6v12M12 10h4" />
    </svg>
  ),
  link: (
    <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 1 0-5.7-5.7L11 7" />
      <path d="M14 10a4 4 0 0 0-5.7 0L5.7 12.6a4 4 0 1 0 5.7 5.7L13 17" />
    </svg>
  ),
  edit: (
    <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
    </svg>
  ),
  benefit: (
    <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 6 6 1-4.5 4.4L17 21l-5-2.7L7 21l1-7.6L3 9l6-1z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h2v5h-2z" />
    </svg>
  ),
};

const TONE_STYLES: Record<ModalTone, { accent: string; border: string; button: string; glow: string; iconBg: string }> = {
  primary: {
    accent: "text-[#1f6dd1]",
    border: "border-[#1f6dd1]/25",
    button: "border-[#1f6dd1]/20 text-[#1f6dd1] hover:bg-[#f2f6ff]",
    glow: "from-[#1f6dd1]/15 via-white to-[#ff6b6b]/10",
    iconBg: "bg-[#f2f6ff]",
  },
  coral: {
    accent: "text-[#ff6b6b]",
    border: "border-[#ff6b6b]/25",
    button: "border-[#ff6b6b]/30 text-[#ff6b6b] hover:bg-[#ffe3e3]",
    glow: "from-[#ff6b6b]/15 via-white to-[#1f6dd1]/10",
    iconBg: "bg-[#ffe3e3]",
  },
};

export function Modal({ open, title, eyebrow, iconName = "info", tone = "primary", onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const styles = TONE_STYLES[tone];
  const icon = ICONS[iconName] ?? ICONS.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute inset-0 bg-[#1a2732]/60 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/80 bg-white/95 shadow-2xl">
        <div className={`border-b border-white/70 bg-gradient-to-r ${styles.glow} px-6 py-5`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${styles.border} ${styles.iconBg} ${styles.accent}`}>
                {icon}
              </div>
              <div>
                {eyebrow && (
                  <div className={`text-xs font-semibold uppercase tracking-[0.35em] ${styles.accent}`}>{eyebrow}</div>
                )}
                {title ? <h3 className="text-2xl font-bold text-[#1a2732]">{title}</h3> : <span />}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${styles.button}`}
            >
              Fechar
            </button>
          </div>
        </div>
        <div className="px-6 pb-6 pt-5 text-sm leading-relaxed text-[#3b4b5a]">{children}</div>
      </div>
    </div>
  );
}
