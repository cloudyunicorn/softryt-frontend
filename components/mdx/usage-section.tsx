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
            className="flex flex-col p-6 rounded-lg border border-hairline bg-card hover:bg-surface/30 transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 p-2.5 rounded-lg bg-surface border border-hairline text-slate">
                {idx % 3 === 0 ? <Briefcase className="w-5 h-5" /> : idx % 3 === 1 ? <Zap className="w-5 h-5" /> : <Target className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-ink leading-tight">
                  {useCase.title}
                </h4>
              </div>
            </div>
            
            <p className="text-sm text-slate mb-4 flex-grow leading-relaxed">
              {useCase.description}
            </p>

            <div className="mt-auto pt-4 border-t border-hairline-soft">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-green-deep" />
                <span className="text-xs font-medium text-slate">
                  Best for: <span className="text-ink font-semibold">{useCase.bestFor}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
