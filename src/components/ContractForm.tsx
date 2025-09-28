'use client';

import { useState } from 'react';
import { 
  DocumentTextIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ContractData {
  title: string;
  type: string;
  parties: string[];
  description: string;
  paymentTerms: string;
  deadline: string;
  specialClauses: string[];
  generatedContent: string;
  // Car Sale specific fields
  carMake?: string;
  carModel?: string;
  carYear?: string;
  carMileage?: string;
  carMileageUnit?: string;
  carVin?: string;
  carCondition?: string;
  // Property Rental specific fields
  propertyAddress?: string;
  propertyType?: string;
  rentAmount?: string;
  rentPeriod?: string;
  securityDeposit?: string;
  // Equipment Lease specific fields
  equipmentDescription?: string;
  equipmentSerialNumber?: string;
  leaseTerm?: string;
  leaseAmount?: string;
}

interface ContractFormProps {
  data: ContractData;
  onChange: (field: keyof ContractData, value: any) => void;
}

const contractTypes = [
  'Freelance',
  'NDA',
  'Service Agreement',
  'Consulting',
  'Employment',
  'Partnership',
  'Car Sale',
  'Property Rental',
  'Equipment Lease',
  'Other'
];

const commonClauses = [
  'Confidentiality Agreement',
  'Non-compete Clause',
  'Intellectual Property Rights',
  'Termination Clause',
  'Dispute Resolution',
  'Force Majeure',
  'Governing Law',
  'Severability Clause'
];

export default function ContractForm({ data, onChange }: ContractFormProps) {
  const [newClause, setNewClause] = useState('');

  const handleClauseToggle = (clause: string) => {
    const updatedClauses = data.specialClauses.includes(clause)
      ? data.specialClauses.filter(c => c !== clause)
      : [...data.specialClauses, clause];
    onChange('specialClauses', updatedClauses);
  };

  const addCustomClause = () => {
    if (newClause.trim() && !data.specialClauses.includes(newClause.trim())) {
      onChange('specialClauses', [...data.specialClauses, newClause.trim()]);
      setNewClause('');
    }
  };

  const removeClause = (clause: string) => {
    onChange('specialClauses', data.specialClauses.filter(c => c !== clause));
  };

  return (
    <div className="space-y-4 md:space-y-6 mobile-form-stack">
      {/* Contract Title */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Contract Title (Optional)
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Leave empty to let AI generate a professional title"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <p className="text-xs text-slate-400 mt-1">AI will create a professional title based on your contract details</p>
      </div>

      {/* Contract Type */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Contract Type *
        </label>
        <select
          value={data.type}
          onChange={(e) => onChange('type', e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          {contractTypes.map(type => (
            <option key={type} value={type} className="bg-slate-700">
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Parties Involved */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Parties Involved *
        </label>
        <div className="space-y-3">
          {data.parties.map((party, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={party}
                onChange={(e) => {
                  const newParties = [...data.parties];
                  newParties[index] = e.target.value;
                  onChange('parties', newParties);
                }}
                placeholder={`Party ${index + 1} (e.g., John Doe - Client)`}
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {data.parties.length > 2 && (
                <button
                  type="button"
                  onClick={() => {
                    const newParties = data.parties.filter((_, i) => i !== index);
                    onChange('parties', newParties);
                  }}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  title="Remove party"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange('parties', [...data.parties, ''])}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add another party
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1">Include role/relationship (e.g., "John Doe - Client", "Jane Smith - Freelancer")</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Contract Description *
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Describe the scope of work, deliverables, and key terms..."
          rows={4}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">Required: Provide details about what this contract covers</p>
      </div>

      {/* Payment Terms */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Payment Terms
        </label>
        <input
          type="text"
          value={data.paymentTerms}
          onChange={(e) => onChange('paymentTerms', e.target.value)}
          placeholder="e.g., $5,000 upon completion, Net 30"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Deadline / Duration
        </label>
        <input
          type="date"
          value={data.deadline}
          onChange={(e) => onChange('deadline', e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Car Sale Specific Fields */}
      {data.type === 'Car Sale' && (
        <div className="space-y-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Vehicle Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Make *
              </label>
              <input
                type="text"
                value={data.carMake || ''}
                onChange={(e) => onChange('carMake', e.target.value)}
                placeholder="e.g., Toyota, Ford, BMW"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Model *
              </label>
              <input
                type="text"
                value={data.carModel || ''}
                onChange={(e) => onChange('carModel', e.target.value)}
                placeholder="e.g., Camry, F-150, X5"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Year *
              </label>
              <input
                type="number"
                value={data.carYear || ''}
                onChange={(e) => onChange('carYear', e.target.value)}
                placeholder="e.g., 2020"
                min="1900"
                max="2025"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mileage *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={data.carMileage || ''}
                  onChange={(e) => onChange('carMileage', e.target.value)}
                  placeholder="e.g., 50000"
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <select
                  value={data.carMileageUnit || 'miles'}
                  onChange={(e) => onChange('carMileageUnit', e.target.value)}
                  className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="miles">Miles</option>
                  <option value="kilometers">Kilometers</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                VIN Number
              </label>
              <input
                type="text"
                value={data.carVin || ''}
                onChange={(e) => onChange('carVin', e.target.value)}
                placeholder="17-character VIN"
                maxLength={17}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Condition *
              </label>
              <select
                value={data.carCondition || ''}
                onChange={(e) => onChange('carCondition', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select condition</option>
                <option value="Excellent">Excellent</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="As-Is">As-Is</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Property Rental Specific Fields */}
      {data.type === 'Property Rental' && (
        <div className="space-y-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Property Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Property Address *
            </label>
            <input
              type="text"
              value={data.propertyAddress || ''}
              onChange={(e) => onChange('propertyAddress', e.target.value)}
              placeholder="Full property address"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Property Type *
              </label>
              <select
                value={data.propertyType || ''}
                onChange={(e) => onChange('propertyType', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Commercial">Commercial</option>
                <option value="Office">Office</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rent Amount *
              </label>
              <input
                type="text"
                value={data.rentAmount || ''}
                onChange={(e) => onChange('rentAmount', e.target.value)}
                placeholder="e.g., $1,500/month"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rent Period
              </label>
              <select
                value={data.rentPeriod || ''}
                onChange={(e) => onChange('rentPeriod', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select period</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semi-annually">Semi-annually</option>
                <option value="Annually">Annually</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Security Deposit
              </label>
              <input
                type="text"
                value={data.securityDeposit || ''}
                onChange={(e) => onChange('securityDeposit', e.target.value)}
                placeholder="e.g., $1,500"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Equipment Lease Specific Fields */}
      {data.type === 'Equipment Lease' && (
        <div className="space-y-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">Equipment Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Equipment Description *
            </label>
            <textarea
              value={data.equipmentDescription || ''}
              onChange={(e) => onChange('equipmentDescription', e.target.value)}
              placeholder="Detailed description of the equipment being leased"
              rows={3}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Serial Number
              </label>
              <input
                type="text"
                value={data.equipmentSerialNumber || ''}
                onChange={(e) => onChange('equipmentSerialNumber', e.target.value)}
                placeholder="Equipment serial number"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Lease Term *
              </label>
              <input
                type="text"
                value={data.leaseTerm || ''}
                onChange={(e) => onChange('leaseTerm', e.target.value)}
                placeholder="e.g., 12 months, 2 years"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Lease Amount *
            </label>
            <input
              type="text"
              value={data.leaseAmount || ''}
              onChange={(e) => onChange('leaseAmount', e.target.value)}
              placeholder="e.g., $500/month, $5,000 total"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}

      {/* Special Clauses */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Special Clauses
        </label>
        
        {/* Common Clauses */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {commonClauses.map(clause => (
            <label key={clause} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.specialClauses.includes(clause)}
                onChange={() => handleClauseToggle(clause)}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-slate-300">{clause}</span>
            </label>
          ))}
        </div>

        {/* Custom Clause Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newClause}
            onChange={(e) => setNewClause(e.target.value)}
            placeholder="Add custom clause..."
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            onKeyPress={(e) => e.key === 'Enter' && addCustomClause()}
          />
          <button
            onClick={addCustomClause}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Selected Clauses */}
        {data.specialClauses.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-slate-400 mb-2">Selected clauses:</p>
            <div className="flex flex-wrap gap-2">
              {data.specialClauses.map((clause: string) => (
                <span
                  key={clause}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                >
                  {clause}
                  <button
                    onClick={() => removeClause(clause)}
                    className="hover:text-blue-300 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
