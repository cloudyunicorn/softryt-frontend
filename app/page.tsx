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
import { GlobalSearch } from "@/components/global-search";
import {
  Zap,
  ArrowRight,
  BarChart3,
  Shield,
  RefreshCw,
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

  // Fetch all searchable comparisons and reviews for the global search bar
  const { data: searchableItems } = await supabase
    .from("generated_pages")
    .select("slug, title, page_type, meta_description")
    .eq("published_status", "published");

  // Fetch tool categories and counts
  const { data: tools } = await supabase
    .from("tools")
    .select("name, logo_url, category")
    .eq("is_active", true);

  // Count tools per category
  const categoryCounts: Record<string, number> = {};
  (tools || []).forEach((tool) => {
    categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
  });

  // Extract and order featured tools for the logos row
  const targetFeaturedTools = [
    "Notion",
    "Figma",
    "Slack",
    "Vercel",
    "ChatGPT",
    "Claude",
    "Supabase",
    "Linear",
    "Monday.com",
    "ClickUp",
    "Asana",
    "Trello",
    "Jira",
    "GitHub Copilot",
    "Zoom",
    "Loom",
    "Canva",
    "PostHog",
    "Resend",
    "Gemini"
  ];

  const featuredTools = targetFeaturedTools
    .map((name) => (tools || []).find((t) => t.name.toLowerCase() === name.toLowerCase()))
    .filter((t): t is { name: string; logo_url: string; category: string } => !!(t && t.logo_url));

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
      <section id="hero" className="relative overflow-hidden bg-hero-glow bg-background">
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
              <span className="animate-text-gradient bg-clip-text text-transparent">
                right tool
              </span>{" "}
              for your team
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
              Data-driven SaaS comparisons powered by in-depth analysis
              and AI insights. Stop guessing, start comparing.
            </p>

            {/* Global Search Bar */}
            <GlobalSearch items={searchableItems || []} />

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

      {/* ── BRAND LOGOS ROW ────────────────────────────────── */}
      <section className="border-b border-hairline bg-canvas/30 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] uppercase tracking-[0.2em] font-semibold text-slate mb-8">
            Compare tools from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 max-w-5xl mx-auto">
            {featuredTools.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-2 text-slate hover:text-ink transition-colors duration-300 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-white/95 p-0.5 border border-hairline/60 flex items-center justify-center shrink-0 opacity-60 group-hover:opacity-100 transition-all duration-300">
                  <img
                    src={tool.logo_url}
                    alt={`${tool.name} Logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className="font-semibold text-sm tracking-wide">
                  {tool.name}
                </span>
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
                  <div className="font-semibold text-ink mb-1">{prop.title}</div>
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
              <Button
                variant="outline"
                size="sm"
                className="group rounded-full border border-brand-blue/30 bg-brand-blue/5 hover:bg-brand-blue/15 hover:border-brand-blue/60 text-brand-blue font-semibold px-4 py-1.5 transition-all duration-300 cursor-pointer shadow-sm shadow-brand-blue/5"
              >
                View all comparisons
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
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
              <Button
                variant="outline"
                size="sm"
                className="group rounded-full border border-brand-green/30 bg-brand-green/5 hover:bg-brand-green/15 hover:border-brand-green/60 text-brand-green-deep font-semibold px-4 py-1.5 transition-all duration-300 cursor-pointer shadow-sm shadow-brand-green/5"
              >
                View all reviews
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
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
              <Button
                variant="outline"
                size="sm"
                className="group rounded-full border border-brand-red/30 bg-brand-red/5 hover:bg-brand-red/15 hover:border-brand-red/60 text-brand-red font-semibold px-4 py-1.5 transition-all duration-300 cursor-pointer shadow-sm shadow-brand-red/5"
              >
                View all blog posts
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
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
                      <div className="font-semibold text-ink text-sm capitalize">
                        {category.replace(/-/g, " ")}
                      </div>
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

          {/* Social Sharing Widget */}
          <div className="mt-12 pt-8 border-t border-hairline max-w-sm mx-auto">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate mb-4">
              Share Cloudy Unicorn
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.cloudyunicorn.com&text=Find%20the%20right%20B2B%20SaaS%20tool%20for%20your%20team%20with%20AI-powered%20comparisons!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-hairline bg-card text-slate hover:text-brand-green-deep hover:bg-surface hover:border-brand-green/30 hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer"
                title="Share on X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.cloudyunicorn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-hairline bg-card text-slate hover:text-brand-green-deep hover:bg-surface hover:border-brand-green/30 hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer"
                title="Share on LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.cloudyunicorn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-hairline bg-card text-slate hover:text-brand-green-deep hover:bg-surface hover:border-brand-green/30 hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer"
                title="Share on Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


