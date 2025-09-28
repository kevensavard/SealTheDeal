import Link from 'next/link';
import { 
  SparklesIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  BellIcon, 
  ShareIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function FeaturesPage() {
  const features = [
    {
      icon: SparklesIcon,
      title: "AI-Powered Generation",
      description: "Generate professional contracts in seconds using advanced AI. Simply describe your needs and get a complete, legally-sound contract ready for customization.",
      benefits: ["Instant contract creation", "Legal compliance built-in", "Multiple contract types", "Smart clause suggestions"]
    },
    {
      icon: UserGroupIcon,
      title: "Multi-Party E-Signatures",
      description: "Send contracts to multiple parties simultaneously. Each signer gets their own secure link with real-time progress tracking.",
      benefits: ["Unlimited signers", "Individual signing links", "Progress tracking", "Automatic notifications"]
    },
    {
      icon: DocumentTextIcon,
      title: "Smart Client Management",
      description: "Store and manage client information with auto-fill capabilities. Link contracts directly to client profiles for seamless workflow.",
      benefits: ["Client database", "Auto-fill contracts", "Contract history", "Contact management"]
    },
    {
      icon: DocumentTextIcon,
      title: "Professional Templates",
      description: "Access a library of pre-built contract templates for common business needs. Customize and save your own templates for future use.",
      benefits: ["Pre-built templates", "Custom templates", "Industry-specific", "Easy customization"]
    },
    {
      icon: ChartBarIcon,
      title: "Analytics & Insights",
      description: "Track contract performance with detailed analytics. Monitor signing rates, turnaround times, and business metrics.",
      benefits: ["Signing analytics", "Performance metrics", "Business insights", "Export reports"]
    },
    {
      icon: BellIcon,
      title: "Smart Notifications",
      description: "Stay on top of your contracts with intelligent notifications. Get alerts for pending signatures, expiring contracts, and important deadlines.",
      benefits: ["Real-time alerts", "Email notifications", "Deadline reminders", "Status updates"]
    },
    {
      icon: ShareIcon,
      title: "PDF Export & Email",
      description: "Export contracts as professional PDFs and send them via email. Share contracts securely with password protection options.",
      benefits: ["PDF generation", "Email integration", "Password protection", "Secure sharing"]
    },
    {
      icon: GlobeAltIcon,
      title: "Multi-Language Support",
      description: "Create contracts in multiple languages with built-in translation support. Perfect for international business.",
      benefits: ["Multiple languages", "Auto-translation", "Local compliance", "Global reach"]
    },
    {
      icon: ShieldCheckIcon,
      title: "Bank-Level Security",
      description: "Enterprise-grade security with encryption, secure storage, and compliance with international data protection standards.",
      benefits: ["End-to-end encryption", "Secure storage", "GDPR compliant", "SOC 2 certified"]
    }
  ];

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
                <Link href="/features" className="text-white px-3 py-2 text-sm font-medium">
                  Features
                </Link>
                <Link href="/pricing" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Pricing
                </Link>
                <Link href="/templates" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
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
            Powerful Features for{' '}
            <span className="gradient-text">Modern Contracts</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Everything you need to create, manage, and execute professional contracts with ease.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-slate-400 text-sm">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500/10 to-emerald-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Contract Process?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of businesses already using SealTheDeal to streamline their contract workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
              Start Free Trial
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="border border-slate-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-800 transition-all duration-200">
              Contact Sales
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
