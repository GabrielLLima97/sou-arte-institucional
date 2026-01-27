export type SiteKey = "sou-arte" | "clinica-sou-luz" | "sou-luz-assessoria";

type SiteConfig = {
  key: SiteKey;
  brand: string;
  title: string;
  template: string;
  description: string;
  keywords: string[];
  icon: string;
  ogImage: string;
};

export const siteConfigs: Record<SiteKey, SiteConfig> = {
  "sou-arte": {
    key: "sou-arte",
    brand: "Sou Arte em Cuidados",
    title: "Sou Arte em Cuidados | Saúde humanizada e multidisciplinar",
    template: "%s | Sou Arte em Cuidados",
    description:
      "Empresa multinacional em cuidados com a saúde, oferecendo serviços hospitalares, home care, gestão de escalas, suporte administrativo e cursos.",
    keywords: [
      "Sou Arte em Cuidados",
      "enfermagem",
      "home care",
      "serviços hospitalares",
      "gestão de escalas",
      "cursos em saúde",
      "cuidados domiciliares",
      "assistência multidisciplinar",
    ],
    icon: "/brand/icon.png",
    ogImage: "/brand/logo-retangular.png",
  },
  "clinica-sou-luz": {
    key: "clinica-sou-luz",
    brand: "Clínica Sou Luz",
    title: "Clínica Sou Luz | Saúde para a sua família",
    template: "%s | Clínica Sou Luz",
    description:
      "Clínica de reabilitação multiprofissional com atendimento hospitalar, ambulatorial e domiciliar, com equipe integrada para cada etapa da vida.",
    keywords: [
      "Clínica Sou Luz",
      "reabilitação multiprofissional",
      "clínica de reabilitação Porto Velho",
      "fonoaudiologia",
      "fisioterapia",
      "nutrição",
      "psicologia",
      "psicopedagogia",
      "terapia ocupacional",
      "clínica médica",
      "exames audiológicos",
      "home care",
      "atendimento domiciliar",
      "saúde infantil",
    ],
    icon: "/souluz/icone.png",
    ogImage: "/souluz/logo-retangular.png",
  },
  "sou-luz-assessoria": {
    key: "sou-luz-assessoria",
    brand: "Sou Luz Assessoria",
    title: "Sou Luz Assessoria | Gestão e auditoria em saúde",
    template: "%s | Sou Luz Assessoria",
    description:
      "Gestão, auditoria e consultoria em saúde para clínicas e empreendimentos que buscam eficiência, conformidade e resultados.",
    keywords: [
      "Sou Luz Assessoria",
      "gestão em saúde",
      "auditoria em saúde",
      "consultoria em credenciamento",
      "consultoria em saúde",
      "faturamento médico hospitalar",
      "assessoria em saúde",
      "gestão hospitalar",
      "indicadores em saúde",
      "compliance em saúde",
    ],
    icon: "/souluz/icone.png",
    ogImage: "/souluz/logo-retangular.png",
  },
};

export function resolveSiteByHost(hostname: string): SiteKey {
  const normalized = hostname.replace(/^www\./, "");

  if (normalized === "clinicasouluz.com.br") {
    return "clinica-sou-luz";
  }
  if (normalized === "souluzassessoria.com.br") {
    return "sou-luz-assessoria";
  }

  return "sou-arte";
}
