import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';

  // Legacy app subdomain → main site (app.runmypg.in SSL was misconfigured on DNS)
  if (host === 'app.runmypg.in') {
    const target = new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://www.runmypg.in');
    return NextResponse.redirect(target, 308);
  }

  return updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
