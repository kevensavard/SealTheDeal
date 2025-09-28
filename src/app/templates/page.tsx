import Link from 'next/link';
import { DocumentTextIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function TemplatesPage() {
  const templates = [
    {
      id: 'freelance-agreement',
      name: 'Freelance Agreement',
      description: 'Perfect for freelancers and independent contractors. Includes scope of work, payment terms, and intellectual property clauses.',
      category: 'Business',
      features: ['Scope of work definition', 'Payment terms', 'Intellectual property', 'Termination clauses'],
      useCases: ['Web development', 'Design projects', 'Consulting', 'Content creation']
    },
    {
      id: 'service-agreement',
      name: 'Service Agreement',
      description: 'Comprehensive service contract for businesses providing services to clients. Covers deliverables, timelines, and responsibilities.',
      category: 'Business',
      features: ['Service description', 'Timeline & milestones', 'Payment schedule', 'Liability protection'],
      useCases: ['Marketing services', 'IT support', 'Business consulting', 'Maintenance services']
    },
    {
      id: 'nda',
      name: 'Non-Disclosure Agreement',
      description: 'Protect confidential information with this comprehensive NDA. Suitable for business partnerships and employee agreements.',
      category: 'Legal',
      features: ['Confidentiality terms', 'Duration & scope', 'Remedies & penalties', 'Return of materials'],
      useCases: ['Business partnerships', 'Employee onboarding', 'Vendor relationships', 'Investment discussions']
    },
    {
      id: 'car-sale',
      name: 'Car Sale Agreement',
      description: 'Complete vehicle sale contract between private parties. Includes vehicle details, payment terms, and warranty information.',
      category: 'Personal',
      features: ['Vehicle identification', 'Condition disclosure', 'Payment terms', 'Transfer of ownership'],
      useCases: ['Private car sales', 'Vehicle purchases', 'Auto transactions', 'Used car deals']
    },
    {
      id: 'rental-agreement',
      name: 'Rental Agreement',
      description: 'Standard rental contract for property or equipment. Covers terms, responsibilities, and payment schedules.',
      category: 'Property',
      features: ['Property description', 'Rent & deposit', 'Tenant responsibilities', 'Maintenance terms'],
      useCases: ['Apartment rental', 'Equipment rental', 'Office space', 'Storage units']
    },
    {
      id: 'partnership-agreement',
      name: 'Partnership Agreement',
      description: 'Formal partnership contract defining roles, responsibilities, and profit sharing between business partners.',
      category: 'Business',
      features: ['Partnership structure', 'Capital contributions', 'Profit sharing', 'Decision making'],
      useCases: ['Business partnerships', 'Joint ventures', 'Co-founder agreements', 'Strategic alliances']
    },
    {
      id: 'employment-contract',
      name: 'Employment Contract',
      description: 'Professional employment agreement covering job responsibilities, compensation, and company policies.',
      category: 'Employment',
      features: ['Job description', 'Compensation package', 'Benefits & perks', 'Company policies'],
      useCases: ['New hires', 'Executive positions', 'Contract employees', 'Remote workers']
    },
    {
      id: 'consulting-agreement',
      name: 'Consulting Agreement',
      description: 'Flexible consulting contract for professional services. Adaptable to various consulting arrangements.',
      category: 'Business',
      features: ['Consulting scope', 'Deliverables', 'Timeline', 'Payment structure'],
      useCases: ['Business consulting', 'Technical consulting', 'Strategy consulting', 'Project consulting']
    }
  ];

  const categories = ['All', 'Business', 'Legal', 'Personal', 'Property', 'Employment'];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold gradient-text">SealTheDeal</h1>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/features" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Pricing
                </Link>
                <Link href="/templates" className="text-white px-3 py-2 text-sm font-medium">
                  Templates
                </Link>
                <Link href="/about" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </Link>
                <Link href="/sign-up" className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Professional Contract{' '}
            <span className="gradient-text">Templates</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Choose from our library of professionally crafted contract templates. Each template is legally sound and ready to customize for your specific needs.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  category === 'All'
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div key={template.id} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{template.name}</h3>
                    <span className="text-sm text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">{template.description}</p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {template.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-slate-400 text-sm">
                        <CheckIcon className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3">Perfect for:</h4>
                  <div className="flex flex-wrap gap-2">
                    {template.useCases.map((useCase, index) => (
                      <span key={index} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/create-contract?template=${template.id}`}
                  className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Use Template
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500/10 to-emerald-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Can't Find the Right Template?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Our AI can generate custom contracts for any situation. Just describe what you need and we'll create a professional contract tailored to your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-contract" className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
              Create Custom Contract
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="border border-slate-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-800 transition-all duration-200">
              Request Template
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">SealTheDeal</h3>
              <p className="text-slate-400 mb-6 max-w-md">
                Generate professional contracts in seconds. Fast, simple, and stress-free contract creation for freelancers, startups, and small businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/templates" className="text-slate-400 hover:text-white transition-colors">Templates</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2025 SealTheDeal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}