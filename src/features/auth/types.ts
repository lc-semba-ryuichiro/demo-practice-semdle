export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface SessionSummary {
  userId: string;
  email: string;
  expiresAt: string;
}
