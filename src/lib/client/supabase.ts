'use client';

import { env } from '@/config/env';
import type { Database } from '@/db/types/supabase';
import { createClient } from '@supabase/supabase-js';

const browserClient = {
  current: createClient<Database>(
    env.client.NEXT_PUBLIC_SUPABASE_URL,
    env.client.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
};

export function getBrowserSupabase() {
  return browserClient.current;
}

export function resetBrowserSupabase() {
  browserClient.current = createClient<Database>(
    env.client.NEXT_PUBLIC_SUPABASE_URL,
    env.client.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
