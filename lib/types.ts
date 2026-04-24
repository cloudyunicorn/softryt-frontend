/**
 * SoftRYT — TypeScript Interfaces
 * ================================
 * Strict types matching the Supabase/backend Pydantic models.
 */

// ── Tool Types ────────────────────────────────────────────

export interface Tool {
  id: string;
  name: string;
  slug: string;
  website_url: string;
  pricing_url: string | null;
  affiliate_url: string | null;
  category: string;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Pricing Types ─────────────────────────────────────────

export interface PricingTier {
  name: string;
  price: string;
  billing_period?: string;
  features: string[];
  is_popular?: boolean;
  cta_text?: string;
}

export interface ToolPricingData {
  name: string;
  tiers: PricingTier[];
}

// ── Feature Grid Types ────────────────────────────────────

export interface FeatureComparison {
  name: string;
  toolA: boolean | string;
  toolB: boolean | string;
}

// ── Page Types ────────────────────────────────────────────

export type PageType = "comparison" | "review" | "alternative";
export type PublishStatus = "draft" | "published" | "archived";

export interface GeneratedPage {
  id: string;
  slug: string;
  page_type: PageType;
  tool_a_id: string | null;
  tool_b_id: string | null;
  title: string;
  meta_description: string;
  markdown_content: string;
  schema_markup: Record<string, unknown> | null;
  published_status: PublishStatus;
  published_at: string | null;
  view_count: number;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface PageSlug {
  slug: string;
  updated_at: string;
  page_type: PageType;
}

// ── MDX Component Props ───────────────────────────────────

export interface PricingTableProps {
  toolA: ToolPricingData;
  toolB: ToolPricingData;
}

export interface ProsConsListProps {
  toolName: string;
  pros: string[];
  cons: string[];
}

export interface FeatureGridProps {
  features: FeatureComparison[];
  toolAName: string;
  toolBName: string;
}

export interface VerdictCardProps {
  winner: string;
  summary: string;
  bestFor: {
    [key: string]: string;
  };
  toolAName?: string;
  toolBName?: string;
}

export interface AffiliateButtonProps {
  toolSlug: string;
  label: string;
  variant?: "primary" | "secondary" | "outline";
}

// ── API Response Types ────────────────────────────────────

export interface PageListResponse {
  pages: GeneratedPage[];
  total: number;
}

export interface ToolListResponse {
  tools: Tool[];
  total: number;
}
