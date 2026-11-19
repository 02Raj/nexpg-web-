// Script to keep Supabase free-tier project active and prevent 7-day auto-pause.
// Can be run locally or via GitHub Actions.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cthkfzilfqxjgarzrtrw.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_METQi-etH6_jPOVjnz3_Hg_by8E1cRy';

async function pingSupabase() {
  const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/`;
  console.log(`[Supabase Keep-Alive] Pinging: ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    console.log(`[Supabase Keep-Alive] Status: ${response.status} ${response.statusText}`);
    if (response.ok || response.status === 200 || response.status === 404) {
      console.log('✅ Supabase project is awake and registered activity successfully!');
    } else if (response.status === 503) {
      console.warn('⚠️ Supabase returned 503. The project might currently be paused. Please unpause it from the Supabase dashboard.');
    } else {
      console.log(`[Supabase Keep-Alive] Response received: ${response.status}`);
    }
  } catch (err) {
    console.error('❌ Failed to ping Supabase:', err.message);
  }
}

pingSupabase();
