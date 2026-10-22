"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { assessoriaContactHref } from "../../lib/assessoria";
import styles from "./assessoria.module.css";

const links = [
  { href: "#sobre", label: "A Sou Luz" },
  { href: "#servicos", label: "Soluções" },
  { href: "#metodo", label: "Nossa abordagem" },
  { href: "#contato", label: "Contato" },
];

export function AssessoriaHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    for (const id of ["inicio", ...links.map((link) => link.href.slice(1))]) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const viewport = window.matchMedia("(min-width: 960px)");
    const onResize = () => {
      if (viewport.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    viewport.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      viewport.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header ref={header} className={styles.header}>
      <div className={`${styles.container} ${styles.headerInner}`}>
        <a
          href="#inicio"
          className={styles.brand}
          aria-label="Sou Luz Assessoria, início"
          onClick={() => setOpen(false)}
        >
          <img
            src="/souluz/logo-retangular.png"
            alt="Sou Luz"
            width="1700"
            height="500"
          />
          <span>Assessoria em saúde</span>
        </a>
        <nav
          id="assessoria-navigation"
          className={styles.navigation}
          data-open={open}
          aria-label="Navegação principal"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            className={styles.mobileContact}
            href={assessoriaContactHref()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Fale com a nossa equipe{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </nav>
        <a
          className={styles.headerContact}
          href={assessoriaContactHref()}
          target="_blank"
          rel="noopener noreferrer"
        >
          Vamos conversar <ArrowUpRight size={17} aria-hidden="true" />
        </a>
        <button
          ref={toggle}
          className={styles.menuToggle}
          type="button"
          aria-controls="assessoria-navigation"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
