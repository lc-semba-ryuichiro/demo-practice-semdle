import type { Tables } from '@/types/database';

export function getProfile(userId: string): Promise<Tables<'profiles'>> {
  return Promise.resolve({
    id: userId,
    email: `${userId}@example.com`,
    display_name: 'Demo User',
    avatar_url: null,
    updated_at: new Date().toISOString(),
  });
}
