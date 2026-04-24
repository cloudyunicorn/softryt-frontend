/**
 * Script to batch download logos from logo.dev and upload them to Supabase Storage.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new storage bucket in your Supabase dashboard named "logos". Make sure to set it to "Public".
 * 2. Get your free Publishable Key from https://logo.dev
 * 3. Add LOGO_DEV_TOKEN="pk_..." to your softryt-frontend/.env file
 * 4. Run this script: node scripts/download-logos.js
 */

require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

// Ensure required environment variables are present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use Service Role key if available to bypass RLS for uploads, otherwise fallback to anon key
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const logoDevToken = process.env.LOGO_DEV_TOKEN;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env");
  process.exit(1);
}

if (!logoDevToken) {
  console.error("❌ Missing LOGO_DEV_TOKEN in .env");
  console.error("Get a free key at https://logo.dev and add it to your .env file.");
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("🔍 Fetching tools from Supabase...");
  
  // Fetch tools that don't have a logo yet
  const { data: tools, error: fetchError } = await supabase
    .from('tools')
    .select('id, name, website_url')
    .is('logo_url', null);

  if (fetchError) {
    console.error("❌ Error fetching tools:", fetchError);
    return;
  }

  if (!tools || tools.length === 0) {
    console.log("✅ All tools already have logos!");
    return;
  }

  console.log(`Found ${tools.length} tools missing logos. Starting download...`);

  for (const tool of tools) {
    if (!tool.website_url) {
      console.log(`⏭️ Skipping ${tool.name}: No website URL`);
      continue;
    }

    try {
      // Extract domain (e.g., https://notion.so/pricing -> notion.so)
      const domain = new URL(tool.website_url).hostname.replace(/^www\./, '');
      console.log(`\n⏳ Processing ${tool.name} (${domain})...`);

      // Fetch from logo.dev
      const logoResponse = await fetch(`https://img.logo.dev/${domain}?token=${logoDevToken}&format=png&size=200`);
      
      if (!logoResponse.ok) {
        console.error(`❌ Failed to fetch logo for ${domain}: ${logoResponse.status} ${logoResponse.statusText}`);
        continue;
      }

      const arrayBuffer = await logoResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Upload to Supabase Storage
      const fileName = `${domain}-${Date.now()}.png`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, buffer, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        if (uploadError.message.includes('row-level security') || uploadError.message.includes('RLS')) {
          console.error(`\n❌ RLS Error for ${domain}: Your Supabase bucket is blocking uploads.`);
          console.error(`👉 FIX: Add SUPABASE_SERVICE_ROLE_KEY="secret_role_key" to your .env file to bypass security rules for this script!`);
          break; // Stop loop since all uploads will fail
        }
        console.error(`❌ Failed to upload logo to Supabase:`, uploadError);
        continue;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);
        
      const publicUrl = publicUrlData.publicUrl;

      // Update tools table
      const { error: updateError } = await supabase
        .from('tools')
        .update({ logo_url: publicUrl })
        .eq('id', tool.id);

      if (updateError) {
        console.error(`❌ Failed to update database for ${tool.name}:`, updateError);
        continue;
      }

      console.log(`✅ Success: ${tool.name} logo saved -> ${publicUrl}`);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (err) {
      console.error(`❌ Unexpected error processing ${tool.name}:`, err.message);
    }
  }

  console.log("\n🎉 Finished processing logos!");
}

main();
