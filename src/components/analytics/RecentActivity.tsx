'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  client: string | null;
  company: string | null;
}

interface RecentActivityProps {
  data: ActivityItem[];
}

export default function RecentActivity({ data }: RecentActivityProps) {
  const { t } = useLanguage();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SIGNED':
        return CheckCircleIcon;
      case 'SENT':
        return ClockIcon;
      case 'EXPIRED':
        return ExclamationTriangleIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SIGNED':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'SENT':
        return 'text-blue-400 bg-blue-500/20';
      case 'EXPIRED':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SIGNED':
        return t.signed;
      case 'SENT':
        return t.sent;
      case 'EXPIRED':
        return t.expired;
      case 'DRAFT':
        return t.draft;
      default:
        return status;
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <ClockIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{t.recentActivity}</h3>
          <p className="text-slate-400 text-sm">{t.latestContractActivity}</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <DocumentTextIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">{t.noRecentActivity}</p>
          </div>
        ) : (
          data.slice(0, 5).map((activity) => {
            const StatusIcon = getStatusIcon(activity.status);
            const statusColor = getStatusColor(activity.status);
            
            return (
              <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusColor}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium truncate">{activity.title}</h4>
                    <span className="text-slate-400 text-sm">{formatTimeAgo(activity.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'SIGNED' ? 'bg-emerald-500/20 text-emerald-400' :
                      activity.status === 'SENT' ? 'bg-blue-500/20 text-blue-400' :
                      activity.status === 'EXPIRED' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {getStatusLabel(activity.status)}
                    </span>
                    
                    {activity.client && (
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <UserIcon className="w-4 h-4" />
                        <span className="truncate">
                          {activity.client}
                          {activity.company && ` (${activity.company})`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {data.length > 5 && (
        <div className="mt-4 pt-4 border-t border-slate-700 text-center">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            {t.viewAllActivity}
          </button>
        </div>
      )}
    </div>
  );
}
