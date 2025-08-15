import { Body, Controller, Post, Req } from '@nestjs/common';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentsController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', { apiVersion: '2024-06-20' } as any);

  @Post('intent')
  async intent(@Body() body: { amount_cents: number; currency?: string }) {
    const pi = await this.stripe.paymentIntents.create({ amount: body.amount_cents, currency: body.currency || 'usd', automatic_payment_methods: { enabled: true } });
    return { client_secret: pi.client_secret };
  }

  @Post('webhook')
  async webhook(@Req() req: any) {
    // TODO: verify signature and handle events
    return { ok: true };
  }
}