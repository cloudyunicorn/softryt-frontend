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
    <Card className="group h-full hover:border-brand-green/30 hover:shadow-md hover:shadow-brand-green/5 transition-all duration-300 border-hairline bg-card rounded-lg overflow-hidden flex flex-col">
      <CardHeader className="pb-4 flex-grow-0 border-b border-hairline bg-surface/50">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={`${tool.name} Logo`}
                className="w-14 h-14 rounded-lg border border-hairline object-cover bg-white p-1"
              />
            ) : (
              <div className="w-14 h-14 bg-brand-tag/15 rounded-lg border border-brand-tag/25 flex items-center justify-center">
                <span className="text-xl font-bold text-brand-tag">
                  {tool.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-grow">
            <CardTitle className="text-xl leading-tight text-ink line-clamp-1 mb-1 font-semibold">
              {tool.name}
            </CardTitle>
            <p className="text-sm text-slate line-clamp-2 leading-relaxed">
              {tool.description || "In-depth overview and comparisons available."}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow pt-5 gap-5">
        {/* Review Action */}
        {reviewSlug ? (
          <Link href={`/${reviewSlug}`} className="block">
            <div className="w-full py-2.5 px-4 rounded-full border border-brand-green/30 bg-brand-green/10 hover:bg-brand-green/20 transition-colors flex items-center justify-between group/review">
              <span className="flex items-center gap-2 text-sm font-semibold text-brand-green-deep">
                <BookOpen className="h-4 w-4" />
                Read Full Review
              </span>
              <ArrowRight className="h-4 w-4 text-brand-green-deep group-hover/review:translate-x-1 transition-transform" />
            </div>
          </Link>
        ) : (
          <div className="w-full py-2.5 px-4 rounded-full border border-hairline bg-surface/50 flex items-center justify-between text-steel/50 cursor-not-allowed">
            <span className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              Review coming soon
            </span>
          </div>
        )}

        {/* Comparisons */}
        {comparisons && comparisons.length > 0 && (
          <div className="flex-grow flex flex-col">
            <div className="flex items-center gap-2 text-sm font-medium text-slate mb-3">
              <Layers className="h-4 w-4" />
              Compare {tool.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {comparisons.map((comp) => {
                // Extract the "other" tool name from the title
                const titlePrefix = comp.title.split(":")[0];
                const toolNames = titlePrefix.split(" vs ");
                const otherToolName = toolNames.find(n => n.trim() !== tool.name) || toolNames[1];

                return (
                  <Link key={comp.slug} href={`/${comp.slug}`}>
                    <Badge variant="outline" className="hover:bg-ink hover:text-canvas hover:border-ink transition-colors cursor-pointer py-1 px-2.5 rounded-full border border-hairline text-slate bg-canvas">
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
