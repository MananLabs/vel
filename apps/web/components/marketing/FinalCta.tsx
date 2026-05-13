'use client';

import { memo } from 'react';
import Link from 'next/link';

function FinalCtaInner() {
  return (
    <section style={{ padding: '128px 0', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
          Stop switching tabs<span style={{ color: '#7C3AED' }}>.</span><br />
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Start orchestrating.</span>
        </h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 40 }}>
          Join teams using VEL AI to run multiple AI models in one infinite workspace.
        </p>
        <Link href="/sign-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 52, padding: '0 36px', borderRadius: 9999, background: '#7C3AED', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', boxShadow: '0 0 48px rgba(124,58,237,0.35)', transition: 'all 150ms' }}>
          Start Building for Free →
        </Link>
      </div>
    </section>
  );
}

export const FinalCta = memo(FinalCtaInner);
