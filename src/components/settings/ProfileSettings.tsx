'use client';

import { useState, useEffect } from 'react';
import { User } from '@clerk/nextjs/server';
import {
  UserIcon,
  EnvelopeIcon,
  CameraIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileSettingsProps {
  user: any;
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses?.[0]?.emailAddress || ''
  });

  const originalData = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses?.[0]?.emailAddress || ''
  };

  // Track changes
  useEffect(() => {
    const hasAnyChanges = Object.keys(formData).some(key => 
      formData[key as keyof typeof formData] !== originalData[key as keyof typeof originalData]
    );
    setHasChanges(hasAnyChanges);
  }, [formData, originalData]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t.firstNameRequired;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t.lastNameRequired;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.emailInvalid;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setErrors({});
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call to update the user profile
      // For now, we'll just simulate success
      console.log('Profile update data:', formData);
      
      setSaveSuccess(true);
      setIsEditing(false);
      setHasChanges(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: t.failedToSave });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{t.profileSettings}</h2>
          <p className="text-slate-300">{t.managePersonalInfo}</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            {t.editProfile}
          </button>
        )}
      </div>

      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="w-12 h-12 text-white" />
            )}
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-700 border-2 border-slate-800 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors">
            <CameraIcon className="w-4 h-4 text-white" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{t.profilePicture}</h3>
          <p className="text-slate-400 text-sm">{t.changeProfilePicture}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {t.firstName} *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-blue-500'
            }`}
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
            {t.lastName} *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-blue-500'
            }`}
          />
          {errors.lastName && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {t.emailAddress} *
        </label>
        <div className="relative">
          <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
            className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-blue-500'
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {errors.email}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-1">{t.emailVerification}</p>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              hasChanges && !isSaving
                ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:shadow-lg transform hover:scale-105'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
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
              <span>{t.saveChanges}</span>
            )}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.emailAddresses?.[0]?.emailAddress || ''
              });
            }}
            className="px-6 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            <p className="text-red-400 font-medium">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-emerald-400" />
            <p className="text-emerald-400 font-medium">{t.profileUpdated}</p>
          </div>
        </div>
      )}
    </div>
  );
}
