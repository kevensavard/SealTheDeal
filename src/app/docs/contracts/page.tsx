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
  PencilIcon,
  TrashIcon,
  ShareIcon,
  DocumentArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function ContractsPage() {
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
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Managing Contracts</h1>
                  <p className="text-slate-400">Complete guide to creating, editing, and managing your contracts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-invert max-w-none">
            
            {/* Contract Creation */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-blue-400" />
                Creating Contracts
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 1: Access the Contract Creator</h3>
                  <p className="text-slate-300 text-sm mb-3">
                    Click "Create Contract" from the dashboard or sidebar to open the contract creation interface.
                  </p>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm">
                      <strong>Tip:</strong> The contract creator has a two-panel layout: form fields on the left, live preview on the right.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 2: Fill in Contract Details</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-slate-200 font-medium text-sm mb-1">Contract Title (Optional)</h4>
                      <p className="text-slate-400 text-sm">Leave blank to let AI generate a meaningful title based on content</p>
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-medium text-sm mb-1">Contract Type</h4>
                      <p className="text-slate-400 text-sm">Select from: Freelance Agreement, Service Agreement, Car Sale, Property Rental, Equipment Lease, NDA</p>
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-medium text-sm mb-1">Parties Involved</h4>
                      <p className="text-slate-400 text-sm">Add names and roles for all parties (e.g., "Client", "Service Provider", "Buyer", "Seller")</p>
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-medium text-sm mb-1">Description (Required)</h4>
                      <p className="text-slate-400 text-sm">Describe the contract purpose, services, or goods involved</p>
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-medium text-sm mb-1">Payment Terms</h4>
                      <p className="text-slate-400 text-sm">Specify payment amounts, schedules, and methods</p>
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-medium text-sm mb-1">Deadlines/Duration</h4>
                      <p className="text-slate-400 text-sm">Set project timelines, delivery dates, or contract duration</p>
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-medium text-sm mb-1">Special Clauses</h4>
                      <p className="text-slate-400 text-sm">Add any specific terms, conditions, or legal requirements</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 3: Generate with AI</h3>
                  <p className="text-slate-300 text-sm mb-3">
                    Click "Generate with AI" to create a professional, legally-sound contract. The AI will:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Create comprehensive contract terms based on your inputs</li>
                    <li>• Include standard legal clauses for the contract type</li>
                    <li>• Generate a professional title if none provided</li>
                    <li>• Format the contract for easy reading and signing</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 4: Auto-Save and Redirect</h3>
                  <p className="text-slate-300 text-sm">
                    Once generated, the contract is automatically saved to your dashboard and you're redirected there. 
                    The contract counts toward your monthly limit immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Contract Management */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <PencilIcon className="w-6 h-6 text-emerald-400" />
                Managing Your Contracts
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <EyeIcon className="w-4 h-4" />
                    Viewing Contracts
                  </h3>
                  <p className="text-slate-300 text-sm mb-2">
                    All your contracts are displayed on the dashboard with key information:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Contract title and creation date</li>
                    <li>• Current status (Draft, Sent, Signed)</li>
                    <li>• Signature progress for multi-party contracts</li>
                    <li>• Associated client information</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <PencilIcon className="w-4 h-4" />
                    Editing Contracts
                  </h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Click the edit button on any contract to modify:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Contract title</li>
                    <li>• Contract content and terms</li>
                    <li>• Party information</li>
                    <li>• Payment terms and deadlines</li>
                  </ul>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-3">
                    <p className="text-yellow-400 text-sm">
                      <strong>Note:</strong> Editing a contract after it's been sent for signature may require sending a new version to all parties.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    Downloading PDFs
                  </h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Download contracts as PDF files for offline use or record keeping:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Click the download button on any contract card</li>
                    <li>• PDFs include all signatures and timestamps</li>
                    <li>• Professional formatting suitable for legal use</li>
                    <li>• Includes signature locations and completion status</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <ShareIcon className="w-4 h-4" />
                    Email Contracts
                  </h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Send contracts directly via email:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Click the email button on any contract</li>
                    <li>• Enter recipient email addresses</li>
                    <li>• Add a custom message (optional)</li>
                    <li>• Contract is sent as a PDF attachment</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <TrashIcon className="w-4 h-4" />
                    Deleting Contracts
                  </h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Remove contracts you no longer need:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Click the delete button on any contract</li>
                    <li>• Confirm deletion in the popup</li>
                    <li>• Contract is permanently removed</li>
                    <li>• Deletion does NOT reduce your monthly contract count</li>
                  </ul>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-3">
                    <p className="text-red-400 text-sm">
                      <strong>Warning:</strong> Deleted contracts cannot be recovered. Make sure you have downloaded any important contracts before deleting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Status */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Contract Status Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <h3 className="text-white font-medium">Draft</h3>
                  </div>
                  <p className="text-slate-400 text-sm">Contract is created but not yet sent for signature. You can edit freely.</p>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <h3 className="text-white font-medium">Sent</h3>
                  </div>
                  <p className="text-slate-400 text-sm">Contract has been sent for e-signature. Awaiting signatures from parties.</p>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    <h3 className="text-white font-medium">Signed</h3>
                  </div>
                  <p className="text-slate-400 text-sm">All parties have signed the contract. Final PDF is automatically sent to all parties.</p>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <LightBulbIcon className="w-6 h-6 text-yellow-400" />
                Best Practices
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Be Specific in Descriptions</h3>
                    <p className="text-slate-300 text-sm">The more detail you provide in the contract description, the better the AI can generate comprehensive terms.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Review Before Sending</h3>
                    <p className="text-slate-300 text-sm">Always review the AI-generated contract before sending it for signature to ensure accuracy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Use Clear Party Names</h3>
                    <p className="text-slate-300 text-sm">Use full names and clear roles (e.g., "John Smith (Client)", "ABC Company (Service Provider)").</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Set Realistic Deadlines</h3>
                    <p className="text-slate-300 text-sm">Include specific dates and timelines to avoid confusion and ensure timely completion.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
