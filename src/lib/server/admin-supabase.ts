import { env } from '@/config/env';
import type { Database } from '@/db/types/supabase';
import { createClient } from '@supabase/supabase-js';

export function createAdminSupabaseClient() {
  const { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } = env.server;

  if (SUPABASE_SERVICE_ROLE_KEY === undefined) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
