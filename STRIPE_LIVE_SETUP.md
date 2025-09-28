# Stripe Live Setup Guide for sealthedeal.app

## 1. Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

### Required Variables:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://sealthedeal.app
```

### How to get these values:

1. **STRIPE_SECRET_KEY**: 
   - Go to Stripe Dashboard → Developers → API Keys
   - Copy the "Secret key" (starts with `sk_live_`)

2. **STRIPE_PUBLISHABLE_KEY**:
   - Same page, copy the "Publishable key" (starts with `pk_live_`)

3. **STRIPE_PRO_MONTHLY_PRICE_ID**:
   - Go to Stripe Dashboard → Products
   - Click on your Pro plan product
   - Copy the Price ID (starts with `price_`)

4. **STRIPE_WEBHOOK_SECRET**:
   - Set up webhook first (see step 2), then copy the signing secret

## 2. Set up Stripe Webhook

1. **Go to Stripe Dashboard** → Developers → Webhooks
2. **Click "Add endpoint"**
3. **Endpoint URL**: `https://sealthedeal.app/api/stripe/webhook`
4. **Select these events**:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. **Click "Add endpoint"**
6. **Copy the webhook signing secret** (starts with `whsec_`)
7. **Add it to Vercel environment variables** as `STRIPE_WEBHOOK_SECRET`

## 3. Test the Integration

1. **Redeploy your Vercel app** after adding environment variables
2. **Test the upgrade flow**:
   - Go to https://sealthedeal.app/settings
   - Click "Upgrade to Pro"
   - Complete the Stripe checkout
   - Verify webhook events in Stripe Dashboard

## 4. Verify Webhook is Working

1. **Go to Stripe Dashboard** → Developers → Webhooks
2. **Click on your webhook endpoint**
3. **Check the "Recent deliveries" tab**
4. **Look for successful webhook calls** (green checkmarks)

## 5. Important Notes

- **Always use live keys** in production (not test keys)
- **Webhook endpoint must be HTTPS** (which it is with your domain)
- **Test thoroughly** before going live with real customers
- **Monitor webhook failures** in Stripe Dashboard

## 6. Troubleshooting

If webhooks fail:
1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Ensure webhook URL is exactly: `https://sealthedeal.app/api/stripe/webhook`
4. Check that all required events are selected

## 7. Security

- Never commit live Stripe keys to your repository
- Use environment variables for all sensitive data
- Monitor for any unauthorized access attempts
