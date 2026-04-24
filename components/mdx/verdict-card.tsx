/**
 * VerdictCard — Final recommendation component
 * ================================================
 * Renders a highlighted verdict/recommendation card
 * at the end of a comparison article.
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VerdictCardProps } from "@/lib/types";

export function VerdictCard({ winner, summary, bestFor, toolAName, toolBName }: VerdictCardProps) {
  /** Resolve a bestFor key to a display-friendly tool name. */
  const getToolLabel = (key: string): string => {
    if (key === "toolA" && toolAName) return toolAName;
    if (key === "toolB" && toolBName) return toolBName;
    // If the key is already a real tool name (new-style data), use it directly
    if (key !== "toolA" && key !== "toolB") return key;
    return "";
  };

  return (
    <Card className="my-8 overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
      {/* Winner Banner */}
      <div className="bg-gradient-to-r from-primary/15 to-primary/5 px-6 py-4 border-b border-primary/10">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Our Verdict
            </p>
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent flex items-center mt-1">
              {winner}{" "}
              <Badge variant="secondary" className="ml-3 text-xs font-medium bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30 border-0">
                Winner
              </Badge>
            </h3>
          </div>
        </div>
      </div>

      <CardContent className="pt-5 space-y-5">
        {/* Summary */}
        <p className="text-sm text-foreground/80 leading-relaxed">{summary}</p>

        {/* Best For */}
        {bestFor && Object.keys(bestFor).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(bestFor).map(([key, value]) => {
              const toolLabel = getToolLabel(key);
              return (
                <div
                  key={key}
                  className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-2"
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    {toolLabel}
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
