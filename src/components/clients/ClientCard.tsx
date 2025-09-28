'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    contracts: number;
  };
}

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onUseForContract: (client: Client) => void;
}

export default function ClientCard({ client, onEdit, onDelete, onUseForContract }: ClientCardProps) {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {client.firstName} {client.lastName}
            </h3>
            {client.company && (
              <p className="text-slate-400 text-sm flex items-center gap-1">
                <BuildingOfficeIcon className="w-4 h-4" />
                {client.company}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(client)}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            title={t.editClient}
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(client.id)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete Client"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <EnvelopeIcon className="w-4 h-4 text-slate-400" />
          <span className="truncate">{client.email}</span>
        </div>
        
        {client.phone && (
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <PhoneIcon className="w-4 h-4 text-slate-400" />
            <span>{client.phone}</span>
          </div>
        )}
        
        {client.address && (
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <MapPinIcon className="w-4 h-4 text-slate-400" />
            <span className="truncate">{client.address}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <DocumentTextIcon className="w-4 h-4" />
          <span>{client._count.contracts} {t.contractsWithClient}</span>
        </div>
        <div className="text-slate-400 text-xs">
          {t.lastContact}: {formatDate(client.updatedAt)}
        </div>
      </div>

      {/* Notes Preview */}
      {client.notes && (
        <div className="mb-4">
          <p className="text-slate-300 text-sm line-clamp-2">
            {client.notes}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors text-sm"
        >
          <EyeIcon className="w-4 h-4" />
          <span>{showDetails ? 'Hide' : 'Details'}</span>
        </button>
        
        <button
          onClick={() => onUseForContract(client)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm"
        >
          <SparklesIcon className="w-4 h-4" />
          <span>{t.useForContract}</span>
        </button>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">{t.clientInfo}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Created:</span>
                <span className="text-slate-300">{formatDate(client.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Updated:</span>
                <span className="text-slate-300">{formatDate(client.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.totalContracts}:</span>
                <span className="text-slate-300">{client._count.contracts}</span>
              </div>
            </div>
          </div>
          
          {client.notes && (
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">{t.notes}</h4>
              <p className="text-slate-400 text-sm bg-slate-700/50 rounded-lg p-3">
                {client.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
