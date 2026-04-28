import { Badge } from "@/components/ui/badge";
import type { ReviewHeroProps } from "@/lib/types";

export function ReviewHero({
  toolName,
  category,
  tagline,
  logoUrl,
}: ReviewHeroProps & { logoUrl?: string | null }) {
  return (
    <div className="not-prose my-10 relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card to-muted/20">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
      
      <div className="relative p-8 sm:p-12 flex flex-col items-center text-center">
        {logoUrl ? (
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl shadow-xl shadow-black/5 border border-border/50 flex items-center justify-center p-4 mb-6">
            <img
              src={logoUrl}
              alt={`${toolName} logo`}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/10 to-primary/30 rounded-2xl shadow-inner border border-primary/20 flex items-center justify-center mb-6">
            <span className="text-3xl font-bold text-primary">
              {toolName.charAt(0)}
            </span>
          </div>
        )}

        <Badge variant="outline" className="mb-4 bg-background/50 backdrop-blur-sm border-border/60 capitalize">
          {category.replace(/-/g, " ")}
        </Badge>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          {toolName} Review
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl text-balance">
          {tagline}
        </p>
      </div>
    </div>
  );
}
