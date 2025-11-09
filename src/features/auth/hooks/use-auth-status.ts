'use client';

import type { AuthStatus } from '../types';
import { useEffect, useState } from 'react';

export function useAuthStatus(delay = 600): { status: AuthStatus } {
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('unauthenticated');
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return { status };
}
