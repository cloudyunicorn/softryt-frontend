import { supabase } from "@/lib/supabase";
import { SearchableReviews } from "@/components/searchable-reviews";
import type { GeneratedPage } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 86400; // 24 hours

export const metadata = {
  title: "All SaaS Reviews | Cloudy Unicorn",
  description: "Browse our complete directory of in-depth, AI-analyzed reviews of the most popular B2B SaaS tools.",
};

export default async function ReviewsPage() {
  const { data: pages } = await supabase
    .from("generated_pages")
    .select("*, tool_a:tools!tool_a_id(logo_url)")
    .eq("published_status", "published")
    .eq("page_type", "review")
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
          All Reviews
        </h1>
        <p className="text-slate text-lg max-w-2xl leading-relaxed">
          Browse our complete directory of in-depth, AI-analyzed reviews of the most popular B2B SaaS tools.
        </p>
      </div>

      <SearchableReviews initialPages={typedPages} />
    </div>
  );
}
