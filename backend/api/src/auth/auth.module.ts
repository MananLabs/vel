import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DebugController } from './debug.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RedisModule } from '../redis/redis.module';
import { UsersModule } from '../modules/users/users.module';
import { EmailModule } from '../modules/email/email.module';

@Global()
@Module({
  imports: [RedisModule, UsersModule, EmailModule],
  controllers: [AuthController, DebugController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
