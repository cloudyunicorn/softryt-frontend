import { supabase } from "@/lib/supabase";
import { ComparisonCard } from "@/components/comparison-card";
import type { GeneratedPage } from "@/lib/types";
import { Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 86400; // 24 hours

export const metadata = {
  title: "All SaaS Comparisons | Cloudy Unicorn",
  description: "Browse our complete directory of in-depth, AI-analyzed analysis and comparisons of the most popular B2B SaaS tools.",
};

export default async function ComparisonsPage() {
  const { data: pages } = await supabase
    .from("generated_pages")
    .select("*, tool_a:tools!tool_a_id(logo_url), tool_b:tools!tool_b_id(logo_url)")
    .eq("published_status", "published")
    .eq("page_type", "comparison")
    .order("updated_at", { ascending: false });

  const typedPages = (pages || []) as GeneratedPage[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-20 min-h-screen">
      <div className="mb-10">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-slate hover:text-ink hover:bg-surface rounded-md cursor-pointer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-ink mb-4">
          All Comparisons
        </h1>
        <p className="text-slate text-lg max-w-2xl leading-relaxed">
          Browse our complete directory of in-depth, AI-analyzed analysis and comparisons of the most popular B2B SaaS tools.
        </p>
      </div>

      {typedPages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {typedPages.map((page) => (
            <ComparisonCard key={page.id} page={page} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-hairline rounded-lg bg-surface">
          <Zap className="h-10 w-10 text-stone mx-auto mb-4" />
          <h3 className="text-lg font-medium text-ink mb-2">
            No comparisons yet
          </h3>
          <p className="text-sm text-slate">
            Comparisons will appear here once analyzed by our AI.
          </p>
        </div>
      )}
    </div>
  );
}
