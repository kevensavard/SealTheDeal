'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { UserGroupIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface ClientData {
  name: string;
  company: string | null;
  totalContracts: number;
  signedContracts: number;
}

interface TopClientsProps {
  data: ClientData[];
}

export default function TopClients({ data }: TopClientsProps) {
  const { t } = useLanguage();

  const getConversionRate = (signed: number, total: number) => {
    return total > 0 ? (signed / total) * 100 : 0;
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <UserGroupIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{t.topClients}</h3>
          <p className="text-slate-400 text-sm">{t.contractsByClient}</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <UserGroupIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">{t.noClientData}</p>
          </div>
        ) : (
          data.map((client, index) => {
            const conversionRate = getConversionRate(client.signedContracts, client.totalContracts);
            
            return (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                {/* Rank */}
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                
                {/* Client Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium truncate">{client.name}</h4>
                    <div className="text-right">
                      <div className="text-white font-semibold">{client.totalContracts}</div>
                      <div className="text-slate-400 text-sm">{t.contracts}</div>
                    </div>
                  </div>
                  
                  {client.company && (
                    <p className="text-slate-400 text-sm truncate">{client.company}</p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-emerald-400 text-sm">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>{client.signedContracts} {t.signed}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <DocumentTextIcon className="w-4 h-4" />
                      <span>{conversionRate.toFixed(1)}% {t.conversionRate}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {data.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {data.reduce((sum, client) => sum + client.totalContracts, 0)}
              </div>
              <div className="text-slate-400 text-sm">{t.totalContracts}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {data.reduce((sum, client) => sum + client.signedContracts, 0)}
              </div>
              <div className="text-slate-400 text-sm">{t.signed}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
