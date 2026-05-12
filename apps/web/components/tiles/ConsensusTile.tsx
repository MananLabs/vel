'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface ConsensusTileData {
  workspaceId: string;
}

const MODELS = [
  { label: 'Claude', key: 'claude', color: '#8B5CF6', icon: '◆' },
  { label: 'GPT-4o', key: 'gpt', color: '#10B981', icon: '●' },
  { label: 'Gemini', key: 'gemini', color: '#3B82F6', icon: '◈' },
];

function ConsensusTile({ id, data, selected }: NodeProps<ConsensusTileData>) {
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [synthesis, setSynthesis] = useState('');
  const [synthStreaming, setSynthStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'claude' | 'gpt' | 'gemini' | 'synthesis'
  >('claude');

  const sendConsensus = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    const prompt = input.trim();
    setInput('');
    setIsStreaming(true);
    setResponses({});
    setSynthesis('');

    // Simulate streaming for demo (replace with actual API call)
    for (const model of MODELS) {
      setResponses((prev) => ({ ...prev, [model.key]: '' }));
    }

    // In production, this calls the /ai/consensus endpoint
    // For now, show the tile with streaming UI
    setTimeout(() => {
      setResponses({
        claude: `**Claude's analysis of:** "${prompt}"\n\nBased on my analysis, this is a comprehensive response that considers multiple perspectives and provides nuanced insights.`,
        gpt: `**GPT-4o's response to:** "${prompt}"\n\nI've analyzed this from multiple angles. Here's my structured take on the topic with practical recommendations.`,
        gemini: `**Gemini's perspective on:** "${prompt}"\n\nDrawing from a broad knowledge base and multimodal understanding, here's my detailed analysis.`,
      });
      setIsStreaming(false);
      setSynthStreaming(true);

      setTimeout(() => {
        setSynthesis(
          `## 🎯 Consensus Synthesis\n\n**Key Agreements:** All three models agree on the fundamental aspects.\n\n**Notable Differences:** Claude provided deeper reasoning, GPT-4o was more practical, Gemini offered broader context.\n\n**Strongest Combined Answer:** The synthesis of all three perspectives provides the most comprehensive response.`,
        );
        setSynthStreaming(false);
      }, 1500);
    }, 2000);
  }, [input, isStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendConsensus();
    }
  };

  const currentContent =
    activeTab === 'synthesis' ? synthesis : responses[activeTab] || '';

  return (
    <div
      className="vel-tile tile-spawn"
      style={{
        width: 620,
        minHeight: 520,
        maxHeight: 700,
        borderColor: selected
          ? 'var(--vel-border-active)'
          : 'var(--vel-border-subtle)',
        borderTopWidth: 3,
        borderTopColor: '#6D5FFF',
        boxShadow: selected
          ? 'var(--shadow-tile), var(--shadow-accent)'
          : 'var(--shadow-tile)',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#6D5FFF', border: 'none', width: 10, height: 10 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#6D5FFF', border: 'none', width: 10, height: 10 }}
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
          <span style={{ fontSize: 16 }}>⚡</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            Consensus Mode
          </span>
          <span
            style={{
              fontSize: 10,
              color: 'var(--vel-text-muted)',
              background: 'var(--vel-accent-muted)',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            3 models
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            color: 'var(--vel-text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          19cr
        </span>
      </div>

      {/* Model tabs */}
      <div
        style={{
          display: 'flex',
          gap: 2,
          padding: '6px 8px',
          borderBottom: '1px solid var(--vel-border-subtle)',
        }}
      >
        {MODELS.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveTab(m.key as 'claude' | 'gpt' | 'gemini')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '6px 0',
              background:
                activeTab === m.key ? `${m.color}15` : 'transparent',
              border: `1px solid ${
                activeTab === m.key ? `${m.color}40` : 'transparent'
              }`,
              borderRadius: 6,
              color:
                activeTab === m.key
                  ? 'var(--vel-text-primary)'
                  : 'var(--vel-text-muted)',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 150ms',
            }}
          >
            <span style={{ color: m.color, fontSize: 10 }}>{m.icon}</span>
            {m.label}
            {responses[m.key] && (
              <span style={{ color: '#22C55E', fontSize: 8 }}>●</span>
            )}
          </button>
        ))}
        <button
          onClick={() => setActiveTab('synthesis')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '6px 0',
            background:
              activeTab === 'synthesis'
                ? 'var(--vel-accent-muted)'
                : 'transparent',
            border: `1px solid ${
              activeTab === 'synthesis'
                ? 'var(--vel-border-active)'
                : 'transparent'
            }`,
            borderRadius: 6,
            color:
              activeTab === 'synthesis'
                ? 'var(--vel-accent)'
                : 'var(--vel-text-muted)',
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
            transition: 'all 150ms',
          }}
        >
          🎯 Synthesis
        </button>
      </div>

      {/* Content area */}
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
        {!currentContent && !isStreaming && (
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
            <div style={{ fontSize: 32 }}>⚡</div>
            <p style={{ fontSize: 13 }}>
              Ask a question to compare 3 AI models
            </p>
            <p style={{ fontSize: 11, color: 'var(--vel-text-disabled)' }}>
              Claude + GPT-4o + Gemini → AI Synthesis
            </p>
          </div>
        )}

        {isStreaming && !currentContent && (
          <div
            style={{
              display: 'flex',
              gap: 4,
              padding: '6px 0',
              alignItems: 'center',
            }}
          >
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                className="streaming-dot"
                style={{
                  background:
                    MODELS.find((m) => m.key === activeTab)?.color ||
                    '#6D5FFF',
                  animationDelay: `${j * 0.2}s`,
                }}
              />
            ))}
            <span style={{ fontSize: 11, color: 'var(--vel-text-muted)', marginLeft: 8 }}>
              {activeTab === 'synthesis' ? 'Synthesizing...' : `${MODELS.find(m => m.key === activeTab)?.label} is thinking...`}
            </span>
          </div>
        )}

        {currentContent && (
          <ReactMarkdown>{currentContent}</ReactMarkdown>
        )}
      </div>

      {/* Input */}
      <div
        className="nodrag"
        style={{
          borderTop: '1px solid var(--vel-border-subtle)',
          padding: '10px 12px',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask all 3 models..."
          rows={1}
          disabled={isStreaming}
          style={{
            flex: 1,
            background: 'var(--vel-bg-elevated)',
            border: '1px solid var(--vel-border-subtle)',
            borderRadius: 8,
            padding: '8px 12px',
            color: 'var(--vel-text-primary)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13,
            resize: 'none',
            outline: 'none',
            minHeight: 36,
          }}
        />
        <button
          onClick={sendConsensus}
          disabled={!input.trim() || isStreaming}
          className="btn-primary"
          style={{
            width: 36,
            height: 36,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            opacity: !input.trim() || isStreaming ? 0.4 : 1,
            fontSize: 14,
          }}
        >
          ⚡
        </button>
      </div>
    </div>
  );
}

export const ConsensusTileNode = memo(ConsensusTile);
