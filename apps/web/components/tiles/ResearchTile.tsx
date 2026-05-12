'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import ReactMarkdown from 'react-markdown';

interface ResearchTileData {
  workspaceId: string;
}

function ResearchTile({ id, data, selected }: NodeProps<ResearchTileData>) {
  const [query, setQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [results, setResults] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startResearch = useCallback(async () => {
    if (!query.trim() || isResearching) return;
    const topic = query.trim();
    setQuery('');
    setIsResearching(true);
    setResults('');
    setSources([]);
    setProgress(0);

    // Simulated multi-pass research
    const phases = [
      { label: 'Searching web sources...', pct: 25 },
      { label: 'Analyzing top results...', pct: 50 },
      { label: 'Cross-referencing data...', pct: 75 },
      { label: 'Generating summary...', pct: 95 },
    ];

    for (const phase of phases) {
      await new Promise((r) => setTimeout(r, 800));
      setProgress(phase.pct);
    }

    setResults(
      `## Research: ${topic}\n\n` +
        `### Key Findings\n\n` +
        `Based on comprehensive web research, here are the main findings:\n\n` +
        `1. **Primary insight** — The most relevant and up-to-date information on this topic.\n\n` +
        `2. **Supporting evidence** — Multiple credible sources confirm these findings.\n\n` +
        `3. **Expert consensus** — Leading experts in the field generally agree on these points.\n\n` +
        `### Detailed Analysis\n\n` +
        `The research reveals several important patterns and trends that should be considered when evaluating this topic. Multiple independent sources corroborate the core findings.`,
    );
    setSources([
      'perplexity.ai/search',
      'scholar.google.com',
      'arxiv.org',
      'wikipedia.org',
    ]);
    setProgress(100);
    setIsResearching(false);
  }, [query, isResearching]);

  return (
    <div
      className="vel-tile tile-spawn"
      style={{
        width: 420,
        minHeight: 520,
        maxHeight: 700,
        borderColor: selected
          ? 'var(--vel-border-active)'
          : 'var(--vel-border-subtle)',
        borderTopColor: '#14B8A6',
        borderTopWidth: 3,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#14B8A6', border: 'none', width: 10, height: 10 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#14B8A6', border: 'none', width: 10, height: 10 }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid var(--vel-border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>🔍</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Deep Research</span>
          <span
            style={{
              fontSize: 10,
              color: '#14B8A6',
              background: 'rgba(20,184,166,0.12)',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            Sonar Pro
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            color: 'var(--vel-text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          20cr
        </span>
      </div>

      {/* Progress bar */}
      {isResearching && (
        <div
          style={{
            height: 2,
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #14B8A6, #3B82F6)',
              transition: 'width 400ms ease',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div
        className="nodrag nowheel"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px',
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        {!results && !isResearching && (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--vel-text-muted)',
              textAlign: 'center',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 32 }}>🔍</div>
            <p style={{ fontSize: 13 }}>Enter a research topic</p>
            <p style={{ fontSize: 11, color: 'var(--vel-text-disabled)' }}>
              Multi-pass web research with citations
            </p>
          </div>
        )}

        {isResearching && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#14B8A6',
              fontSize: 12,
            }}
          >
            <div className="streaming-dot" style={{ background: '#14B8A6' }} />
            <div
              className="streaming-dot"
              style={{ background: '#14B8A6', animationDelay: '0.2s' }}
            />
            <div
              className="streaming-dot"
              style={{ background: '#14B8A6', animationDelay: '0.4s' }}
            />
            <span style={{ marginLeft: 4 }}>
              Researching... ({progress}%)
            </span>
          </div>
        )}

        {results && <ReactMarkdown>{results}</ReactMarkdown>}

        {sources.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p
              style={{
                fontSize: 11,
                color: 'var(--vel-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 8,
              }}
            >
              Sources ({sources.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {sources.map((src, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 11,
                    color: '#14B8A6',
                    padding: '4px 8px',
                    background: 'rgba(20,184,166,0.08)',
                    borderRadius: 4,
                  }}
                >
                  {i + 1}. {src}
                </div>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="nodrag"
        style={{
          borderTop: '1px solid var(--vel-border-subtle)',
          padding: '10px 12px',
          display: 'flex',
          gap: 8,
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') startResearch();
          }}
          placeholder="Research topic..."
          disabled={isResearching}
          style={{
            flex: 1,
            background: 'var(--vel-bg-elevated)',
            border: '1px solid var(--vel-border-subtle)',
            borderRadius: 8,
            padding: '8px 12px',
            color: 'var(--vel-text-primary)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          onClick={startResearch}
          disabled={!query.trim() || isResearching}
          className="btn-primary"
          style={{
            width: 36,
            height: 36,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            opacity: !query.trim() || isResearching ? 0.4 : 1,
            fontSize: 14,
          }}
        >
          🔍
        </button>
      </div>
    </div>
  );
}

export const ResearchTileNode = memo(ResearchTile);
