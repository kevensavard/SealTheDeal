'use client';

import { useState, useEffect } from 'react';
import { DocumentTextIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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

interface ContractPreviewProps {
  data: ContractData;
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export default function ContractPreview({ data, onGenerate, isGenerating }: ContractPreviewProps) {
  const [previewContent, setPreviewContent] = useState('');
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (data.generatedContent) {
      setShowEmptyState(false);
      setPreviewContent(data.generatedContent);
    } else {
      // Always show empty state until AI generation is triggered
      setShowEmptyState(true);
      setPreviewContent('');
    }
  }, [data]);

  const handleGenerate = () => {
    if (onGenerate) {
      setShowEmptyState(false);
      setAnimationStep(1);
      setProgress(0);
      setCurrentStep(0);
      onGenerate();
    }
  };

  // Premium animation steps with realistic progress
  const generationSteps = [
    { id: 0, title: "Analyzing Requirements", description: "Processing contract type and party details", duration: 2000, progress: 10 },
    { id: 1, title: "Drafting Legal Framework", description: "Creating comprehensive legal structure", duration: 3000, progress: 25 },
    { id: 2, title: "Generating Clauses", description: "Crafting specialized contract clauses", duration: 2500, progress: 45 },
    { id: 3, title: "Optimizing Language", description: "Refining legal terminology and structure", duration: 2000, progress: 65 },
    { id: 4, title: "Finalizing Contract", description: "Adding signatures and final touches", duration: 1500, progress: 85 },
    { id: 5, title: "Contract Ready", description: "Your professional contract is complete", duration: 500, progress: 100 }
  ];

  // Simulate realistic progress during generation
  useEffect(() => {
    if (isGenerating) {
      let stepIndex = 0;
      let currentProgress = 0;
      
      const progressInterval = setInterval(() => {
        if (stepIndex < generationSteps.length - 1) { // Don't go to 100% until actually done
          const step = generationSteps[stepIndex];
          setCurrentStep(stepIndex);
          
          // Animate progress to this step's target
          const targetProgress = step.progress;
          const progressStep = (targetProgress - currentProgress) / 20; // Smooth animation
          
          const progressAnimation = setInterval(() => {
            currentProgress += progressStep;
            if (currentProgress >= targetProgress) {
              currentProgress = targetProgress;
              clearInterval(progressAnimation);
            }
            setProgress(currentProgress);
          }, 50);
          
          stepIndex++;
        } else {
          // Stay at 85% until generation is actually complete
          setCurrentStep(generationSteps.length - 2); // Stay at "Finalizing Contract"
          setProgress(85);
          clearInterval(progressInterval);
        }
      }, 1000);

      return () => clearInterval(progressInterval);
    } else {
      setProgress(0);
      setCurrentStep(0);
    }
  }, [isGenerating]);

  // Complete the progress when generation is actually done
  useEffect(() => {
    if (!isGenerating && data.generatedContent) {
      // Add a brief delay before showing "Contract Ready" for better UX
      const timer = setTimeout(() => {
        setCurrentStep(generationSteps.length - 1); // "Contract Ready"
        setProgress(100);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isGenerating, data.generatedContent]);

  const generateBasicPreview = (data: ContractData) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let specificDetails = '';

    if (data.type === 'Car Sale') {
      specificDetails = `
**Vehicle Details:**
- Make: ${data.carMake || 'Not specified'}
- Model: ${data.carModel || 'Not specified'}
- Year: ${data.carYear || 'Not specified'}
- Mileage: ${data.carMileage || 'Not specified'} ${data.carMileageUnit || 'miles'}
- VIN: ${data.carVin || 'Not provided'}
- Condition: ${data.carCondition || 'Not specified'}
Important: This is a private sale between individuals. Includes "as-is" clause.
`;
    } else if (data.type === 'Property Rental') {
      specificDetails = `
**Property Details:**
- Address: ${data.propertyAddress || 'Not specified'}
- Type: ${data.propertyType || 'Not specified'}
- Rent: ${data.rentAmount || 'Not specified'}
- Period: ${data.rentPeriod || 'Monthly'}
- Security Deposit: ${data.securityDeposit || 'Not specified'}
Important: Includes standard rental terms, maintenance responsibilities, and tenant/landlord obligations.
`;
    } else if (data.type === 'Equipment Lease') {
      specificDetails = `
**Equipment Details:**
- Description: ${data.equipmentDescription || 'Not specified'}
- Serial Number: ${data.equipmentSerialNumber || 'Not provided'}
- Lease Term: ${data.leaseTerm || 'Not specified'}
- Amount: ${data.leaseAmount || 'Not specified'}
Important: Includes equipment condition, maintenance responsibilities, and return conditions.
`;
    }

    return `
# ${data.title || 'Contract Title (AI Generated)'}

**Contract Type:** ${data.type}
**Effective Date:** ${currentDate}
**Contract ID:** STC-${Date.now().toString().slice(-6)}

---

## RECITALS

WHEREAS, the parties desire to enter into a formal agreement regarding ${data.type.toLowerCase()};

WHEREAS, each party has the legal capacity and authority to enter into this agreement;

WHEREAS, the parties wish to set forth their respective rights and obligations;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

---

## 1. PARTIES

${data.parties.filter(p => p.trim()).length > 0 
  ? data.parties.filter(p => p.trim()).map((party, index) => `**Party ${index + 1}:** ${party}`).join('\n\n')
  : 'Parties to be specified'
}

---

## 2. SCOPE OF WORK / SUBJECT MATTER

${data.description || 'Work description to be specified'}

**Deliverables:**
- [To be specified based on contract type and description]

**Quality Standards:**
- All work shall be performed in a professional manner
- Deliverables shall meet industry standards
- Compliance with applicable laws and regulations

---

## 3. COMPENSATION AND PAYMENT TERMS

${data.paymentTerms || 'Payment terms to be specified'}

**Payment Schedule:**
- [To be detailed based on payment terms provided]

**Late Payment:**
- Late payments shall incur interest at the rate of 1.5% per month
- Payment is due within 30 days of invoice date unless otherwise specified

---

## 4. TERM AND TIMELINE

**Contract Duration:** ${data.deadline ? `From ${currentDate} to ${new Date(data.deadline).toLocaleDateString()}` : 'To be specified'}

**Key Milestones:**
- [To be detailed based on timeline and deliverables]

---

## 5. SPECIAL PROVISIONS

${data.specialClauses.length > 0
  ? data.specialClauses.map(clause => `• ${clause}`).join('\n')
  : 'Standard terms apply'
}

---
${specificDetails}
## 6. WARRANTIES AND REPRESENTATIONS

Each party represents and warrants that:
- They have the legal capacity and authority to enter into this agreement
- All information provided is true and accurate
- They will comply with all applicable laws and regulations
- They have obtained all necessary approvals and consents

---

## 7. INDEMNIFICATION

Each party shall indemnify and hold harmless the other party from any claims, damages, or liabilities arising from their breach of this agreement or negligent acts.

---

## 8. TERMINATION

This agreement may be terminated:
- By mutual written consent of all parties
- Upon material breach by any party (with 30 days notice to cure)
- Upon completion of all obligations

---

## 9. DISPUTE RESOLUTION

Any disputes arising from this agreement shall be resolved through:
1. Good faith negotiation between the parties
2. Mediation if negotiation fails
3. Binding arbitration in accordance with the rules of the American Arbitration Association

---

## 10. GENERAL PROVISIONS

**Governing Law:** This agreement shall be governed by the laws of [State/Country]

**Entire Agreement:** This contract constitutes the entire agreement between the parties

**Amendments:** Any amendments must be in writing and signed by all parties

**Severability:** If any provision is deemed invalid, the remainder shall remain in effect

**Force Majeure:** Neither party shall be liable for delays due to circumstances beyond their control

---

## 11. EXECUTION

IN WITNESS WHEREOF, the parties have executed this agreement as of the date first written above.

**Signature Lines:**

${data.parties.filter(p => p.trim()).map((party, index) => 
  `_________________________${index < data.parties.filter(p => p.trim()).length - 1 ? '          ' : ''}`
).join('\n')}
${data.parties.filter(p => p.trim()).map((party, index) => 
  `${party || `Party ${index + 1}`}${index < data.parties.filter(p => p.trim()).length - 1 ? '              ' : ''}`
).join('\n')}
${data.parties.filter(p => p.trim()).map((_, index) => 
  `Date: _______________${index < data.parties.filter(p => p.trim()).length - 1 ? '              ' : ''}`
).join('\n')}

---

*This is a basic contract template. For a comprehensive, legally-sound contract with all necessary protections and clauses, please use the "Generate with AI" button.*
    `.trim();
  };

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="text-2xl font-bold text-white mb-4">
              {line.substring(2)}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-xl font-semibold text-white mt-6 mb-3">
              {line.substring(3)}
            </h2>
          );
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={index} className="text-gray-800 font-semibold mb-2">
              {line.substring(2, line.length - 2)}
            </p>
          );
        }
        if (line.startsWith('• ')) {
          return (
            <li key={index} className="text-gray-700 ml-4 mb-1">
              {line.substring(2)}
            </li>
          );
        }
        if (line.startsWith('---')) {
          return <hr key={index} className="border-gray-300 my-4" />;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return (
          <p key={index} className="text-gray-700 mb-2 leading-relaxed">
            {line}
          </p>
        );
      });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="w-5 h-5 text-slate-400" />
          <span className="text-slate-300 text-sm">
            {data.generatedContent ? 'AI Generated Contract' : showEmptyState ? 'Ready to Generate' : 'Basic Preview'}
          </span>
        </div>
        {data.generatedContent && (
          <div className="flex items-center gap-1 text-emerald-400 text-sm">
            <SparklesIcon className="w-4 h-4" />
            <span>AI Enhanced</span>
          </div>
        )}
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white rounded-lg p-6 overflow-y-auto">
        <div className="max-w-none">
          {showEmptyState ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-lg mx-auto">
                {/* Premium Empty State */}
                <div className="relative mb-8">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 via-purple-100 to-emerald-100 rounded-full flex items-center justify-center shadow-xl animate-glow">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <SparklesIcon className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                </div>

                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Generate Your Contract</h3>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Fill in the contract details on the left, then click the button below to generate a comprehensive, 
                    <span className="font-semibold text-blue-600"> AI-powered professional contract</span> tailored to your specific needs.
                  </p>
                </div>

                <div className="animate-scaleIn">
                  <button
                    onClick={handleGenerate}
                    disabled={!data.description || data.parties.filter(p => p.trim()).length < 2}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                  >
                    <SparklesIcon className="w-6 h-6" />
                    <span>Generate with AI</span>
                  </button>
                </div>

                <div className="mt-6 animate-slideInLeft">
                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-gray-700 font-medium">
                      ✨ <span className="font-semibold">Requirements:</span> Contract description and at least 2 parties
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-lg mx-auto">
                {/* Premium Header */}
                <div className="relative mb-8">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                      <SparklesIcon className="w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                  </div>
                  <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full opacity-30 animate-ping"></div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Dynamic Step Display */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-fadeIn">
                    {generationSteps[currentStep]?.title || "Creating Your Contract"}
                  </h3>
                  <p className="text-gray-600 text-lg animate-fadeIn">
                    {generationSteps[currentStep]?.description || "Processing your request..."}
                  </p>
                </div>

                {/* Premium Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                      style={{width: `${progress}%`}}
                    >
                      <div className="h-full bg-white opacity-30 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center space-x-2 mb-6">
                  {generationSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index <= currentStep 
                          ? 'bg-gradient-to-r from-blue-500 to-emerald-500 shadow-lg' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Premium Status Message */}
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-gray-700 font-medium">
                    🚀 Generating a comprehensive, legally-sound contract tailored to your specific needs
                  </p>
                </div>
              </div>
            </div>
          ) : previewContent ? (
            <div className="prose prose-sm max-w-none animate-fadeIn">
              {formatContent(previewContent)}
            </div>
          ) : (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Preview Available
              </h3>
              <p className="text-gray-500">
                Fill in the form fields to see a live preview of your contract.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Footer */}
      <div className="mt-4 p-3 bg-slate-700 rounded-lg">
        <p className="text-xs text-slate-400 text-center">
          {showEmptyState ? 'Ready to generate your professional contract' : 'This is a preview. The final contract will be professionally formatted and ready for signatures.'}
        </p>
      </div>
    </div>
  );
}
