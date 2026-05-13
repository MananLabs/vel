'use client';

import { memo } from 'react';
import Link from 'next/link';

const PLANS = [
  { name: 'Free', price: '$0', subtitle: 'Get started', features: ['500 credits/mo', 'Core models', '3 workspaces'] },
  { name: 'Pro', price: '$29', subtitle: 'For builders', features: ['10,000 credits/mo', 'All models', 'Consensus mode'], highlight: true },
  { name: 'BYOK', price: '$9', subtitle: 'Use your keys', features: ['Unlimited usage', 'Custom routing', 'Priority support'] },
];

function PricingCardsInner() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-[clamp(30px,4.8vw,52px)] font-bold text-white">Simple pricing.</h2>
          <p className="mt-3 text-white/60">Start free and scale as your workload grows.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-6 ${plan.highlight ? 'border-sky-300/40 bg-sky-400/10' : 'border-white/10 bg-white/[0.03]'}`}
            >
              <div className="text-sm font-semibold text-white">{plan.name}</div>
              <div className="mt-2 text-4xl font-bold text-white">{plan.price}<span className="text-base text-white/50">/mo</span></div>
              <div className="mt-1 text-sm text-white/60">{plan.subtitle}</div>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                {plan.features.map((f) => <li key={f}>• {f}</li>)}
              </ul>
              <Link href="/sign-up" className="mt-6 block rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white no-underline transition hover:bg-white/10">
                Choose {plan.name}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export const PricingCards = memo(PricingCardsInner);
