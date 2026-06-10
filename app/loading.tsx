/**
 * SoftRYT — Global Page Loading Skeleton
 * ========================================
 * Automatically displayed by Next.js App Router during client-side navigation
 * when loading server-side components/fetching data. Renders a matching
 * glassmorphic skeleton for B2B SaaS comparison pages.
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-40 -z-10" />

      <div className="space-y-12 animate-pulse">
        {/* Breadcrumb & Title skeleton */}
        <div className="space-y-4 max-w-3xl">
          {/* Breadcrumb line */}
          <div className="h-4 w-32 bg-white/5 rounded-full" />
          {/* Title */}
          <div className="h-12 md:h-16 w-full bg-white/5 rounded-2xl" />
          {/* Subtitle/Meta description */}
          <div className="h-5 w-2/3 bg-white/5 rounded-full" />
        </div>

        {/* Feature Comparison Cards (Side-by-side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border border-white/5 bg-[#1c1c1e]/40 backdrop-blur-md rounded-3xl p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center gap-4">
                {/* Tool Logo */}
                <div className="w-12 h-12 rounded-2xl bg-white/5" />
                {/* Tool Name & Category */}
                <div className="space-y-2">
                  <div className="h-6 w-36 bg-white/5 rounded-lg" />
                  <div className="h-4 w-24 bg-white/5 rounded-lg" />
                </div>
              </div>

              {/* Tool Highlights / Verdict */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="h-4 w-full bg-white/5 rounded-md" />
                <div className="h-4 w-full bg-white/5 rounded-md" />
                <div className="h-4 w-3/4 bg-white/5 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Comparison Table Skeleton */}
        <div className="border border-white/5 bg-[#1c1c1e]/20 backdrop-blur-md rounded-3xl p-6 md:p-8 space-y-6">
          <div className="h-8 w-56 bg-white/5 rounded-lg mb-6" />
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="flex items-center justify-between py-4 border-b border-white/5 last:border-0"
              >
                {/* Feature Name */}
                <div className="h-4 w-1/4 bg-white/5 rounded-md" />
                {/* Tool A value */}
                <div className="h-4 w-1/5 bg-white/5 rounded-md" />
                {/* Tool B value */}
                <div className="h-4 w-1/5 bg-white/5 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
