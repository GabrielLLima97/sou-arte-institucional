import type { MetadataRoute } from "next";

const siteUrl = "https://souarteemcuidados.com.br";

export default function robots(): MetadataRoute.Robots {
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
