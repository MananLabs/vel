// ═══════════════════════════════════════════════════════════
// VEL AI — API Client
// ═══════════════════════════════════════════════════════════

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiClient<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

export function createAuthenticatedClient(getToken: () => Promise<string | null>) {
  return async function authenticatedFetch<T>(
    path: string,
    options: FetchOptions = {},
  ): Promise<T> {
    const token = await getToken();
    return apiClient<T>(path, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  };
}
