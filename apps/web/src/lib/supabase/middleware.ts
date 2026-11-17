import { env } from '@/lib/env';
import type { Database } from '@/types/database';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PREFIXES = [
  '/',
  '/blog',
  '/about',
  '/contact',
  '/cities',
  '/help',
  '/privacy',
  '/terms',
  '/refund',
  '/cookies',
  '/download',
  '/pricing',
  '/features',
];

function isPublicMarketingPath(pathname: string) {
  if (pathname === '/') return true;
  return PUBLIC_PREFIXES.some((p) => p !== '/' && (pathname === p || pathname.startsWith(`${p}/`)));
}

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some((c) => c.name.includes('auth-token'));
}

export async function updateSession(request: NextRequest) {
  if (!env.isConfigured) {
    return NextResponse.next({ request });
  }

  const { pathname } = request.nextUrl;
  if (isPublicMarketingPath(pathname) && !hasSupabaseAuthCookie(request)) {
    return NextResponse.next({ request });
  }

  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    await supabase.auth.getUser();
    return supabaseResponse;
  } catch {
    return NextResponse.next({ request });
  }
}
