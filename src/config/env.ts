import { z } from 'zod';

const serverSchema = z.object({
  SUPABASE_URL: z.url().default('http://localhost:54321'),
  SUPABASE_ANON_KEY: z.string().min(1).default('public-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NEXT_RUNTIME_REGION: z.string().default('local'),
  CACHE_MAX_ENTRIES: z.coerce.number().int().positive().default(500),
  CACHE_TTL_MS: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(5 * 60 * 1000),
  CACHE_MEMORY_THRESHOLD_MB: z.coerce.number().int().nonnegative().default(768),
  CACHE_MEMORY_CHECK_INTERVAL_MS: z.coerce.number().int().min(1000).default(30_000),
  CACHE_MEMORY_CLEAR_STRATEGY: z.enum(['trim', 'clear']).default('trim'),
  CACHE_ENABLE_MONITORING: z.coerce.boolean().default(true),
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
  CACHE_MAX_ENTRIES: process.env['CACHE_MAX_ENTRIES'],
  CACHE_TTL_MS: process.env['CACHE_TTL_MS'],
  CACHE_MEMORY_THRESHOLD_MB: process.env['CACHE_MEMORY_THRESHOLD_MB'],
  CACHE_MEMORY_CHECK_INTERVAL_MS: process.env['CACHE_MEMORY_CHECK_INTERVAL_MS'],
  CACHE_MEMORY_CLEAR_STRATEGY: process.env['CACHE_MEMORY_CLEAR_STRATEGY'],
  CACHE_ENABLE_MONITORING: process.env['CACHE_ENABLE_MONITORING'],
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
