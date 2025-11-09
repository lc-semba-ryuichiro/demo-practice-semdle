import { updateSession } from '@/lib/server/supabase/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  return updateSession(request, response);
}
