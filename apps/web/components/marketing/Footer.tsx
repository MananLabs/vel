'use client';

import { memo } from 'react';
import Link from 'next/link';

function FooterInner() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#020203', paddingTop: 96, paddingBottom: 48 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 64 }}>
        <div style={{ maxWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✦</div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
              VEL AI<span style={{ color: '#7C3AED' }}>.</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            The infinite multi-agent operating workspace. Unifying intelligence, execution, and context.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 64, fontSize: 13 }}>
          {[
            { title: 'Platform', links: ['Canvas', 'Models', 'Terminal', 'Pricing'] },
            { title: 'Resources', links: ['Documentation', 'API Reference', 'GitHub', 'Discord'] },
            { title: 'Company', links: ['Blog', 'Careers', 'Terms', 'Privacy'] },
          ].map((col) => (
            <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4 style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>{col.title}</h4>
              {col.links.map((l) => (
                <Link key={l} href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 150ms' }}>{l}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '96px auto 0', padding: '32px 24px 0', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
        <span>© {new Date().getFullYear()} VEL AI Inc. All rights reserved.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} /> All systems operational
        </div>
      </div>
    </footer>
  );
}

export const Footer = memo(FooterInner);
