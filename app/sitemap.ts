/**
 * SoftRYT — Dynamic Sitemap Generator
 * =======================================
 * Generates an XML sitemap from all published pages in the database.
 * Next.js automatically serves this at /sitemap.xml.
 */

import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://softryt.com";

  // Fetch all published pages
  const { data: pages } = await supabase
    .from("generated_pages")
    .select("slug, updated_at, page_type")
    .eq("published_status", "published")
    .order("updated_at", { ascending: false });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/comparisons`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Dynamic comparison/review pages
  const dynamicPages: MetadataRoute.Sitemap = (pages || []).map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: "weekly" as const,
    priority: page.page_type === "comparison" ? 0.9 : page.page_type === "review" ? 0.85 : 0.8,
  }));

  return [...staticPages, ...dynamicPages];
}
