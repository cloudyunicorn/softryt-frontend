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
  [key: string]: unknown;
}

export function ProsConsList(props: ProsConsListProps) {
  const { toolName, pros, cons } = props;
  const prosList = Array.isArray(pros) ? pros : [];
  const consList = Array.isArray(cons) ? cons : [];

  if (prosList.length === 0 && consList.length === 0) return null;

  return (
    <Card className="my-6 overflow-hidden border-border/50 shadow-md">
      <CardHeader className="pb-3 bg-gradient-to-r from-muted/50 to-transparent">
        <CardTitle className="text-xl font-extrabold bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
          {toolName ?? "Tool"} — Pros & Cons
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros */}
          {prosList.length > 0 && (
            <div className="space-y-3">
              <h5 className="flex items-center gap-2 text-sm font-semibold text-green-500 uppercase tracking-wider">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/15">
                  ✓
                </span>
                Pros
              </h5>
              <ul className="space-y-2">
                {prosList.map((pro, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-foreground/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {consList.length > 0 && (
            <div className="space-y-3">
              <h5 className="flex items-center gap-2 text-sm font-semibold text-red-500 uppercase tracking-wider">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/15">
                  ✗
                </span>
                Cons
              </h5>
              <ul className="space-y-2">
                {consList.map((con, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-foreground/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
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
