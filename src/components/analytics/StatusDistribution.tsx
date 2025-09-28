'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface StatusData {
  draft: number;
  sent: number;
  signed: number;
  expired: number;
}

interface StatusDistributionProps {
  data: StatusData;
}

export default function StatusDistribution({ data }: StatusDistributionProps) {
  const { t } = useLanguage();

  const total = data.draft + data.sent + data.signed + data.expired;

  const statusItems = [
    {
      key: 'signed',
      label: t.signed,
      value: data.signed,
      color: 'text-emerald-400 bg-emerald-500/20',
      icon: CheckCircleIcon
    },
    {
      key: 'sent',
      label: t.sent,
      value: data.sent,
      color: 'text-blue-400 bg-blue-500/20',
      icon: ClockIcon
    },
    {
      key: 'draft',
      label: t.draft,
      value: data.draft,
      color: 'text-slate-400 bg-slate-500/20',
      icon: DocumentTextIcon
    },
    {
      key: 'expired',
      label: t.expired,
      value: data.expired,
      color: 'text-red-400 bg-red-500/20',
      icon: ExclamationTriangleIcon
    }
  ];

  const getPercentage = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <DocumentTextIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{t.statusDistribution}</h3>
          <p className="text-slate-400 text-sm">{t.contractsByStatus}</p>
        </div>
      </div>

      <div className="space-y-4">
        {statusItems.map((item) => {
          const Icon = item.icon;
          const percentage = getPercentage(item.value);
          
          return (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 font-medium">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{item.value}</div>
                  <div className="text-slate-400 text-sm">{percentage.toFixed(1)}%</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.key === 'signed' ? 'bg-emerald-500' :
                    item.key === 'sent' ? 'bg-blue-500' :
                    item.key === 'draft' ? 'bg-slate-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {total > 0 ? getPercentage(data.signed).toFixed(1) : 0}%
            </div>
            <div className="text-slate-400 text-sm">{t.completionRate}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {total}
            </div>
            <div className="text-slate-400 text-sm">{t.totalContracts}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
