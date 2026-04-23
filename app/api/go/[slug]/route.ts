/**
 * SoftRYT — Affiliate Redirect API Route
 * ==========================================
 * Handles affiliate link cloaking.
 * 
 * Flow:
 * 1. User clicks a CTA button pointing to /api/go/{slug}
 * 2. This route looks up the tool's affiliate_url in Supabase
 * 3. Returns a 307 Temporary Redirect to the affiliate URL
 * 
 * Why 307?
 * - 307 preserves the request method
 * - Temporary redirects signal to search engines that the redirect
 *   destination may change (affiliate links can rotate)
 * - Prevents search engines from following the redirect for ranking
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Look up the tool by slug
  const { data: tool, error } = await supabase
    .from("tools")
    .select("affiliate_url, website_url, name")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !tool) {
    // Redirect to homepage if tool not found
    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  // Use affiliate URL if available, otherwise fall back to website URL
  const redirectUrl = tool.affiliate_url || tool.website_url;

  // Increment click count for the tool's comparison pages (fire-and-forget)
  try {
    // Find any comparison pages featuring this tool and increment their click count
    const { data: pages } = await supabase
      .from("generated_pages")
      .select("id, click_count")
      .or(`tool_a_id.eq.${slug},tool_b_id.eq.${slug}`)
      .limit(1);

    // Simple click tracking - in production, use a dedicated analytics table
    if (pages && pages.length > 0) {
      await supabase
        .from("generated_pages")
        .update({ click_count: (pages[0].click_count || 0) + 1 })
        .eq("id", pages[0].id);
    }
  } catch {
    // Non-critical, don't block the redirect
  }

  // Perform the 307 Temporary Redirect
  return NextResponse.redirect(redirectUrl, 307);
}
