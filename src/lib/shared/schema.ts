import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().int().nonnegative().default(0),
  pageSize: z.number().int().positive().max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
