/**
 * SoftRYT — Dynamic Sitemap Generator
 * =======================================
 * Generates an XML sitemap from all published pages in the database.
 * Next.js automatically serves this at /sitemap.xml.
 */

import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cloudyunicorn.com";

  // Fetch all published pages (range paginated)
  let pages: any[] = [];
  let from = 0;
  const limit = 1000;
  let hasMore = true;
  while (hasMore) {
    const { data } = await supabase
      .from("generated_pages")
      .select("slug, updated_at, page_type")
      .eq("published_status", "published")
      .order("updated_at", { ascending: false })
      .range(from, from + limit - 1);
    
    if (data && data.length > 0) {
      pages = pages.concat(data);
      if (data.length < limit) {
        hasMore = false;
      } else {
        from += limit;
      }
    } else {
      hasMore = false;
    }
  }

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
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dynamic comparison/review pages
  const dynamicPages: MetadataRoute.Sitemap = (pages || []).map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: "weekly" as const,
    priority: page.page_type === "comparison" ? 0.9 : page.page_type === "review" ? 0.85 : 0.8,
  }));

  // Fetch all published blog posts (range paginated)
  let blogPosts: any[] = [];
  let blogFrom = 0;
  let blogHasMore = true;
  while (blogHasMore) {
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published_status", "published")
      .order("updated_at", { ascending: false })
      .range(blogFrom, blogFrom + limit - 1);

    if (data && data.length > 0) {
      blogPosts = blogPosts.concat(data);
      if (data.length < limit) {
        blogHasMore = false;
      } else {
        blogFrom += limit;
      }
    } else {
      blogHasMore = false;
    }
  }

  const blogPages: MetadataRoute.Sitemap = (blogPosts || []).map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Fetch all active tools for alternatives and categories (range paginated)
  let tools: any[] = [];
  let toolsFrom = 0;
  let toolsHasMore = true;
  while (toolsHasMore) {
    const { data } = await supabase
      .from("tools")
      .select("slug, category, updated_at")
      .eq("is_active", true)
      .range(toolsFrom, toolsFrom + limit - 1);

    if (data && data.length > 0) {
      tools = tools.concat(data);
      if (data.length < limit) {
        toolsHasMore = false;
      } else {
        toolsFrom += limit;
      }
    } else {
      toolsHasMore = false;
    }
  }

  // Dynamic alternatives pages
  const alternativesPages: MetadataRoute.Sitemap = (tools || []).map((tool) => ({
    url: `${siteUrl}/alternatives/${tool.slug}`,
    lastModified: tool.updated_at ? new Date(tool.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  // Dynamic category pages (deduplicated)
  const uniqueCategories = Array.from(new Set((tools || []).map((tool) => tool.category)));
  const categoryPages: MetadataRoute.Sitemap = uniqueCategories.map((category) => ({
    url: `${siteUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...dynamicPages,
    ...blogPages,
    ...alternativesPages,
    ...categoryPages,
  ];
}
