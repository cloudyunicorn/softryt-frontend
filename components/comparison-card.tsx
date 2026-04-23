import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, ArrowRight } from "lucide-react";
import type { GeneratedPage } from "@/lib/types";

export function ComparisonCard({ page }: { page: GeneratedPage }) {
  const formattedDate = new Date(page.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Extract tool names from title (e.g., "Notion vs Coda" from "Notion vs Coda: Complete Comparison (2026)")
  const titleParts = page.title.split(":");
  const toolNames = titleParts[0] || page.title;

  return (
    <Link href={`/${page.slug}`}>
      <Card className="group h-full hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-card/50 overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant="secondary"
              className="text-[10px] uppercase tracking-wider"
            >
              {page.page_type}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {page.view_count}
            </span>
          </div>
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
            {toolNames}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {page.meta_description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
            <span className="text-primary/80 font-medium group-hover:text-primary flex items-center gap-1 transition-colors">
              Read more
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
