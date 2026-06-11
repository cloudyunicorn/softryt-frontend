import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, ShieldCheck } from "lucide-react";
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
    <Card className="group relative h-full hover:border-brand-green/35 hover:shadow-md hover:shadow-brand-green/5 transition-all duration-300 border-hairline bg-card overflow-hidden flex flex-col rounded-lg">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-blue via-brand-red to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3 flex-grow-0">
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant="secondary"
            className="text-[10px] uppercase tracking-wider bg-brand-green/10 text-brand-green-deep border-brand-green/20 hover:bg-brand-green/20 rounded-full"
          >
            {page.page_type}
          </Badge>
        </div>
        
        <div className="flex items-center gap-3 mb-2">
          {page.tool_a?.logo_url && (
            <img 
              src={page.tool_a.logo_url} 
              alt={`${toolName} Logo`} 
              className="w-10 h-10 rounded-lg border border-hairline object-cover bg-white p-1"
            />
          )}
          <CardTitle className="text-xl leading-tight text-ink group-hover:text-brand-green-deep transition-colors line-clamp-1">
            <Link href={`/${page.slug}`} className="after:absolute after:inset-0 after:z-10">
              {toolName}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow">
        <p className="text-sm text-slate line-clamp-2 mb-4 flex-grow">
          {page.meta_description}
        </p>
        <div className="flex items-center justify-between text-xs text-slate/70 mt-auto">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
          <span className="text-brand-green-deep font-semibold group-hover:text-ink flex items-center gap-1 transition-colors">
            Read review
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
