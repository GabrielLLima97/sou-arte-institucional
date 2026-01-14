import "../globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ReactNode } from "react";
import { resolveSiteByHost, siteConfigs } from "../lib/site-config";

export function generateMetadata(): Metadata {
  const host = headers().get("host") ?? "souarteemcuidados.com.br";
  const hostname = host.split(":")[0];
  const protocol = hostname.includes("localhost") ? "http" : "https";
  const siteUrl = `${protocol}://${hostname}`;
  const site = siteConfigs[resolveSiteByHost(hostname)];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: site.title,
      template: site.template,
    },
    description: site.description,
    alternates: {
      canonical: "/",
    },
    keywords: site.keywords,
    openGraph: {
      type: "website",
      url: siteUrl,
      title: site.title,
      description: site.description,
      images: [
        {
          url: site.ogImage,
          alt: site.brand,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: [site.ogImage],
    },
    icons: {
      icon: site.icon,
      shortcut: site.icon,
      apple: site.icon,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
