'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface SecuritySettingsProps {
  user: any;
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load 2FA status from localStorage
  useEffect(() => {
    const saved2FA = localStorage.getItem('sealthedeal-2fa-enabled');
    if (saved2FA !== null) {
      setTwoFactorEnabled(JSON.parse(saved2FA));
    }
  }, []);

  // Mock active sessions
  const activeSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: '2 hours ago',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, NY',
      lastActive: '1 day ago',
      current: false
    },
    {
      id: 3,
      device: 'Firefox on Mac',
      location: 'San Francisco, CA',
      lastActive: '3 days ago',
      current: false
    }
  ];

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handlePasswordChange = async () => {
    setPasswordError('');

    // Validation
    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!passwordForm.newPassword) {
      setPasswordError('New password is required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    const passwordValidation = validatePassword(passwordForm.newPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    setIsChangingPassword(true);
    setPasswordSuccess(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call to change the password
      console.log('Password change request:', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setPasswordSuccess(true);
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Hide success message after 3 seconds
      setTimeout(() => setPasswordSuccess(false), 3000);
      
    } catch (error) {
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRevokeSession = (sessionId: number) => {
    // In real app, call API to revoke session
    console.log('Revoking session:', sessionId);
  };

  const handleEnable2FA = async () => {
    if (twoFactorEnabled) {
      // Disable 2FA
      const confirmed = window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.');
      if (confirmed) {
        setTwoFactorEnabled(false);
        localStorage.setItem('sealthedeal-2fa-enabled', 'false');
        console.log('2FA disabled');
      }
    } else {
      // Enable 2FA
      const confirmed = window.confirm('Enable two-factor authentication? You will need to set up an authenticator app.');
      if (confirmed) {
        // Simulate 2FA setup process
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTwoFactorEnabled(true);
        localStorage.setItem('sealthedeal-2fa-enabled', 'true');
        console.log('2FA enabled');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Security</h2>
        <p className="text-slate-300">Manage your account security and privacy settings</p>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
              <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              twoFactorEnabled 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              onClick={handleEnable2FA}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {twoFactorEnabled ? 'Manage' : 'Enable'}
            </button>
          </div>
        </div>
        <p className="text-slate-400 text-sm">
          Two-factor authentication helps protect your account by requiring a second form of verification when you sign in.
        </p>
      </div>

      {/* Change Password */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <KeyIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Change Password</h3>
              <p className="text-slate-400 text-sm">Update your account password</p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors"
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                  <p className="text-red-400 text-sm">{passwordError}</p>
                </div>
              </div>
            )}

            <button
              onClick={handlePasswordChange}
              disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isChangingPassword ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Changing...</span>
                </>
              ) : (
                <span>Change Password</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <DevicePhoneMobileIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
            <p className="text-slate-400 text-sm">Manage devices signed into your account</p>
          </div>
        </div>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                  <DevicePhoneMobileIcon className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <div className="text-white font-medium">{session.device}</div>
                  <div className="text-slate-400 text-sm">{session.location} • {session.lastActive}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {session.current && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                    Current
                  </span>
                )}
                {!session.current && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-blue-400 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Security Tips</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Use a strong, unique password for your account</li>
              <li>• Enable two-factor authentication for extra security</li>
              <li>• Regularly review and revoke unused sessions</li>
              <li>• Never share your login credentials with others</li>
              <li>• Log out from shared or public devices</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {passwordSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-emerald-400" />
            <p className="text-emerald-400 font-medium">Password changed successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
}
