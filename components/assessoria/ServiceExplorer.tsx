"use client";

import { useState } from "react";
import { ArrowUpRight, Plus, Minus, Check } from "lucide-react";
import {
  assessoriaServices,
  assessoriaContactHref,
} from "../../lib/assessoria";
import styles from "./assessoria.module.css";

export function ServiceExplorer() {
  const [selected, setSelected] = useState<string | null>(
    assessoriaServices[0].id,
  );
  return (
    <div className={styles.services}>
      {assessoriaServices.map((service, index) => {
        const open = selected === service.id;
        return (
          <article key={service.id} className={styles.service} data-open={open}>
            <h3>
              <button
                id={`service-${service.id}`}
                type="button"
                aria-expanded={open}
                aria-controls={`panel-${service.id}`}
                onClick={() => setSelected(open ? null : service.id)}
                className={styles.serviceToggle}
              >
                <span className={styles.serviceNumber}>0{index + 1}</span>
                <span>{service.title}</span>
                <span className={styles.serviceSymbol}>
                  {open ? (
                    <Minus size={20} aria-hidden="true" />
                  ) : (
                    <Plus size={20} aria-hidden="true" />
                  )}
                </span>
              </button>
            </h3>
            <div
              id={`panel-${service.id}`}
              role="region"
              aria-labelledby={`service-${service.id}`}
              hidden={!open}
              className={styles.servicePanel}
            >
              <p className={styles.serviceLead}>{service.short}</p>
              <p>{service.description}</p>
              <ul>
                {service.scope.map((item) => (
                  <li key={item}>
                    <Check size={15} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className={styles.serviceFocus}>{service.focus}</p>
              <a
                href={assessoriaContactHref(service.title)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.textLink}
              >
                Conversar sobre esta solução{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
