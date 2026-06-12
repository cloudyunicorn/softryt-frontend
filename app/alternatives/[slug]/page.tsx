import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 86400; // 24 hours

export async function generateStaticParams() {
  const { data: tools } = await supabase
    .from("tools")
    .select("slug")
    .eq("is_active", true);

  return (tools || []).map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: tool } = await supabase
    .from("tools")
    .select("name, category")
    .eq("slug", slug)
    .single();

  if (!tool) {
    return {
      title: "Alternatives Not Found",
    };
  }

  const categoryFormatted = tool.category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cloudyunicorn.com";

  const desc = `Looking for the best alternative to ${tool.name}? Discover, compare, and analyze the top ${categoryFormatted} tools and software solutions for your team in 2026.`;

  return {
    title: `Best ${tool.name} Alternatives & Competitors (2026)`,
    description: desc,
    openGraph: {
      title: `Best ${tool.name} Alternatives & Competitors (2026)`,
      description: desc,
      type: "website",
      url: `${siteUrl}/alternatives/${slug}`,
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: `Best ${tool.name} Alternatives & Competitors (2026)`,
        },
      ],
    },
    alternates: {
      canonical: `${siteUrl}/alternatives/${slug}`,
    },
  };
}

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch the main tool
  const { data: tool } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!tool) {
    notFound();
  }

  // Fetch alternatives in the same category
  const { data: alternatives } = await supabase
    .from("tools")
    .select("*")
    .eq("category", tool.category)
    .neq("slug", tool.slug)
    .eq("is_active", true)
    .order("name");

  // Fetch reviews to link to them if they exist
  const { data: reviewPages } = await supabase
    .from("generated_pages")
    .select("slug, tool_a_id")
    .eq("published_status", "published")
    .eq("page_type", "review");

  // Map review slugs by tool_id for easy lookup
  const reviewMap: Record<string, string> = {};
  if (reviewPages) {
    reviewPages.forEach((page) => {
      reviewMap[page.tool_a_id] = page.slug;
    });
  }

  const categoryFormatted = tool.category.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 sm:pt-32 sm:pb-16">
      {/* Back Navigation */}
      {reviewMap[tool.id] && (
        <div className="mb-8 flex justify-center sm:justify-start">
          <Link
            href={`/${reviewMap[tool.id]}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate hover:text-ink transition-colors bg-surface border border-hairline px-4 py-2 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {tool.name} review
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="text-center sm:text-left mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-ink">
          Best {tool.name} Alternatives
        </h1>
        <p className="text-lg text-slate max-w-2xl mx-auto sm:mx-0">
          Looking for an alternative to {tool.name}? We've compiled the best {categoryFormatted} tools to help you find the perfect fit for your team in 2026.
        </p>
      </div>

      {/* Alternatives Grid */}
      {alternatives && alternatives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alternatives.map((alt) => {
            const reviewSlug = reviewMap[alt.id];
            
            return (
              <Card key={alt.id} className="flex flex-col h-full bg-card border border-hairline rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  {alt.logo_url ? (
                    <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center p-2 border border-hairline shadow-sm shrink-0">
                      <img src={alt.logo_url} alt={`${alt.name} logo`} className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-brand-tag/15 border border-brand-tag/25 flex items-center justify-center shrink-0">
                      <span className="text-brand-tag font-bold text-lg">{alt.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl text-ink">{alt.name}</CardTitle>
                    <CardDescription className="text-slate line-clamp-1 mt-1">{alt.description || `${alt.name} is a powerful ${categoryFormatted} tool.`}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-charcoal leading-relaxed text-sm">
                    {alt.name} is an excellent alternative to {tool.name}. It offers competitive pricing and features specifically designed for modern teams looking for a reliable {categoryFormatted} solution.
                  </p>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-3 pt-2">
                  <Link href={`/api/go/${alt.slug}`} target="_blank" rel="nofollow noopener noreferrer" className="flex-1 min-w-[120px]">
                    <Button className="w-full bg-ink hover:bg-charcoal text-canvas rounded-full transition-colors font-medium">
                      Visit Website <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  {reviewSlug && (
                    <Link href={`/${reviewSlug}`} className="flex-1 min-w-[120px]">
                      <Button variant="outline" className="w-full rounded-full border border-hairline text-ink hover:bg-surface transition-colors font-medium">
                        Read Review <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-hairline rounded-lg bg-surface">
          <p className="text-slate">We couldn't find any direct alternatives to {tool.name} in our database yet.</p>
        </div>
      )}
    </div>
  );
}
