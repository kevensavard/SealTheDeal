'use client';

import { useState, useEffect } from 'react';
import {
  BellIcon,
  LanguageIcon,
  SunIcon,
  MoonIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PreferencesSettings() {
  const { language, setLanguage, t } = useLanguage();
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: true,
    language: language,
    marketingEmails: false,
    contractReminders: true,
    securityAlerts: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('sealthedeal-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Track changes
  useEffect(() => {
    const savedPreferences = localStorage.getItem('sealthedeal-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        const hasAnyChanges = Object.keys(preferences).some(key => 
          preferences[key as keyof typeof preferences] !== parsed[key]
        );
        setHasChanges(hasAnyChanges);
      } catch (error) {
        setHasChanges(true);
      }
    } else {
      setHasChanges(true);
    }
  }, [preferences]);

  const handleToggle = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
    setPreferences(prev => ({
      ...prev,
      language: newLanguage
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('sealthedeal-preferences', JSON.stringify(preferences));
      
      // Language is already applied by the context
      
      // Apply dark mode to document
      if (preferences.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      setSaveSuccess(true);
      setHasChanges(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{t.preferences}</h2>
        <p className="text-slate-300">{t.customizeExperience}</p>
      </div>

      {/* Notifications Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BellIcon className="w-5 h-5" />
          {t.notifications}
        </h3>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">{t.emailNotifications}</h4>
              <p className="text-slate-400 text-sm">{t.emailNotificationsDesc}</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.emailNotifications ? 'bg-blue-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Contract Reminders */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">{t.contractReminders}</h4>
              <p className="text-slate-400 text-sm">{t.contractRemindersDesc}</p>
            </div>
            <button
              onClick={() => handleToggle('contractReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.contractReminders ? 'bg-blue-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.contractReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Security Alerts */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">{t.securityAlerts}</h4>
              <p className="text-slate-400 text-sm">{t.securityAlertsDesc}</p>
            </div>
            <button
              onClick={() => handleToggle('securityAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.securityAlerts ? 'bg-blue-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.securityAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">{t.marketingEmails}</h4>
              <p className="text-slate-400 text-sm">{t.marketingEmailsDesc}</p>
            </div>
            <button
              onClick={() => handleToggle('marketingEmails')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.marketingEmails ? 'bg-blue-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {preferences.darkMode ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          {t.appearance}
        </h3>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">{t.darkMode}</h4>
              <p className="text-slate-400 text-sm">{t.darkModeDesc}</p>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.darkMode ? 'bg-blue-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Language Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <LanguageIcon className="w-5 h-5" />
          {t.languageRegion}
        </h3>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              {t.language}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    preferences.language === lang.code
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {preferences.language === lang.code && (
                    <CheckIcon className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
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
              <span>{t.savePreferences}</span>
            )}
        </button>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-emerald-400" />
            <p className="text-emerald-400 font-medium">{t.preferencesUpdated}</p>
          </div>
        </div>
      )}
    </div>
  );
}
