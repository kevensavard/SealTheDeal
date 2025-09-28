'use client';

import { useState } from 'react';
import {
  ExclamationTriangleIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface DangerZoneProps {
  user: any;
}

export default function DangerZone({ user }: DangerZoneProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setDeleteError('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would be an API call to delete the account
      console.log('Account deletion request for user:', user?.id);
      
      setDeleteSuccess(true);
      setShowDeleteModal(false);
      
      // In a real app, redirect to sign-in or show success message
      setTimeout(() => {
        setDeleteSuccess(false);
        // Redirect to sign-in page
        window.location.href = '/sign-in';
      }, 3000);
      
    } catch (error) {
      setDeleteError('Failed to delete account. Please try again or contact support.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Danger Zone</h2>
        <p className="text-slate-300">Irreversible and destructive actions</p>
      </div>

      {/* Delete Account */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <TrashIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Delete Account</h3>
              <p className="text-slate-400 text-sm">
                Permanently delete your account and all associated data
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Delete Account
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
          <div className="flex items-start gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="text-sm text-red-300">
              <p className="font-medium mb-1">This action cannot be undone</p>
              <p>This will permanently delete your account, all contracts, and remove all data from our servers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <TrashIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Delete Account</h2>
                  <p className="text-slate-400 text-sm">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5" />
                    <div className="text-sm text-red-300">
                      <p className="font-medium mb-2">Are you absolutely sure?</p>
                      <p>This will permanently delete:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Your account and profile</li>
                        <li>All contracts and documents</li>
                        <li>All billing and subscription data</li>
                        <li>All settings and preferences</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Type <span className="font-mono bg-slate-700 px-1 rounded">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => {
                      setConfirmText(e.target.value);
                      setDeleteError(''); // Clear error when typing
                    }}
                    placeholder="DELETE"
                    className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      deleteError ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-red-500'
                    }`}
                  />
                  {deleteError && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      {deleteError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-700">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || confirmText !== 'DELETE'}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {deleteSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-emerald-400" />
            <p className="text-emerald-400 font-medium">Account deleted successfully. Redirecting to sign-in...</p>
          </div>
        </div>
      )}

      {/* Additional Warning */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Before You Go</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <p>• Download any contracts you want to keep</p>
              <p>• Cancel any active subscriptions</p>
              <p>• Consider contacting support if you're having issues</p>
              <p>• Remember that account deletion is permanent and irreversible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
