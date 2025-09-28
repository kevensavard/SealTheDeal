'use client';

import { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface SubscriptionBillingProps {
  user: any;
}

export default function SubscriptionBilling({ user }: SubscriptionBillingProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({
    plan: 'Free',
    status: 'active',
    contractsUsed: 0,
    contractsLimit: 1 as number | string,
    nextBillingDate: null,
    price: 0
  });

  useEffect(() => {
    // Update subscription data based on user tier
    if (user?.tier === 'PRO') {
      setSubscriptionData(prev => ({
        ...prev,
        plan: 'Pro',
        contractsLimit: 'unlimited',
        price: 15
      }));
    }
  }, [user?.tier]);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
          planType: 'pro'
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data.error);
        alert('Failed to start upgrade process. Please try again.');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsManaging(true);
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe customer portal
        window.location.href = data.url;
      } else {
        console.error('Failed to create portal session:', data.error);
        alert('Failed to open billing portal. Please try again.');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsManaging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Subscription & Billing</h2>
        <p className="text-slate-300">Manage your plan and billing information</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <CreditCardIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{subscriptionData.plan} Plan</h3>
              <p className="text-slate-300">Current subscription</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">${subscriptionData.price}/month</div>
            <div className="text-sm text-slate-400">
              {subscriptionData.status === 'active' ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">{subscriptionData.contractsUsed}</div>
            <div className="text-sm text-slate-400">Contracts Generated</div>
            <div className="text-xs text-slate-500">This month</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">{subscriptionData.contractsLimit}</div>
            <div className="text-sm text-slate-400">Monthly Limit</div>
            <div className="text-xs text-slate-500">Free plan</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">
              {typeof subscriptionData.contractsLimit === 'number' 
                ? Math.round((subscriptionData.contractsUsed / subscriptionData.contractsLimit) * 100) + '%'
                : '∞'
              }
            </div>
            <div className="text-sm text-slate-400">Usage</div>
            <div className="text-xs text-slate-500">This month</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-300 mb-2">
            <span>Usage this month</span>
            <span>{subscriptionData.contractsUsed} / {subscriptionData.contractsLimit}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: typeof subscriptionData.contractsLimit === 'number' 
                  ? `${Math.min((subscriptionData.contractsUsed / subscriptionData.contractsLimit) * 100, 100)}%`
                  : '100%'
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {subscriptionData.plan === 'Free' ? (
          <button
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isUpgrading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ArrowUpIcon className="w-5 h-5" />
                <span>Upgrade to Pro</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleManageSubscription}
            disabled={isManaging}
            className="w-full bg-slate-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isManaging ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Opening...</span>
              </>
            ) : (
              <>
                <CreditCardIcon className="w-5 h-5" />
                <span>Manage Subscription</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Plan Features Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Free Plan</h3>
            <div className="text-2xl font-bold text-white">$0</div>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-slate-300">
              <CheckIcon className="w-5 h-5 text-emerald-400" />
              <span>1 contract per month</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <CheckIcon className="w-5 h-5 text-emerald-400" />
              <span>Basic templates</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <CheckIcon className="w-5 h-5 text-emerald-400" />
              <span>PDF download</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <XMarkIcon className="w-5 h-5 text-red-400" />
              <span>E-signature integration</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <XMarkIcon className="w-5 h-5 text-red-400" />
              <span>Priority support</span>
            </li>
          </ul>
          {subscriptionData.plan === 'Free' && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-400 text-sm font-medium">Current Plan</p>
            </div>
          )}
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/30 rounded-xl p-6 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              Popular
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Pro Plan</h3>
            <div className="text-2xl font-bold text-white">$15</div>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-slate-300">
              <CheckIcon className="w-5 h-5 text-emerald-400" />
              <span>Unlimited contracts</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <CheckIcon className="w-5 h-5 text-emerald-400" />
              <span>Premium templates</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <CheckIcon className="w-5 h-5 text-emerald-400" />
              <span>PDF download</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <CheckIcon className="w-5 h-5 text-emerald-400" />
              <span>E-signature integration</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <CheckIcon className="w-5 h-5 text-emerald-400" />
              <span>Priority support</span>
            </li>
          </ul>
          {subscriptionData.plan === 'Free' ? (
            <button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isUpgrading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ArrowUpIcon className="w-5 h-5" />
                  <span>Upgrade to Pro</span>
                </>
              )}
            </button>
          ) : (
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3">
              <p className="text-emerald-400 text-sm font-medium">Current Plan</p>
            </div>
          )}
        </div>
      </div>

      {/* Billing Information */}
      {subscriptionData.plan !== 'Free' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Billing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-sm text-slate-400">Next billing date</div>
                <div className="text-white font-medium">
                  {subscriptionData.nextBillingDate || 'No billing date'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCardIcon className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-sm text-slate-400">Payment method</div>
                <div className="text-white font-medium">•••• •••• •••• 4242</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
