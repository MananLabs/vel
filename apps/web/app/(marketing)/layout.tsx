'use client';

import { type ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--vel-black)',
        color: '#E8E8E8',
      }}
    >
      {children}
    </div>
  );
}
