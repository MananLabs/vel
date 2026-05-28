'use client';

import { useCallback } from 'react';

export function useAuth() {
  const getToken = useCallback(async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    try {
      const res = await fetch('/api/auth/token', {
        credentials: 'include',
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.accessToken || null;
    } catch {
      return null;
    }
  }, []);

  return { getToken };
}
