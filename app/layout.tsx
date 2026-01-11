import "../globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

const siteUrl = "https://souarteemcuidados.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sou Arte em Cuidados | Saúde humanizada e multidisciplinar",
    template: "%s | Sou Arte em Cuidados",
  },
  description:
    "Empresa multinacional em cuidados com a saúde, oferecendo serviços hospitalares, home care, gestão de escalas, suporte administrativo e cursos.",
  alternates: {
    canonical: "/",
  },
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
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Sou Arte em Cuidados | Saúde humanizada e multidisciplinar",
    description:
      "Ciência e sensibilidade em cada atendimento, com atuação hospitalar, domiciliar e administrativa.",
    images: [
      {
        url: "/brand/logo-retangular.png",
        alt: "Sou Arte em Cuidados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sou Arte em Cuidados | Saúde humanizada e multidisciplinar",
    description:
      "Ciência e sensibilidade em cada atendimento, com atuação hospitalar, domiciliar e administrativa.",
    images: ["/brand/logo-retangular.png"],
  },
  icons: {
    icon: "/brand/icon.png",
    shortcut: "/brand/icon.png",
    apple: "/brand/icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
