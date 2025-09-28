'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import MonitoringDashboard from '@/components/admin/MonitoringDashboard';
import UserManagement from '@/components/admin/UserManagement';
import SupportTicketManagement from '@/components/admin/SupportTicketManagement';
import { 
  ShieldCheckIcon,
  ChartBarIcon,
  ServerIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userTier, setUserTier] = useState<string>('FREE');
  const [activeSection, setActiveSection] = useState('monitoring');
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    proUsers: 0,
    adminUsers: 0,
    freeUsers: 0,
    totalContracts: 0,
    contractsThisMonth: 0,
    loading: true
  });
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    lastBackup: null,
    loading: true
  });
  const [backupLogs, setBackupLogs] = useState([]);

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
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        console.error('Error checking user tier:', error);
      }
    }
  };

  useEffect(() => {
    checkUserTier();
  }, [isSignedIn, user]);

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      setUserStats(prev => ({ ...prev, loading: true }));
      const response = await fetch('/api/admin/users/stats');
      const data = await response.json();
      
      if (data.success) {
        setUserStats({
          totalUsers: data.stats.totalUsers,
          activeUsers: data.stats.activeUsers,
          proUsers: data.stats.proUsers,
          adminUsers: data.stats.adminUsers,
          freeUsers: data.stats.freeUsers,
          totalContracts: data.stats.totalContracts,
          contractsThisMonth: data.stats.contractsThisMonth,
          loading: false
        });
      } else {
        console.error('Failed to fetch user stats:', data.error);
        setUserStats(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setUserStats(prev => ({ ...prev, loading: false }));
    }
  };

  // Fetch database status
  const fetchDbStatus = async () => {
    try {
      setDbStatus(prev => ({ ...prev, loading: true }));
      const [healthResponse, backupResponse] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/admin/backup')
      ]);
      
      const healthData = await healthResponse.json();
      const backupData = await backupResponse.json();
      
      setDbStatus({
        connected: healthData.status === 'ok',
        lastBackup: backupData.success && backupData.backups?.length > 0 
          ? backupData.backups[0].createdAt 
          : null,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching database status:', error);
      setDbStatus(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (isAdmin && activeSection === 'users') {
      fetchUserStats();
    }
    if (isAdmin && activeSection === 'database') {
      fetchDbStatus();
    }
  }, [isAdmin, activeSection]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900">
          <div className="text-center">
            <ShieldCheckIcon className="w-20 h-20 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-slate-300 mb-6">
              You don't have permission to access the admin dashboard.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col p-6 bg-slate-900">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheckIcon className="w-7 h-7" />
            Admin Dashboard
          </h1>
          <p className="text-slate-300 text-lg">System monitoring and administration tools</p>
        </div>

        {/* Admin Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => setActiveSection('monitoring')}
              className={`bg-slate-800 rounded-xl border p-6 hover:border-slate-600 transition-all duration-200 text-left w-full ${
                activeSection === 'monitoring' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">System Monitoring</h3>
                  <p className="text-slate-400 text-sm">Real-time performance metrics</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setActiveSection('database')}
              className={`bg-slate-800 rounded-xl border p-6 hover:border-slate-600 transition-all duration-200 text-left w-full ${
                activeSection === 'database' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <ServerIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Database Management</h3>
                  <p className="text-slate-400 text-sm">Backup and maintenance</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setActiveSection('users')}
              className={`bg-slate-800 rounded-xl border p-6 hover:border-slate-600 transition-all duration-200 text-left w-full ${
                activeSection === 'users' 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : 'border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">User Management</h3>
                  <p className="text-slate-400 text-sm">Manage user accounts</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setActiveSection('tickets')}
              className={`bg-slate-800 rounded-xl border p-6 hover:border-slate-600 transition-all duration-200 text-left w-full ${
                activeSection === 'tickets' 
                  ? 'border-cyan-500 bg-cyan-500/10' 
                  : 'border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Support Tickets</h3>
                  <p className="text-slate-400 text-sm">Manage support requests</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setActiveSection('content')}
              className={`bg-slate-800 rounded-xl border p-6 hover:border-slate-600 transition-all duration-200 text-left w-full ${
                activeSection === 'content' 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Content Management</h3>
                  <p className="text-slate-400 text-sm">Templates and settings</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setActiveSection('settings')}
              className={`bg-slate-800 rounded-xl border p-6 hover:border-slate-600 transition-all duration-200 text-left w-full ${
                activeSection === 'settings' 
                  ? 'border-red-500 bg-red-500/10' 
                  : 'border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Cog6ToothIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">System Settings</h3>
                  <p className="text-slate-400 text-sm">Configuration and maintenance</p>
                </div>
              </div>
            </button>
          </div>
        </div>


        {/* Dynamic Content Section */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          {activeSection === 'monitoring' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-blue-400" />
                System Monitoring
              </h2>
              <MonitoringDashboard />
            </div>
          )}

          {activeSection === 'database' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ServerIcon className="w-6 h-6 text-purple-400" />
                Database Management
              </h2>
              <div className="space-y-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Backup Operations</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/admin/backup', { method: 'POST' });
                          const data = await response.json();
                          if (data.success) {
                            alert('Backup created successfully!');
                          } else {
                            alert('Failed to create backup: ' + data.error);
                          }
                        } catch (error) {
                          alert('Error creating backup: ' + error);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Full Backup
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/admin/backup');
                          const data = await response.json();
                          if (data.success) {
                            setBackupLogs(data.backups || []);
                          } else {
                            alert('Failed to load backup logs: ' + data.error);
                          }
                        } catch (error) {
                          alert('Error loading backup logs: ' + error);
                        }
                      }}
                      className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      View Backup Logs
                    </button>
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Database Status</h3>
                  {dbStatus.loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className="text-slate-400">Loading database status...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-slate-300">
                        Database connection: 
                        <span className={`ml-2 ${dbStatus.connected ? 'text-emerald-400' : 'text-red-400'}`}>
                          {dbStatus.connected ? 'Connected' : 'Disconnected'}
                        </span>
                      </p>
                      <p className="text-slate-300">
                        Last backup: 
                        <span className="ml-2 text-slate-400">
                          {dbStatus.lastBackup 
                            ? new Date(dbStatus.lastBackup).toLocaleString()
                            : 'Never'
                          }
                        </span>
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Backup Logs */}
                {backupLogs.length > 0 && (
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Recent Backups</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {backupLogs.map((backup: any, index: number) => (
                        <div key={index} className="bg-slate-600 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{backup.filename || `Backup ${index + 1}`}</p>
                            <p className="text-slate-400 text-sm">
                              {backup.createdAt ? new Date(backup.createdAt).toLocaleString() : 'Unknown date'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-300 text-sm">
                              {backup.recordCount ? `${(Object.values(backup.recordCount) as number[]).reduce((a: number, b: number) => a + b, 0)} records` : 'Unknown size'}
                            </p>
                            <span className={`px-2 py-1 rounded text-xs ${
                              backup.status === 'success' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {backup.status || 'unknown'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <UserGroupIcon className="w-6 h-6 text-orange-400" />
                User Management
              </h2>
              <div className="space-y-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">User Statistics</h3>
                  {userStats.loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-slate-400">Loading user statistics...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                      <div className="bg-slate-600 rounded-lg p-3">
                        <p className="text-slate-400 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-white">{userStats.totalUsers}</p>
                      </div>
                      <div className="bg-slate-600 rounded-lg p-3">
                        <p className="text-slate-400 text-sm">Free Users</p>
                        <p className="text-2xl font-bold text-white">{userStats.freeUsers}</p>
                      </div>
                      <div className="bg-slate-600 rounded-lg p-3">
                        <p className="text-slate-400 text-sm">Pro Users</p>
                        <p className="text-2xl font-bold text-white">{userStats.proUsers}</p>
                      </div>
                      <div className="bg-slate-600 rounded-lg p-3">
                        <p className="text-slate-400 text-sm">Admin Users</p>
                        <p className="text-2xl font-bold text-white">{userStats.adminUsers}</p>
                      </div>
                      <div className="bg-slate-600 rounded-lg p-3">
                        <p className="text-slate-400 text-sm">Total Contracts</p>
                        <p className="text-2xl font-bold text-white">{userStats.totalContracts}</p>
                      </div>
                      <div className="bg-slate-600 rounded-lg p-3">
                        <p className="text-slate-400 text-sm">This Month</p>
                        <p className="text-2xl font-bold text-white">{userStats.contractsThisMonth}</p>
                      </div>
                    </div>
                  )}
                </div>
                <UserManagement onUserUpdate={fetchUserStats} />
              </div>
            </div>
          )}

          {activeSection === 'tickets' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-cyan-400" />
                Support Tickets
              </h2>
              <SupportTicketManagement />
            </div>
          )}

          {activeSection === 'content' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-emerald-400" />
                Content Management
              </h2>
              <div className="space-y-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Contract Templates</h3>
                  <p className="text-slate-300">Manage contract templates and content...</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">System Content</h3>
                  <p className="text-slate-300">Manage system-wide content and settings...</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Cog6ToothIcon className="w-6 h-6 text-red-400" />
                System Settings
              </h2>
              <div className="space-y-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Application Settings</h3>
                  <p className="text-slate-300">Configure application-wide settings...</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Maintenance</h3>
                  <p className="text-slate-300">System maintenance and configuration tools...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
