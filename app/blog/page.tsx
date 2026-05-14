/**
 * Cloudy Unicorn — Blog Listing Page
 * ======================================
 * Displays all published blog posts in a responsive grid.
 * Fetches from blog_posts table (separate from generated_pages).
 */

import { supabase } from "@/lib/supabase";
import { BlogCard } from "@/components/blog-card";
import type { BlogPost } from "@/lib/types";
import { PenLine, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 86400; // 24 hours

export const metadata = {
  title: "Blog | Cloudy Unicorn",
  description:
    "Insights, trends, and deep dives into B2B SaaS, AI tools, and enterprise technology from the Cloudy Unicorn team.",
};

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published_status", "published")
    .order("published_at", { ascending: false });

  const typedPosts = (posts || []) as BlogPost[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 min-h-screen">
      <div className="mb-10">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 -ml-3 text-muted-foreground hover:text-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Blog
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Insights, trends, and deep dives into B2B SaaS, AI tools, and
          enterprise technology.
        </p>
      </div>

      {typedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {typedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-border/50 rounded-2xl bg-muted/10">
          <PenLine className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No blog posts yet
          </h3>
          <p className="text-sm text-muted-foreground/60">
            Blog posts will appear here once published.
          </p>
        </div>
      )}
    </div>
  );
}
