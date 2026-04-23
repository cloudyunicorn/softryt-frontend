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
  [key: string]: unknown;
}

export function FeatureGrid(props: FeatureGridProps) {
  const { features, toolAName, toolBName } = props;
  const featureList = Array.isArray(features) ? features : [];

  if (featureList.length === 0) return null;

  return (
    <Card className="my-8 overflow-hidden border-border/50 shadow-md">
      <CardHeader className="pb-3 bg-gradient-to-r from-muted/50 to-transparent">
        <CardTitle className="text-xl font-extrabold bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
          📊 Feature-by-Feature Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[40%] font-semibold">Feature</TableHead>
                <TableHead className="text-center font-semibold">
                  <span className="inline-flex items-center gap-1.5 text-blue-500">
                    {toolAName ?? "Tool A"}
                  </span>
                </TableHead>
                <TableHead className="text-center font-semibold">
                  <span className="inline-flex items-center gap-1.5 text-emerald-500">
                    {toolBName ?? "Tool B"}
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featureList.map((feature, idx) => (
                <TableRow
                  key={idx}
                  className="border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium text-sm">
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
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500/15 text-green-500 text-sm font-bold">
        ✓
      </span>
    ) : (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500/10 text-red-400 text-sm">
        ✗
      </span>
    );
  }

  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-500 border border-amber-500/20">
      {value}
    </span>
  );
}
