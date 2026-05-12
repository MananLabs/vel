import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { ContextModule } from '../context/context.module';
import { CreditsModule } from '../credits/credits.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [ContextModule, CreditsModule, AnalyticsModule],
  controllers: [AIController],
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}
