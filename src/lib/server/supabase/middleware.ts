import type { NextRequest, NextResponse } from 'next/server';

export function updateSession(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get('sb-access-token');
  if (session === undefined) {
    return response;
  }

  return response;
}
