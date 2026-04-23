/**
 * SoftRYT — MDX Configuration
 * ==============================
 * Configures next-mdx-remote for server-side MDX rendering
 * with custom component mapping for embedded SaaS comparison components.
 */

import type { MDXComponents } from "mdx/types";
import { PricingTable } from "@/components/mdx/pricing-table";
import { ProsConsList } from "@/components/mdx/pros-cons-list";
import { FeatureGrid } from "@/components/mdx/feature-grid";
import { VerdictCard } from "@/components/mdx/verdict-card";
import { AffiliateButton } from "@/components/mdx/affiliate-button";

/**
 * Custom component map for MDX rendering.
 * These components are available for use in AI-generated MDX content.
 * Each component receives typed props from the MDX source.
 */
export const mdxComponents: MDXComponents = {
  PricingTable: PricingTable as any,
  ProsConsList: ProsConsList as any,
  FeatureGrid: FeatureGrid as any,
  VerdictCard: VerdictCard as any,
  AffiliateButton: AffiliateButton as any,
};
