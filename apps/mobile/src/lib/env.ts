const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

const looksDummy =
  !url ||
  !anonKey ||
  url.includes('dummy') ||
  url.includes('YOUR_PROJECT') ||
  anonKey.includes('REPLACE_WITH_REAL') ||
  anonKey.includes('YOUR_ANON');

export const env = {
  supabaseUrl: url,
  supabaseAnonKey: anonKey,
  isConfigured: !looksDummy,
};
