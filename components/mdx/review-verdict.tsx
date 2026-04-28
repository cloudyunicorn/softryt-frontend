import { ShieldCheck, Target } from "lucide-react";
import type { ReviewVerdictProps } from "@/lib/types";

export function ReviewVerdict({ summary, bestFor }: ReviewVerdictProps) {
  return (
    <div className="not-prose my-10 p-6 sm:p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-foreground">The Final Verdict</h3>
      </div>
      
      <p className="text-base text-muted-foreground leading-relaxed mb-6">
        {summary}
      </p>

      <div className="p-4 rounded-xl bg-background border border-border/50 flex items-start gap-3">
        <Target className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm">
          <span className="font-semibold text-foreground">Best Suited For: </span>
          <span className="text-muted-foreground">{bestFor}</span>
        </p>
      </div>
    </div>
  );
}
