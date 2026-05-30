import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    redirect('/sign-in?error=invalid-token');
  }

  try {
    const res = await fetch(`${API_BASE}/auth/verify-email?token=${encodeURIComponent(token)}`, {
      redirect: 'manual',
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (location) redirect(location);
    }

    if (!res.ok) {
      redirect('/sign-in?error=verification-failed');
    }
  } catch {
    // Backend redirects — follow it
  }

  redirect('/sign-in?verified=true');
}
