'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface EsignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (signers: Signer[], message: string, password?: string) => void;
  contractTitle: string;
  contractParties?: Array<{
    name: string;
    role: string;
    email: string;
  }>;
  existingClient?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function EsignModal({ isOpen, onClose, onSend, contractTitle, contractParties, existingClient }: EsignModalProps) {
  const [signers, setSigners] = useState<Signer[]>([]);
  const [message, setMessage] = useState(`Please review and sign the contract: ${contractTitle}`);
  const [passwordProtection, setPasswordProtection] = useState(false);
  const [signingPassword, setSigningPassword] = useState('');

  // Load parties from contract data
  useEffect(() => {
    if (isOpen && contractParties && contractParties.length > 0) {
      const loadedSigners = contractParties.map((party, index) => ({
        id: `party-${index}`,
        name: party.name,
        email: party.email || '',
        role: party.role
      }));
      setSigners(loadedSigners);
    } else if (isOpen) {
      // Fallback to default parties if none stored
      setSigners([
        {
          id: 'contractor-1',
          name: 'Contractor',
          email: '',
          role: 'contractor'
        },
        {
          id: 'client-1',
          name: existingClient ? `${existingClient.firstName} ${existingClient.lastName}` : 'Client',
          email: existingClient?.email || '',
          role: 'client'
        }
      ]);
    }
  }, [isOpen, contractParties, existingClient]);


  const addSigner = () => {
    const newSigner: Signer = {
      id: Date.now().toString(),
      name: '',
      email: '',
      role: 'client'
    };
    setSigners([...signers, newSigner]);
  };

  const removeSigner = (id: string) => {
    if (signers.length > 1) {
      setSigners(signers.filter(signer => signer.id !== id));
    }
  };

  const updateSigner = (id: string, field: keyof Signer, value: string) => {
    setSigners(signers.map(signer => 
      signer.id === id ? { ...signer, [field]: value } : signer
    ));
  };

  const handleSend = () => {
    // Validate all signers
    const validSigners = signers.filter(signer => 
      signer.name.trim() && signer.email.trim()
    );

    if (validSigners.length === 0) {
      alert('Please add at least one signer with name and email');
      return;
    }

    if (passwordProtection && !signingPassword.trim()) {
      alert('Please enter a password for protection');
      return;
    }

    onSend(validSigners, message, passwordProtection ? signingPassword : undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Request E-signatures</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Contract Info */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Contract</h4>
            <p className="text-white">{contractTitle}</p>
          </div>

          {/* Signers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-slate-300">Signers</h4>
              <button
                onClick={addSigner}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Add Signer
              </button>
            </div>

            <div className="space-y-4">
              {signers.map((signer, index) => (
                <div key={signer.id} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-white">Signer {index + 1}</h5>
                    {signers.length > 1 && (
                      <button
                        onClick={() => removeSigner(signer.id)}
                        className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={signer.name}
                        onChange={(e) => updateSigner(signer.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Full name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={signer.email}
                        onChange={(e) => updateSigner(signer.id, 'email', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Role
                      </label>
                      <select
                        value={signer.role}
                        onChange={(e) => updateSigner(signer.id, 'role', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="client">Client</option>
                        <option value="contractor">Contractor</option>
                        <option value="witness">Witness</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Message to Signers
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a custom message for the signers..."
            />
          </div>

          {/* Password Protection */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                id="passwordProtection"
                checked={passwordProtection}
                onChange={(e) => setPasswordProtection(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="passwordProtection" className="text-sm font-medium text-slate-300">
                Password Protect Signing Links
              </label>
            </div>
            
            {passwordProtection && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Signing Password
                </label>
                <input
                  type="password"
                  value={signingPassword}
                  onChange={(e) => setSigningPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter password for signing access"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Signers will need this password to access and sign the contract
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium"
            >
              Send E-signature Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
