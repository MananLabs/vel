'use client';

import { memo } from 'react';

function FooterInner() {
  return (
    <footer className="border-t border-white/10 px-6 py-12 text-sm text-white/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-semibold text-white">VEL AI</div>
          <div className="mt-1">Multi-agent workspace for shipping faster with AI.</div>
        </div>
        <div className="text-xs">© {new Date().getFullYear()} VEL AI</div>
      </div>
    </footer>
  );
}

export const Footer = memo(FooterInner);
