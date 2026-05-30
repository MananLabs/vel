import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private readonly ses: SESClient | null;
  private readonly fromAddress: string;
  private readonly frontendUrl: string;
  private readonly region: string | undefined;

  constructor() {
    this.region = process.env['AWS_REGION'];
    this.fromAddress = process.env['SES_FROM_EMAIL'] || 'mittalmanan81@gmail.com';
    this.frontendUrl = process.env['FRONTEND_URL'] || 'http://localhost:3000';

    if (this.region) {
      this.ses = new SESClient({ region: this.region });
    } else {
      this.ses = null;
      this.logger.warn('AWS_REGION not set — emails will be logged only');
    }
  }

  onModuleInit() {
    this.logger.log(`SES Region: ${this.region || 'NOT SET'}`);
    this.logger.log(`SES From Address: ${this.fromAddress}`);
    if (this.ses) {
      this.logger.log('Email service initialized with AWS SES');
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    this.logger.log(`Sending email to ${to} | Subject: ${subject}`);

    if (!this.ses) {
      this.logger.log(`[DEV MODE] Email body: ${html}`);
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
      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error: unknown) {
      this.logger.error('SES Send Failed', error);
      return false;
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<boolean> {
    const verifyUrl = `${this.frontendUrl}/api/auth/verify-email?token=${token}`;
    this.logger.log(`Verification URL generated: ${verifyUrl}`);
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

  async sendTestEmail(to: string): Promise<{ success: boolean; error?: unknown }> {
    this.logger.log(`Sending test email to ${to}`);

    if (!this.ses) {
      return { success: false, error: 'SES not configured — AWS_REGION missing' };
    }

    try {
      await this.ses.send(new SendEmailCommand({
        Source: this.fromAddress,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: 'VEL AI — Test Email' },
          Body: { Html: { Data: '<h2>Test email from VEL AI</h2><p>If you received this, SES is working correctly.</p>' } },
        },
      }));
      this.logger.log(`Test email sent successfully to ${to}`);
      return { success: true };
    } catch (error: unknown) {
      this.logger.error('SES Test Send Failed', error);
      return { success: false, error };
    }
  }
}
