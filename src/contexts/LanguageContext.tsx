'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '@/lib/languages/en';
import { fr } from '@/lib/languages/fr';
import { es } from '@/lib/languages/es';

// Import other languages as needed
// import { de } from '@/lib/languages/de';
// import { it } from '@/lib/languages/it';
// import { pt } from '@/lib/languages/pt';
// import { zh } from '@/lib/languages/zh';
// import { ja } from '@/lib/languages/ja';
// import { ko } from '@/lib/languages/ko';
// import { ru } from '@/lib/languages/ru';
// import { ar } from '@/lib/languages/ar';
// import { hi } from '@/lib/languages/hi';

type Language = 'en' | 'fr' | 'es' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko' | 'ru' | 'ar' | 'hi';

const languages = {
  en,
  fr,
  es,
  // Add other languages as they are implemented
  // de,
  // it,
  // pt,
  // zh,
  // ja,
  // ko,
  // ru,
  // ar,
  // hi,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('sealthedeal-language') as Language;
    if (savedLanguage && languages[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sealthedeal-language', lang);
    // Apply language to document
    document.documentElement.lang = lang;
  };

  // Apply language to document when it changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = languages[language] || en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
