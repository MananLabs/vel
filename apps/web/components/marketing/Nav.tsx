'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function NavInner() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto w-[95vw] md:w-auto md:min-w-[800px]"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 8,
            borderRadius: 9999,
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 40px rgba(0,0,0,0.5)',
            transition: 'all 500ms',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              paddingLeft: 8,
              paddingRight: 16,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 14,
              }}
            >
              ✦
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '-0.02em',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              VEL AI
              <span style={{ color: '#7C3AED' }}>.</span>
            </span>
          </Link>

          <div
            className="hidden md:flex"
            style={{
              alignItems: 'center',
              gap: 4,
              padding: '4px 12px',
              borderRadius: 9999,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {['Features', 'Models', 'Workspace', 'Pricing'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  padding: '6px 16px',
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'all 150ms',
                }}
              >
                {item}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 4 }}>
            <Link
              href="/sign-in"
              className="hidden md:block"
              style={{
                padding: '8px 16px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
              }}
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 20px',
                borderRadius: 9999,
                background: '#7C3AED',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 150ms',
                boxShadow: '0 0 20px rgba(124,58,237,0.3)',
              }}
            >
              Launch App →
            </Link>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}

export const Nav = memo(NavInner);
