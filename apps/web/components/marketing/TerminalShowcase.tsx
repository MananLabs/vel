'use client';

import { memo } from 'react';

function TerminalShowcaseInner() {
  return (
    <section style={{ padding: '128px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(124,58,237,0.02) 0%, transparent 100%)' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 64, position: 'relative', zIndex: 10 }}>
        {/* Text */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 9999, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#7C3AED', fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>
            Agentic Execution
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 24 }}>
            AI that writes code.<br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>And actually runs it.</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 32 }}>
            Deploy autonomous terminal agents. They execute commands, read output, debug failures, and deploy infrastructure directly from your workspace.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['Secure isolated sandboxes', 'Real-time stdout/stderr streaming', 'Automated error recovery loops'].map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', boxShadow: '0 0 8px rgba(124,58,237,0.5)' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Terminal mockup */}
        <div style={{ flex: 1, minWidth: 360 }}>
          <div style={{ background: '#0A0A0C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, boxShadow: '0 0 60px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(239,68,68,0.8)' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(245,158,11,0.8)' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(34,197,94,0.8)' }} />
              <span style={{ marginLeft: 8, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)' }}>vel-ai@production:~</span>
            </div>
            <div style={{ padding: 24, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 2, height: 320, overflow: 'hidden', position: 'relative' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)' }}>~ <span style={{ color: '#7C3AED' }}>$</span> vel-agent deploy --target aws</div>
              <div style={{ color: '#A78BFA', marginTop: 8 }}>➔ Initializing Claude DevOps Agent...</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>Analyzing infrastructure requirements...</div>
              <div style={{ color: 'rgba(255,255,255,0.6)' }}>Generating Terraform states...</div>
              <div style={{ color: '#F59E0B', marginTop: 8 }}>⚠ Warning: Missing IAM permissions. Auto-generating policy patch.</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>Applying patches...</div>
              <div style={{ color: '#22C55E', marginTop: 16 }}>✔ Infrastructure successfully deployed in 14.2s</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>~ <span style={{ color: '#7C3AED' }}>$</span> <span style={{ animation: 'blink 1s step-end infinite' }}>_</span></div>
              <div style={{ position: 'absolute', insetInline: 0, bottom: 0, height: 96, background: 'linear-gradient(0deg, #0A0A0C, transparent)' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const TerminalShowcase = memo(TerminalShowcaseInner);
