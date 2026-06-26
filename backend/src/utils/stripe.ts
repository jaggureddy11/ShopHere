import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

let stripe: Stripe | null = null;

if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-04-10' as any
  });
}

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd'
) => {
  // Convert dollars to cents
  const amountInCents = Math.round(amount * 100);

  if (stripe) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata: { integration_check: 'accept_a_payment' }
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    };
  } else {
    // Return mock payment intent
    console.log(`[STRIPE MOCK] Creating payment intent of ${amount} ${currency}`);
    return {
      clientSecret: `mock_secret_${Math.random().toString(36).substr(2, 9)}`,
      id: `mock_pi_${Math.random().toString(36).substr(2, 9)}`
    };
  }
};
