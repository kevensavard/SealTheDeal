'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import AnalyticsOverview from '@/components/analytics/AnalyticsOverview';
import MonthlyChart from '@/components/analytics/MonthlyChart';
import StatusDistribution from '@/components/analytics/StatusDistribution';
import RecentActivity from '@/components/analytics/RecentActivity';
import TopClients from '@/components/analytics/TopClients';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    totalContracts: number;
    signedContracts: number;
    sentContracts: number;
    draftContracts: number;
    expiredContracts: number;
    conversionRate: number;
    averageTurnaroundDays: number;
  };
  monthlyData: Array<{
    month: string;
    contracts: number;
    signed: number;
    sent: number;
    conversionRate: number;
  }>;
  statusDistribution: {
    draft: number;
    sent: number;
    signed: number;
    expired: number;
  };
  recentActivity: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    client: string | null;
    company: string | null;
  }>;
  topClients: Array<{
    name: string;
    company: string | null;
    totalContracts: number;
    signedContracts: number;
  }>;
  period: number;
}

export default function AnalyticsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isProUser, setIsProUser] = useState(false);
  const [userTier, setUserTier] = useState<string>('FREE');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Check user tier
  const checkUserTier = async () => {
    if (isSignedIn && user) {
      try {
        const response = await fetch('/api/user/tier');
        const data = await response.json();
        
        if (data.success) {
          setUserTier(data.tier);
          setIsProUser(data.tier === 'PRO' || data.tier === 'ADMIN');
        }
      } catch (error) {
        console.error('Error checking user tier:', error);
      }
    }
  };

  useEffect(() => {
    if (isSignedIn && user) {
      checkUserTier();
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (isSignedIn && user && isProUser) {
      fetchAnalytics();
    }
  }, [isSignedIn, user, selectedPeriod, isProUser]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/analytics?clerkId=${user?.id}&period=${selectedPeriod}`);
      const data = await response.json();

      if (data.success) {
        setAnalyticsData(data.analytics);
      } else {
        console.error('Failed to fetch analytics:', data.error);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  // Pro feature gate
  if (!isProUser) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col p-6 bg-slate-900">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <SparklesIcon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Analytics & Insights</h3>
              <p className="text-slate-300 mb-6">
                Get detailed insights into your contract performance, conversion rates, and business metrics.
              </p>
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Pro Features:</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                    Contract performance metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                    Conversion rate tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                    Average turnaround time
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                    Monthly trend analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                    Client performance insights
                  </li>
                </ul>
              </div>
              <button
                onClick={() => router.push('/settings')}
                className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col p-6 bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <ChartBarIcon className="w-8 h-8" />
              {t.analytics}
            </h1>
            <p className="text-slate-300">Track your contract performance and business insights</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
              {[
                { value: '7', label: '7 days' },
                { value: '30', label: '30 days' },
                { value: '90', label: '90 days' },
                { value: '365', label: '1 year' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSelectedPeriod(value)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedPeriod === value
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-300">{t.loading}</p>
            </div>
          </div>
        ) : analyticsData ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <AnalyticsOverview data={analyticsData.overview} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyChart data={analyticsData.monthlyData} />
              <StatusDistribution data={analyticsData.statusDistribution} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity data={analyticsData.recentActivity} />
              <TopClients data={analyticsData.topClients} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChartBarIcon className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Analytics Data Yet</h3>
              <p className="text-slate-400 mb-6">
                Start creating contracts to see your performance insights and analytics.
              </p>
              <button
                onClick={() => router.push('/create-contract')}
                className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Create Your First Contract
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
