'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { ContractStatus } from '@prisma/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Contract {
  id: string;
  title: string;
  content: string;
  status: ContractStatus;
  expiresAt?: Date | null;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    company?: string;
  } | null;
}

interface ContractEditModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractId: string, updates: Partial<Contract>) => Promise<void>;
}

export default function ContractEditModal({ contract, isOpen, onClose, onSave }: ContractEditModalProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'DRAFT' as ContractStatus,
    expiresAt: '',
  });

  useEffect(() => {
    if (contract) {
      setFormData({
        title: contract.title,
        content: contract.content,
        status: contract.status,
        expiresAt: contract.expiresAt ? new Date(contract.expiresAt).toISOString().split('T')[0] : '',
      });
    }
  }, [contract]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    setIsLoading(true);
    try {
      const updates = {
        title: formData.title,
        content: formData.content,
        status: formData.status,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
      };

      await onSave(contract.id, updates);
      onClose();
    } catch (error) {
      console.error('Error updating contract:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen || !contract) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4 z-50">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden mobile-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.edit} Contract</h2>
              <p className="text-slate-400 text-sm">Contract ID: {contract.id}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4 md:space-y-6 mobile-form-stack">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
                Contract Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter contract title"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">
                {t.status}
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ContractStatus }))}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="DRAFT">{t.draft}</option>
                <option value="SENT">{t.sent}</option>
                <option value="SIGNED">{t.signed}</option>
                <option value="EXPIRED">{t.expired}</option>
                <option value="CANCELLED">{t.cancelled}</option>
              </select>
            </div>

            {/* Expiration Date */}
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Expiration Date (Optional)
                </div>
              </label>
              <input
                type="date"
                id="expiresAt"
                value={formData.expiresAt}
                onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">
                Contract Content
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Enter contract content..."
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-700 mobile-button-group horizontal">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? 'Saving...' : t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
