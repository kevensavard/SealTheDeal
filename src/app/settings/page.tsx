'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ProfileSettings from '@/components/settings/ProfileSettings';
import SubscriptionBilling from '@/components/settings/SubscriptionBilling';
import PreferencesSettings from '@/components/settings/PreferencesSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import DataProtectionSettings from '@/components/settings/DataProtectionSettings';
import DangerZone from '@/components/settings/DangerZone';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  UserIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

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

  const settingsSections = [
    {
      id: 'profile',
      name: t.profileSettings,
      icon: UserIcon,
      description: t.managePersonalInfo
    },
    {
      id: 'subscription',
      name: t.subscriptionBilling,
      icon: CreditCardIcon,
      description: t.manageSubscription
    },
    {
      id: 'preferences',
      name: t.preferences,
      icon: Cog6ToothIcon,
      description: t.customizeExperience
    },
    {
      id: 'security',
      name: t.security,
      icon: ShieldCheckIcon,
      description: t.manageSecurity
    },
    {
      id: 'data-protection',
      name: t.dataProtection,
      icon: DocumentTextIcon,
      description: t.manageYourData
    },
    {
      id: 'help',
      name: 'Help & Support',
      icon: QuestionMarkCircleIcon,
      description: 'Get help and contact support'
    },
    {
      id: 'danger',
      name: t.dangerZone,
      icon: ExclamationTriangleIcon,
      description: t.destructiveActions
    }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings user={user} />;
      case 'subscription':
        return <SubscriptionBilling user={user} />;
      case 'preferences':
        return <PreferencesSettings />;
      case 'security':
        return <SecuritySettings user={user} />;
      case 'data-protection':
        return <DataProtectionSettings user={user} />;
      case 'help':
        return <HelpSupportSection />;
      case 'danger':
        return <DangerZone user={user} />;
      default:
        return <ProfileSettings user={user} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col p-6 bg-slate-900">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t.settings}</h1>
          <p className="text-slate-300 text-lg">{t.manageAccount}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <h2 className="text-lg font-semibold text-white mb-4">{t.settings}</h2>
              <nav className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-blue-500/20 text-blue-400 font-medium'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{section.name}</div>
                        <div className="text-xs text-slate-400">{section.description}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Help & Support Section Component
function HelpSupportSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Help & Support</h2>
        <p className="text-slate-300">Get help with SealTheDeal and contact our support team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center gap-3 mb-4">
            <QuestionMarkCircleIcon className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Quick Help</h3>
          </div>
          <p className="text-slate-300 mb-4">Need immediate assistance? Access our comprehensive support center.</p>
          <button
            onClick={() => window.open('/support', '_blank')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Support Center
          </button>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center gap-3 mb-4">
            <DocumentTextIcon className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Documentation</h3>
          </div>
          <p className="text-slate-300 mb-4">Browse our guides, tutorials, and FAQ for self-service help.</p>
          <button
            onClick={() => window.open('/support?tab=documentation', '_blank')}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            View Documentation
          </button>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center gap-3 mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Report a Bug</h3>
          </div>
          <p className="text-slate-300 mb-4">Found something that's not working? Help us improve by reporting it.</p>
          <button
            onClick={() => window.open('/support?tab=bug-report', '_blank')}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Report Bug
          </button>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center gap-3 mb-4">
            <Cog6ToothIcon className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Request Feature</h3>
          </div>
          <p className="text-slate-300 mb-4">Have an idea for a new feature? We'd love to hear your suggestions.</p>
          <button
            onClick={() => window.open('/support?tab=feature-request', '_blank')}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Request Feature
          </button>
        </div>
      </div>

      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <QuestionMarkCircleIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Email Support</p>
              <p className="text-slate-400 text-sm">support@sealthedeal.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Cog6ToothIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-medium">Response Time</p>
              <p className="text-slate-400 text-sm">Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
