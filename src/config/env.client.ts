import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z.url().default('http://localhost:54321'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default('public-anon-key'),
});

export type ClientEnv = z.infer<typeof clientSchema>;

function loadClientEnv(): ClientEnv {
  try {
    return clientSchema.parse({
      NEXT_PUBLIC_SITE_URL: process.env['NEXT_PUBLIC_SITE_URL'],
      NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL'],
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    });
  } catch {
    console.error('Public environment variable validation failed');
    throw new Error('Invalid client configuration. Check your NEXT_PUBLIC_* variables.');
  }
}

export const envClient = loadClientEnv();
