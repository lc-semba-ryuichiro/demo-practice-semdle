import { env } from '@/config/env';
import type { Database } from '@/db/types/supabase';
import { createClient } from '@supabase/supabase-js';

export function createSupabaseServerClient() {
  return createClient<Database>(env.server.SUPABASE_URL, env.server.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        'x-client-info': 'semdle-server',
      },
    },
  });
}
