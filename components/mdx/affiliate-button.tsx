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
  href?: string;
  label?: string;
  variant?: "primary" | "secondary" | "outline";
  [key: string]: unknown;
}

export function AffiliateButton(props: AffiliateButtonProps) {
  const { toolSlug, href: directHref, label, variant = "primary" } = props;

  if (!toolSlug && !directHref) return null;

  const href = directHref || `/api/go/${toolSlug}`;

  const variantStyles: Record<string, string> = {
    primary:
      "bg-ink hover:bg-charcoal text-canvas shadow-sm",
    secondary:
      "bg-brand-green hover:bg-brand-green-deep text-canvas font-semibold shadow-sm shadow-brand-green/15",
    outline:
      "border border-hairline bg-canvas text-ink hover:bg-surface",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="inline-block my-3"
    >
      <Button
        className={`${variantStyles[variant] ?? variantStyles.primary} px-6 py-3 h-auto text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer`}
        size="lg"
      >
        {label ?? `Try ${toolSlug}`}
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </a>
  );
}
