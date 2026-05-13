'use client';

import { memo } from 'react';

const FEATURES = [
  {
    title: 'Autonomous Swarms',
    desc: 'Deploy multiple specialized agents to handle repetitive research and engineering pipelines.',
    icon: '🔮',
    span: 1,
  },
  {
    title: 'Infinite Routing',
    desc: "Design complex acyclic graphs. Output from GPT-4o flows directly into Claude's context window.",
    icon: '🌐',
    span: 2,
  },
  {
    title: 'Shared Context',
    desc: 'A persistent memory store ensures all agents maintain exact situational awareness.',
    icon: '📡',
    span: 1,
  },
  {
    title: 'Terminal Sandboxes',
    desc: 'Deploy agents that can write, execute, and debug bash scripts natively.',
    icon: '⌨️',
    span: 1,
  },
  {
    title: 'Deep Research',
    desc: 'Multi-pass data extraction powered by Perplexity Sonar and continuous learning.',
    icon: '🔍',
    span: 1,
  },
];

function FeatureGridInner() {
  return (
    <section id="features" style={{ padding: '160px 0', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Infinite Canvas
            <span style={{ color: '#7C3AED' }}>.</span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Zero limitations.</span>
          </h2>
          <p
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: 640,
              lineHeight: 1.7,
            }}
          >
            Break out of the chat box. Orchestrate complex workflows with multi-agent
            consensus, live terminal execution, and persistent shared context.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                gridColumn: `span ${f.span}`,
                padding: 32,
                borderRadius: 24,
                background: 'rgba(10,10,12,0.9)',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                minHeight: 320,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 500ms',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 32,
                  left: 32,
                  fontSize: 40,
                  opacity: 0.8,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  marginBottom: 8,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.6,
                  maxWidth: f.span > 1 ? 480 : undefined,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const FeatureGrid = memo(FeatureGridInner);
