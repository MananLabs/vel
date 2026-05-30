'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';

function PasswordRequirements({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /\d/.test(password) },
    { label: 'Special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-2 text-xs">
          <span className={c.met ? 'text-green-400' : 'text-[#555]'}>{c.met ? '✓' : '○'}</span>
          <span className={c.met ? 'text-green-400' : 'text-[#666]'}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp.email({ email, password, name });
      // TEMPORARILY DISABLED FOR DEVELOPMENT - skip email verification screen
      // RE-ENABLE BEFORE PRODUCTION LAUNCH
      router.replace('/sign-in?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    padding: '48px 40px', borderRadius: 24,
    background: 'rgba(17, 17, 17, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(24px)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
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
      <div className="relative z-10 w-full max-w-[420px] mx-4" style={cardStyle}>
        <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center">
          <img src="/logo.avif" alt="VEL AI" width={56} height={56} className="rounded-lg" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2 text-center">Create Account</h2>
        <p className="text-sm text-[#888] mb-8 text-center">Join VEL AI</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#888] mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              placeholder="Your name" required />
          </div>
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
              placeholder="At least 8 characters" required minLength={8} />
            <PasswordRequirements password={password} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-[#666] mt-6">
          Already have an account?{' '}
          <a href="/sign-in" className="text-violet-400 hover:text-violet-300">Sign in</a>
        </p>
      </div>
    </div>
  );
}
