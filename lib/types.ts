export type UserRole = "admin" | "socio";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string | null;
  uf: string | null;
  admission_date: string | null;
  profession: string | null;
  active: boolean;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  published_at: string;
  expires_at: string | null;
  target_cities: string[];
  target_professions: string[];
  author_name: string | null;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  access_url: string;
  target_cities: string[];
  target_professions: string[];
  created_at: string;
};

export type Partner = {
  id: string;
  name: string;
  description: string;
  link_url: string;
  logo_url: string | null;
  target_cities: string[];
  target_professions: string[];
};

export type PortalLink = {
  id: string;
  slug: "plantao" | "antecipacao" | "plano-saude";
  title: string;
  description: string;
  body: string;
  link_url: string;
};
