'use client';

import { Nav } from '@/components/marketing/Nav';
import { Hero } from '@/components/marketing/Hero';
import { FeatureGrid } from '@/components/marketing/FeatureGrid';
import { TerminalShowcase } from '@/components/marketing/TerminalShowcase';
import { ModelGrid } from '@/components/marketing/ModelGrid';
import { PricingCards } from '@/components/marketing/PricingCards';
import { FinalCta } from '@/components/marketing/FinalCta';
import { Footer } from '@/components/marketing/Footer';

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        color: '#E8E8E8',
        fontFamily: 'var(--font-body)',
        overflow: 'hidden',
      }}
    >
      <Nav />
      <Hero />

      {/* Logo strip */}
      <section
        style={{
          padding: '96px 0',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(255,255,255,0.01)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <p
            style={{
              textAlign: 'center',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: 48,
            }}
          >
            Integrated with the frontier of intelligence
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '48px 64px',
              opacity: 0.4,
              filter: 'grayscale(1)',
              transition: 'all 700ms',
            }}
          >
            {['Anthropic', 'OpenAI', 'Google DeepMind', 'Perplexity', 'Meta AI', 'DeepSeek', 'xAI'].map(
              (logo) => (
                <span
                  key={logo}
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {logo}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <FeatureGrid />
      <TerminalShowcase />
      <ModelGrid />
      <PricingCards />
      <FinalCta />
      <Footer />
    </div>
  );
}
