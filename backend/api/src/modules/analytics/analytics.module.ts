import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { UsageEventsRepository } from './usage-events.repository';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, UsageEventsRepository],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
