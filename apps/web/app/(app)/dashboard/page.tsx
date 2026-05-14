'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

const MOCK_WORKSPACES = [
  {
    id: '1',
    name: 'Product Research Sprint',
    tileCount: 5,
    lastOpenedAt: '2 hours ago',
    models: ['Claude', 'GPT-4o'],
  },
  {
    id: '2',
    name: 'Code Architecture Review',
    tileCount: 3,
    lastOpenedAt: '1 day ago',
    models: ['Claude', 'Codex'],
  },
  {
    id: '3',
    name: 'Market Analysis',
    tileCount: 8,
    lastOpenedAt: '3 days ago',
    models: ['Gemini', 'Sonar Pro', 'Claude'],
  },
];

const TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    icon: '◻',
    desc: 'Start from scratch',
  },
  {
    id: 'research',
    name: 'Research Sprint',
    icon: '🔍',
    desc: 'Claude + Sonar + Gemini',
  },
  {
    id: 'code',
    name: 'Code Review',
    icon: '💻',
    desc: 'Claude + Codex + Terminal',
  },
  {
    id: 'consensus',
    name: 'Decision Engine',
    icon: '⚡',
    desc: 'Consensus Mode + Research',
  },
  {
    id: 'content',
    name: 'Content Pipeline',
    icon: '✍️',
    desc: 'Multi-model content generation',
  },
  {
    id: 'analysis',
    name: 'Data Analysis',
    icon: '📊',
    desc: 'Gemini + Claude + Sheets',
  },
];

export default function DashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        color: 'var(--vel-text-primary)',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px',
          borderBottom: '1px solid var(--vel-border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Image src="/logo.avif" alt="VEL AI logo" width={32} height={32} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
            VEL AI
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              background: 'var(--vel-bg-surface)',
              border: '1px solid var(--vel-border-subtle)',
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            <span className="credit-ok" style={{ fontWeight: 600 }}>
              100
            </span>
            <span style={{ color: 'var(--vel-text-muted)', fontSize: 11 }}>
              credits
            </span>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: 32, height: 32 },
              },
            }}
          />
        </div>
      </header>

      {/* Content */}
      <main
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '48px 32px',
        }}
      >
        {/* Title + Create */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 36,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-1px',
              }}
            >
              Workspaces
            </h1>
            <p
              style={{
                fontSize: 14,
                color: 'var(--vel-text-secondary)',
                marginTop: 4,
              }}
            >
              Your AI operating environments
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              fontSize: 14,
            }}
          >
            <span>+</span>
            New Workspace
          </button>
        </div>

        {/* Workspace grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          {MOCK_WORKSPACES.map((ws, i) => (
            <motion.div
              key={ws.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/workspace/${ws.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    background: 'var(--vel-bg-surface)',
                    border: '1px solid var(--vel-border-subtle)',
                    borderRadius: 14,
                    padding: 24,
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      'var(--vel-border-active)';
                    (e.currentTarget as HTMLElement).style.transform =
                      'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '';
                    (e.currentTarget as HTMLElement).style.transform = '';
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="canvas-background"
                    style={{
                      height: 140,
                      borderRadius: 8,
                      marginBottom: 16,
                      border: '1px solid var(--vel-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        opacity: 0.4,
                      }}
                    >
                      {[0, 1, 2].map((j) => (
                        <div
                          key={j}
                          style={{
                            width: 48,
                            height: 40,
                            background: 'var(--vel-bg-elevated)',
                            borderRadius: 6,
                            border: '1px solid var(--vel-border-subtle)',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'Clash Display, sans-serif',
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    {ws.name}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: 6,
                      }}
                    >
                      {ws.models.map((m) => (
                        <span
                          key={m}
                          style={{
                            fontSize: 10,
                            padding: '2px 6px',
                            background: 'var(--vel-bg-elevated)',
                            borderRadius: 4,
                            color: 'var(--vel-text-secondary)',
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--vel-text-muted)',
                      }}
                    >
                      {ws.lastOpenedAt}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--vel-bg-surface)',
              border: '1px solid var(--vel-border-default)',
              borderRadius: 16,
              padding: 32,
              width: 520,
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-modal)',
            }}
          >
            <h2
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 24,
              }}
            >
              Create Workspace
            </h2>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Workspace name..."
              autoFocus
              style={{
                width: '100%',
                background: 'var(--vel-bg-elevated)',
                border: '1px solid var(--vel-border-subtle)',
                borderRadius: 10,
                padding: '12px 16px',
                color: 'var(--vel-text-primary)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                outline: 'none',
                marginBottom: 24,
              }}
            />

            <p
              style={{
                fontSize: 12,
                color: 'var(--vel-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 12,
              }}
            >
              Choose a template
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                marginBottom: 24,
              }}
            >
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '16px 8px',
                    background:
                      selectedTemplate === t.id
                        ? 'var(--vel-accent-muted)'
                        : 'transparent',
                    border: `1px solid ${
                      selectedTemplate === t.id
                        ? 'var(--vel-border-active)'
                        : 'var(--vel-border-subtle)'
                    }`,
                    borderRadius: 10,
                    color: 'var(--vel-text-primary)',
                    cursor: 'pointer',
                    transition: 'all 150ms',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{t.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    {t.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: 'var(--vel-text-muted)',
                    }}
                  >
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <Link
                href="/workspace/new"
                className="btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Create Workspace
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
