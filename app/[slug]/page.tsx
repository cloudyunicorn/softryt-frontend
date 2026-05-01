/**
 * SoftRYT — Dynamic Comparison Page
 * ====================================
 * Server component that renders AI-generated MDX comparison content.
 * 
 * KEY FEATURES:
 * - Incremental Static Regeneration (ISR) with 24-hour revalidation
 * - Dynamic metadata generation for SEO (title, description, OG tags)
 * - MDX rendering via next-mdx-remote with custom component mapping
 * - JSON-LD structured data for rich search results
 * - generateStaticParams for pre-rendering published pages at build time
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, ArrowLeft, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MdxContent } from "@/components/mdx/mdx-renderer";
import type { GeneratedPage } from "@/lib/types";

/**
 * ISR Configuration:
 * Revalidate cached pages every 24 hours (86400 seconds).
 */
export const revalidate = 86400;

/**
 * Pre-render all published pages at build time.
 */
export async function generateStaticParams() {
  const { data: pages } = await supabase
    .from("generated_pages")
    .select("slug")
    .eq("published_status", "published");

  return (pages || []).map((page) => ({
    slug: page.slug,
  }));
}

/**
 * Dynamic metadata generation for SEO.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { data: page } = await supabase
    .from("generated_pages")
    .select("title, meta_description, slug, updated_at")
    .eq("slug", slug)
    .eq("published_status", "published")
    .single();

  if (!page) {
    return {
      title: "Page Not Found | Cloudy Unicorn",
      description: "The requested comparison page could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cloudyunicorn.com";

  return {
    title: page.title,
    description: page.meta_description,
    openGraph: {
      title: page.title,
      description: page.meta_description,
      url: `${siteUrl}/${page.slug}`,
      siteName: "Cloudy Unicorn",
      type: "article",
      modifiedTime: page.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.meta_description,
    },
    alternates: {
      canonical: `${siteUrl}/${page.slug}`,
    },
  };
}

/**
 * Main page component.
 * Fetches page data from Supabase and passes raw MDX to the client renderer.
 */
