import { Module, Global } from '@nestjs/common';
import { ContextService } from './context.service';
import { RedisService } from '../../redis/redis.service';

@Global()
@Module({
  providers: [ContextService, RedisService],
  exports: [ContextService],
})
export class ContextModule {}
