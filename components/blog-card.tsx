/**
 * Cloudy Unicorn — Blog Post Card
 * =================================
 * Card component for blog listing page with title, excerpt, tags, and date.
 */

import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 250));
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Draft";

  const readTime = estimateReadTime(post.markdown_content);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="relative overflow-hidden rounded-lg border border-hairline bg-card transition-all duration-300 hover:border-brand-green/35 hover:shadow-md hover:shadow-brand-green/5 hover:-translate-y-1 h-full flex flex-col">
        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="aspect-[2/1] overflow-hidden">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Gradient accent bar when no image */}
        {!post.cover_image_url && (
          <div className="h-1.5 bg-gradient-to-r from-brand-green to-brand-green-deep" />
        )}

        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
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
          <h3 className="text-lg sm:text-xl font-bold text-ink group-hover:text-brand-green-deep transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-slate line-clamp-3 mb-4 flex-1">
            {post.meta_description}
          </p>

          {/* Meta row */}
          <div className="flex items-center justify-between pt-3 border-t border-hairline-soft">
            <div className="flex items-center gap-3 text-xs text-slate/70">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readTime} min read
              </span>
            </div>

            <span className="text-xs font-semibold text-brand-green-deep flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Read <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
