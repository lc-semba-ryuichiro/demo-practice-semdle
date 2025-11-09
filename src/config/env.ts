import { z } from 'zod';

const serverSchema = z.object({
  SUPABASE_URL: z.url().default('http://localhost:54321'),
  SUPABASE_ANON_KEY: z.string().min(1).default('public-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NEXT_RUNTIME_REGION: z.string().default('local'),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const server = serverSchema.parse({
  SUPABASE_URL: process.env['SUPABASE_URL'] ?? process.env['NEXT_PUBLIC_SUPABASE_URL'],
  SUPABASE_ANON_KEY:
    process.env['SUPABASE_ANON_KEY'] ?? process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  SUPABASE_SERVICE_ROLE_KEY: process.env['SUPABASE_SERVICE_ROLE_KEY'],
  NEXT_RUNTIME_REGION: process.env['NEXT_RUNTIME'] ?? process.env['NEXT_RUNTIME_REGION'],
});

const client = clientSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env['NEXT_PUBLIC_SITE_URL'],
  NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? server.SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? server.SUPABASE_ANON_KEY,
});

export const env = {
  server,
  client,
};
