'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ContractForm from '@/components/ContractForm';
import ContractPreview from '@/components/ContractPreview';
import { 
  DocumentPlusIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  CheckIcon
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

function CreateContractContent() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [contractData, setContractData] = useState<ContractData>({
    title: '',
    type: 'Freelance',
    parties: ['', ''],
    description: '',
    paymentTerms: '',
    deadline: '',
    specialClauses: [],
    generatedContent: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Load template data from URL if present
  useEffect(() => {
    const templateParam = searchParams.get('template');
    const clientParam = searchParams.get('client');
    
    if (templateParam) {
      try {
        const templateData = JSON.parse(decodeURIComponent(templateParam));
        setContractData(prev => ({
          ...prev,
          ...templateData
        }));
      } catch (error) {
        console.error('Error parsing template data:', error);
      }
    }
    
    if (clientParam) {
      try {
        const clientData = JSON.parse(decodeURIComponent(clientParam));
        setContractData(prev => ({
          ...prev,
          parties: clientData.parties || prev.parties,
          // Add more client data auto-fill as needed
        }));
      } catch (error) {
        console.error('Error parsing client data:', error);
      }
    }
  }, [searchParams]);

  const handleFormChange = (field: keyof ContractData, value: any) => {
    setContractData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateContract = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      });

      const data = await response.json();
      
      if (data.success) {
        // Auto-save the contract immediately after generation
        const saveResponse = await fetch('/api/contracts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...contractData,
            title: data.title || contractData.title, // Use AI-generated title if available
            generatedContent: data.content,
            clerkId: user?.id
          }),
        });

        const saveData = await saveResponse.json();
        
        if (saveData.success) {
          // Redirect to dashboard immediately
          router.push('/dashboard');
        } else {
          console.error('Failed to save contract:', saveData.error);
          alert('Contract generated but failed to save. Please try again.');
        }
      } else {
        console.error('Failed to generate contract:', data.error);
        alert('Failed to generate contract. Please try again.');
      }
    } catch (error) {
      console.error('Error generating contract:', error);
      alert('Failed to generate contract. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveContract = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contractData,
          clerkId: user?.id
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.push('/dashboard');
        }, 2000);
      } else {
        console.error('Failed to save contract:', data.error);
      }
    } catch (error) {
      console.error('Error saving contract:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = async () => {
    try {
      // Dynamic import for client-side PDF generation
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      // Set font
      doc.setFont('helvetica');
      
      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(contractData.title || 'Contract Agreement', margin, 30);
      
      // Date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Date: ${currentDate}`, margin, 45);
      
      // Contract content
      doc.setFontSize(12);
      let yPosition = 60;
      
      // Split content into lines and add to PDF
      const content = contractData.generatedContent || 'No contract content available';
      const lines = doc.splitTextToSize(content, maxWidth);
      
      lines.forEach((line: string) => {
        if (yPosition > 280) { // Check if we need a new page
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });
      
      // Save the PDF
      doc.save(`${contractData.title || 'contract'}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to server-side PDF generation
      try {
        const response = await fetch('/api/contracts/pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contractData),
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${contractData.title || 'contract'}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      } catch (fallbackError) {
        console.error('Fallback PDF generation also failed:', fallbackError);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="bg-slate-800 shadow-sm border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <DocumentPlusIcon className="w-6 h-6" />
              {searchParams.get('template') 
                ? 'Create Contract from Template' 
                : searchParams.get('client')
                ? 'Create Contract with Client Data'
                : 'Create New Contract'
              }
            </h1>
            <p className="text-slate-300">
              {searchParams.get('template') 
                ? 'Customize your template with AI assistance' 
                : searchParams.get('client')
                ? 'Contract form pre-filled with client information'
                : 'Generate a professional contract with AI assistance'
              }
            </p>
          </div>
          
          {/* Action Buttons */}
          {contractData.generatedContent && (
            <div className="flex items-center gap-3">
              <button
                onClick={saveContract}
                disabled={isSaving}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
              
              <button
                onClick={downloadPDF}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              
              <button className="bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center gap-2">
                <ShareIcon className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-3 mx-6 mt-4 rounded-lg flex items-center gap-2">
          <CheckIcon className="w-5 h-5" />
          <span>Contract saved successfully! Redirecting to dashboard...</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-full mobile-grid-1">
          {/* Left Panel - Form */}
          <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-4 md:p-6 mobile-card">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 mobile-text-large">Contract Details</h2>
            <ContractForm 
              data={contractData}
              onChange={handleFormChange}
            />
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-4 md:p-6 mobile-card">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 mobile-text-large">Live Preview</h2>
            <ContractPreview 
              data={contractData}
              onGenerate={generateContract}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default function CreateContract() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    }>
      <CreateContractContent />
    </Suspense>
  );
}
