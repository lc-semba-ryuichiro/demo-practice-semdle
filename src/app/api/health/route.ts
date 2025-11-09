import { env } from '@/config/env';
import { NextResponse } from 'next/server';

export function GET() {
  const timestamp = new Date().toISOString();
  return NextResponse.json({ status: 'ok', timestamp, region: env.server.NEXT_RUNTIME_REGION });
}
