'use client';

import { useState } from 'react';
import { XMarkIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { UserTier } from '@prisma/client';

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

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, data: { firstName?: string; lastName?: string; tier?: UserTier }) => Promise<void>;
}

export default function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    tier: user?.tier || 'FREE' as UserTier
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await onSave(user.id, formData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Edit User</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                User ID
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <UserIcon className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300 text-sm">{user.clerkId}</span>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                User Tier
              </label>
              <select
                value={formData.tier}
                onChange={(e) => handleInputChange('tier', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FREE">Free</option>
                <option value="PRO">Pro</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          {/* User Stats */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-3">User Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Contracts:</span>
                <span className="text-white ml-2">{user.contractCount}</span>
              </div>
              <div>
                <span className="text-slate-400">Clients:</span>
                <span className="text-white ml-2">{user.clientCount}</span>
              </div>
              <div>
                <span className="text-slate-400">This Month:</span>
                <span className="text-white ml-2">{user.contractsThisMonth}</span>
              </div>
              <div>
                <span className="text-slate-400">Joined:</span>
                <span className="text-white ml-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
