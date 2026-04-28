import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Layers } from "lucide-react";
import type { Tool } from "@/lib/types";

interface CategoryToolCardProps {
  tool: Tool;
  reviewSlug?: string;
  comparisons: { slug: string; title: string; tool_a_id: string; tool_b_id: string }[];
}

export function CategoryToolCard({ tool, reviewSlug, comparisons }: CategoryToolCardProps) {
  return (
    <Card className="group h-full hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-card/50 overflow-hidden flex flex-col">
      <CardHeader className="pb-4 flex-grow-0 border-b border-border/30 bg-muted/10">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={`${tool.name} Logo`}
                className="w-14 h-14 rounded-2xl border border-border/50 object-cover bg-white p-1"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/30 rounded-2xl shadow-inner border border-primary/20 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {tool.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-grow">
            <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-1">
              {tool.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {tool.description || "In-depth overview and comparisons available."}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow pt-5 gap-5">
        {/* Review Action */}
        {reviewSlug ? (
          <Link href={`/${reviewSlug}`} className="block">
            <div className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center justify-between group/review">
              <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <BookOpen className="h-4 w-4" />
                Read Full Review
              </span>
              <ArrowRight className="h-4 w-4 text-emerald-500 group-hover/review:translate-x-1 transition-transform" />
            </div>
          </Link>
        ) : (
          <div className="w-full py-2.5 px-4 rounded-xl border border-border/30 bg-muted/20 flex items-center justify-between text-muted-foreground/50 cursor-not-allowed">
            <span className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              Review coming soon
            </span>
          </div>
        )}

        {/* Comparisons */}
        {comparisons && comparisons.length > 0 && (
          <div className="flex-grow flex flex-col">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <Layers className="h-4 w-4" />
              Compare {tool.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {comparisons.map((comp) => {
                // Extract the "other" tool name from the title
                // E.g., title = "Notion vs Coda: Complete Comparison (2026)"
                // if tool.name is "Notion", other tool is "Coda"
                const titlePrefix = comp.title.split(":")[0];
                const toolNames = titlePrefix.split(" vs ");
                const otherToolName = toolNames.find(n => n.trim() !== tool.name) || toolNames[1];

                return (
                  <Link key={comp.slug} href={`/${comp.slug}`}>
                    <Badge variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer py-1 px-2.5">
                      vs {otherToolName}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
