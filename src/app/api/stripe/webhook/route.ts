import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const clerkId = session.metadata?.clerkId;
  
  if (!clerkId) {
    console.error('No clerkId in session metadata');
    return;
  }

  // Update user tier to PRO
  await prisma.user.update({
    where: { clerkId },
    data: { 
      tier: 'PRO',
      stripeCustomerId: session.customer as string,
    },
  });

  console.log(`User ${clerkId} upgraded to PRO`);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const clerkId = subscription.metadata?.clerkId;
  
  if (!clerkId) {
    console.error('No clerkId in subscription metadata');
    return;
  }

  // Update user with subscription details
  await prisma.user.update({
    where: { clerkId },
    data: { 
      tier: 'PRO',
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
    },
  });

  console.log(`Subscription created for user ${clerkId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const clerkId = subscription.metadata?.clerkId;
  
  if (!clerkId) {
    console.error('No clerkId in subscription metadata');
    return;
  }

  // Update subscription status
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (user) {
    await prisma.user.update({
      where: { clerkId },
      data: { 
        stripeSubscriptionId: subscription.id,
        // Keep tier as PRO if subscription is active
        tier: subscription.status === 'active' ? 'PRO' : 'FREE',
      },
    });
  }

  console.log(`Subscription updated for user ${clerkId}: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const clerkId = subscription.metadata?.clerkId;
  
  if (!clerkId) {
    console.error('No clerkId in subscription metadata');
    return;
  }

  // Downgrade user to FREE
  await prisma.user.update({
    where: { clerkId },
    data: { 
      tier: 'FREE',
      stripeSubscriptionId: null,
    },
  });

  console.log(`User ${clerkId} downgraded to FREE`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const clerkId = subscription.metadata?.clerkId;
  
  if (!clerkId) return;

  // Ensure user stays PRO
  await prisma.user.update({
    where: { clerkId },
    data: { tier: 'PRO' },
  });

  console.log(`Payment succeeded for user ${clerkId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const clerkId = subscription.metadata?.clerkId;
  
  if (!clerkId) return;

  console.log(`Payment failed for user ${clerkId}`);
  // You might want to send a notification email here
}
