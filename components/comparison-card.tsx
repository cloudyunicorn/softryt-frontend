import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
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
      <Card className="group h-full hover:border-brand-green/35 hover:shadow-md hover:shadow-brand-green/5 transition-all duration-300 border-hairline bg-card overflow-hidden rounded-lg">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-brand-blue via-brand-red to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="secondary"
              className="text-[10px] uppercase tracking-wider bg-brand-green/10 text-brand-green-deep border-brand-green/20 hover:bg-brand-green/20 rounded-full"
            >
              {page.page_type}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            {(page.tool_a?.logo_url || page.tool_b?.logo_url) && (
              <div className="flex -space-x-2">
                {page.tool_a?.logo_url && (
                  <img 
                    src={page.tool_a.logo_url} 
                    alt="Tool A Logo" 
                    className="w-8 h-8 rounded-full border-2 border-background object-cover bg-white"
                  />
                )}
                {page.tool_b?.logo_url && (
                  <img 
                    src={page.tool_b.logo_url} 
                    alt="Tool B Logo" 
                    className="w-8 h-8 rounded-full border-2 border-background object-cover bg-white"
                  />
                )}
              </div>
            )}
            <CardTitle className="text-lg leading-tight text-ink group-hover:text-brand-green-deep transition-colors line-clamp-1">
              {toolNames}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-slate line-clamp-2 mb-4">
            {page.meta_description}
          </p>
          <div className="flex items-center justify-between text-xs text-slate/70">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
            <span className="text-brand-green-deep font-semibold group-hover:text-ink flex items-center gap-1 transition-colors">
              Read comparison
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
