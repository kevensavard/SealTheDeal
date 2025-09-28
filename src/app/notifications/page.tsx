'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import NotificationCard from '@/components/notifications/NotificationCard';
import ActivityTimeline from '@/components/notifications/ActivityTimeline';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  FunnelIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon
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

export default function NotificationsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread' | 'contracts' | 'clients'>('all');
  const [view, setView] = useState<'list' | 'timeline'>('list');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchNotifications();
    }
  }, [isSignedIn, user]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/notifications?clerkId=${user?.id}&limit=100`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } else {
        console.error('Failed to fetch notifications:', data.error);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user?.id,
          isRead: true
        }),
      });

      if (response.ok) {
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}?clerkId=${user?.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'contracts':
        return notification.type.includes('CONTRACT');
      case 'clients':
        return notification.type === 'CLIENT_ADDED';
      default:
        return true;
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CONTRACT_CREATED':
      case 'CONTRACT_SENT':
        return DocumentTextIcon;
      case 'CONTRACT_SIGNED':
        return CheckCircleIcon;
      case 'CONTRACT_EXPIRED':
      case 'CONTRACT_EXPIRING_SOON':
        return ExclamationTriangleIcon;
      case 'CLIENT_ADDED':
        return BellIcon;
      default:
        return BellIcon;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'CONTRACT_SIGNED':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'CONTRACT_EXPIRED':
      case 'CONTRACT_EXPIRING_SOON':
        return 'text-red-400 bg-red-500/20';
      case 'CONTRACT_CREATED':
      case 'CONTRACT_SENT':
        return 'text-blue-400 bg-blue-500/20';
      case 'CLIENT_ADDED':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
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

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col p-6 bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <BellIcon className="w-8 h-8" />
              {t.notifications}
            </h1>
            <p className="text-slate-300">
              {unreadCount > 0 
                ? `${unreadCount} unread notifications` 
                : 'All caught up! No new notifications'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
            
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView('timeline')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === 'timeline' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Timeline
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300 text-sm">Filter:</span>
          </div>
          
          <div className="flex items-center gap-2">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'contracts', label: 'Contracts', count: notifications.filter(n => n.type.includes('CONTRACT')).length },
              { key: 'clients', label: 'Clients', count: notifications.filter(n => n.type === 'CLIENT_ADDED').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {label} ({count})
              </button>
            ))}
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
        ) : filteredNotifications.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <BellIcon className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="text-slate-400">
                {filter === 'unread' 
                  ? 'You\'re all caught up! Check back later for new updates.'
                  : 'Your activity feed will appear here as you create contracts and add clients.'
                }
              </p>
            </div>
          </div>
        ) : view === 'list' ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                getIcon={getNotificationIcon}
                getColor={getNotificationColor}
              />
            ))}
          </div>
        ) : (
          <ActivityTimeline
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            getIcon={getNotificationIcon}
            getColor={getNotificationColor}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
