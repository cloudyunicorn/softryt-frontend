/**
 * ProsConsList — Pros and Cons summary component
 * ==================================================
 * Renders a styled pros/cons card for a single tool.
 * Used in the MDX content to summarize strengths and weaknesses.
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProsConsListProps {
  toolName?: string;
  pros?: string[];
  cons?: string[];
  toolAName?: string;
  toolBName?: string;
  toolALogo?: string | null;
  toolBLogo?: string | null;
  [key: string]: unknown;
}

export function ProsConsList(props: ProsConsListProps) {
  const { toolName, pros, cons, toolAName, toolBName, toolALogo, toolBLogo } = props;
  const prosList = Array.isArray(pros) ? pros : [];
  const consList = Array.isArray(cons) ? cons : [];

  if (prosList.length === 0 && consList.length === 0) return null;

  // Match the toolName to the correct logo
  let logoUrl: string | null = null;
  if (toolName && toolAName && toolName.toLowerCase().includes(toolAName.toLowerCase())) {
    logoUrl = toolALogo ?? null;
  } else if (toolName && toolBName && toolName.toLowerCase().includes(toolBName.toLowerCase())) {
    logoUrl = toolBLogo ?? null;
  }

  return (
    <Card className="my-6 overflow-hidden border border-hairline bg-card rounded-lg shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-ink flex items-center gap-3">
          {logoUrl && (
            <img src={logoUrl} alt={toolName ?? "Tool"} className="w-7 h-7 rounded-lg border border-hairline object-cover bg-white" />
          )}
          {toolName ?? "Tool"} — Pros & Cons
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 border-t border-hairline bg-surface/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros */}
          {prosList.length > 0 && (
            <div className="space-y-3">
              <h5 className="flex items-center gap-2 text-sm font-semibold text-brand-green-deep uppercase tracking-wider">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-green/15 text-brand-green-deep text-sm font-bold">
                  ✓
                </span>
                Pros
              </h5>
              <ul className="space-y-2">
                {prosList.map((pro, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-charcoal"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green-deep mt-1.5 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {consList.length > 0 && (
            <div className="space-y-3">
              <h5 className="flex items-center gap-2 text-sm font-semibold text-brand-error uppercase tracking-wider">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-error/15 text-brand-error text-sm font-semibold">
                  ✗
                </span>
                Cons
              </h5>
              <ul className="space-y-2">
                {consList.map((con, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-charcoal"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-error mt-1.5 shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
