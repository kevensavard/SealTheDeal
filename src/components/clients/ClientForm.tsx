'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  XMarkIcon,
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckIcon
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

interface ClientFormProps {
  client?: Client;
  onSave: (clientData: any) => Promise<void>;
  onCancel: () => void;
  title: string;
}

export default function ClientForm({ client, onSave, onCancel, title }: ClientFormProps) {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState({
    firstName: client?.firstName || '',
    lastName: client?.lastName || '',
    company: client?.company || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
    notes: client?.notes || ''
  });

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setErrors({});
    
    try {
      await onSave(formData);
      setSaveSuccess(true);
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        onCancel();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error saving client:', error);
      setErrors({ general: error.message || 'Failed to save client. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="text-slate-400 text-sm">Enter client information</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-blue-500'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-blue-500'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t.company}
              </label>
              <div className="relative">
                <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter company name (optional)"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-blue-500'
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t.phone}
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter phone number (optional)"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t.address}
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter address (optional)"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t.notes}
              </label>
              <div className="relative">
                <DocumentTextIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter notes about this client (optional)"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-medium">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {saveSuccess && (
            <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-emerald-400" />
                <p className="text-emerald-400 font-medium">
                  {client ? t.clientUpdated : t.clientAdded}
                </p>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                isSaving
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t.loading}</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  <span>{t.save}</span>
                </>
              ) : (
                <span>{t.save}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
