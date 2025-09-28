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
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function GettingStartedPage() {
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Getting Started with SealTheDeal</h1>
                  <p className="text-slate-400">Your complete guide to creating and managing contracts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-invert max-w-none">
            
            {/* Welcome Section */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-blue-400" />
                Welcome to SealTheDeal
              </h2>
              <p className="text-slate-300 mb-4">
                SealTheDeal is a powerful contract management platform that helps you create, manage, and execute professional contracts with AI-powered generation and e-signature capabilities.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <LightBulbIcon className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="text-blue-400 font-medium mb-1">Quick Start</h3>
                    <p className="text-slate-300 text-sm">
                      You can create your first contract in under 2 minutes. Just click "Create Contract" in the sidebar and follow the guided process.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Setup */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Cog6ToothIcon className="w-6 h-6 text-emerald-400" />
                Account Setup
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Complete Your Profile</h3>
                    <p className="text-slate-300 text-sm mb-2">
                      Go to Settings → Profile Settings to add your full name, company information, and profile picture.
                    </p>
                    <Link href="/settings?tab=profile" className="text-blue-400 hover:text-blue-300 text-sm">
                      Go to Profile Settings →
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Choose Your Plan</h3>
                    <p className="text-slate-300 text-sm mb-2">
                      Start with the Free plan (1 contract/month) or upgrade to Pro for unlimited contracts and advanced features.
                    </p>
                    <Link href="/settings?tab=subscription" className="text-blue-400 hover:text-blue-300 text-sm">
                      View Plans →
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Add Your First Client</h3>
                    <p className="text-slate-300 text-sm mb-2">
                      Go to Clients to add contact information for people you'll be creating contracts with.
                    </p>
                    <Link href="/clients" className="text-blue-400 hover:text-blue-300 text-sm">
                      Manage Clients →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Creating Your First Contract */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-purple-400" />
                Creating Your First Contract
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Click "Create Contract"</h3>
                    <p className="text-slate-300 text-sm mb-2">
                      From the dashboard or sidebar, click the "Create Contract" button to start the process.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Fill in Contract Details</h3>
                    <p className="text-slate-300 text-sm mb-2">
                      Enter the contract title, type, parties involved, and any specific terms or requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Generate with AI</h3>
                    <p className="text-slate-300 text-sm mb-2">
                      Click "Generate with AI" to create a professional, legally-sound contract based on your inputs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Review and Send</h3>
                    <p className="text-slate-300 text-sm mb-2">
                      Review the generated contract, make any necessary edits, then send it for e-signature.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Pro Tip</span>
                </div>
                <p className="text-slate-300 text-sm">
                  The AI will automatically generate a meaningful title if you leave the title field empty. 
                  It will also create comprehensive contract terms based on the contract type you select.
                </p>
              </div>
            </div>

            {/* Contract Types */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Available Contract Types</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Freelance Agreement</h3>
                  <p className="text-slate-400 text-sm">Perfect for freelancers and independent contractors</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Service Agreement</h3>
                  <p className="text-slate-400 text-sm">General service contracts for businesses</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Car Sale</h3>
                  <p className="text-slate-400 text-sm">Vehicle purchase agreements between individuals</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Property Rental</h3>
                  <p className="text-slate-400 text-sm">Rental agreements for properties and equipment</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Equipment Lease</h3>
                  <p className="text-slate-400 text-sm">Equipment rental and leasing agreements</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">NDA (Non-Disclosure)</h3>
                  <p className="text-slate-400 text-sm">Confidentiality and non-disclosure agreements</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">What's Next?</h2>
              
              <div className="space-y-3">
                <Link href="/docs/first-contract" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <DocumentTextIcon className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="text-white font-medium">Creating Your First Contract</h3>
                    <p className="text-slate-400 text-sm">Step-by-step guide to creating your first contract</p>
                  </div>
                </Link>
                
                <Link href="/docs/contract-types" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <DocumentTextIcon className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-white font-medium">Contract Types Guide</h3>
                    <p className="text-slate-400 text-sm">Detailed information about each contract type</p>
                  </div>
                </Link>
                
                <Link href="/docs/ai-generation" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <DocumentTextIcon className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="text-white font-medium">AI Contract Generation</h3>
                    <p className="text-slate-400 text-sm">How to get the best results from AI generation</p>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
