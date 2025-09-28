'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  CheckIcon,
  TrashIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  contract?: {
    id: string;
    title: string;
    status: string;
    expiresAt?: string;
    signedAt?: string;
  };
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    company?: string;
  };
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getIcon: (type: string) => any;
  getColor: (type: string) => string;
}

export default function NotificationCard({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  getIcon, 
  getColor 
}: NotificationCardProps) {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: 'bg-slate-500/20 text-slate-400', label: 'Draft' },
      SENT: { color: 'bg-blue-500/20 text-blue-400', label: 'Sent' },
      SIGNED: { color: 'bg-emerald-500/20 text-emerald-400', label: 'Signed' },
      EXPIRED: { color: 'bg-red-500/20 text-red-400', label: 'Expired' },
      CANCELLED: { color: 'bg-gray-500/20 text-gray-400', label: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const Icon = getIcon(notification.type);
  const colorClass = getColor(notification.type);

  return (
    <div className={`bg-slate-800 rounded-xl border transition-all duration-200 hover:border-slate-600 ${
      notification.isRead ? 'border-slate-700' : 'border-blue-500/50 bg-blue-500/5'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className={`font-semibold ${notification.isRead ? 'text-slate-300' : 'text-white'}`}>
                  {notification.title}
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  {notification.message}
                </p>
                
                {/* Contract/Client Info */}
                {(notification.contract || notification.client) && (
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    {notification.contract && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Contract:</span>
                        <span className="text-slate-300 font-medium">
                          {notification.contract.title}
                        </span>
                        {getStatusBadge(notification.contract.status)}
                      </div>
                    )}
                    
                    {notification.client && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Client:</span>
                        <span className="text-slate-300 font-medium">
                          {notification.client.firstName} {notification.client.lastName}
                          {notification.client.company && ` (${notification.client.company})`}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-slate-400 text-sm">
                    {formatTimeAgo(notification.createdAt)}
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.isRead && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                    title={showDetails ? 'Hide details' : 'Show details'}
                  >
                    {showDetails ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => onDelete(notification.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete notification"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="text-slate-300 font-medium mb-2">Notification Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Type:</span>
                    <span className="text-slate-300">{notification.type.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Created:</span>
                    <span className="text-slate-300">{formatDate(notification.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-slate-300">
                      {notification.isRead ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>
              </div>
              
              {notification.contract && (
                <div>
                  <h4 className="text-slate-300 font-medium mb-2">Contract Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      {getStatusBadge(notification.contract.status)}
                    </div>
                    {notification.contract.expiresAt && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Expires:</span>
                        <span className="text-slate-300">
                          {formatDate(notification.contract.expiresAt)}
                        </span>
                      </div>
                    )}
                    {notification.contract.signedAt && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Signed:</span>
                        <span className="text-slate-300">
                          {formatDate(notification.contract.signedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
