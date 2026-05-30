'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth-client';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified') === 'true';
  const registered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn.email({ email, password });
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div
        className="absolute pointer-events-none"
        style={{
          width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(109,95,255,0.15) 0%, transparent 60%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="relative z-10 w-full max-w-[420px] mx-4"
        style={{
          padding: '48px 40px', borderRadius: 24,
          background: 'rgba(17, 17, 17, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center">
          <img src="/logo.avif" alt="VEL AI" width={56} height={56} className="rounded-lg" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2 text-center">Sign In</h2>
        <p className="text-sm text-[#888] mb-8 text-center">Welcome back to VEL AI</p>

        {verified && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            Email verified successfully! You can now sign in.
          </div>
        )}

        {registered && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            Account created successfully! Sign in to continue.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#888] mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm text-[#888] mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              placeholder="••••••••" required minLength={8} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#666] mt-6">
          Don&apos;t have an account?{' '}
          <a href="/sign-up" className="text-violet-400 hover:text-violet-300">Sign up</a>
        </p>
      </div>
    </div>
  );
}
