/**
 * FeatureGrid — Feature-by-feature comparison table
 * =====================================================
 * Renders a detailed comparison grid showing which features
 * each tool supports (boolean) or with custom text values.
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FeatureItem {
  name?: string;
  toolA?: boolean | string;
  toolB?: boolean | string;
}

interface FeatureGridProps {
  features?: FeatureItem[];
  toolAName?: string;
  toolBName?: string;
  toolALogo?: string | null;
  toolBLogo?: string | null;
  [key: string]: unknown;
}

export function FeatureGrid(props: FeatureGridProps) {
  const { features, toolAName, toolBName, toolALogo, toolBLogo } = props;
  const featureList = Array.isArray(features) ? features : [];

  if (featureList.length === 0) return null;

  return (
    <Card className="my-8 overflow-hidden border border-hairline bg-card rounded-lg shadow-sm">
      <CardHeader className="pb-3 border-b border-hairline bg-surface/30">
        <CardTitle className="text-xl font-semibold text-ink">
          📊 Feature-by-Feature Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-hairline hover:bg-transparent bg-surface/10">
                <TableHead className="w-[40%] font-semibold text-ink">Feature</TableHead>
                <TableHead className="text-center font-semibold text-ink">
                  <span className="inline-flex items-center justify-center gap-2">
                    {toolALogo && (
                      <img src={toolALogo} alt={toolAName ?? "Tool A"} className="w-5 h-5 rounded-md border border-hairline object-cover bg-white" />
                    )}
                    {toolAName ?? "Tool A"}
                  </span>
                </TableHead>
                <TableHead className="text-center font-semibold text-ink">
                  <span className="inline-flex items-center justify-center gap-2">
                    {toolBLogo && (
                      <img src={toolBLogo} alt={toolBName ?? "Tool B"} className="w-5 h-5 rounded-md border border-hairline object-cover bg-white" />
                    )}
                    {toolBName ?? "Tool B"}
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featureList.map((feature, idx) => (
                <TableRow
                  key={idx}
                  className="border-b border-hairline-soft hover:bg-surface/30 transition-colors"
                >
                  <TableCell className="font-medium text-sm text-charcoal">
                    {feature.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <FeatureValue value={feature.toolA} />
                  </TableCell>
                  <TableCell className="text-center">
                    <FeatureValue value={feature.toolB} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Renders a feature value as either:
 * - ✓ (green check) for true
 * - ✗ (red cross) for false
 * - Custom text badge for string values (e.g., "Enterprise only")
 */
function FeatureValue({ value }: { value?: boolean | string }) {
  if (value === undefined || value === null) {
    return <span className="text-stone text-sm">—</span>;
  }

  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-green/15 text-brand-green-deep text-sm font-bold">
        ✓
      </span>
    ) : (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-error/10 text-brand-error text-sm font-semibold">
        ✗
      </span>
    );
  }

  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-warn/10 text-brand-warn border border-brand-warn/25">
      {value}
    </span>
  );
}
