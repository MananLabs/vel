import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from '@/components/providers/query-provider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'VEL AI — Infinite Multi-Agent AI Workspace',
  description:
    'Run Claude, GPT-4o, and Gemini simultaneously on an infinite canvas. Share context between agents. Ship faster.',
  keywords: [
    'AI workspace',
    'multi-agent',
    'Claude',
    'GPT-4',
    'Gemini',
    'AI orchestration',
  ],
  openGraph: {
    title: 'VEL AI — Infinite Multi-Agent AI Workspace',
    description: 'The operating system layer for AI workflows',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VEL AI',
    description: 'Infinite Multi-Agent AI Operating Workspace',
  },
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = clerkKey && clerkKey.startsWith('pk_') && clerkKey.length > 20;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = <QueryProvider>{children}</QueryProvider>;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-transparent text-[#E8E8E8] font-body selection:bg-white/20 selection:text-white">
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#020203]">
          <img
            src="/bg3.avif"
            alt="Background"
            className="w-full h-full object-cover object-top opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-[#020203]/40 to-[#020203]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020203] via-transparent to-[#020203]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020203_120%)]" />
        </div>
        {hasValidClerkKey ? (
          <ClerkProvider
            appearance={{
              variables: {
                colorPrimary: '#6D5FFF',
                colorBackground: '#0C0C10',
                colorText: '#F4F4F6',
                colorInputBackground: '#12121A',
                colorInputText: '#F4F4F6',
                borderRadius: '10px',
              },
            }}
          >
            {content}
          </ClerkProvider>
        ) : (
          content
        )}
      </body>
    </html>
  );
}
