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
  toolALogo?: string | null;
  toolBLogo?: string | null;
  [key: string]: unknown;
}

export function PricingTable(props: PricingTableProps) {
  const { toolA, toolB, toolALogo, toolBLogo } = props;

  // If neither tool has data, don't render
  if (!toolA && !toolB) return null;

  return (
    <div className="my-8">
      <h3 className="text-2xl font-semibold mb-8 text-center text-ink">
        💰 Pricing Comparison
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {toolA && <PricingColumn tool={toolA} logoUrl={toolALogo} />}
        {toolB && <PricingColumn tool={toolB} logoUrl={toolBLogo} />}
      </div>
    </div>
  );
}

function PricingColumn({
  tool,
  logoUrl,
}: {
  tool: ToolPricing;
  logoUrl?: string | null;
}) {
  const tiers = tool.tiers ?? [];

  return (
    <div className="space-y-4">
      <h4
        className="text-lg font-semibold text-center pb-2 border-b border-hairline flex items-center justify-center gap-2 text-ink"
      >
        {logoUrl && (
          <img src={logoUrl} alt={tool.name ?? "Tool"} className="w-6 h-6 rounded-md border border-hairline object-cover bg-white" />
        )}
        {tool.name ?? "Tool"}
      </h4>
      {tiers.length > 0 ? (
        tiers.map((tier, idx) => {
          const isPopular = tier.is_popular;
          return (
            <Card
              key={idx}
              className={`relative overflow-hidden bg-card rounded-lg transition-all duration-300 ${
                isPopular
                  ? "border-2 border-brand-green shadow-md shadow-brand-green/8"
                  : "border border-hairline shadow-sm"
              }`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg text-xs bg-brand-green text-canvas border-l border-b border-brand-green-deep font-semibold">
                    Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-ink">{tier.name ?? "Plan"}</CardTitle>
                <p className="text-2xl font-bold tracking-tight text-ink">{tier.price ?? "Contact"}</p>
                {tier.billing_period && (
                  <p className="text-xs text-slate">
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
                        className="flex items-start gap-2 text-sm text-charcoal"
                      >
                        <span className="text-brand-green-deep mt-0.5 shrink-0 font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })
      ) : (
        <p className="text-sm text-slate text-center py-4">No pricing data available.</p>
      )}
    </div>
  );
}
