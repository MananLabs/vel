import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Req,
  UseGuards,
  RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';
import { BillingService } from './billing.service';
import { ClerkAuthGuard } from '../../guards/clerk-auth.guard';
import type { AuthenticatedRequest } from '../../common/types';

@Controller('billing')
export class BillingController {
  private stripe: Stripe;

  constructor(private readonly billingService: BillingService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
    });
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ): Promise<{ received: boolean }> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody!,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Webhook signature verification failed: ${message}`);
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.billingService.handleSubscriptionChange(
          event.data.object as Stripe.Subscription,
        );
        break;
      case 'customer.subscription.deleted':
        await this.billingService.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      case 'invoice.payment_succeeded':
        await this.billingService.handlePaymentSucceeded(
          event.data.object as Stripe.Invoice,
        );
        break;
      case 'invoice.payment_failed':
        await this.billingService.handlePaymentFailed(
          event.data.object as Stripe.Invoice,
        );
        break;
      case 'checkout.session.completed':
        await this.billingService.handleCheckoutCompleted(
          event.data.object as Stripe.CheckoutSession,
        );
        break;
    }

    return { received: true };
  }

  @Post('checkout')
  @UseGuards(ClerkAuthGuard)
  async createCheckout(
    @Req() req: AuthenticatedRequest,
    @Body() body: { priceId: string },
  ) {
    const url = await this.billingService.createCheckoutSession(
      req.user.id,
      body.priceId,
    );
    return { checkoutUrl: url };
  }

  @Post('top-up')
  @UseGuards(ClerkAuthGuard)
  async createTopUp(
    @Req() req: AuthenticatedRequest,
    @Body() body: { priceId: string },
  ) {
    const url = await this.billingService.createTopUpCheckout(
      req.user.id,
      body.priceId,
    );
    return { checkoutUrl: url };
  }
}
