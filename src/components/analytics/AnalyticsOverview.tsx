'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface OverviewData {
  totalContracts: number;
  signedContracts: number;
  sentContracts: number;
  draftContracts: number;
  expiredContracts: number;
  conversionRate: number;
  averageTurnaroundDays: number;
}

interface AnalyticsOverviewProps {
  data: OverviewData;
}

export default function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const { t } = useLanguage();

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const formatDays = (days: number) => {
    if (days < 1) {
      return `${Math.round(days * 24)} hours`;
    }
    return `${days.toFixed(1)} days`;
  };

  const overviewCards = [
    {
      title: t.totalContracts,
      value: formatNumber(data.totalContracts),
      icon: DocumentTextIcon,
      color: 'text-blue-400 bg-blue-500/20',
      trend: null
    },
    {
      title: t.signedContracts,
      value: formatNumber(data.signedContracts),
      icon: CheckCircleIcon,
      color: 'text-emerald-400 bg-emerald-500/20',
      trend: data.totalContracts > 0 ? formatPercentage((data.signedContracts / data.totalContracts) * 100) : '0%'
    },
    {
      title: t.conversionRate,
      value: formatPercentage(data.conversionRate),
      icon: ChartBarIcon,
      color: 'text-purple-400 bg-purple-500/20',
      trend: `${data.sentContracts} sent`
    },
    {
      title: t.averageTurnaround,
      value: formatDays(data.averageTurnaroundDays),
      icon: ClockIcon,
      color: 'text-orange-400 bg-orange-500/20',
      trend: data.signedContracts > 0 ? `${data.signedContracts} signed` : 'No data'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              {card.trend && (
                <div className="text-right">
                  <div className="text-slate-400 text-sm">{card.trend}</div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
              <p className="text-slate-400 text-sm">{card.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
