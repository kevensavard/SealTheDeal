'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ContractCard from '@/components/contracts/ContractCard';
import ContractEditModal from '@/components/contracts/ContractEditModal';
import { 
  DocumentPlusIcon, 
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  FireIcon,
  BellIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ContractStatus } from '@prisma/client';

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContract, setEditingContract] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [contractUsage, setContractUsage] = useState<{
    currentMonth: number;
    limit: number | null;
    tier: string;
    resetDate?: string;
  } | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any>(null);

  // Define functions before useEffect hooks
  const syncUserWithDatabase = async () => {
    try {
      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user?.id,
          email: user?.emailAddresses[0]?.emailAddress,
          firstName: user?.firstName,
          lastName: user?.lastName,
        }),
      });

      if (response.ok) {
        console.log('User synced with database successfully');
      } else {
        console.error('Failed to sync user with database');
      }
    } catch (error) {
      console.error('Error syncing user with database:', error);
    }
  };

  const fetchContracts = async () => {
    if (!user?.id) {
      console.error('No user ID available for fetching contracts');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/contracts?clerkId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setContracts(data.contracts || []);
      } else {
        console.error('Failed to fetch contracts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch contract usage
  const fetchContractUsage = async () => {
    if (user?.id) {
      try {
        console.log('🔍 Dashboard - Fetching contract usage for user:', user.id);
        const response = await fetch('/api/user/contract-usage');
        const data = await response.json();
        
        console.log('🔍 Dashboard - Contract usage response:', data);
        
        if (data.success) {
          setContractUsage(data.usage);
        }
      } catch (error) {
        console.error('Error fetching contract usage:', error);
      }
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        // If analytics API fails, calculate from contracts data
        const contractsResponse = await fetch(`/api/contracts?clerkId=${user?.id}`);
        if (contractsResponse.ok) {
          const contractsData = await contractsResponse.json();
          const contracts = contractsData.contracts || [];
          
          const thisMonth = new Date();
          thisMonth.setDate(1);
          const lastMonth = new Date(thisMonth);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          
          const thisMonthContracts = contracts.filter((c: any) => 
            new Date(c.createdAt) >= thisMonth
          );
          const lastMonthContracts = contracts.filter((c: any) => {
            const created = new Date(c.createdAt);
            return created >= lastMonth && created < thisMonth;
          });
          
          const signedContracts = contracts.filter((c: any) => c.status === 'SIGNED');
          const successRate = contracts.length > 0 ? Math.round((signedContracts.length / contracts.length) * 100) : 0;
          
          const mockAnalytics = {
            thisMonth: thisMonthContracts.length,
            lastMonth: lastMonthContracts.length,
            successRate: successRate,
            totalContracts: contracts.length,
            signedContracts: signedContracts.length
          };
          
          setAnalytics(mockAnalytics);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/notifications?limit=5');
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const fetchActionItems = async () => {
    try {
      // Get contracts that need attention
      const response = await fetch(`/api/contracts?clerkId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        const contracts = data.contracts || [];
        
        const items: Array<{
          id: string;
          type: string;
          title: string;
          description: string;
          contractId: string;
          priority: string;
          icon: any;
          color: string;
        }> = [];
        
        // Find contracts pending signature
        const pendingContracts = contracts.filter((c: any) => c.status === 'SENT');
        pendingContracts.forEach((contract: any) => {
          items.push({
            id: `pending-${contract.id}`,
            type: 'pending_signature',
            title: 'Contract pending signature',
            description: `${contract.title} is waiting for signatures`,
            contractId: contract.id,
            priority: 'high',
            icon: DocumentCheckIcon,
            color: 'text-yellow-400'
          });
        });

        // Find contracts that might be expiring soon (check if they have expiration dates)
        const contractsWithExpiration = contracts.filter((c: any) => {
          // Check if contract has expiration metadata or created more than 30 days ago
          const createdDate = new Date(c.createdAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdDate < thirtyDaysAgo && c.status !== 'SIGNED';
        });

        contractsWithExpiration.slice(0, 2).forEach((contract: any) => {
          const daysSinceCreated = Math.floor((new Date().getTime() - new Date(contract.createdAt).getTime()) / (1000 * 60 * 60 * 24));
          items.push({
            id: `expiring-${contract.id}`,
            type: 'expiring',
            title: 'Contract needs attention',
            description: `${contract.title} created ${daysSinceCreated} days ago`,
            contractId: contract.id,
            priority: 'medium',
            icon: CalendarIcon,
            color: 'text-orange-400'
          });
        });

        setActionItems(items);
      }
    } catch (error) {
      console.error('Error fetching action items:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      // Calculate real achievements based on actual data
      const response = await fetch(`/api/contracts?clerkId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        const contracts = data.contracts || [];
        
        // Calculate streak (consecutive days with contract creation)
        let streak = 0;
        const today = new Date();
        const contractDates: string[] = contracts.map((c: any) => new Date(c.createdAt).toDateString());
        const uniqueDates: string[] = [...new Set(contractDates)].sort().reverse();
        
        for (let i = 0; i < uniqueDates.length; i++) {
          const contractDate = new Date(uniqueDates[i]);
          const daysDiff = Math.floor((today.getTime() - contractDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === i) {
            streak++;
          } else {
            break;
          }
        }
        
        // Calculate signed contracts
        const signedContracts = contracts.filter((c: any) => c.status === 'SIGNED');
        
        const realAchievements = {
          totalContracts: contracts.length,
          streak: streak,
          milestones: [
            { id: 1, title: 'First Contract', achieved: contracts.length >= 1, icon: '🎉' },
            { id: 2, title: '5 Contracts', achieved: contracts.length >= 5, icon: '📄' },
            { id: 3, title: 'Power User', achieved: contracts.length >= 10, icon: '⚡' },
            { id: 4, title: 'Template Master', achieved: contracts.length >= 20, icon: '📋' },
            { id: 5, title: 'Signature Pro', achieved: signedContracts.length >= 5, icon: '✍️' }
          ],
          badges: [
            { name: 'Quick Starter', earned: contracts.length >= 1, color: 'bg-blue-500' },
            { name: 'Consistent Creator', earned: contracts.length >= 5, color: 'bg-emerald-500' },
            { name: 'Signature Pro', earned: signedContracts.length >= 3, color: 'bg-purple-500' },
            { name: 'Streak Master', earned: streak >= 7, color: 'bg-orange-500' }
          ]
        };
        
        setAchievements(realAchievements);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const handleEditContract = (contract: any) => {
    setEditingContract(contract);
    setIsEditModalOpen(true);
  };

  const handleSaveContract = async (updatedContract: any) => {
    try {
      const response = await fetch(`/api/contracts/${updatedContract.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContract),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the contract in the list
        setContracts(prev => 
          prev.map(contract => 
            contract.id === updatedContract.id ? updatedContract : contract
          )
        );
        setIsEditModalOpen(false);
        setEditingContract(null);
      } else {
        console.error('Failed to update contract:', data.error);
      }
    } catch (error) {
      console.error('Error updating contract:', error);
    }
  };

  const handleDeleteContract = async (contractId: string) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove the contract from the list
        setContracts(prev => prev.filter(contract => contract.id !== contractId));
      } else {
        console.error('Failed to delete contract:', data.error);
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
    }
  };

  const handleStatusChange = async (contractId: string, newStatus: ContractStatus) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the contract status in the list
        setContracts(prev => 
          prev.map(contract => 
            contract.id === contractId ? { ...contract, status: newStatus } : contract
          )
        );
      } else {
        console.error('Failed to update contract status:', data.error);
      }
    } catch (error) {
      console.error('Error updating contract status:', error);
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Sync user with database when component mounts
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      syncUserWithDatabase();
    }
  }, [isLoaded, isSignedIn, user]);

  // Fetch contracts when component mounts
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchContracts();
      fetchContractUsage();
      fetchAnalytics();
      fetchRecentActivity();
      fetchActionItems();
    }
  }, [isLoaded, isSignedIn, user]);

  // Fetch achievements after contracts are loaded
  useEffect(() => {
    if (contracts.length >= 0) {
      fetchAchievements();
    }
  }, [contracts]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SENT': return 'bg-yellow-100 text-yellow-800';
      case 'SIGNED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
        {/* Header */}
        <header className="bg-slate-800 shadow-sm border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.firstName || 'User'} 👋
              </h1>
              <p className="text-slate-300">Here's what's happening with your contracts today.</p>
            </div>
            <Link href="/create-contract" className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
              <DocumentPlusIcon className="w-5 h-5" />
              <span>New Contract</span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Analytics Overview */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <ChartBarIcon className="w-6 h-6 text-blue-400" />
                    Analytics Overview
                  </h2>
                  <Link href="/analytics" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    View Details →
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">This Month</span>
                      <DocumentTextIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {analytics ? analytics.thisMonth : contracts.length}
                    </div>
                    <div className="text-xs text-emerald-400">
                      {analytics && analytics.lastMonth > 0 
                        ? `+${Math.round(((analytics.thisMonth - analytics.lastMonth) / analytics.lastMonth) * 100)}% from last month`
                        : 'First month'
                      }
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">Success Rate</span>
                      <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {analytics ? `${analytics.successRate}%` : '0%'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {analytics ? `${analytics.signedContracts} of ${analytics.totalContracts} signed` : 'No contracts yet'}
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">Total Contracts</span>
                      <ClockIcon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {analytics ? analytics.totalContracts : contracts.length}
                    </div>
                    <div className="text-xs text-slate-400">
                      {analytics ? `${analytics.signedContracts} signed, ${analytics.totalContracts - analytics.signedContracts} pending` : 'All time'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Contracts Summary */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <DocumentTextIcon className="w-6 h-6 text-emerald-400" />
                    Recent Contracts
                  </h2>
                  <Link href="/contracts" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    View All →
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading contracts...</p>
                  </div>
                ) : contracts.length > 0 ? (
                  <div className="space-y-4">
                    {contracts.map((contract) => (
                      <ContractCard
                        key={contract.id}
                        contract={contract}
                        onEdit={handleEditContract}
                        onDelete={handleDeleteContract}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No contracts yet</h3>
                    <p className="text-slate-400 mb-4">Get started by creating your first contract.</p>
                    <Link href="/create-contract" className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2">
                      <DocumentPlusIcon className="w-4 h-4" />
                      <span>Create Contract</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Usage Widget */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-blue-400" />
                  Usage This Month
                </h3>
                {contractUsage ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Contracts</span>
                      <span className="text-white font-semibold">
                        {contractUsage.currentMonth} / {contractUsage.limit === null ? '∞' : contractUsage.limit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: contractUsage.limit === null ? '100%' : `${Math.min((contractUsage.currentMonth / contractUsage.limit) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-400">
                      {contractUsage.tier} Plan
                      {contractUsage.resetDate && (
                        <span className="block">Resets on {new Date(contractUsage.resetDate).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-slate-400 text-sm">Loading usage...</p>
                  </div>
                )}
              </div>

              {/* Action Items & Reminders */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-yellow-400" />
                  Action Items
                </h3>
                {actionItems.length > 0 ? (
                  <div className="space-y-3">
                    {actionItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                          <Icon className={`w-5 h-5 ${item.color} mt-0.5`} />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{item.title}</p>
                            <p className="text-slate-400 text-xs">{item.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircleIcon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">All caught up!</p>
                  </div>
                )}
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-purple-400" />
                  Recent Activity
                </h3>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{activity.title}</p>
                          <p className="text-slate-400 text-xs">{activity.message}</p>
                          <p className="text-slate-500 text-xs mt-1">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <ClockIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No recent activity</p>
                  </div>
                )}
              </div>

              {/* Achievement & Progress */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h3>
                {achievements ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">Current Streak</span>
                      <div className="flex items-center gap-1">
                        <FireIcon className="w-4 h-4 text-orange-400" />
                        <span className="text-white font-semibold">{achievements.streak} days</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {achievements.milestones.slice(0, 3).map((milestone: any) => (
                        <div key={milestone.id} className={`flex items-center gap-2 p-2 rounded-lg ${
                          milestone.achieved ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                        }`}>
                          <span className="text-lg">{milestone.icon}</span>
                          <span className={`text-sm ${milestone.achieved ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {milestone.title}
                          </span>
                          {milestone.achieved && <CheckCircleIcon className="w-4 h-4 text-emerald-400 ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <TrophyIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Loading achievements...</p>
                  </div>
                )}
              </div>

              {/* Smart Quick Actions */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-purple-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link href="/create-contract" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <DocumentPlusIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-white text-sm font-medium">Create New Contract</span>
                  </Link>
                  <Link href="/templates" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <DocumentTextIcon className="w-5 h-5 text-emerald-400" />
                    <span className="text-white text-sm font-medium">Browse Templates</span>
                  </Link>
                  <Link href="/clients" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <UserGroupIcon className="w-5 h-5 text-purple-400" />
                    <span className="text-white text-sm font-medium">Manage Clients</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Contract Edit Modal */}
        <ContractEditModal
          contract={editingContract}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingContract(null);
          }}
          onSave={handleSaveContract}
        />
    </DashboardLayout>
  );
}