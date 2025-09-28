'use client';

import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning';
}

export default function SuccessModal({ isOpen, onClose, title, message, type = 'success' }: SuccessModalProps) {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-emerald-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-emerald-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`w-12 h-12 ${getIconColor()}`} />;
      case 'error':
        return <XMarkIcon className={`w-12 h-12 ${getIconColor()}`} />;
      case 'warning':
        return <CheckCircleIcon className={`w-12 h-12 ${getIconColor()}`} />;
      default:
        return <CheckCircleIcon className={`w-12 h-12 ${getIconColor()}`} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            {getIcon()}
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              {title}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {message}
            </p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
