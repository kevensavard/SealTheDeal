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
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  KeyIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function ESignaturesPage() {
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
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">E-Signatures</h1>
                  <p className="text-slate-400">Complete guide to sending, managing, and tracking electronic signatures</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-invert max-w-none">
            
            {/* Overview */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
                E-Signature Overview
              </h2>
              
              <p className="text-slate-300 mb-4">
                SealTheDeal's e-signature system allows you to send contracts for electronic signature with advanced security features, 
                multi-party support, and automatic completion tracking.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <h3 className="text-emerald-400 font-medium mb-2">✅ Legal Compliance</h3>
                  <p className="text-slate-300 text-sm">E-signatures are legally binding and compliant with ESIGN Act and UETA regulations.</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h3 className="text-blue-400 font-medium mb-2">🔒 Secure & Encrypted</h3>
                  <p className="text-slate-300 text-sm">All signatures are encrypted and stored securely with timestamp and location verification.</p>
                </div>
              </div>
            </div>

            {/* Sending for E-Signature */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <UserGroupIcon className="w-6 h-6 text-blue-400" />
                Sending Contracts for E-Signature
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 1: Click "Request E-Signature"</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    From any contract card on your dashboard, click the "Request E-Signature" button.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 2: Add Signers</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    For each party that needs to sign, enter their:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Full name (as it should appear on the signature)</li>
                    <li>• Email address (where the signing link will be sent)</li>
                    <li>• Role in the contract (e.g., "Client", "Service Provider")</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 3: Optional Security Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-slate-200 font-medium text-sm mb-1">Password Protection</h4>
                      <p className="text-slate-400 text-sm">Add a password that signers must enter before they can view and sign the contract.</p>
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-medium text-sm mb-1">Custom Message</h4>
                      <p className="text-slate-400 text-sm">Include a personal message that will be sent with the signing invitation.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 4: Send Invitations</h3>
                  <p className="text-slate-300 text-sm">
                    Click "Send E-Signature Request" to send unique signing links to each party. 
                    Each signer receives their own secure link that matches their role in the contract.
                  </p>
                </div>
              </div>
            </div>

            {/* Multi-Party Signing */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <UserGroupIcon className="w-6 h-6 text-purple-400" />
                Multi-Party Signing Process
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Individual Signing Links</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Each party receives a unique signing link that:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Is tied to their specific role in the contract</li>
                    <li>• Can only be used by the intended recipient</li>
                    <li>• Expires after a set period for security</li>
                    <li>• Requires password verification if enabled</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Signature Placement</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Signatures are automatically placed in the correct location for each party:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Each party's signature appears under their name/role</li>
                    <li>• Signatures include timestamp and location</li>
                    <li>• Final PDF shows all signatures in proper order</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Progress Tracking</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Monitor signing progress with:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• "X/Y signatures" indicator on contract cards</li>
                    <li>• Progress bar showing completion percentage</li>
                    <li>• Real-time notifications when parties sign</li>
                    <li>• Automatic final contract distribution when complete</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Signing Process */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-emerald-400" />
                The Signing Experience
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 1: Access the Signing Link</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Signers click the link in their email to access the contract signing page.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 2: Password Verification (if enabled)</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    If the contract is password-protected, signers must enter the correct password to proceed.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 3: Review the Contract</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Signers can read the full contract before signing. The contract is displayed in a clean, readable format.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 4: Create Digital Signature</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Signers create their signature using:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Mouse or touchpad drawing</li>
                    <li>• Touch screen (mobile devices)</li>
                    <li>• High-resolution capture for clear PDF display</li>
                    <li>• Clear signature button to start over if needed</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Step 5: Automatic Completion</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    Once signed, the system automatically:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• Records the signature with timestamp</li>
                    <li>• Captures IP-based location for verification</li>
                    <li>• Updates the contract status</li>
                    <li>• Sends notifications to all parties</li>
                    <li>• Distributes final signed PDF when all parties sign</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-red-400" />
                Security & Verification
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <KeyIcon className="w-4 h-4 text-blue-400" />
                    Password Protection
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Optional password protection ensures only authorized parties can access and sign contracts.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-emerald-400" />
                    Timestamp Verification
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Each signature includes precise timestamp showing exactly when it was created.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <GlobeAltIcon className="w-4 h-4 text-purple-400" />
                    Location Verification
                  </h3>
                  <p className="text-slate-300 text-sm">
                    IP-based location capture provides additional verification of where the signature was created.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-red-400" />
                    Encrypted Storage
                  </h3>
                  <p className="text-slate-300 text-sm">
                    All signature data is encrypted and stored securely with industry-standard protection.
                  </p>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                Common Issues & Solutions
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Signer Can't See Their Signature</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    <strong>Problem:</strong> Signature appears as a small dot in the PDF
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Solution:</strong> Make sure to draw a clear, visible signature. The system captures high-resolution signatures that should display properly in the final PDF.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Signing Link Not Working</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    <strong>Problem:</strong> Signers can't access the signing page
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Solution:</strong> Check that the email address is correct and the link hasn't expired. You can resend the signing request if needed.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Password Not Working</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    <strong>Problem:</strong> Signers can't enter the correct password
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Solution:</strong> Double-check the password you set. Passwords are case-sensitive and must be entered exactly as configured.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Contract Not Marked as Complete</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    <strong>Problem:</strong> All parties signed but contract still shows as "Sent"
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Solution:</strong> This usually resolves automatically. If it persists, check that all parties have actually completed the signing process and received confirmation.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
