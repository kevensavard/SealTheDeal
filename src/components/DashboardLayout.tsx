'use client';

import { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BellIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  // Check user tier and fetch unread notification count
  useEffect(() => {
    if (user?.id) {
      console.log('🔍 DashboardLayout - Making API call for user:', user.id);
      
      const checkUserTier = async () => {
        try {
          console.log('📡 DashboardLayout - Calling /api/user/tier');
          const response = await fetch('/api/user/tier');
          const data = await response.json();
          console.log('📡 DashboardLayout - Response:', data);
          if (data.success) {
            setIsAdmin(data.isAdmin);
          }
        } catch (error) {
          console.error('❌ DashboardLayout - Error checking user tier:', error);
        }
      };

      const fetchUnreadCount = async () => {
        try {
          const response = await fetch(`/api/notifications?clerkId=${user.id}&limit=1`);
          const data = await response.json();
          if (data.success) {
            setUnreadCount(data.unreadCount);
          }
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      };

      checkUserTier();
      fetchUnreadCount();
      
      // Refresh unread count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-slate-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">SealTheDeal</h1>
          <button
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-300"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  <Link 
                    href="/dashboard" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === '/dashboard' || pathname === '/'
                        ? 'bg-blue-500/20 text-blue-400 font-medium' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <HomeIcon className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    href="/create-contract" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === '/create-contract' 
                        ? 'bg-blue-500/20 text-blue-400 font-medium' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <DocumentPlusIcon className="w-5 h-5" />
                    <span>Create Contract</span>
                  </Link>
                  <Link 
                    href="/templates" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === '/templates' 
                        ? 'bg-blue-500/20 text-blue-400 font-medium' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                    <span>Templates</span>
                  </Link>
                  <Link 
                    href="/clients" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === '/clients' 
                        ? 'bg-blue-500/20 text-blue-400 font-medium' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <UserGroupIcon className="w-5 h-5" />
                    <span>Clients</span>
                  </Link>
                  <Link 
                    href="/notifications" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === '/notifications' 
                        ? 'bg-blue-500/20 text-blue-400 font-medium' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="relative">
                      <BellIcon className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <span>Notifications</span>
                  </Link>
                  <Link 
                    href="/analytics" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === '/analytics' 
                        ? 'bg-blue-500/20 text-blue-400 font-medium' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="relative">
                      <ChartBarIcon className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        PRO
                      </span>
                    </div>
                    <span>Analytics</span>
                  </Link>
                  <Link 
                href="/settings" 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/settings' 
                    ? 'bg-blue-500/20 text-blue-400 font-medium' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/admin' 
                      ? 'bg-blue-500/20 text-blue-400 font-medium' 
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="relative">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      ADMIN
                    </span>
                  </div>
                  <span>Admin</span>
                </Link>
              )}
                </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">SealTheDeal</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {children}
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.open('/support', '_blank')}
          className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-300 flex items-center justify-center group cursor-pointer hover:scale-110 hover:rotate-12"
          title="Get Help & Support"
          style={{ cursor: 'pointer' }}
        >
          <QuestionMarkCircleIcon className="w-6 h-6 text-white group-hover:scale-125 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
