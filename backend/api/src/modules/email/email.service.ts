import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export interface EmailProvider {
  sendEmail(to: string, subject: string, html: string): Promise<boolean>;
}

@Injectable()
export class EmailService implements EmailProvider {
  private readonly logger = new Logger(EmailService.name);
  private readonly ses: SESClient | null;
  private readonly fromAddress: string;
  private readonly frontendUrl: string;

  constructor() {
    const region = process.env['AWS_REGION'];
    this.fromAddress = process.env['SES_FROM_EMAIL'] || 'noreply@vel-ai.com';
    this.frontendUrl = process.env['FRONTEND_URL'] || 'http://localhost:3000';

    if (region) {
      this.ses = new SESClient({ region });
      this.logger.log('Email service initialized with AWS SES');
    } else {
      this.ses = null;
      this.logger.warn('Email service not configured — emails will be logged only');
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.ses) {
      this.logger.log(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
      this.logger.log(`[DEV EMAIL] Body: ${html}`);
      return true;
    }

    try {
      await this.ses.send(new SendEmailCommand({
        Source: this.fromAddress,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject },
          Body: { Html: { Data: html } },
        },
      }));
      return true;
    } catch (error: unknown) {
      this.logger.error(`Failed to send email to ${to}: ${(error as Error).message}`);
      return false;
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<boolean> {
    const verifyUrl = `${this.frontendUrl}/api/auth/verify-email?token=${token}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email address</h2>
        <p>Click the button below to verify your email and activate your VEL AI account.</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #7C3AED; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Verify Email</a>
        <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
        <p style="color: #666; font-size: 12px;">If you didn't create an account, ignore this email.</p>
      </div>
    `;
    return this.sendEmail(to, 'Verify your VEL AI account', html);
  }
}
