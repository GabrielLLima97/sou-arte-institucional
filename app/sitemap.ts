import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host") ?? "souarteemcuidados.com.br";
  const hostname = host.split(":")[0];
  const protocol = hostname.includes("localhost") ? "http" : "https";
  const siteUrl = `${protocol}://${hostname}`;
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
