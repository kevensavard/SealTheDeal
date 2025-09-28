'use client';

import { useState } from 'react';
import { 
  ShieldCheckIcon, 
  ArrowDownTrayIcon, 
  TrashIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface DataProtectionSettingsProps {
  user: any;
}

export default function DataProtectionSettings({ user }: DataProtectionSettingsProps) {
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    
    try {
      const response = await fetch(`/api/users/${user?.id}/export`);
      const data = await response.json();
      
      if (data.success) {
        // Create and download file
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sealthedeal-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 5000);
      } else {
        console.error('Export failed:', data.error);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account and all data? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setDeleteSuccess(false);
    
    try {
      // In a real app, this would call a delete account API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDeleteSuccess(true);
      setTimeout(() => {
        // Redirect to sign-in page
        window.location.href = '/sign-in';
      }, 3000);
      
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <ShieldCheckIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{t.dataProtection}</h2>
          <p className="text-slate-400">{t.manageYourData}</p>
        </div>
      </div>

      {/* Data Export Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ArrowDownTrayIcon className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">{t.exportData}</h3>
        </div>
        
        <p className="text-slate-300 mb-4">
          {t.exportDataDesc}
        </p>
        
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-white mb-2">{t.exportIncludes}</h4>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• {t.personalInfo}</li>
            <li>• {t.contracts}</li>
            <li>• {t.clients}</li>
            <li>• {t.notifications}</li>
            <li>• {t.accountSettings}</li>
          </ul>
        </div>

        <button
          onClick={handleExportData}
          disabled={isExporting}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t.exporting}
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="w-4 h-4" />
              {t.exportMyData}
            </>
          )}
        </button>

        {exportSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircleIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{t.exportSuccessful}</span>
            </div>
          </div>
        )}
      </div>

      {/* Data Retention Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ClockIcon className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">{t.dataRetention}</h3>
        </div>
        
        <p className="text-slate-300 mb-4">
          {t.dataRetentionDesc}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">{t.activeAccount}</h4>
            <p className="text-sm text-slate-400">{t.activeAccountDesc}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">{t.deletedAccount}</h4>
            <p className="text-sm text-slate-400">{t.deletedAccountDesc}</p>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <EyeIcon className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">{t.dataSecurity}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">{t.encryption}</h4>
            <p className="text-sm text-slate-400">{t.encryptionDesc}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">{t.accessControls}</h4>
            <p className="text-sm text-slate-400">{t.accessControlsDesc}</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
          <h3 className="text-lg font-semibold text-white">{t.dangerZone}</h3>
        </div>
        
        <p className="text-slate-300 mb-4">
          {t.deleteAccountWarning}
        </p>
        
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t.deletingAccount}
            </>
          ) : (
            <>
              <TrashIcon className="w-4 h-4" />
              {t.deleteAccount}
            </>
          )}
        </button>

        {deleteSuccess && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <CheckCircleIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{t.accountDeleted}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
