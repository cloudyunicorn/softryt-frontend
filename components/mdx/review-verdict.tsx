import { ShieldCheck, Target } from "lucide-react";
import type { ReviewVerdictProps } from "@/lib/types";

export function ReviewVerdict({ summary, bestFor }: ReviewVerdictProps) {
  return (
    <div className="not-prose my-10 p-6 sm:p-8 rounded-lg border border-brand-green/30 bg-brand-green/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-brand-green/15 rounded-md">
          <ShieldCheck className="w-6 h-6 text-brand-green-deep" />
        </div>
        <h3 className="text-xl font-semibold text-ink">The Final Verdict</h3>
      </div>
      
      <p className="text-base text-charcoal leading-relaxed mb-6">
        {summary}
      </p>

      <div className="p-4 rounded-lg bg-card border border-hairline flex items-start gap-3">
        <Target className="w-5 h-5 text-ink shrink-0 mt-0.5" />
        <p className="text-sm">
          <span className="font-semibold text-ink">Best Suited For: </span>
          <span className="text-slate">{bestFor}</span>
        </p>
      </div>
    </div>
  );
}
