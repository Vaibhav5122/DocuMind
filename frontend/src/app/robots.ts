import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://documind-ai.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/signup"],
        disallow: ["/dashboard", "/dashboard/*", "/chat", "/chat/*", "/api", "/api/*"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
