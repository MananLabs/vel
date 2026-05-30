import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IsEmail } from 'class-validator';
import { EmailService } from '../modules/email/email.service';

class TestEmailDto {
  @IsEmail()
  email!: string;
}

@Controller('debug')
export class DebugController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test-email')
  @HttpCode(HttpStatus.OK)
  async testEmail(@Body() dto: TestEmailDto) {
    const result = await this.emailService.sendTestEmail(dto.email);
    return result;
  }
}
