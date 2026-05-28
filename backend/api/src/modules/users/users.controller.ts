import { Controller, Get, Req, UseGuards, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsersService } from './users.service';
import type { AuthenticatedRequest } from '../../common/types';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const user = await this.usersService.findById(req.user.id);
    return user;
  }

  @Post('onboarding/complete')
  async completeOnboarding(@Req() req: AuthenticatedRequest) {
    await this.usersService.completeOnboarding(req.user.id);
    return { success: true };
  }
}
