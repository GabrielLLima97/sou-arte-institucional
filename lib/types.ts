export type UserRole = "admin" | "socio";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  published_at: string;
  expires_at: string | null;
  author_name: string | null;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  access_url: string;
  created_at: string;
};

export type Partner = {
  id: string;
  name: string;
  description: string;
  link_url: string;
  logo_url: string | null;
};

export type PortalLink = {
  id: string;
  slug: "plantao" | "antecipacao" | "plano-saude";
  title: string;
  description: string;
  body: string;
  link_url: string;
};
