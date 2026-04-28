import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CategoryToolCard } from "@/components/category-tool-card";
import { ArrowLeft, Layers, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Tool } from "@/lib/types";

export const revalidate = 86400; // 24 hours

export async function generateStaticParams() {
  const { data: tools } = await supabase
    .from("tools")
    .select("category")
    .eq("is_active", true);

  const categories = new Set((tools || []).map((t) => t.category));
  return Array.from(categories).map((category) => ({
    slug: category,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoryName = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return {
    title: `Best ${categoryName} Software & Tools | SoftRYT`,
    description: `Browse top-rated ${categoryName} tools. Read in-depth reviews and compare pricing, features, and alternatives to find the best software for your business.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoryName = slug.replace(/-/g, " ");

  // Fetch all active tools in this category
  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .eq("category", slug)
    .eq("is_active", true)
    .order("name");

  if (!tools || tools.length === 0) {
    notFound();
  }

  const typedTools = tools as Tool[];
  const toolIds = typedTools.map((t) => t.id);

  // Fetch all related generated pages (both reviews and comparisons)
  const { data: relatedPages } = await supabase
    .from("generated_pages")
    .select("slug, title, page_type, tool_a_id, tool_b_id")
    .eq("published_status", "published")
    .or(`tool_a_id.in.(${toolIds.join(",")}),tool_b_id.in.(${toolIds.join(",")})`);

  // Group pages by tool ID
  const reviewsByToolId: Record<string, string> = {}; // tool_id -> review_slug
  const comparisonsByToolId: Record<string, { slug: string; title: string; tool_a_id: string; tool_b_id: string }[]> = {};

  (relatedPages || []).forEach((page) => {
    if (page.page_type === "review" && page.tool_a_id) {
      reviewsByToolId[page.tool_a_id] = page.slug;
    } else if (page.page_type === "comparison" && page.tool_a_id && page.tool_b_id) {
      if (!comparisonsByToolId[page.tool_a_id]) comparisonsByToolId[page.tool_a_id] = [];
      if (!comparisonsByToolId[page.tool_b_id]) comparisonsByToolId[page.tool_b_id] = [];
      
      comparisonsByToolId[page.tool_a_id].push({
        slug: page.slug,
        title: page.title,
        tool_a_id: page.tool_a_id,
        tool_b_id: page.tool_b_id,
      });
      
      comparisonsByToolId[page.tool_b_id].push({
        slug: page.slug,
        title: page.title,
        tool_a_id: page.tool_a_id,
        tool_b_id: page.tool_b_id,
      });
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 min-h-screen">
      <div className="mb-12">
        <Link href="/#categories">
          <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to categories
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/30 border border-primary/20">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight capitalize">
            {categoryName} Tools
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Browse {tools.length} top-rated tools in the {categoryName} category. Read our in-depth reviews or compare them head-to-head to find the perfect fit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {typedTools.map((tool) => (
          <CategoryToolCard
            key={tool.id}
            tool={tool}
            reviewSlug={reviewsByToolId[tool.id]}
            comparisons={comparisonsByToolId[tool.id] || []}
          />
        ))}
      </div>
    </div>
  );
}
