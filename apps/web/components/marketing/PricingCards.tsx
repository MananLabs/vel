'use client';

import { memo } from 'react';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    credits: '500 credits/mo',
    features: ['3 workspaces', 'GPT-4o Mini, Gemini Flash, Llama', 'Basic context routing', 'Community support'],
  },
  {
    name: 'Pro',
    price: '$29',
    credits: '10,000 credits/mo',
    highlight: true,
    badge: 'Most Popular',
    features: ['Unlimited workspaces', 'All 12+ models', 'Consensus Mode', 'Priority streaming', 'Export & API access', 'Email support'],
  },
  {
    name: 'Pro BYOK',
    price: '$9',
    credits: 'Unlimited (your keys)',
    features: ['Everything in Pro', 'Bring your own API keys', 'Zero credit limits', 'Custom model routing', 'Priority support'],
  },
];

function PricingCardsInner() {
  return (
    <section id="pricing" style={{ padding: '128px 0' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Simple pricing<span style={{ color: '#7C3AED' }}>.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 12 }}>Start free. Scale when you need to.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{ padding: 32, borderRadius: 20, border: `1px solid ${plan.highlight ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.05)'}`, background: plan.highlight ? 'rgba(124,58,237,0.05)' : 'rgba(10,10,12,0.9)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {plan.badge && (
                <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 600, background: '#7C3AED', color: '#fff', padding: '4px 14px', borderRadius: 9999 }}>{plan.badge}</span>
              )}
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: 8 }}>{plan.name}</div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>/mo</span>
              </div>
              <div style={{ fontSize: 12, color: '#7C3AED', fontFamily: 'var(--font-mono)', marginBottom: 24 }}>{plan.credits}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', padding: '6px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" style={{ display: 'block', marginTop: 24, textAlign: 'center', padding: '12px 0', borderRadius: 10, background: plan.highlight ? '#7C3AED' : 'rgba(255,255,255,0.05)', border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.08)', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none', transition: 'all 150ms', boxShadow: plan.highlight ? '0 0 24px rgba(124,58,237,0.3)' : 'none' }}>
                {plan.name === 'Free' ? 'Get Started' : 'Upgrade'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const PricingCards = memo(PricingCardsInner);
