"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { assessoria, assessoriaServices } from "../../lib/assessoria";
import styles from "./assessoria.module.css";

export function AssessoriaContact() {
  const [service, setService] = useState("");
  const [institution, setInstitution] = useState("");
  const message = [
    "Olá! Gostaria de conversar com a Sou Luz Assessoria.",
    institution.trim() ? `Meu empreendimento: ${institution.trim()}.` : "",
    service
      ? `Tenho interesse em ${service}.`
      : "Gostaria de orientação para identificar a melhor solução para minha operação.",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={styles.contactForm}>
      <h3>Conte com um olhar especializado.</h3>
      <div className={styles.field}>
        <label htmlFor="assessoria-institution">
          Seu empreendimento <span>(opcional)</span>
        </label>
        <input
          id="assessoria-institution"
          name="organization"
          autoComplete="organization"
          placeholder="Nome da clínica ou instituição"
          maxLength={120}
          value={institution}
          onChange={(event) => setInstitution(event.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="assessoria-service">Como podemos ajudar?</label>
        <div className={styles.selectWrap}>
          <select
            id="assessoria-service"
            value={service}
            onChange={(event) => setService(event.target.value)}
          >
            <option value="">Quero orientação para a minha gestão</option>
            {assessoriaServices.map((item) => (
              <option key={item.id} value={item.title}>
                {item.title}
              </option>
            ))}
          </select>
          <ChevronDown size={18} aria-hidden="true" />
        </div>
      </div>
      <a
        href={`https://wa.me/${assessoria.whatsappNumber}?text=${encodeURIComponent(message)}`}
        className={`${styles.button} ${styles.buttonLight}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Iniciar conversa no WhatsApp{" "}
        <ArrowUpRight size={20} aria-hidden="true" />
      </a>
      <p className={styles.contactNote}>
        Os dados preenchidos serão incluídos em uma mensagem no WhatsApp.
        Revise e confirme o envio à nossa equipe por lá.
      </p>
    </div>
  );
}
