// ═══════════════════════════════════════════════════════════
// VEL AI — API Request/Response Types
// ═══════════════════════════════════════════════════════════

import type { TileType } from './tiles';

export interface StreamAIRequest {
  model: string;
  messages: ChatMessage[];
  tileId: string;
  tileType: TileType;
  workspaceId: string;
  contextSources: string[];
  maxTokens?: number;
  requestId: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StreamEvent {
  type: 'delta' | 'done' | 'error' | 'context_injected';
  content?: string;
  tokensIn?: number;
  tokensOut?: number;
  latencyMs?: number;
  message?: string;
}

export interface ConsensusStreamEvent {
  type: 'delta' | 'synthesis_start' | 'synthesis_delta' | 'done' | 'error';
  model?: 'claude' | 'gpt' | 'gemini';
  content?: string;
  message?: string;
}

export interface ConsensusRequest {
  prompt: string;
  workspaceId: string;
  tileId: string;
  requestId: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  templateId?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  canvasState?: unknown;
  contextGraph?: unknown;
}

export interface CreditBalanceResponse {
  balance: number;
  monthlyAlloc: number;
  usedThisMonth: number;
  plan: string;
}

export interface TopUpRequest {
  credits: number;
  priceId: string;
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  version: string;
  uptime: number;
  services: {
    database: boolean;
    redis: boolean;
    openrouter: boolean;
  };
}
