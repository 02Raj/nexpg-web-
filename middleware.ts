import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Determine if we are on production and checking for the app subdomain
  const isProd = hostname.includes('runmypg.in');
  const isAppSubdomain = hostname.startsWith('app.');

  // 1. If on app subdomain and accessing the root (/), redirect to the dashboard
  if (isAppSubdomain && url.pathname === '/') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // 2. If on the main domain (runmypg.in) and trying to access app pages, redirect to app.runmypg.in
  if (isProd && !isAppSubdomain) {
    const appRoutes = ['/login', '/signup', '/dashboard', '/setup', '/tenant', '/beds', '/bills', '/more'];
    if (appRoutes.some(route => url.pathname === route || url.pathname.startsWith(`${route}/`))) {
      url.hostname = 'app.runmypg.in';
      // Ensure we use https in production when redirecting across domains
      url.protocol = 'https:';
      return NextResponse.redirect(url);
    }
  }

  // Continue to standard Supabase session update
  return updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
