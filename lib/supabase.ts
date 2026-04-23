/**
 * SoftRYT — Supabase Client Configuration
 * ==========================================
 * Creates Supabase clients for both server and client-side usage.
 * Uses the publishable key for all operations.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Server-side Supabase client.
 * Used in Server Components, API routes, and generateStaticParams.
 * 
 * Note: This uses the publishable key which respects RLS policies.
 * Only published pages and active tools are accessible.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Helper to create a fresh client instance.
 * Useful for edge functions or when you need isolated sessions.
 */
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey);
}
