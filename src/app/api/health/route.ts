import { envServer } from '@/config/env.server';
import { NextResponse } from 'next/server';

export function GET() {
  const timestamp = new Date().toISOString();
  return NextResponse.json({ status: 'ok', timestamp, region: envServer.NEXT_RUNTIME_REGION });
}
