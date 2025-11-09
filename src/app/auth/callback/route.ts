import { handlePkceCallback } from '@/lib/server/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const result = await handlePkceCallback(request.url);
  return NextResponse.json(result.body, { status: result.status });
}
