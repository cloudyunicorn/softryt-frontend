import { Badge } from "@/components/ui/badge";
import type { ReviewHeroProps } from "@/lib/types";

export function ReviewHero({
  toolName,
  category,
  tagline,
  logoUrl,
}: ReviewHeroProps & { logoUrl?: string | null }) {
  return (
    <div className="not-prose my-10 relative overflow-hidden rounded-lg border border-hairline bg-gradient-to-b from-hero-sky-from/20 to-hero-sky-to/10 shadow-sm">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
      
      <div className="relative p-8 sm:p-12 flex flex-col items-center text-center">
        {logoUrl ? (
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg shadow-md border border-hairline flex items-center justify-center p-4 mb-6">
            <img
              src={logoUrl}
              alt={`${toolName} logo`}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-tag/15 rounded-lg border border-brand-tag/25 flex items-center justify-center mb-6 shadow-sm">
            <span className="text-3xl font-bold text-brand-tag">
              {toolName.charAt(0)}
            </span>
          </div>
        )}

        <Badge variant="outline" className="mb-4 bg-canvas/85 text-slate border-hairline rounded-full capitalize">
          {category.replace(/-/g, " ")}
        </Badge>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-ink">
          {toolName} Review
        </h1>

        <p className="text-lg sm:text-xl text-slate max-w-2xl text-balance leading-relaxed">
          {tagline}
        </p>
      </div>
    </div>
  );
}
