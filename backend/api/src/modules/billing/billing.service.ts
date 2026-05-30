import { Injectable, Logger, Inject } from '@nestjs/common';
import Stripe from 'stripe';
import { UsersRepository } from '../users/users.repository';
import { CreditsService } from '../credits/credits.service';
import { STRIPE_CLIENT } from './billing.constants';

const PLAN_CREDITS: Record<string, number> = {
  pro: 3000,
  pro_byok: 0,
  teams: 8000,
};

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly creditsService: CreditsService,
    private readonly usersRepo: UsersRepository,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
  ) {}

  async createCheckoutSession(userId: string, priceId: string, customerId?: string): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env['FRONTEND_URL']}/dashboard?checkout=success`,
      cancel_url: `${process.env['FRONTEND_URL']}/billing?checkout=cancel`,
      metadata: { userId },
    });
    return session.url || '';
  }

  async createTopUpCheckout(userId: string, priceId: string, customerId?: string): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env['FRONTEND_URL']}/dashboard?topup=success`,
      cancel_url: `${process.env['FRONTEND_URL']}/billing?topup=cancel`,
      metadata: { userId, type: 'top_up' },
    });
    return session.url || '';
  }

  async handleSubscriptionChange(sub: Stripe.Subscription): Promise<void> {
    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
    if (!customerId) return;

    // TODO: Add GSI on stripeCustomerId for efficient lookup
    const user = await this.usersRepo.getUserByEmail(''); // Placeholder — need stripeCustomerId lookup
    if (!user) {
      this.logger.warn(`No user found for Stripe customer ${customerId}`);
      return;
    }

    const plan = this.extractPlanFromSubscription(sub);
    await this.usersRepo.updateUser(user.id, { plan });
  }

  async handleSubscriptionDeleted(sub: Stripe.Subscription): Promise<void> {
    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
    if (!customerId) return;
    // Downgrade handled via webhook metadata
  }

  async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const userId = (invoice.metadata as Record<string, string>)?.userId;
    if (!userId) return;
    const user = await this.usersRepo.getUserById(userId);
    if (!user) return;
    const monthlyCredits = PLAN_CREDITS[user.plan] || 100;
    await this.creditsService.addCredits(user.id, monthlyCredits, 'monthly_allocation');
  }

  async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    this.logger.warn(`Payment failed for invoice ${invoice.id}`);
  }

  async handleCheckoutCompleted(session: { metadata?: Record<string, string>; amount_total?: number; customer?: string | null }): Promise<void> {
    const userId = session.metadata?.userId;
    if (!userId) return;

    if (session.metadata?.type === 'top_up') {
      const creditAmount = this.getCreditAmountFromPrice(session.amount_total || 0);
      await this.creditsService.addCredits(userId, creditAmount, 'top_up');
    }
  }

  private extractPlanFromSubscription(sub: Stripe.Subscription): string {
    const priceId = sub.items.data[0]?.price?.id || '';
    const priceMap: Record<string, string> = {
      [process.env['STRIPE_PRICE_PRO_MONTHLY'] || '']: 'pro',
      [process.env['STRIPE_PRICE_PRO_BYOK_MONTHLY'] || '']: 'pro_byok',
      [process.env['STRIPE_PRICE_TEAMS_MONTHLY'] || '']: 'teams',
    };
    return priceMap[priceId] || 'pro';
  }

  private getCreditAmountFromPrice(amountCents: number): number {
    const priceToCredits: Record<number, number> = { 500: 500, 1500: 2000, 5000: 10000 };
    return priceToCredits[amountCents] || Math.floor(amountCents / 1);
  }
}
