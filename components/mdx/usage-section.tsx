import { CheckCircle2, Briefcase, Zap, Target } from "lucide-react";
import type { UsageSectionProps } from "@/lib/types";

export function UsageSection({ useCases }: UsageSectionProps) {
  if (!useCases || useCases.length === 0) return null;

  return (
    <div className="not-prose my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {useCases.map((useCase, idx) => (
          <div
            key={idx}
            className="flex flex-col p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 p-2.5 rounded-xl bg-primary/10 text-primary">
                {idx % 3 === 0 ? <Briefcase className="w-5 h-5" /> : idx % 3 === 1 ? <Zap className="w-5 h-5" /> : <Target className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground leading-tight">
                  {useCase.title}
                </h4>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 flex-grow">
              {useCase.description}
            </p>

            <div className="mt-auto pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium text-muted-foreground">
                  Best for: <span className="text-foreground">{useCase.bestFor}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
