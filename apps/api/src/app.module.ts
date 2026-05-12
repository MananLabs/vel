// ═══════════════════════════════════════════════════════════
// VEL AI — App Module (Root Module Assembly)
// ═══════════════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIModule } from './modules/ai/ai.module';
import { ContextModule } from './modules/context/context.module';
import { CreditsModule } from './modules/credits/credits.module';
import { BillingModule } from './modules/billing/billing.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { StorageModule } from './modules/storage/storage.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ContextModule,
    CreditsModule,
    AnalyticsModule,
    StorageModule,
    AIModule,
    BillingModule,
    UsersModule,
    WorkspaceModule,
  ],
})
export class AppModule {}
