'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface MonthlyData {
  month: string;
  contracts: number;
  signed: number;
  sent: number;
  conversionRate: number;
}

interface MonthlyChartProps {
  data: MonthlyData[];
}

export default function MonthlyChart({ data }: MonthlyChartProps) {
  const { t } = useLanguage();

  const maxValue = Math.max(...data.map(d => Math.max(d.contracts, d.signed, d.sent)));

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <ChartBarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{t.monthlyTrends}</h3>
            <p className="text-slate-400 text-sm">{t.contractsOverTime}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Chart */}
        <div className="h-64 flex items-end justify-between gap-1 overflow-hidden">
          {data.map((month, index) => {
            // Ensure max height doesn't exceed container
            const maxBarHeight = 180; // Leave room for labels
            const contractsHeight = Math.min((month.contracts / maxValue) * maxBarHeight, maxBarHeight);
            const signedHeight = Math.min((month.signed / maxValue) * maxBarHeight, maxBarHeight);
            const sentHeight = Math.min((month.sent / maxValue) * maxBarHeight, maxBarHeight);

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1 min-w-0 max-w-16">
                {/* Bars */}
                <div className="w-full flex flex-col justify-end h-48 relative">
                  {/* Total Contracts Bar */}
                  <div className="w-full flex flex-col">
                    <div
                      className="w-full bg-slate-600 rounded-t-sm"
                      style={{ height: `${contractsHeight}px` }}
                    ></div>
                    {/* Signed Overlay */}
                    <div
                      className="w-full bg-emerald-500 rounded-t-sm"
                      style={{ height: `${signedHeight}px` }}
                    ></div>
                    {/* Sent Overlay */}
                    <div
                      className="w-full bg-blue-500 rounded-t-sm"
                      style={{ height: `${sentHeight}px` }}
                    ></div>
                  </div>
                </div>

                {/* Month Label */}
                <div className="text-xs text-slate-400 text-center mt-2">
                  {month.month}
                </div>

                {/* Values */}
                <div className="text-xs text-slate-300 text-center">
                  <div>{month.contracts}</div>
                  <div className="text-emerald-400">{month.signed}</div>
                  <div className="text-blue-400">{month.sent}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-600 rounded-sm"></div>
            <span className="text-slate-400 text-sm">{t.total}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
            <span className="text-slate-400 text-sm">{t.signed}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span className="text-slate-400 text-sm">{t.sent}</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {data.reduce((sum, month) => sum + month.contracts, 0)}
            </div>
            <div className="text-slate-400 text-sm">{t.totalContracts}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {data.reduce((sum, month) => sum + month.signed, 0)}
            </div>
            <div className="text-slate-400 text-sm">{t.signed}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {data.reduce((sum, month) => sum + month.sent, 0)}
            </div>
            <div className="text-slate-400 text-sm">{t.sent}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
