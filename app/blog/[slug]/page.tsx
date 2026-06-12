/**
 * Cloudy Unicorn — Individual Blog Post Page
 * =============================================
 * Dynamic route for /blog/[slug].
 * Fetches from blog_posts table (separate from generated_pages).
 * Uses the same MDX renderer and premium styling as review pages.
 */

import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MdxContent } from "@/components/mdx/mdx-renderer";
import { JsonLd } from "@/components/seo/json-ld";
import type { BlogPost } from "@/lib/types";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const revalidate = 86400; // 24 hours

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published_status", "published");

  return (posts || []).map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, meta_description, cover_image_url")
    .eq("slug", slug)
    .eq("published_status", "published")
    .single();

  if (!post) {
    return { title: "Post Not Found" };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.cloudyunicorn.com";

  return {
    title: `${post.title} | Cloudy Unicorn`,
    description: post.meta_description,
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: "article",
      url: `${siteUrl}/blog/${slug}`,
      images: [
        {
          url: post.cover_image_url || "/logo.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
  };
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 250));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published_status", "published")
    .single();

  if (!post) {
    notFound();
  }

  const typedPost = post as BlogPost;
  const formattedDate = typedPost.published_at
    ? new Date(typedPost.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const readTime = estimateReadTime(typedPost.markdown_content);

  // Fetch related blog posts (same tags)
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("title, slug, meta_description, tags, published_at")
    .eq("published_status", "published")
    .neq("slug", slug)
    .limit(3);

  return (
    <>
      {/* JSON-LD Structured Data */}
      {typedPost.schema_markup && <JsonLd data={typedPost.schema_markup} />}

      <article className="max-w-[850px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 sm:pt-32 sm:pb-16">
        {/* Back Navigation */}
        <div className="mb-8 flex justify-center sm:justify-start">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate hover:text-ink transition-colors bg-surface border border-hairline px-4 py-2 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
        </div>

        {/* Cover Image */}
        {typedPost.cover_image_url && (
          <div className="mb-8 rounded-lg overflow-hidden border border-hairline">
            <img
              src={typedPost.cover_image_url}
              alt={typedPost.title}
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>
        )}

        {/* Page Header */}
        <header className="mb-10 text-center sm:text-left">
          {/* Tags */}
          {typedPost.tags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
              {typedPost.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs font-medium bg-brand-green/10 text-brand-green-deep border-brand-green/20 hover:bg-brand-green/20 rounded-full"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-ink leading-tight">
            {typedPost.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate text-sm">
            {formattedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readTime} min read
            </span>
          </div>
        </header>

        {/* MDX Content Body */}
        <div
          className="
          mdx-content break-words
          [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:bg-surface-code [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:border [&_pre]:border-hairline-dark [&_pre]:my-6 [&_pre]:text-on-dark
          [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:pb-4 [&_h2]:border-b [&_h2]:border-hairline [&_h2]:tracking-tight [&_h2]:text-ink

          [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:tracking-tight [&_h3]:text-ink

          [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-8 [&_h4]:mb-3 [&_h4]:text-ink

          [&_p]:text-base sm:[&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-charcoal [&_p]:mb-5

          [&_ul]:my-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2
          [&_ol]:my-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2
          [&_li]:text-charcoal [&_li]:text-base sm:[&_li]:text-lg [&_li]:leading-relaxed

          [&_strong]:text-ink [&_strong]:font-semibold

          [&_a]:text-brand-tag [&_a]:font-medium [&_a]:underline-offset-4 [&_a]:decoration-brand-tag/30 [&_a]:underline hover:[&_a]:text-brand-green-deep hover:[&_a]:decoration-brand-green-deep/50

          [&_blockquote]:border-l-4 [&_blockquote]:border-brand-green [&_blockquote]:bg-surface [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:rounded-r-md [&_blockquote]:text-charcoal [&_blockquote]:my-6 [&_blockquote]:italic

          [&_hr]:border-hairline [&_hr]:my-10

          [&_code]:text-sm [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-xs [&_code]:text-charcoal [&_code]:border [&_code]:border-hairline [&_code]:font-mono [&_code]:break-words [&_code]:whitespace-pre-wrap

          [&_table]:w-full [&_table]:border-collapse
          [&_thead]:bg-surface
          [&_th]:text-left [&_th]:px-4 [&_th]:py-3 [&_th]:text-sm [&_th]:font-semibold [&_th]:text-ink [&_th]:border-b [&_th]:border-hairline
          [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_td]:text-charcoal [&_td]:border-b [&_td]:border-hairline-soft
          [&_tr:last-child_td]:border-b-0
          [&_tbody_tr:nth-child(even)]:bg-surface-soft
          [&_tbody_tr]:transition-colors hover:[&_tbody_tr]:bg-surface
        "
        >
          <MdxContent source={typedPost.markdown_content} />
        </div>

        {/* Related Blog Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-hairline">
            <h3 className="text-2xl font-bold text-ink mb-6">Related articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map(
                (related: {
                  slug: string;
                  title: string;
                  meta_description: string;
                }) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`}>
                    <div className="p-4 rounded-lg border border-hairline bg-card hover:border-brand-green/30 hover:shadow-md hover:shadow-brand-green/5 transition-all duration-300 h-full flex flex-col justify-center">
                      <p className="font-semibold text-ink">
                        {related.title}
                      </p>
                      <p className="text-sm text-slate mt-1 line-clamp-2">
                        {related.meta_description}
                      </p>
                      <p className="text-sm text-brand-green-deep mt-2 flex items-center font-medium">
                        Read article{" "}
                        <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        )}

        {/* Separator */}
        <div className="h-px bg-hairline mt-16 mb-8" />

        {/* Footer */}
        <footer className="text-center py-8 bg-surface rounded-lg border border-hairline px-6">
          <p className="text-sm font-medium text-ink">
            Published on Cloudy Unicorn
          </p>
          {formattedDate && (
            <p className="text-xs text-slate mt-2">
              Last updated on {formattedDate}
            </p>
          )}
        </footer>
      </article>
    </>
  );
}
