'use client';

import { memo } from 'react';

const MODELS = [
  { name: 'Claude Sonnet 4', provider: 'Anthropic', color: '#8B5CF6', credits: 8, tier: 'Pro' },
  { name: 'GPT-4o', provider: 'OpenAI', color: '#10B981', credits: 8, tier: 'Pro' },
  { name: 'Gemini 1.5 Pro', provider: 'Google', color: '#3B82F6', credits: 6, tier: 'Pro' },
  { name: 'GPT-4o Mini', provider: 'OpenAI', color: '#6EE7B7', credits: 2, tier: 'Free' },
  { name: 'Gemini Flash', provider: 'Google', color: '#93C5FD', credits: 1, tier: 'Free' },
  { name: 'Sonar Pro', provider: 'Perplexity', color: '#F59E0B', credits: 5, tier: 'Pro' },
  { name: 'Grok 2', provider: 'xAI', color: '#EF4444', credits: 6, tier: 'Pro' },
  { name: 'Llama 3.1 70B', provider: 'Meta', color: '#06B6D4', credits: 3, tier: 'Free' },
];

function ModelGridInner() {
  return (
    <section id="models" style={{ padding: '128px 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED', marginBottom: 16 }}>Integrated Models</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Every frontier model<span style={{ color: '#7C3AED' }}>.</span><br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>One workspace.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260, 1fr))', gap: 12 }}>
          {MODELS.map((m) => (
            <div key={m.name} style={{ padding: 20, borderRadius: 16, background: 'rgba(10,10,12,0.9)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 300ms' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${m.color}15`, border: `1px solid ${m.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, boxShadow: `0 0 12px ${m.color}` }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{m.provider}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)' }}>{m.credits}cr</div>
                <div style={{ fontSize: 10, color: m.tier === 'Free' ? '#22C55E' : '#7C3AED', fontWeight: 600 }}>{m.tier}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const ModelGrid = memo(ModelGridInner);
