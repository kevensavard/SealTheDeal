import Stripe from 'stripe';

// Initialize Stripe only if the secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    })
  : null;

export const STRIPE_CONFIG = {
  // Pro Plan - Monthly
  PRO_MONTHLY_PRICE_ID: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
  
  // Pro Plan - Yearly (if you want to add this later)
  PRO_YEARLY_PRICE_ID: process.env.STRIPE_PRO_YEARLY_PRICE_ID || '',
  
  // Webhook secret for verifying webhook signatures
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  
  // Success and cancel URLs
  SUCCESS_URL: `${process.env.NEXT_PUBLIC_APP_URL || 'https://sealthedeal.app'}/settings?tab=subscription&success=true`,
  CANCEL_URL: `${process.env.NEXT_PUBLIC_APP_URL || 'https://sealthedeal.app'}/settings?tab=subscription&canceled=true`,
};

export const formatPrice = (amount: number, currency: string = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};
