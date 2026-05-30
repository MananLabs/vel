import { Module } from '@nestjs/common';
import { CreditsController } from './credits.controller';
import { CreditsService } from './credits.service';
import { CreditTransactionsRepository } from './credit-transactions.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [CreditsController],
  providers: [CreditsService, CreditTransactionsRepository],
  exports: [CreditsService],
})
export class CreditsModule {}
