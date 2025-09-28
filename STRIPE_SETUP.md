# Stripe Integration Setup Guide

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_PRO_MONTHLY_PRICE_ID=price_your_pro_monthly_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step-by-Step Setup Instructions

### 1. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Make sure you're in **Test mode** (toggle in top left)
3. Go to **Developers** → **API keys**
4. Copy your **Publishable key** and **Secret key**

### 2. Create Your Product and Price

1. Go to **Products** in your Stripe dashboard
2. Click **Add product**
3. Fill in:
   - **Name**: "SealTheDeal Pro Plan"
   - **Description**: "Unlimited contracts, e-signatures, and premium features"
4. Under **Pricing**, set:
   - **Price**: $15.00
   - **Billing period**: Monthly
5. Click **Save product**
6. Copy the **Price ID** (starts with `price_`)

### 3. Set Up Webhooks

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
   - For local development: `https://your-ngrok-url.ngrok.io/api/stripe/webhook`
4. Select these events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

### 4. Update Your Environment Variables

Replace the placeholder values in your `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_51ABC123...  # Your actual secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...  # Your actual publishable key
STRIPE_PRO_MONTHLY_PRICE_ID=price_1ABC123...  # Your actual price ID
STRIPE_WEBHOOK_SECRET=whsec_ABC123...  # Your actual webhook secret
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Your app URL
```

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Go to Settings → Subscription & Billing
3. Click "Upgrade to Pro"
4. You should be redirected to Stripe checkout
5. Use test card: `4242 4242 4242 4242`
6. Complete the checkout process
7. Check that your user tier is updated to "PRO"

### 6. Production Setup

For production:

1. Switch to **Live mode** in Stripe dashboard
2. Create the same product and price in live mode
3. Update environment variables with live keys
4. Set up production webhook endpoint
5. Update `NEXT_PUBLIC_APP_URL` to your production domain

## Features Included

✅ **Stripe Checkout**: Secure payment processing
✅ **Webhook Handling**: Automatic subscription management
✅ **Customer Portal**: Users can manage their subscriptions
✅ **Tier Updates**: Automatic user tier changes
✅ **Error Handling**: Proper error messages and fallbacks

## Testing

Use these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

All test cards use any future expiry date and any 3-digit CVC.
