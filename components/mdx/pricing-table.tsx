/**
 * PricingTable — Side-by-side pricing comparison component
 * ==========================================================
 * Renders pricing tiers for two tools in a responsive grid.
 * Highlights the "popular" plan and shows feature lists per tier.
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PricingTier {
  name?: string;
  price?: string;
  billing_period?: string;
  is_popular?: boolean;
  features?: string[];
}

interface ToolPricing {
  name?: string;
  tiers?: PricingTier[];
}

interface PricingTableProps {
  toolA?: ToolPricing;
  toolB?: ToolPricing;
  [key: string]: unknown;
}

export function PricingTable(props: PricingTableProps) {
  const { toolA, toolB } = props;

  // If neither tool has data, don't render
  if (!toolA && !toolB) return null;

  return (
    <div className="my-8">
      <h3 className="text-2xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
        💰 Pricing Comparison
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {toolA && <PricingColumn tool={toolA} accent="blue" />}
        {toolB && <PricingColumn tool={toolB} accent="emerald" />}
      </div>
    </div>
  );
}

function PricingColumn({
  tool,
  accent,
}: {
  tool: ToolPricing;
  accent: "blue" | "emerald";
}) {
  const gradientClass =
    accent === "blue"
      ? "from-blue-500/10 to-indigo-500/10"
      : "from-emerald-500/10 to-teal-500/10";

  const badgeClass =
    accent === "blue"
      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";

  const tiers = tool.tiers ?? [];

  return (
    <div className="space-y-4">
      <h4
        className={`text-lg font-semibold text-center pb-2 border-b border-border`}
      >
        {tool.name ?? "Tool"}
      </h4>
      {tiers.length > 0 ? (
        tiers.map((tier, idx) => (
          <Card
            key={idx}
            className={`relative overflow-hidden bg-gradient-to-br ${gradientClass} border-border/50 hover:border-border transition-colors duration-300`}
          >
            {tier.is_popular && (
              <div className="absolute top-0 right-0">
                <Badge className={`rounded-none rounded-bl-lg text-xs ${badgeClass}`}>
                  Popular
                </Badge>
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">{tier.name ?? "Plan"}</CardTitle>
              <p className="text-2xl font-bold tracking-tight">{tier.price ?? "Contact"}</p>
              {tier.billing_period && (
                <p className="text-xs text-muted-foreground">
                  {tier.billing_period}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {tier.features && tier.features.length > 0 && (
                <ul className="space-y-1.5">
                  {tier.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">No pricing data available.</p>
      )}
    </div>
  );
}
