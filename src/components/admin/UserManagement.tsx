'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { UserTier } from '@prisma/client';
import UserEditModal from './UserEditModal';

interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  tier: UserTier;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  contractCount: number;
  clientCount: number;
  contractsThisMonth: number;
}

interface UserManagementProps {
  onUserUpdate?: () => void;
}

export default function UserManagement({ onUserUpdate }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (tierFilter) params.append('tier', tierFilter);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.pagination.pages);
      } else {
        console.error('Failed to fetch users:', data.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, tierFilter]);

  const handleTierChange = async (userId: string, newTier: UserTier) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: newTier })
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
        onUserUpdate?.();
      } else {
        console.error('Failed to update user tier:', data.error);
      }
    } catch (error) {
      console.error('Error updating user tier:', error);
    }
  };

  const handleSaveUser = async (userId: string, data: { firstName?: string; lastName?: string; tier?: UserTier }) => {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      fetchUsers();
      onUserUpdate?.();
    } else {
      throw new Error(result.error || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setShowDeleteModal(null);
        onUserUpdate?.();
      } else {
        console.error('Failed to delete user:', data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getTierColor = (tier: UserTier) => {
    switch (tier) {
      case 'ADMIN': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PRO': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'FREE': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-slate-400">Manage user accounts, tiers, and permissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Tiers</option>
          <option value="FREE">Free</option>
          <option value="PRO">Pro</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <UserIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : 'No name set'
                          }
                        </div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                        <div className="text-xs text-slate-500">
                          ID: {user.clerkId.slice(0, 8)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.tier}
                        onChange={(e) => handleTierChange(user.id, e.target.value as UserTier)}
                        className={`px-2 py-1 rounded text-xs font-medium border ${getTierColor(user.tier)} bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="FREE">Free</option>
                        <option value="PRO">Pro</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">
                        <div className="flex items-center gap-1 mb-1">
                          <CalendarIcon className="w-4 h-4" />
                          Joined: {formatDate(user.createdAt)}
                        </div>
                        <div className="text-xs text-slate-400">
                          Last active: {formatDate(user.lastActivity)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1 text-slate-300">
                          <DocumentTextIcon className="w-4 h-4" />
                          {user.contractCount} contracts
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <UserGroupIcon className="w-4 h-4" />
                          {user.clientCount} clients
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {user.contractsThisMonth} this month
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(user)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Delete User</h3>
            </div>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete <strong>{showDeleteModal.email}</strong>? 
              This action cannot be undone and will permanently remove all their data including contracts and clients.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteModal.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      <UserEditModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
      />
    </div>
  );
}
