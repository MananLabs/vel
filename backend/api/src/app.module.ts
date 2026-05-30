// ═══════════════════════════════════════════════════════════
// VEL AI — App Module (Root Module Assembly)
// ═══════════════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { RedisModule } from './redis/redis.module';
import { AIModule } from './modules/ai/ai.module';
import { ContextModule } from './modules/context/context.module';
import { CreditsModule } from './modules/credits/credits.module';
import { BillingModule } from './modules/billing/billing.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { StorageModule } from './modules/storage/storage.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { TilesModule } from './modules/tiles/tiles.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ResearchModule } from './modules/research/research.module';
import { VoiceModule } from './modules/voice/voice.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
      },
    }),
    DatabaseModule,
    AuthModule,
    RedisModule,
    ContextModule,
    CreditsModule,
    AnalyticsModule,
    StorageModule,
    AIModule,
    BillingModule,
    UsersModule,
    WorkspaceModule,
    TilesModule,
    MessagesModule,
    ResearchModule,
    VoiceModule,
  ],
})
export class AppModule {}
