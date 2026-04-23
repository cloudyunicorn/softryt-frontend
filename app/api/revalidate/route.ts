/**
 * SoftRYT — On-Demand ISR Revalidation Webhook
 * ================================================
 * Called by the FastAPI backend after content regeneration
 * to bust the ISR cache for a specific page.
 * 
 * Security:
 * - Validates a shared secret to prevent unauthorized cache busting
 * - Revalidates both the specific page path and the pages tag
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, secret } = body;

    // Validate the revalidation secret
    const expectedSecret =
      process.env.REVALIDATION_SECRET || "softryt-revalidation-secret-change-me";

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid revalidation secret" },
        { status: 401 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug parameter" },
        { status: 400 }
      );
    }

    // Revalidate the specific page path
    revalidatePath(`/${slug}`);

    // Also revalidate the homepage (which lists comparisons)
    revalidatePath("/");

    // Revalidate tagged caches (Next.js 16 requires a second argument)
    revalidateTag("pages", "max");

    return NextResponse.json({
      revalidated: true,
      slug,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to revalidate", details: String(error) },
      { status: 500 }
    );
  }
}
