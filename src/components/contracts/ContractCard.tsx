'use client';

import { useState } from 'react';
import { 
  DocumentTextIcon, 
  PencilIcon, 
  TrashIcon, 
  ShareIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import EsignModal from './EsignModal';
import { ContractStatus } from '@prisma/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Contract {
  id: string;
  title: string;
  content: string;
  status: ContractStatus;
  expiresAt?: Date | null;
  sentAt?: Date | null;
  signedAt?: Date | null;
  createdAt: Date;
  parties?: Array<{
    name: string;
    role: string;
    email: string;
  }>;
  signers?: Array<{
    id: string;
    signerName: string;
    signerEmail: string;
    role: string;
    signedAt?: string;
  }>;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    company?: string;
  } | null;
}

interface ContractCardProps {
  contract: Contract;
  onEdit: (contract: Contract) => void;
  onDelete: (contractId: string) => void;
  onStatusChange: (contractId: string, status: ContractStatus) => void;
}

export default function ContractCard({ contract, onEdit, onDelete, onStatusChange }: ContractCardProps) {
  const { t } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(contract.title);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEsignModal, setShowEsignModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate signature progress
  const getSignatureProgress = () => {
    if (!contract.signers || contract.signers.length === 0) {
      return null;
    }

    const totalSigners = contract.signers.length;
    const signedCount = contract.signers.filter(signer => signer.signedAt).length;
    
    return {
      signed: signedCount,
      total: totalSigners,
      percentage: Math.round((signedCount / totalSigners) * 100)
    };
  };

  const signatureProgress = getSignatureProgress();

  const getStatusIcon = (status: ContractStatus) => {
    switch (status) {
      case 'DRAFT':
        return <PencilIcon className="w-5 h-5" />;
      case 'SENT':
        return <ShareIcon className="w-5 h-5" />;
      case 'SIGNED':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'EXPIRED':
        return <XCircleIcon className="w-5 h-5" />;
      case 'CANCELLED':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-slate-500/20 text-slate-400';
      case 'SENT':
        return 'bg-blue-500/20 text-blue-400';
      case 'SIGNED':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'EXPIRED':
        return 'bg-red-500/20 text-red-400';
      case 'CANCELLED':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const isExpiringSoon = (expiresAt: Date | null | undefined) => {
    if (!expiresAt) return false;
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return new Date(expiresAt) <= threeDaysFromNow && new Date(expiresAt) > new Date();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      setIsDeleting(true);
      try {
        await onDelete(contract.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSaveTitle = async () => {
    if (newTitle.trim() === contract.title) {
      setIsEditingTitle(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/contracts/${contract.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() })
      });

      if (response.ok) {
        setIsEditingTitle(false);
        // Update the contract title in the parent component
        contract.title = newTitle.trim();
      } else {
        alert('Failed to update title');
      }
    } catch (error) {
      console.error('Error updating title:', error);
      alert('Failed to update title');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/contracts/${contract.id}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${contract.title.replace(/[^a-z0-9]/gi, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail.trim()) {
      alert('Please enter recipient email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/contracts/${contract.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: recipientEmail.trim(),
          message: emailMessage.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowEmailModal(false);
        setRecipientEmail('');
        setEmailMessage('');
        alert('Contract sent successfully!');
      } else {
        alert(data.error || 'Failed to send contract');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send contract');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEsign = async (signers: any[], message: string, password?: string) => {
    setLoading(true);
    try {
      // Send individual e-signature requests to each signer
      const responses = await Promise.all(
        signers.map(async (signer) => {
          const response = await fetch(`/api/contracts/${contract.id}/esign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipientEmail: signer.email,
              recipientName: signer.name,
              recipientRole: signer.role,
              message: message,
              password: password
            })
          });
          return { signer, response: await response.json() };
        })
      );

      const successful = responses.filter(r => r.response.success);
      const failed = responses.filter(r => !r.response.success);

      if (successful.length > 0) {
        setShowEsignModal(false);
        alert(`E-signature requests sent to ${successful.length} signer(s)!`);
      }
      
      if (failed.length > 0) {
        alert(`Failed to send to ${failed.length} signer(s): ${failed.map(f => f.signer.name).join(', ')}`);
      }
    } catch (error) {
      console.error('Error sending e-signature:', error);
      alert('Failed to send e-signature request');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions: { value: ContractStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'DRAFT', label: t.draft, icon: <PencilIcon className="w-4 h-4" /> },
    { value: 'SENT', label: t.sent, icon: <ShareIcon className="w-4 h-4" /> },
    { value: 'SIGNED', label: t.signed, icon: <CheckCircleIcon className="w-4 h-4" /> },
    { value: 'EXPIRED', label: t.expired, icon: <XCircleIcon className="w-4 h-4" /> },
    { value: 'CANCELLED', label: t.cancelled, icon: <ExclamationTriangleIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') {
                    setNewTitle(contract.title);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                disabled={loading}
                className="p-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                title="Save"
              >
                <CheckCircleIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setNewTitle(contract.title);
                  setIsEditingTitle(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-300"
                title="Cancel"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white flex-1">{contract.title}</h3>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1 text-slate-400 hover:text-blue-400"
                title="Edit title"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {contract.client && (
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <UserGroupIcon className="w-4 h-4" />
              <span>{contract.client.firstName} {contract.client.lastName}</span>
              {contract.client.company && <span>({contract.client.company})</span>}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(contract.createdAt)}</span>
            </div>
            {contract.sentAt && (
              <div className="flex items-center gap-1">
                <ShareIcon className="w-4 h-4" />
                <span>{formatDate(contract.sentAt)}</span>
              </div>
            )}
            {contract.signedAt && (
              <div className="flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4" />
                <span>{formatDate(contract.signedAt)}</span>
              </div>
            )}
          </div>
          
          {/* Signature Information for Signed Contracts */}
          {contract.status === 'SIGNED' && contract.signers && contract.signers.length > 0 && (
            <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircleIcon className="w-4 h-4" />
                <span className="font-medium">
                  Signed by {contract.signers.map(signer => signer.signerName).join(', ')}
                </span>
              </div>
              {contract.signers[0]?.signerEmail && (
                <p className="text-slate-400 text-xs mt-1">{contract.signers[0].signerEmail}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Signature Progress */}
          {signatureProgress && (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-700 rounded-full text-sm">
              <div className="flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  {signatureProgress.signed}/{signatureProgress.total} signatures
                </span>
              </div>
              <div className="w-16 bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${signatureProgress.percentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)} hover:opacity-80 transition-opacity`}
            >
              {getStatusIcon(contract.status)}
              {t[contract.status.toLowerCase() as keyof typeof t]}
            </button>

            {showStatusMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-700 rounded-lg border border-slate-600 shadow-lg z-10">
                <div className="py-1">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onStatusChange(contract.id, option.value);
                        setShowStatusMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-slate-600 transition-colors ${
                        contract.status === option.value ? 'text-blue-400' : 'text-slate-300'
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expiration Warning */}
      {contract.expiresAt && isExpiringSoon(contract.expiresAt) && (
        <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t.contractExpiringSoon} - {formatDate(contract.expiresAt)}
            </span>
          </div>
        </div>
      )}

      {/* Contract Preview */}
      <div className="mb-4">
        <p className="text-slate-300 text-sm line-clamp-3">
          {contract.content.substring(0, 200)}...
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(contract)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Edit Contract"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
            title={contract.status === 'SIGNED' ? 'Download Signed PDF' : 'Download PDF'}
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
          </button>
          {contract.status !== 'SIGNED' && (
            <>
              <button
                onClick={() => setShowEmailModal(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                title="Send via Email"
              >
                <EnvelopeIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowEsignModal(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-slate-700 transition-colors"
                title="Request E-signature"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Delete Contract"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-500">
          ID: {contract.id.slice(0, 8)}...
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Send Contract via Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter recipient email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a personal message..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E-signature Modal */}
      <EsignModal
        isOpen={showEsignModal}
        onClose={() => setShowEsignModal(false)}
        onSend={handleSendEsign}
        contractTitle={contract.title}
        contractParties={contract.parties as any}
        existingClient={contract.client ? {
          firstName: contract.client.firstName,
          lastName: contract.client.lastName,
          email: '' // Client doesn't have email in our schema
        } : undefined}
      />
    </div>
  );
}
