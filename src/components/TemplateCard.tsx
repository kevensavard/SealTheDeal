'use client';

import { useState } from 'react';
import { Template } from '@/types/template';
import {
  DocumentTextIcon,
  EyeIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface TemplateCardProps {
  template: Template;
  onUseTemplate: (template: Template) => void;
}

export default function TemplateCard({ template, onUseTemplate }: TemplateCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleUseTemplate = () => {
    onUseTemplate(template);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <>
      <div
        className={`bg-slate-800 rounded-xl border border-slate-700 p-6 transition-all duration-300 cursor-pointer group ${
          isHovered ? 'shadow-2xl border-blue-500/50 transform -translate-y-1' : 'hover:shadow-lg'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center text-2xl">
              {template.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{template.name}</h3>
              {template.isPremium && (
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400 font-medium">Premium</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          {template.description}
        </p>

        {/* Category Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleUseTemplate}
            className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Use Template</span>
          </button>
          <button
            onClick={handlePreview}
            className="px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center justify-center"
            title="Preview Template"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Hover Effects */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 rounded-xl pointer-events-none" />
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center text-xl">
                  {template.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{template.name}</h2>
                  <p className="text-slate-400 text-sm">Template Preview</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                  <p className="text-slate-300">{template.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Preview</h3>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <p className="text-slate-300 text-sm leading-relaxed">{template.preview}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Template Fields</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Contract Type: {template.fields.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Parties: {template.fields.parties.length} parties</span>
                    </div>
                    {template.fields.paymentTerms && (
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Payment Terms: {template.fields.paymentTerms}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span>Special Clauses: {template.fields.specialClauses.length} clauses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-700">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  handleUseTemplate();
                }}
                className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Use This Template</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
