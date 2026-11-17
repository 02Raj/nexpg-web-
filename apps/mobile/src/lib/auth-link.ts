import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';

/** Where Supabase email links should land (app deep link, not Metro root). */
export function authRedirectUrl(path = 'auth/callback') {
  return Linking.createURL(path);
}

export function passwordResetRedirectUrl() {
  return authRedirectUrl('auth/reset-password');
}

export function isRecoveryUrl(url: string) {
  return paramsFromUrl(url).type === 'recovery';
}

function paramsFromUrl(url: string) {
  const merged = new URLSearchParams();
  const query = url.split('?')[1]?.split('#')[0];
  const hash = url.split('#')[1];
  if (query) new URLSearchParams(query).forEach((v, k) => merged.set(k, v));
  if (hash) new URLSearchParams(hash).forEach((v, k) => merged.set(k, v));
  const out: Record<string, string> = {};
  merged.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

export function authErrorFromUrl(url: string): string | null {
  const params = paramsFromUrl(url);
  if (params.error_description) {
    return decodeURIComponent(params.error_description.replace(/\+/g, ' '));
  }
  if (params.error === 'access_denied' && params.error_code === 'otp_expired') {
    return 'This email link has expired. Sign up again, or turn off email confirmation in Supabase.';
  }
  return null;
}

export async function createSessionFromUrl(url: string) {
  const params = paramsFromUrl(url);
  const linkError = authErrorFromUrl(url);
  if (linkError) throw new Error(linkError);

  if (params.access_token && params.refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });
    if (error) throw error;
    return;
  }

  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) throw error;
    return;
  }

  throw new Error(
    'This email link is invalid or has expired. In Supabase, turn off Auth → Email → Confirm email, then create your account again.',
  );
}
