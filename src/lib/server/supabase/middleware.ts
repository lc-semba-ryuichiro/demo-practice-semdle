import { env } from '@/config/env';
import type { NextRequest, NextResponse } from 'next/server';

export function updateSession(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get('sb-access-token');
  if (session === undefined) {
    return response;
  }

  response.headers.set('x-session-refreshed', new Date().toISOString());
  response.headers.set('x-supabase-url', env.server.SUPABASE_URL);
  return response;
}
