/**
 * SoftRYT — Landing Page
 * ========================
 * Premium homepage with hero section, latest comparisons grid,
 * category browser, and CTA section.
 * 
 * Fetches published pages and tools from Supabase at build time
 * with ISR revalidation every 24 hours.
 */

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ComparisonCard } from "@/components/comparison-card";
import { ReviewCard } from "@/components/review-card";
import {
  Zap,
  ArrowRight,
  BarChart3,
  Shield,
  RefreshCw,
  Eye,
  Calendar,
  Layers,
  Code,
  Palette,
  MessageSquare,
  TrendingUp,
  Mail,
  Bot,
  Database,
} from "lucide-react";
import type { GeneratedPage } from "@/lib/types";

export const revalidate = 86400;

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  "project-management": <Layers className="h-5 w-5" />,
  "dev-tools": <Code className="h-5 w-5" />,
  design: <Palette className="h-5 w-5" />,
  communication: <MessageSquare className="h-5 w-5" />,
  analytics: <TrendingUp className="h-5 w-5" />,
  email: <Mail className="h-5 w-5" />,
  "ai-tools": <Bot className="h-5 w-5" />,
  cms: <Database className="h-5 w-5" />,
};

export default async function HomePage() {
// Fetch published comparison pages
  const { data: pages, count: totalComparisons } = await supabase
    .from("generated_pages")
    .select("*, tool_a:tools!tool_a_id(logo_url), tool_b:tools!tool_b_id(logo_url)", { count: "exact" })
    .eq("published_status", "published")
    .eq("page_type", "comparison")
    .order("updated_at", { ascending: false })
    .limit(12);

  // Fetch published review pages
  const { data: reviewPages } = await supabase
    .from("generated_pages")
    .select("*, tool_a:tools!tool_a_id(logo_url)")
    .eq("published_status", "published")
    .eq("page_type", "review")
    .order("updated_at", { ascending: false })
    .limit(6);

  // Fetch tool categories and counts
  const { data: tools } = await supabase
    .from("tools")
    .select("category")
    .eq("is_active", true);

  // Count tools per category
  const categoryCounts: Record<string, number> = {};
  (tools || []).forEach((tool) => {
    categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
  });

  const typedPages = (pages || []) as GeneratedPage[];
  const typedReviewPages = (reviewPages || []) as GeneratedPage[];

  let displayComparisonsCount = "0";
  if (totalComparisons) {
    if (totalComparisons >= 100) {
      displayComparisonsCount = `${Math.floor(totalComparisons / 100) * 100}+`;
    } else if (totalComparisons >= 10) {
      displayComparisonsCount = `${Math.floor(totalComparisons / 10) * 10}+`;
    } else {
      displayComparisonsCount = `${totalComparisons}`;
    }
  }

  return (
    <>
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-muted/30 backdrop-blur-sm text-sm text-muted-foreground mb-6">
              <Zap className="h-3.5 w-3.5 text-blue-500" />
              AI-powered SaaS comparison engine
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Find the{" "}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                right tool
              </span>{" "}
              for your team
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Data-driven SaaS comparisons powered by in-depth analysis
              and AI insights. Stop guessing, start comparing.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#comparisons">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 px-8 h-12 text-base"
                >
                  Browse Comparisons
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#reviews">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 px-8 h-12 text-base"
                >
                  Browse Reviews
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#categories">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border/60 hover:bg-muted/50 h-12 px-8 text-base"
                >
                  Explore Categories
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16">
            {[
              { label: "Tools Tracked", value: (tools || []).length + "+" },
              { label: "Comparisons", value: displayComparisonsCount },
              { label: "Updated", value: "Weekly" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE PROPS ──────────────────────────────────── */}
      <section className="border-y border-border/30 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
                title: "Real Data",
                description:
                  "Pricing and features analyzed directly from official sources. No outdated info.",
              },
              {
                icon: <Shield className="h-5 w-5 text-emerald-500" />,
                title: "AI Fact-Checked",
                description:
                  "Every comparison is verified by a dedicated AI fact-checker for accuracy.",
              },
              {
                icon: <RefreshCw className="h-5 w-5 text-purple-500" />,
                title: "Always Fresh",
                description:
                  "Weekly analysis detects pricing changes and keeps content up to date.",
              },
            ].map((prop) => (
              <div key={prop.title} className="flex gap-4">
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-border/50 bg-muted/50">
                  {prop.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISONS GRID ─────────────────────────────── */}
      <section id="comparisons" className="scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-tight mb-3">
                Latest Comparisons
              </h2>
              <p className="text-muted-foreground max-w-lg">
                In-depth, AI-powered analysis of the most popular B2B SaaS tools
              </p>
            </div>
            <Link href="/comparisons">
              <Button variant="ghost" size="sm" className="group text-muted-foreground hover:text-primary">
                View all
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {typedPages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typedPages.map((page) => (
                <ComparisonCard key={page.id} page={page} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border/50 rounded-2xl bg-muted/10">
              <Zap className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No comparisons yet
              </h3>
              <p className="text-sm text-muted-foreground/60">
                Comparisons will appear here once analyzed by our AI.
              </p>
            </div>
          )}
        </div>
      </section>

      
      {/* ── REVIEWS GRID ─────────────────────────────── */}
      <section id="reviews" className="scroll-mt-20 border-t border-border/30 bg-muted/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-tight mb-3">
                Latest Reviews
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Deep dives into single B2B SaaS tools to help you decide
              </p>
            </div>
            <Link href="/reviews">
              <Button variant="ghost" size="sm" className="group text-emerald-500/70 hover:text-emerald-500">
                View all
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {typedReviewPages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typedReviewPages.map((page) => (
                <ReviewCard key={page.id} page={page} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border/50 rounded-2xl bg-muted/10">
              <Zap className="h-10 w-10 text-emerald-500/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No reviews yet
              </h3>
              <p className="text-sm text-muted-foreground/60">
                Reviews will appear here once analyzed by our AI.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section
        id="categories"
        className="scroll-mt-20 border-t border-border/30 bg-muted/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Browse by Category
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Explore tools across different B2B software categories
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <Link key={category} href={`/category/${category}`}>
                <Card
                  className="group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer border-border/50 bg-card/50 h-full"
                >
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 border border-border/50 group-hover:border-primary/20 transition-colors">
                    {categoryIcons[category] || (
                      <Layers className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm capitalize">
                      {category.replace(/-/g, " ")}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {count} tool{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <section className="border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Can&apos;t find the comparison you need?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            We&apos;re constantly adding new tools and comparisons. Check back
            soon or let us know what you&apos;d like to see.
          </p>
          <Link href="/comparisons">
            <Button
              size="lg"
              variant="outline"
              className="border-border/60 hover:bg-muted/50 h-12 px-8"
            >
              Browse All Comparisons
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}