export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: page } = await supabase
    .from("generated_pages")
    .select("*, tool_a:tools!tool_a_id(logo_url, slug), tool_b:tools!tool_b_id(logo_url, slug)")
    .eq("slug", slug)
    .eq("published_status", "published")
    .single();

  if (!page) {
    notFound();
  }

  const typedPage = page as GeneratedPage;
  const formattedDate = new Date(typedPage.updated_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Extract tool names from title (e.g., "Notion vs Coda" from "Notion vs Coda: Complete Comparison (2026)")
  const titleParts = typedPage.title.split(":");
  const titlePrefix = titleParts[0] || typedPage.title;
  const toolNamesStr = titlePrefix.split(" vs ");
  const toolAName = toolNamesStr[0]?.trim();
  const toolBName = toolNamesStr[1]?.trim();

  // Fetch review pages for both tools (if they exist)
  const toolASlug = (page as any).tool_a?.slug;
  const toolBSlug = (page as any).tool_b?.slug;

  const reviewSlugs = [
    toolASlug ? `review/${toolASlug}` : null,
    toolBSlug ? `review/${toolBSlug}` : null,
  ].filter(Boolean) as string[];

  const { data: reviewPages } = reviewSlugs.length > 0
    ? await supabase
        .from("generated_pages")
        .select("slug, title")
        .eq("published_status", "published")
        .eq("page_type", "review")
        .in("slug", reviewSlugs)
    : { data: null };

  return (
    <>
      {/* JSON-LD Structured Data */}
      {typedPage.schema_markup && (
        <JsonLd data={typedPage.schema_markup} />
      )}

      <article className="max-w-[850px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Back Navigation */}
        <div className="mb-8 flex justify-center sm:justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/80 px-4 py-2 rounded-full border border-border/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to comparisons
          </Link>
        </div>

        {/* Page Header */}
        <header className="mb-12 sm:mb-16 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-6">
            <Badge variant="secondary" className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border-0">
              {typedPage.page_type}
            </Badge>
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1.5 px-2">
              <Calendar className="h-3.5 w-3.5" />
              Updated {formattedDate}
            </span>
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1.5 px-2">
              <Eye className="h-3.5 w-3.5" />
              {typedPage.view_count.toLocaleString()} views
            </span>
          </div>

          {/* Tool Logos */}
          {(typedPage.tool_a?.logo_url || typedPage.tool_b?.logo_url) && (
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-8">
              {typedPage.tool_a?.logo_url && (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={typedPage.tool_a.logo_url}
                    alt={toolAName || "Tool A"}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-border/50 object-cover bg-white shadow-lg"
                  />
                  <span className="text-xs font-semibold text-foreground/70">{toolAName}</span>
                </div>
              )}
              <span className="text-sm font-bold text-muted-foreground/50 px-1">vs</span>
              {typedPage.tool_b?.logo_url && (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={typedPage.tool_b.logo_url}
                    alt={toolBName || "Tool B"}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-border/50 object-cover bg-white shadow-lg"
                  />
                  <span className="text-xs font-semibold text-foreground/70">{toolBName}</span>
                </div>
              )}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent leading-[1.15]">
            {typedPage.title}
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground/90 leading-relaxed max-w-[800px]">
            {typedPage.meta_description}
          </p>
        </header>

        {/* MDX Content Body */}
        <div className="
          mdx-content
          [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:mt-10 [&_h1]:mb-6 [&_h1]:tracking-tight
          [&_h1]:bg-gradient-to-r [&_h1]:from-blue-500 [&_h1]:to-indigo-400 [&_h1]:bg-clip-text [&_h1]:text-transparent

          [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:pb-4 [&_h2]:border-b [&_h2]:border-border/50 [&_h2]:tracking-tight
          [&_h2]:bg-gradient-to-r [&_h2]:from-blue-500 [&_h2]:to-indigo-400 [&_h2]:bg-clip-text [&_h2]:text-transparent

          [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:tracking-tight
          [&_h3]:bg-gradient-to-r [&_h3]:from-emerald-500 [&_h3]:to-teal-400 [&_h3]:bg-clip-text [&_h3]:text-transparent

          [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-8 [&_h4]:mb-3 [&_h4]:text-foreground

          [&_p]:text-base sm:[&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-foreground/80 [&_p]:mb-5

          [&_ul]:my-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2
          [&_ol]:my-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2
          [&_li]:text-foreground/80 [&_li]:text-base sm:[&_li]:text-lg [&_li]:leading-relaxed

          [&_strong]:text-foreground [&_strong]:font-semibold

          [&_a]:text-blue-500 [&_a]:font-medium [&_a]:underline-offset-4 [&_a]:decoration-blue-500/30 [&_a]:underline hover:[&_a]:text-blue-400 hover:[&_a]:decoration-blue-400/50

          [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500/50 [&_blockquote]:bg-muted/30 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:rounded-r-xl [&_blockquote]:text-foreground/90 [&_blockquote]:my-6 [&_blockquote]:italic

          [&_hr]:border-border/50 [&_hr]:my-10

          [&_code]:text-sm [&_code]:bg-muted/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-foreground/90 [&_code]:font-mono

          [&_table]:w-full [&_table]:border-collapse
          [&_thead]:bg-muted/50
          [&_th]:text-left [&_th]:px-4 [&_th]:py-3 [&_th]:text-sm [&_th]:font-semibold [&_th]:text-foreground [&_th]:border-b [&_th]:border-border/50
          [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_td]:text-foreground/80 [&_td]:border-b [&_td]:border-border/30
          [&_tr:last-child_td]:border-b-0
          [&_tbody_tr:nth-child(even)]:bg-muted/20
          [&_tbody_tr]:transition-colors hover:[&_tbody_tr]:bg-muted/30
        ">
          <MdxContent source={typedPage.markdown_content} toolAName={toolAName} toolBName={toolBName} toolALogo={typedPage.tool_a?.logo_url} toolBLogo={typedPage.tool_b?.logo_url} />
        </div>

        {/* Cross-link to individual reviews */}
        {reviewPages && reviewPages.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              <h3 className="text-xl font-bold">Read individual reviews</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviewPages.map((review) => {
                const reviewToolName = review.title.split(" Review")[0];
                const isToolA = review.slug.includes(toolASlug || "");
                const logoUrl = isToolA ? typedPage.tool_a?.logo_url : typedPage.tool_b?.logo_url;
                return (
                  <Link key={review.slug} href={`/${review.slug}`}>
                    <div className="group p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors flex items-center gap-4">
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt={reviewToolName}
                          className="w-10 h-10 rounded-xl border border-border/50 object-cover bg-white p-1"
                        />
                      )}
                      <div className="flex-grow">
                        <p className="font-semibold text-foreground">{reviewToolName} Review</p>
                        <p className="text-sm text-muted-foreground">Pricing, features & verdict</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Cross-link to alternatives */}
        {(toolASlug || toolBSlug) && (
          <div className="mt-12 pt-8 border-t border-border/50">
            <h3 className="text-xl font-bold mb-6">Explore Alternatives</h3>
            <div className="flex flex-wrap gap-4">
              {toolASlug && (
                <Link href={`/alternatives/${toolASlug}`}>
                  <Button variant="outline" className="gap-2 bg-muted/20">
                    View {toolAName} Alternatives
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              {toolBSlug && (
                <Link href={`/alternatives/${toolBSlug}`}>
                  <Button variant="outline" className="gap-2 bg-muted/20">
                    View {toolBName} Alternatives
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Separator */}
        <div className="h-px bg-border/50 mt-16 mb-8" />

        {/* Footer CTA */}
        <footer className="text-center py-8 bg-muted/20 rounded-3xl border border-border/50 px-6">
          <p className="text-sm font-medium text-foreground/80">
            Last updated on {formattedDate}. Pricing and features may have
            changed since our last review.
          </p>
          <p className="text-xs text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
            Some links on this page are affiliate links. We may earn a
            commission at no extra cost to you, which helps support our research.
          </p>
        </footer>
      </article>
    </>
  );
}
