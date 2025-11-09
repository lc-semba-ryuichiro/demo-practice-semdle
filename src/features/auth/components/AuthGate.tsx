'use client';

import { useAuthStatus } from '../hooks/use-auth-status';
import type { ReactNode } from 'react';

interface AuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGate({ children, fallback = null }: AuthGateProps) {
  const { status } = useAuthStatus();

  if (status === 'loading') {
    return <p className="text-muted-foreground">Checking session…</p>;
  }

  if (status === 'unauthenticated') {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
