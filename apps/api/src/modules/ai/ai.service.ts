// ═══════════════════════════════════════════════════════════
// VEL AI — AI Service (OpenRouter Integration)
// ═══════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import type { AuthenticatedUser } from '../../common/types';

interface StreamOptions {
  model: string;
  messages: Array<{ role: string; content: string }>;
  user: AuthenticatedUser;
  byokKey?: string | null;
  maxTokens?: number;
}

interface StreamChunk {
  choices?: Array<{
    delta?: { content?: string };
    finish_reason?: string | null;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  async *createStream(options: StreamOptions): AsyncGenerator<StreamChunk> {
    const { model, messages, maxTokens = 4096 } = options;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    // Resolve model ID to OpenRouter model string
    const openRouterId = this.resolveModelId(model);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'https://vel.ai',
        'X-Title': 'VEL AI Workspace',
      },
      body: JSON.stringify({
        model: openRouterId,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: maxTokens,
        stream: true,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`OpenRouter error: ${response.status} - ${errorText}`);
      throw new Error(`AI model error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body from AI provider');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const data = trimmed.slice(6);
          if (data === '[DONE]') {
            return;
          }

          try {
            const parsed = JSON.parse(data) as StreamChunk;
            yield parsed;
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private resolveModelId(modelId: string): string {
    // If already an OpenRouter model string, pass through
    if (modelId.includes('/')) return modelId;

    // Map our model IDs to OpenRouter
    const modelMap: Record<string, string> = {
      'claude-opus-4': 'anthropic/claude-opus-4',
      'claude-sonnet-4': 'anthropic/claude-sonnet-4',
      'claude-haiku-3-5': 'anthropic/claude-3.5-haiku',
      'gpt-4o': 'openai/gpt-4o',
      'gpt-4-1': 'openai/gpt-4.1',
      'o3-mini': 'openai/o3-mini',
      'codex': 'openai/codex-mini-latest',
      'gemini-2-flash': 'google/gemini-2.0-flash-001',
      'gemini-1-5-pro': 'google/gemini-pro-1.5',
      'perplexity-sonar-pro': 'perplexity/sonar-pro',
      'grok-3': 'x-ai/grok-3-beta',
      'llama-3-3-70b': 'meta-llama/llama-3.3-70b-instruct',
    };

    return modelMap[modelId] || modelId;
  }
}
