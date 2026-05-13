'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function HeroInner() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 96,
        paddingBottom: 128,
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 9999,
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#7C3AED',
              boxShadow: '0 0 12px #7C3AED',
              animation: 'pulse 2s infinite',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            The Infinite Multi-Agent Operating Workspace
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(40px, 5vw, 72px)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.6) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            paddingBottom: 8,
            margin: 0,
          }}
        >
          The Future of{' '}
          <br className="hidden md:block" />
          AI Workflows
          <span style={{ WebkitTextFillColor: '#7C3AED' }}>.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: 24,
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: 640,
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          VEL AI unifies Claude, GPT, Gemini, Perplexity, terminal agents,
          and intelligent workflows into one infinite workspace.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: 40,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <Link
            href="/sign-up"
            style={{
              height: 48,
              padding: '0 32px',
              borderRadius: 9999,
              background: '#7C3AED',
              color: '#fff',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              fontSize: 14,
              boxShadow: '0 0 40px rgba(124,58,237,0.3)',
              transition: 'all 150ms',
            }}
          >
            Start Building →
          </Link>
          <button
            style={{
              height: 48,
              padding: '0 32px',
              borderRadius: 9999,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              fontSize: 14,
              backdropFilter: 'blur(12px)',
              transition: 'all 150ms',
            }}
          >
            Watch Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export const Hero = memo(HeroInner);
