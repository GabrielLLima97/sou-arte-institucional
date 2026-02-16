const sortByPtBr = (a: string, b: string) => a.localeCompare(b, "pt-BR");

export const DEFAULT_CITY_OPTIONS = [
  "Porto Velho",
  "Ji-Paraná",
  "Cacoal",
  "Vila Velha",
  "Rio Branco",
];

export const DEFAULT_PROFESSION_OPTIONS = [
  "Enfermeiro(a)",
  "Técnico(a) de Enfermagem",
  "Farmacêutico(a)",
  "Biomédico(a)",
  "Psicólogo(a)",
  "Nutricionista",
];

export const buildAudienceOptions = (
  values: Array<string | null | undefined>,
  fallbackOptions: string[] = [],
) =>
  Array.from(
    new Set(
      [...fallbackOptions, ...values]
        .map((value) => (value ?? "").trim())
        .filter(Boolean),
    ),
  ).sort(sortByPtBr);
