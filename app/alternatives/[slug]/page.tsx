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

  return {
    title: `Best ${tool.name} Alternatives & Competitors (2026)`,
    description: `Looking for an alternative to ${tool.name}? Discover and compare the best ${categoryFormatted} tools and software in 2026.`,
    openGraph: {
      title: `Best ${tool.name} Alternatives & Competitors (2026)`,
      description: `Looking for an alternative to ${tool.name}? Discover and compare the best ${categoryFormatted} tools and software in 2026.`,
      type: "website",
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
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back Navigation */}
      <div className="mb-8 flex justify-center sm:justify-start">
        <Link
          href={`/review/${tool.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/80 px-4 py-2 rounded-full border border-border/50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {tool.name} review
        </Link>
      </div>

      {/* Header */}
      <div className="text-center sm:text-left mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
          Best {tool.name} Alternatives
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto sm:mx-0">
          Looking for an alternative to {tool.name}? We've compiled the best {categoryFormatted} tools to help you find the perfect fit for your team in 2026.
        </p>
      </div>

      {/* Alternatives Grid */}
      {alternatives && alternatives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alternatives.map((alt) => {
            const reviewSlug = reviewMap[alt.id];
            
            return (
              <Card key={alt.id} className="flex flex-col h-full bg-card/50 hover:bg-card border-border/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  {alt.logo_url ? (
                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center p-2 shadow-sm shrink-0">
                      <img src={alt.logo_url} alt={`${alt.name} logo`} className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-bold text-lg">{alt.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{alt.name}</CardTitle>
                    <CardDescription className="line-clamp-1 mt-1">{alt.description || `${alt.name} is a powerful ${categoryFormatted} tool.`}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-foreground/80 leading-relaxed text-sm">
                    {alt.name} is an excellent alternative to {tool.name}. It offers competitive pricing and features specifically designed for modern teams looking for a reliable {categoryFormatted} solution.
                  </p>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-3 pt-2">
                  <Link href={alt.affiliate_url || alt.website_url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px]">
                    <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors">
                      Visit Website <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  {reviewSlug && (
                    <Link href={`/${reviewSlug}`} className="flex-1 min-w-[120px]">
                      <Button variant="outline" className="w-full">
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
        <div className="text-center py-16 border border-border/50 rounded-2xl bg-muted/20">
          <p className="text-muted-foreground">We couldn't find any direct alternatives to {tool.name} in our database yet.</p>
        </div>
      )}
    </div>
  );
}
