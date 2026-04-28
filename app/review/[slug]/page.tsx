import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MdxContent } from "@/components/mdx/mdx-renderer";
import { JsonLd } from "@/components/seo/json-ld";
import type { GeneratedPage, PageSlug } from "@/lib/types";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const revalidate = 86400; // 24 hours

export async function generateStaticParams() {
  const { data: pages } = await supabase
    .from("generated_pages")
    .select("slug")
    .eq("published_status", "published")
    .eq("page_type", "review");

  return (pages || []).map((page: { slug: string }) => {
    // The slug in the database is "review/notion", but Next.js router passes "notion" as slug 
    // because this file is in app/review/[slug]/page.tsx
    const slugPart = page.slug.replace("review/", "");
    return {
      slug: slugPart,
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fullSlug = `review/${slug}`;

  const { data: page } = await supabase
    .from("generated_pages")
    .select("title, meta_description")
    .eq("slug", fullSlug)
    .eq("published_status", "published")
    .single();

  if (!page) {
    return {
      title: "Review Not Found",
    };
  }

  return {
    title: `${page.title} | SoftRYT`,
    description: page.meta_description,
    openGraph: {
      title: page.title,
      description: page.meta_description,
      type: "article",
    },
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fullSlug = `review/${slug}`;

  const { data: page } = await supabase
    .from("generated_pages")
    .select("*, tool_a:tools!tool_a_id(logo_url)")
    .eq("slug", fullSlug)
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

  // Extract tool name from title (e.g., "Notion Review (2026): Pricing, Features & Verdict")
  const titleParts = typedPage.title.split(" Review");
  const toolName = titleParts[0]?.trim() || "Tool";

  // Fetch cross-linked comparisons
  const { data: comparisons } = await supabase
    .from("generated_pages")
    .select("title, slug")
    .eq("published_status", "published")
    .eq("page_type", "comparison")
    .or(`tool_a_id.eq.${typedPage.tool_a_id},tool_b_id.eq.${typedPage.tool_a_id}`)
    .limit(5);

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
            href="/reviews"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/80 px-4 py-2 rounded-full border border-border/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to reviews
          </Link>
        </div>

        {/* Page Header is mostly handled by ReviewHero component inside MDX, but we show meta here */}
        <header className="mb-8 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1.5 px-2">
              <Calendar className="h-3.5 w-3.5" />
              Updated {formattedDate}
            </span>
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1.5 px-2">
              <Eye className="h-3.5 w-3.5" />
              {typedPage.view_count.toLocaleString()} views
            </span>
          </div>
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
          <MdxContent source={typedPage.markdown_content} toolAName={toolName} toolALogo={typedPage.tool_a?.logo_url} />
        </div>

        {/* Cross-linking Comparisons */}
        {comparisons && comparisons.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border/50">
            <h3 className="text-2xl font-bold mb-6">Compare {toolName} with alternatives</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {comparisons.map((comp) => (
                <Link key={comp.slug} href={`/${comp.slug}`}>
                  <div className="p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-colors h-full flex flex-col justify-center">
                    <p className="font-medium text-foreground">{comp.title.split(":")[0]}</p>
                    <p className="text-sm text-blue-500 mt-2 flex items-center">
                      Read comparison <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                    </p>
                  </div>
                </Link>
              ))}
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
