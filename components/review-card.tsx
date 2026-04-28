import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import type { GeneratedPage } from "@/lib/types";

export function ReviewCard({ page }: { page: GeneratedPage }) {
  const formattedDate = new Date(page.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Extract tool name from title (e.g., "Notion Review (2026): Pricing, Features & Verdict")
  const titleParts = page.title.split(" Review");
  const toolName = titleParts[0]?.trim() || "Tool";

  return (
    <Link href={`/${page.slug}`}>
      <Card className="group h-full hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 border-border/50 bg-card/50 overflow-hidden flex flex-col">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="pb-3 flex-grow-0">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="secondary"
              className="text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border-0"
            >
              {page.page_type}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {page.view_count}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            {page.tool_a?.logo_url && (
              <img 
                src={page.tool_a.logo_url} 
                alt={`${toolName} Logo`} 
                className="w-10 h-10 rounded-xl border border-border/50 object-cover bg-white p-1"
              />
            )}
            <CardTitle className="text-xl leading-tight group-hover:text-emerald-500 transition-colors line-clamp-1">
              {toolName}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
            {page.meta_description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground/60 mt-auto">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
            <span className="text-emerald-500/80 font-medium group-hover:text-emerald-500 flex items-center gap-1 transition-colors">
              Read review
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
