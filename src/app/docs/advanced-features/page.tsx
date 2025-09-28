'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function AdvancedFeaturesPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <Link 
                href="/support?tab=documentation" 
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Documentation
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Advanced Features</h1>
                  <p className="text-slate-400">Power user features and advanced functionality</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-invert max-w-none">
            
            {/* Client Management */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <UserGroupIcon className="w-6 h-6 text-blue-400" />
                Client Management
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Centralized Client Database</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Store and manage all your client information in one place:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Full name and company information</li>
                    <li>• Email addresses and phone numbers</li>
                    <li>• Contract history and relationship tracking</li>
                    <li>• Quick access to all past agreements</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Auto-Fill Contract Data</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    When creating contracts, client information is automatically populated:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Select from existing clients when creating contracts</li>
                    <li>• Client details automatically fill in party information</li>
                    <li>• Reduces manual data entry and errors</li>
                    <li>• Maintains consistency across all contracts</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Client Relationship Tracking</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Track your business relationships:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• View all contracts associated with each client</li>
                    <li>• Track contract completion rates</li>
                    <li>• Monitor ongoing business relationships</li>
                    <li>• Identify your most valuable clients</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Analytics & Insights */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-emerald-400" />
                Analytics & Insights
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Contract Performance Metrics</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Track your contract success with detailed analytics:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Monthly contract creation trends</li>
                    <li>• Success rate (sent vs. signed contracts)</li>
                    <li>• Average turnaround time for signatures</li>
                    <li>• Most popular contract types</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Visual Charts & Reports</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Interactive charts help you understand your business:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Monthly trends with bar charts</li>
                    <li>• Status distribution pie charts</li>
                    <li>• Top clients by contract volume</li>
                    <li>• Performance over time</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Business Intelligence</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Make data-driven decisions:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Identify your most successful contract types</li>
                    <li>• Optimize your contract creation process</li>
                    <li>• Track client satisfaction through completion rates</li>
                    <li>• Plan for business growth</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Templates System */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <DocumentDuplicateIcon className="w-6 h-6 text-purple-400" />
                Contract Templates
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Pre-Built Templates</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Access professional contract templates:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Freelance Agreement templates</li>
                    <li>• Service Agreement templates</li>
                    <li>• NDA templates</li>
                    <li>• Property Rental templates</li>
                    <li>• Equipment Lease templates</li>
                    <li>• Car Sale templates</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Template Workflow</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Streamline your contract creation:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Browse template gallery</li>
                    <li>• Preview template content</li>
                    <li>• Load template into contract creator</li>
                    <li>• Customize with your specific details</li>
                    <li>• Generate final contract with AI</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Custom Templates (Coming Soon)</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Future features will include:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Create your own custom templates</li>
                    <li>• Save frequently used contract structures</li>
                    <li>• Share templates with team members</li>
                    <li>• Premium template marketplace</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Notifications & Activity */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BellIcon className="w-6 h-6 text-yellow-400" />
                Notifications & Activity Tracking
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Real-Time Notifications</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Stay informed about contract activity:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• When contracts are sent for signature</li>
                    <li>• When parties sign contracts</li>
                    <li>• When contracts are completed</li>
                    <li>• System updates and announcements</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Activity Timeline</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Track all contract-related activities:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Chronological timeline of all actions</li>
                    <li>• Who performed each action</li>
                    <li>• Timestamps for all activities</li>
                    <li>• Quick access to related contracts</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Action Items & Reminders</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Never miss important deadlines:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Pending signatures that need attention</li>
                    <li>• Expiring contracts</li>
                    <li>• Overdue payments</li>
                    <li>• Upcoming deadlines</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security & Compliance */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-red-400" />
                Security & Compliance
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Data Protection</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Your data is protected with enterprise-grade security:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• End-to-end encryption for all data</li>
                    <li>• Secure cloud storage with redundancy</li>
                    <li>• Regular security audits and updates</li>
                    <li>• GDPR and CCPA compliance</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Audit Trail</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Complete record of all contract activities:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Who accessed each contract</li>
                    <li>• When signatures were created</li>
                    <li>• IP addresses and locations</li>
                    <li>• Complete modification history</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Legal Compliance</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    E-signatures meet legal requirements:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• ESIGN Act compliance</li>
                    <li>• UETA (Uniform Electronic Transactions Act) compliance</li>
                    <li>• Court-admissible evidence standards</li>
                    <li>• International e-signature laws</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Account Management */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Cog6ToothIcon className="w-6 h-6 text-slate-400" />
                Account Management
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Subscription Management</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Manage your account and billing:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• View current plan and usage</li>
                    <li>• Upgrade or downgrade plans</li>
                    <li>• Manage payment methods</li>
                    <li>• View billing history</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">User Preferences</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Customize your experience:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Language preferences</li>
                    <li>• Notification settings</li>
                    <li>• Email preferences</li>
                    <li>• Privacy settings</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Data Export & Backup</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Control your data:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Export all your contracts as PDFs</li>
                    <li>• Download client data</li>
                    <li>• Request complete data backup</li>
                    <li>• Account deletion options</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
