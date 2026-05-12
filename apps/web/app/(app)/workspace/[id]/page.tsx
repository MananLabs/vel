'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { InfiniteCanvasProvider } from '@/components/canvas/InfiniteCanvas';
import { useWorkspaceStore } from '@/lib/stores/workspace.store';
import { useCreditStore } from '@/lib/stores/credits.store';
import { useActivityStore } from '@/lib/stores/activity.store';
import Link from 'next/link';

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const { setCurrentWorkspace, workspaceName, isSaving, lastSaved } =
    useWorkspaceStore();
  const { balance } = useCreditStore();
  const { events } = useActivityStore();

  useEffect(() => {
    setCurrentWorkspace(workspaceId, 'My Workspace');
  }, [workspaceId, setCurrentWorkspace]);

  const creditStatus =
    balance > 50 ? 'credit-ok' : balance > 15 ? 'credit-warn' : 'credit-low';

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--vel-bg-void)',
      }}
    >
      {/* Workspace header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid var(--vel-border-subtle)',
          background: 'var(--vel-bg-surface)',
          zIndex: 50,
          height: 48,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href="/dashboard"
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 18,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'baseline',
              gap: 4,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <span style={{ color: '#6D5FFF' }}>VEL</span>
            <span style={{ fontWeight: 300 }}>AI</span>
          </Link>

          <div
            style={{
              width: 1,
              height: 20,
              background: 'var(--vel-border-subtle)',
            }}
          />

          <span style={{ fontSize: 13, fontWeight: 500 }}>
            {workspaceName}
          </span>

          {isSaving && (
            <span
              style={{
                fontSize: 10,
                color: 'var(--vel-text-muted)',
                fontStyle: 'italic',
              }}
            >
              Saving...
            </span>
          )}
          {lastSaved && !isSaving && (
            <span style={{ fontSize: 10, color: 'var(--vel-text-disabled)' }}>
              Saved
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Credit badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              background: 'var(--vel-bg-elevated)',
              border: '1px solid var(--vel-border-subtle)',
              borderRadius: 6,
              fontSize: 12,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            <span className={creditStatus} style={{ fontWeight: 600 }}>
              {balance}
            </span>
            <span style={{ color: 'var(--vel-text-muted)', fontSize: 10 }}>
              cr
            </span>
          </div>

          {/* Activity count */}
          {events.length > 0 && (
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'var(--vel-accent-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#6D5FFF',
                fontWeight: 600,
              }}
            >
              {events.length}
            </div>
          )}

          <UserButton
            appearance={{
              elements: { avatarBox: { width: 28, height: 28 } },
            }}
          />
        </div>
      </header>

      {/* Canvas */}
      <div style={{ flex: 1 }}>
        <InfiniteCanvasProvider workspaceId={workspaceId} />
      </div>
    </div>
  );
}
