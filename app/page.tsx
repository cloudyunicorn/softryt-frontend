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
import { BlogCard } from "@/components/blog-card";
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
  PenLine,
} from "lucide-react";
import type { GeneratedPage, BlogPost } from "@/lib/types";

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

  // Fetch published blog posts
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published_status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

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
  const typedBlogPosts = (blogPosts || []) as BlogPost[];

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
      <section className="relative overflow-hidden bg-gradient-to-b from-hero-sky-from/35 via-hero-sky-to/15 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-hairline bg-card/85 backdrop-blur-sm text-sm font-medium text-slate mb-6 shadow-sm">
              <Zap className="h-3.5 w-3.5 text-brand-green-deep animate-pulse" />
              AI-powered SaaS comparison engine
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink mb-6">
              Find the{" "}
              <span className="bg-gradient-to-r from-brand-blue via-brand-red via-brand-yellow to-brand-green bg-clip-text text-transparent animate-gradient-xy">
                right tool
              </span>{" "}
              for your team
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
              Data-driven SaaS comparisons powered by in-depth analysis
              and AI insights. Stop guessing, start comparing.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
              <Link href="#comparisons" className="w-auto">
                <Button
                  size="lg"
                  className="rounded-full bg-ink text-canvas font-medium hover:bg-charcoal transition-all duration-300 px-5 sm:px-8 h-10 sm:h-12 text-sm sm:text-base shadow-sm cursor-pointer w-[215px] sm:w-[230px]"
                >
                  Browse Comparisons
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#reviews" className="w-auto">
                <Button
                  size="lg"
                  className="rounded-full border border-hairline bg-card text-ink font-medium hover:bg-surface transition-all duration-300 px-5 sm:px-8 h-10 sm:h-12 text-sm sm:text-base cursor-pointer w-[215px] sm:w-[230px]"
                >
                  Browse Reviews
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/blog" className="w-auto">
                <Button
                  size="lg"
                  className="rounded-full bg-brand-green text-canvas font-semibold hover:bg-brand-green-deep transition-all duration-300 px-5 sm:px-8 h-10 sm:h-12 text-sm sm:text-base shadow-sm shadow-brand-green/15 cursor-pointer w-[215px] sm:w-[230px]"
                >
                  Read our Blog
                  <PenLine className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#categories" className="w-auto">
                <Button
                  size="lg"
                  className="rounded-full border border-hairline bg-card text-ink font-medium hover:bg-surface transition-all duration-300 px-5 sm:px-8 h-10 sm:h-12 text-sm sm:text-base cursor-pointer w-[215px] sm:w-[230px]"
                >
                  Explore Categories
                  <Layers className="ml-2 h-4 w-4 text-brand-yellow" />
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
                className="text-center p-4 rounded-lg border border-hairline bg-card/40 backdrop-blur-sm shadow-sm"
              >
                <p className="text-2xl font-bold text-ink">
                  {stat.value}
                </p>
                <p className="text-xs text-slate mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE PROPS ──────────────────────────────────── */}
      <section className="border-y border-hairline bg-surface-soft/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-5 w-5 text-brand-tag" />,
                title: "Real Data",
                description:
                  "Pricing and features analyzed directly from official sources. No outdated info.",
              },
              {
                icon: <Shield className="h-5 w-5 text-brand-green-deep" />,
                title: "AI Fact-Checked",
                description:
                  "Every comparison is verified by a dedicated AI fact-checker for accuracy.",
              },
              {
                icon: <RefreshCw className="h-5 w-5 text-brand-tag" />,
                title: "Always Fresh",
                description:
                  "Weekly analysis detects pricing changes and keeps content up to date.",
              },
            ].map((prop) => (
              <div key={prop.title} className="flex gap-4">
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg border border-hairline bg-card shadow-sm">
                  {prop.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-ink mb-1">{prop.title}</h3>
                  <p className="text-sm text-slate leading-relaxed">
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
              <h2 className="text-3xl font-bold tracking-tight text-ink mb-3">
                Latest Comparisons
              </h2>
              <p className="text-slate max-w-lg">
                In-depth, AI-powered analysis of the most popular B2B SaaS tools
              </p>
            </div>
            <Link href="/comparisons">
              <Button variant="ghost" size="sm" className="group text-slate hover:text-ink font-medium cursor-pointer">
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
            <div className="text-center py-20 border border-dashed border-hairline rounded-lg bg-surface">
              <Zap className="h-10 w-10 text-stone mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium text-ink mb-2">
                No comparisons yet
              </h3>
              <p className="text-sm text-slate">
                Comparisons will appear here once analyzed by our AI.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── REVIEWS GRID ─────────────────────────────── */}
      <section id="reviews" className="scroll-mt-20 border-t border-hairline bg-surface-soft/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-tight text-ink mb-3">
                Latest Reviews
              </h2>
              <p className="text-slate max-w-lg">
                Deep dives into single B2B SaaS tools to help you decide
              </p>
            </div>
            <Link href="/reviews">
              <Button variant="ghost" size="sm" className="group text-brand-green-deep hover:text-ink font-semibold cursor-pointer">
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
            <div className="text-center py-20 border border-dashed border-hairline rounded-lg bg-card">
              <Zap className="h-10 w-10 text-brand-green-deep mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium text-ink mb-2">
                No reviews yet
              </h3>
              <p className="text-sm text-slate">
                Reviews will appear here once analyzed by our AI.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── BLOG SECTION ───────────────────────────────────── */}
      <section id="blog" className="scroll-mt-20 border-t border-hairline bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-tight text-ink mb-3">
                Latest Blog Posts
              </h2>
              <p className="text-slate max-w-lg">
                Stay updated with the latest SaaS insights, trends, and technology analyses.
              </p>
            </div>
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="group text-slate hover:text-ink font-medium cursor-pointer">
                View all blog posts
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {typedBlogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typedBlogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-hairline rounded-lg bg-surface-soft/40">
              <PenLine className="h-10 w-10 text-stone mx-auto mb-4" />
              <h3 className="text-lg font-medium text-ink mb-2">
                No blog posts yet
              </h3>
              <p className="text-sm text-slate">
                Check back soon for latest insights from our team.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section
        id="categories"
        className="scroll-mt-20 border-t border-hairline bg-surface-soft/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-ink mb-3">
              Browse by Category
            </h2>
            <p className="text-slate max-w-lg mx-auto">
              Explore tools across different B2B software categories
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <Link key={category} href={`/category/${category}`}>
                <Card
                  className="group hover:border-brand-green/35 hover:shadow-md hover:shadow-brand-green/5 transition-all duration-300 cursor-pointer border-hairline bg-card rounded-lg h-full"
                >
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-surface border border-hairline group-hover:border-brand-green/20 group-hover:text-brand-green-deep transition-colors text-slate">
                      {categoryIcons[category] || (
                        <Layers className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink text-sm capitalize">
                        {category.replace(/-/g, " ")}
                      </h3>
                      <p className="text-xs text-slate mt-0.5">
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
      <section className="border-t border-hairline bg-surface-soft/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-4">
            Can&apos;t find the comparison you need?
          </h2>
          <p className="text-slate mb-8 max-w-md mx-auto">
            We&apos;re constantly adding new tools and comparisons. Check back
            soon or let us know what you&apos;d like to see.
          </p>
          <Link href="/comparisons">
            <Button
              size="lg"
              className="rounded-full border border-hairline bg-card text-ink hover:bg-surface font-semibold h-12 px-8 shadow-sm cursor-pointer"
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


