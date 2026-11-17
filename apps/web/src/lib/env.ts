export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  get isConfigured() {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey && !this.supabaseUrl.includes('YOUR_PROJECT'));
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001',
};
