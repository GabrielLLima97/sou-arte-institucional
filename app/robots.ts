import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "souarteemcuidados.com.br";
  const hostname = host.split(":")[0];
  const protocol = hostname.includes("localhost") ? "http" : "https";
  const siteUrl = `${protocol}://${hostname}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/portal-admin", "/portal-socio"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
