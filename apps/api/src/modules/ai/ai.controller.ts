// ═══════════════════════════════════════════════════════════
// VEL AI — AI Controller (Core Streaming Endpoints)
// ═══════════════════════════════════════════════════════════

import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { ClerkAuthGuard } from '../../guards/clerk-auth.guard';
import { RateLimitGuard } from '../../guards/rate-limit.guard';
import { PromptLimitGuard } from '../../guards/prompt-limit.guard';
import { ModelAccessGuard } from '../../guards/model-access.guard';
import { TokenBudgetGuard } from '../../guards/token-budget.guard';
import { AIService } from './ai.service';
import { ContextService } from '../context/context.service';
import { CreditsService } from '../credits/credits.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { StreamAIDto } from './dto/stream-ai.dto';
import type { AuthenticatedRequest } from '../../common/types';

@Controller('ai')
@UseGuards(ClerkAuthGuard)
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly contextService: ContextService,
    private readonly creditsService: CreditsService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Post('stream')
  @HttpCode(200)
  @UseGuards(RateLimitGuard, PromptLimitGuard, ModelAccessGuard, TokenBudgetGuard)
  async streamAI(
    @Req() req: AuthenticatedRequest,
    @Body() dto: StreamAIDto,
    @Res() res: Response,
  ): Promise<void> {
    const startTime = Date.now();

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    let totalTokensIn = 0;
    let totalTokensOut = 0;
    let fullContent = '';

    try {
      // Build messages with injected context from connected tiles
      const messagesWithContext =
        await this.contextService.buildContextualMessages(
          dto.workspaceId,
          dto.tileId,
          dto.messages,
          dto.contextSources || [],
        );

      const stream = this.aiService.createStream({
        model: dto.model,
        messages: messagesWithContext,
        user: req.user,
        byokKey: req.user.byokOpenaiKey || req.user.byokAnthropicKey,
        maxTokens: dto.maxTokens || 4096,
      });

      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          res.write(
            `data: ${JSON.stringify({ type: 'delta', content })}\n\n`,
          );
        }

        if (chunk.usage) {
          totalTokensIn = chunk.usage.prompt_tokens || 0;
          totalTokensOut = chunk.usage.completion_tokens || 0;
        }
      }

      const latencyMs = Date.now() - startTime;

      res.write(
        `data: ${JSON.stringify({
          type: 'done',
          tokensIn: totalTokensIn,
          tokensOut: totalTokensOut,
          latencyMs,
        })}\n\n`,
      );
      res.end();

      // Async post-stream (non-blocking)
      setImmediate(async () => {
        try {
          await this.contextService.updateTileContext(
            dto.workspaceId,
            dto.tileId,
            fullContent,
          );

          await this.creditsService.finalizeDeduction(
            req.user.id,
            dto.requestId,
            dto.model,
            totalTokensIn,
            totalTokensOut,
          );

          await this.analyticsService.recordAIUsage({
            userId: req.user.id,
            model: dto.model,
            tileType: dto.tileType,
            workspaceId: dto.workspaceId,
            tokensIn: totalTokensIn,
            tokensOut: totalTokensOut,
            latencyMs,
          });
        } catch (err) {
          console.error('Post-stream job error:', err);
        }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.write(
        `data: ${JSON.stringify({ type: 'error', message })}\n\n`,
      );
      res.end();
      await this.creditsService.releaseReservation(
        req.user.id,
        dto.requestId,
      );
    }
  }

  @Post('consensus')
  @HttpCode(200)
  @UseGuards(RateLimitGuard, PromptLimitGuard)
  async consensusStream(
    @Req() req: AuthenticatedRequest,
    @Body()
    dto: {
      prompt: string;
      workspaceId: string;
      tileId: string;
      requestId: string;
    },
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    try {
      const CONSENSUS_MODELS = [
        {
          id: 'claude-sonnet-4',
          openRouterId: 'anthropic/claude-sonnet-4',
          label: 'claude' as const,
        },
        {
          id: 'gpt-4o',
          openRouterId: 'openai/gpt-4o',
          label: 'gpt' as const,
        },
        {
          id: 'gemini-1-5-pro',
          openRouterId: 'google/gemini-pro-1.5',
          label: 'gemini' as const,
        },
      ];

      const chatMessages = [
        { role: 'user' as const, content: dto.prompt },
      ];
      const results: Record<string, string> = {};

      await Promise.allSettled(
        CONSENSUS_MODELS.map(async (model) => {
          try {
            const stream = this.aiService.createStream({
              model: model.openRouterId,
              messages: chatMessages,
              user: req.user,
              maxTokens: 2048,
            });

            let content = '';
            for await (const chunk of stream) {
              const delta = chunk.choices?.[0]?.delta?.content || '';
              if (delta) {
                content += delta;
                res.write(
                  `data: ${JSON.stringify({
                    type: 'delta',
                    model: model.label,
                    content: delta,
                  })}\n\n`,
                );
              }
            }
            results[model.label] = content;
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            res.write(
              `data: ${JSON.stringify({
                type: 'error',
                model: model.label,
                message,
              })}\n\n`,
            );
          }
        }),
      );

      // Generate AI synthesis if at least 2 models responded
      if (Object.keys(results).length >= 2) {
        res.write(
          `data: ${JSON.stringify({ type: 'synthesis_start' })}\n\n`,
        );

        const synthesisPrompt = `You received three AI responses to this prompt:
"${dto.prompt}"

Claude said: ${results.claude || 'Error'}
GPT-4o said: ${results.gpt || 'Error'}
Gemini said: ${results.gemini || 'Error'}

Synthesize these responses into a structured analysis:
1. **Key Agreements**: Points all models agree on
2. **Notable Differences**: Where models diverge and why
3. **Strongest Combined Answer**: The most comprehensive response drawing on all three
4. **Confidence Assessment**: Rate each model's response quality (High/Medium/Low)

Be concise and direct.`;

        const synthesisStream = this.aiService.createStream({
          model: 'anthropic/claude-sonnet-4',
          messages: [{ role: 'user', content: synthesisPrompt }],
          user: req.user,
          maxTokens: 1024,
        });

        for await (const chunk of synthesisStream) {
          const delta = chunk.choices?.[0]?.delta?.content || '';
          if (delta) {
            res.write(
              `data: ${JSON.stringify({
                type: 'synthesis_delta',
                content: delta,
              })}\n\n`,
            );
          }
        }
      }

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.write(
        `data: ${JSON.stringify({ type: 'error', message })}\n\n`,
      );
      res.end();
    }
  }
}
