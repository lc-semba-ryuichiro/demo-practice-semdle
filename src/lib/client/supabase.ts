'use client';

import { envClient } from '@/config/env.client';
import type { Database } from '@/db/types/supabase';
import { createClient } from '@supabase/supabase-js';

const browserClient = {
  current: createClient<Database>(
    envClient.NEXT_PUBLIC_SUPABASE_URL,
    envClient.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
};

export function getBrowserSupabase() {
  return browserClient.current;
}

export function resetBrowserSupabase() {
  browserClient.current = createClient<Database>(
    envClient.NEXT_PUBLIC_SUPABASE_URL,
    envClient.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
