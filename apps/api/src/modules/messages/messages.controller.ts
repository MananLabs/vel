// ═══════════════════════════════════════════════════════════
// VEL AI — Messages Controller (REST API)
// ═══════════════════════════════════════════════════════════

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(
    @Body()
    body: {
      tileId: string;
      role: 'user' | 'assistant' | 'system';
      content: string;
      tokensIn?: number;
      tokensOut?: number;
      model?: string;
      latencyMs?: number;
      metadata?: Record<string, unknown>;
    },
  ) {
    return this.messagesService.create(body.tileId, body);
  }

  @Get('tile/:tileId')
  async findByTile(
    @Param('tileId') tileId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.messagesService.findByTile(
      tileId,
      limit ? parseInt(limit, 10) : 100,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { tileId: string },
  ) {
    return this.messagesService.findById(id, body.tileId);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body: {
      tileId: string;
      content?: string;
      metadata?: Record<string, unknown>;
    },
  ) {
    return this.messagesService.update(id, body.tileId, body);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { tileId: string },
  ) {
    return this.messagesService.delete(id, body.tileId);
  }

  @Get('context/:tileId')
  async getContext(
    @Param('tileId') tileId: string,
    @Query('lookback') lookback?: string,
  ) {
    return this.messagesService.getConversationContext(
      tileId,
      lookback ? parseInt(lookback, 10) : 10,
    );
  }
}