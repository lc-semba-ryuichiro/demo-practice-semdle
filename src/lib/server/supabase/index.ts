import { envServer } from '@/config/env.server';
import type { Database } from '@/db/types/supabase';
import { createClient } from '@supabase/supabase-js';

export function createSupabaseServerClient() {
  return createClient<Database>(envServer.SUPABASE_URL, envServer.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        'x-client-info': 'semdle-server',
      },
    },
  });
}
