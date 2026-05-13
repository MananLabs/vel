'use client';

import { memo } from 'react';
import Link from 'next/link';

function FinalCtaInner() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-b from-sky-400/10 to-transparent px-8 py-14 text-center">
        <h2 className="text-[clamp(30px,4.8vw,52px)] font-bold leading-tight text-white">Stop tab-switching.<br />Start orchestrating.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/60">Bring your entire AI workflow into one production-grade workspace.</p>
        <Link href="/sign-up" className="mt-8 inline-block rounded-xl border border-sky-300/40 bg-sky-400/25 px-6 py-3 text-sm font-semibold text-sky-100 no-underline transition hover:bg-sky-300/35">
          Start Building Free
        </Link>
      </div>
    </section>
  );
}

export const FinalCta = memo(FinalCtaInner);
