'use client';

import React from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface SessionUser {
  name: string;
  email: string;
  id: string;
  plan: string;
}

interface Session {
  user: SessionUser;
}

interface UseSessionResult {
  data: Session | null;
  isPending: boolean;
  error: Error | null;
}

let currentSession: Session | null = null;
const sessionListeners: Array<() => void> = [];
let sessionFetchInProgress = false;

async function fetchSession(): Promise<Session | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: { id: string; email: string; name?: string; plan?: string } };
    if (data?.user) {
      const session: Session = {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || 'User',
          plan: data.user.plan || 'free',
        },
      };
      currentSession = session;
      return session;
    }
    return null;
  } catch (e) {
    console.warn('[auth] fetchSession error', e);
    return null;
  }
}

function notifyListeners() {
  sessionListeners.forEach((fn) => fn());
}

export const signIn = {
  email: async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = (await res.json()) as { user: SessionUser };
    currentSession = { user: data.user };
    notifyListeners();
    return data;
  },
};

export const signUp = {
  email: async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error('Registration failed');
    const data = (await res.json()) as { user: SessionUser };
    currentSession = { user: data.user };
    notifyListeners();
    return data;
  },
};

export const signOut = async (opts?: { fetchOptions?: { onSuccess?: () => void } }) => {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // proceed with local logout
  }
  currentSession = null;
  notifyListeners();
  if (opts?.fetchOptions?.onSuccess) {
    opts.fetchOptions.onSuccess();
  }
  window.location.href = '/sign-in';
};

export const useSession = (): UseSessionResult => {
  if (typeof window === 'undefined') {
    return { data: null, isPending: true, error: null };
  }

  if (!sessionFetchInProgress && !currentSession) {
    sessionFetchInProgress = true;
    fetchSession().finally(() => {
      sessionFetchInProgress = false;
      notifyListeners();
    });
  }

  const [session, setSession] = React.useState<Session | null>(currentSession);
  const [pending, setPending] = React.useState(!currentSession);

  React.useEffect(() => {
    const handler = () => {
      setSession(currentSession);
      setPending(false);
    };
    sessionListeners.push(handler);
    if (currentSession) {
      setSession(currentSession);
      setPending(false);
    }
    return () => {
      const idx = sessionListeners.indexOf(handler);
      if (idx >= 0) sessionListeners.splice(idx, 1);
    };
  }, []);

  return { data: session, isPending: pending, error: null }; // TODO: expose fetch errors via state
};

export const getSession = async (): Promise<Session | null> => {
  return fetchSession();
};
