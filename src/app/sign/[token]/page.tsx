'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  DocumentTextIcon, 
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import SignaturePad from '@/components/SignaturePad';

interface Contract {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  client?: {
    firstName: string;
    lastName: string;
    company?: string;
  };
  user?: {
    firstName: string;
    lastName: string;
    emailAddresses: Array<{
      emailAddress: string;
    }>;
  };
}

export default function SigningPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [accessPassword, setAccessPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch(`/api/contracts/sign/${token}`);
        const data = await response.json();

        if (!response.ok) {
          if (data.error === 'Password required') {
            setPasswordRequired(true);
            setError(null);
          } else {
            setError(data.error || 'Failed to load contract');
          }
          setLoading(false);
          return;
        }

        setContract(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contract:', error);
        setError('Failed to load contract');
        setLoading(false);
      }
    };

    if (token) {
      fetchContract();
    }
  }, [token]);

  const handlePasswordSubmit = async () => {
    if (!accessPassword.trim()) {
      setPasswordError('Please enter the password');
      return;
    }

    setPasswordError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/contracts/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: accessPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setPasswordError(errorData.error || 'Invalid password');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setContract(data);
      setPasswordRequired(false);
      setLoading(false);
    } catch (error) {
      console.error('Error verifying password:', error);
      setPasswordError('Failed to verify password');
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!signerName || !signerEmail) {
      alert('Please fill in your name and email');
      return;
    }

    setSigning(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/contracts/sign/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signerName,
          signerEmail,
          signatureData,
          signatureTime: new Date().toLocaleTimeString(),
          signatureLocation: 'Digital Signature',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to sign contract');
        setSigning(false);
        return;
      }

      setSigned(true);
      setSigning(false);
    } catch (error) {
      console.error('Error signing contract:', error);
      setError('Failed to sign contract');
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading contract...</p>
        </div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Password Required</h1>
            <p className="text-slate-400">This contract is password protected. Please enter the password to access and sign.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Access Password
              </label>
              <input
                type="password"
                value={accessPassword}
                onChange={(e) => setAccessPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the signing password"
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
              {passwordError && (
                <p className="text-red-400 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <button
              onClick={handlePasswordSubmit}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Access Contract'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!contract || error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Contract Not Found</h1>
          <p className="text-slate-300">{error || 'The signing link is invalid or has expired.'}</p>
        </div>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <CheckCircleIcon className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Contract Signed!</h1>
          <p className="text-slate-300 mb-4">
            Thank you, {signerName}. The contract has been successfully signed and all parties have been notified.
          </p>
          <div className="bg-slate-800 rounded-lg p-4 text-left">
            <h3 className="text-lg font-semibold text-white mb-2">Contract Details</h3>
            <p className="text-slate-300 text-sm mb-1"><strong>Title:</strong> {contract.title}</p>
            <p className="text-slate-300 text-sm mb-1"><strong>Signed by:</strong> {signerName}</p>
            <p className="text-slate-300 text-sm mb-1"><strong>Email:</strong> {signerEmail}</p>
            <p className="text-slate-300 text-sm"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <DocumentTextIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Contract Signing</h1>
          <p className="text-slate-300">Please review the contract below and sign if you agree to the terms.</p>
        </div>

        {/* Contract Content */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{contract.title}</h2>
            {contract.client && (
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <UserIcon className="w-5 h-5" />
                <span>{contract.client.firstName} {contract.client.lastName}</span>
                {contract.client.company && <span>({contract.client.company})</span>}
              </div>
            )}
            <p className="text-slate-400 text-sm">
              Created: {new Date(contract.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="text-slate-300 whitespace-pre-wrap">
              {contract.content}
            </div>
          </div>
        </div>

        {/* Signing Form */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <PencilIcon className="w-6 h-6 text-blue-400" />
            Sign Contract
          </h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
                required
              />
            </div>

          </div>

          {/* Signature Pad */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Digital Signature *
            </label>
            <SignaturePad 
              onSignatureChange={setSignatureData}
              className="w-full"
            />
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-400 text-sm">
              <strong>Important:</strong> By signing this contract, you agree to be legally bound by its terms and conditions. 
              Please ensure you have read and understood all provisions before proceeding.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSign}
            disabled={signing || !signerName || !signerEmail || !signatureData}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {signing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Signing Contract...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-6 h-6" />
                Sign Contract
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
