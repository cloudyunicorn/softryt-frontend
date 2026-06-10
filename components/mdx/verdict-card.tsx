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

export function VerdictCard({ winner, summary, bestFor, toolAName, toolBName, toolALogo, toolBLogo }: VerdictCardProps) {
  /** Resolve a bestFor key to a display-friendly tool name. */
  const getToolLabel = (key: string): string => {
    if (key === "toolA" && toolAName) return toolAName;
    if (key === "toolB" && toolBName) return toolBName;
    // If the key is already a real tool name (new-style data), use it directly
    if (key !== "toolA" && key !== "toolB") return key;
    return "";
  };

  /** Resolve a bestFor key to the appropriate logo URL. */
  const getToolLogo = (key: string): string | null | undefined => {
    if (key === "toolA") return toolALogo;
    if (key === "toolB") return toolBLogo;
    // Try matching key against tool names for new-style data
    if (toolAName && key === toolAName) return toolALogo;
    if (toolBName && key === toolBName) return toolBLogo;
    return null;
  };

  /** Try to find the winner's logo */
  let winnerLogoUrl: string | null = null;
  if (winner) {
    if (toolAName && winner.toLowerCase().includes(toolAName.toLowerCase()) && toolALogo) winnerLogoUrl = toolALogo;
    else if (toolBName && winner.toLowerCase().includes(toolBName.toLowerCase()) && toolBLogo) winnerLogoUrl = toolBLogo;
  }

  return (
    <Card className="my-8 overflow-hidden border-2 border-brand-green bg-card rounded-lg shadow-md shadow-brand-green/8">
      {/* Winner Banner */}
      <div className="bg-brand-green/10 px-6 py-4 border-b border-brand-green/20">
        <div className="flex items-center gap-4">
          <span className="text-3xl sm:text-4xl leading-none">🏆</span>
          <div className="flex-1">
            <span className="block text-[10px] uppercase tracking-[0.15em] text-slate font-bold mb-1">
              Our Verdict
            </span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {winnerLogoUrl && (
                <img src={winnerLogoUrl} alt="Winner Logo" className="w-8 h-8 rounded-lg border border-hairline object-cover bg-white shadow-sm" />
              )}
              <div className="text-2xl font-bold text-ink leading-none">
                {winner}
              </div>
              <Badge className="text-[10px] px-2.5 py-0.5 font-bold bg-brand-green text-canvas border border-brand-green-deep rounded-full uppercase tracking-wider">
                Winner
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="pt-5 space-y-4">
        {/* Summary */}
        <div className="text-sm text-charcoal leading-relaxed">{summary}</div>

        {/* Best For */}
        {bestFor && Object.keys(bestFor).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(bestFor).map(([key, value]) => {
              const toolLabel = getToolLabel(key);
              const logoUrl = getToolLogo(key);
              return (
                <div
                  key={key}
                  className="rounded-lg border border-hairline bg-surface p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {logoUrl && (
                      <img src={logoUrl} alt={toolLabel} className="w-5 h-5 rounded-md border border-hairline object-cover bg-white shadow-sm" />
                    )}
                    <span className="text-[10px] uppercase tracking-[0.1em] text-slate font-bold leading-none">
                      {toolLabel}
                    </span>
                  </div>
                  <div className="text-sm text-charcoal leading-relaxed">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
