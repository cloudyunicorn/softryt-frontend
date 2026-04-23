/**
 * AffiliateButton — CTA button with affiliate redirect
 * ========================================================
 * Renders a styled call-to-action button that links to
 * the affiliate redirect endpoint (/api/go/{slug}).
 * Uses rel="nofollow" for SEO compliance.
 */

"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface AffiliateButtonProps {
  toolSlug?: string;
  label?: string;
  variant?: "primary" | "secondary" | "outline";
  [key: string]: unknown;
}

export function AffiliateButton(props: AffiliateButtonProps) {
  const { toolSlug, label, variant = "primary" } = props;

  if (!toolSlug) return null;

  const href = `/api/go/${toolSlug}`;

  const variantStyles: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
    secondary:
      "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40",
    outline:
      "border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 text-foreground",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="inline-block my-3"
    >
      <Button
        className={`${variantStyles[variant] ?? variantStyles.primary} px-6 py-3 h-auto text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer`}
        size="lg"
      >
        {label ?? `Try ${toolSlug}`}
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </a>
  );
}
