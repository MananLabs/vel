import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreditsService } from './credits.service';
import type { AuthenticatedRequest } from '../../common/types';

@Controller('credits')
@UseGuards(JwtAuthGuard)
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get('balance')
  async getBalance(@Req() req: AuthenticatedRequest) {
    const balance = await this.creditsService.getBalance(req.user.id);
    return { balance };
  }
}
