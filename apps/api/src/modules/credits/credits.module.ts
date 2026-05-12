import { Module, Global } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { RedisService } from '../../redis/redis.service';

@Global()
@Module({
  controllers: [CreditsController],
  providers: [CreditsService, RedisService],
  exports: [CreditsService],
})
export class CreditsModule {}
