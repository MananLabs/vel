'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  Bot,
  CirclePlus,
  FolderOpen,
  Globe,
  Image as ImageIcon,
  Mic,
  Plus,
  Search,
  Settings2,
  SunMedium,
} from 'lucide-react';
import { getAvailableModels } from '@vel-ai/shared/types/models';
import { useWorkspaceStore } from '@/lib/stores/workspace.store';
import { useCreditStore } from '@/lib/stores/credits.store';
import { CreateProjectModal } from '@/components/workspace/CreateProjectModal';
import { ModelPreferencesModal } from '@/components/workspace/ModelPreferencesModal';
import { NewWorkspaceModal } from '@/components/workspace/NewWorkspaceModal';

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const { setCurrentWorkspace } = useWorkspaceStore();
  const { balance } = useCreditStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showModelPreferences, setShowModelPreferences] = useState(false);

  useEffect(() => {
    setCurrentWorkspace(workspaceId, 'Workspace');
  }, [workspaceId, setCurrentWorkspace]);

  const models = useMemo(() => getAvailableModels(), []);

  return (
    <div className="flex min-h-screen bg-transparent text-[var(--vel-text)]">
      <aside className="hidden w-72 shrink-0 border-r border-[var(--vel-border-subtle)] bg-[var(--vel-surface)]/90 px-4 py-4 lg:flex lg:flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="VEL AI logo" width={28} height={28} />
            <span className="font-display text-lg font-bold tracking-tight">VEL AI</span>
          </div>
          <button className="rounded-md p-1 text-[var(--vel-text-secondary)] transition-colors hover:bg-[var(--vel-card)] hover:text-[var(--vel-text)]">
            <SunMedium className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--vel-text-muted)]" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="h-9 w-full rounded-md border border-[var(--vel-border)] bg-[var(--vel-card)] pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-[var(--vel-text-muted)] focus:border-[var(--vel-border-focus)]"
            />
          </label>
        </div>

        <div className="mt-3 space-y-1">
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-[var(--vel-card)]">
            <CirclePlus className="h-4 w-4 text-[var(--vel-violet)]" />
            New Chat
          </button>

          <button
            onClick={() => setShowNewWorkspaceModal(true)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--vel-card)]"
          >
            <span className="inline-flex items-center gap-2">
              <Bot className="h-4 w-4 text-[var(--vel-violet)]" />
              Workspace
            </span>
            <Plus className="h-4 w-4 text-[var(--vel-text-muted)]" />
          </button>

          <button
            onClick={() => setShowCreateProjectModal(true)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--vel-card)]"
          >
            <span className="inline-flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-[var(--vel-violet)]" />
              Projects
            </span>
            <Plus className="h-4 w-4 text-[var(--vel-text-muted)]" />
          </button>

          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--vel-card)]">
            <ImageIcon className="h-4 w-4 text-[var(--vel-violet)]" />
            Image Studio
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-[var(--vel-border)] bg-[var(--vel-card)] p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--vel-text-muted)]">Workspace Controls</p>
          <button
            onClick={() => setShowModelPreferences(true)}
            className="mt-2 inline-flex items-center gap-2 rounded-md border border-[var(--vel-border)] bg-[var(--vel-overlay)] px-3 py-2 text-xs font-medium text-[var(--vel-text-secondary)] transition-colors hover:border-[var(--vel-border-focus)] hover:text-[var(--vel-text)]"
          >
            <Settings2 className="h-4 w-4" />
            Model Preferences
          </button>
        </div>

        <div className="mt-auto space-y-3">
          <div className="rounded-lg border border-[var(--vel-border)] bg-[var(--vel-card)] p-3">
            <p className="text-sm font-semibold">Free Plan</p>
            <p className="mt-1 text-xs text-[var(--vel-text-secondary)]">0 / {balance} messages used</p>
            <div className="mt-2 h-1.5 rounded-full bg-[var(--vel-overlay)]" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[var(--vel-border)] bg-[var(--vel-card)] p-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--vel-overlay)] text-xs font-semibold">S</span>
            <div>
              <p className="text-sm font-medium">Somesh</p>
              <p className="text-xs text-[var(--vel-text-secondary)]">Personal Workspace</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="border-b border-[var(--vel-border-subtle)] px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-lg font-semibold tracking-tight">Workspace</h1>
            <button
              onClick={() => setShowModelPreferences(true)}
              className="inline-flex items-center gap-2 rounded-md border border-[var(--vel-border)] bg-[var(--vel-card)] px-3 py-2 text-xs text-[var(--vel-text-secondary)] transition-colors hover:text-[var(--vel-text)]"
            >
              <Settings2 className="h-4 w-4" />
              Models
            </button>
          </div>
        </div>

        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
          <div className="mx-auto mb-6 text-center">
            <Image src="/logo.png" alt="VEL AI" width={56} height={56} className="mx-auto" />
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">How can I assist you today?</h2>
            <p className="mt-2 text-sm text-[var(--vel-text-secondary)]">Ask once, compare clearly, and keep all project context in one workspace.</p>
          </div>

          <div className="rounded-2xl border border-[var(--vel-border)] bg-[var(--vel-card)] p-4 sm:p-5">
            <textarea
              placeholder="Ask anything..."
              className="h-28 w-full resize-none border-none bg-transparent text-sm outline-none placeholder:text-[var(--vel-text-muted)]"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--vel-border-subtle)] pt-3">
              <div className="flex items-center gap-2">
                <button className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--vel-border)] bg-[var(--vel-overlay)] px-3 text-xs text-[var(--vel-text-secondary)] transition-colors hover:text-[var(--vel-text)]">
                  <Plus className="h-4 w-4" /> Upload
                </button>
                <button className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--vel-border)] bg-[var(--vel-overlay)] px-3 text-xs text-[var(--vel-text-secondary)] transition-colors hover:text-[var(--vel-text)]">
                  <Mic className="h-4 w-4" /> Voice
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--vel-border)] bg-[var(--vel-overlay)] px-3 text-xs text-[var(--vel-text-secondary)] transition-colors hover:text-[var(--vel-text)]">
                  <Globe className="h-4 w-4" /> Web Search
                </button>
                <button className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--vel-border)] bg-[var(--vel-overlay)] px-3 text-xs text-[var(--vel-text-secondary)] transition-colors hover:text-[var(--vel-text)]">
                  <ImageIcon className="h-4 w-4" /> Generate Image
                </button>
                <button className="btn-primary h-9 rounded-md px-4 text-xs">Send</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <NewWorkspaceModal open={showNewWorkspaceModal} onClose={() => setShowNewWorkspaceModal(false)} />
      <CreateProjectModal open={showCreateProjectModal} onClose={() => setShowCreateProjectModal(false)} />
      <ModelPreferencesModal
        open={showModelPreferences}
        onClose={() => setShowModelPreferences(false)}
        models={models}
      />
    </div>
  );
}
