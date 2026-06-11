import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cloudyunicorn.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/go/", "/api/go/*"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
