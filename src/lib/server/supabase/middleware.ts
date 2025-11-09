import { envServer } from '@/config/env.server';
import type { Database } from '@/db/types/supabase';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient<Database>(
    envServer.SUPABASE_URL,
    envServer.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            const maxAge = options.maxAge;
            if (typeof maxAge === 'number' && maxAge <= 0) {
              request.cookies.delete(name);
            } else {
              request.cookies.set(name, value);
            }

            response.cookies.set({ name, value, ...options });
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.getUser();

  if (error?.status === 401) {
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
  }

  return response;
}
