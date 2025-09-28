import Link from 'next/link';
import { CheckIcon, ArrowRightIcon, StarIcon } from '@heroicons/react/24/outline';

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with basic contract needs",
      features: [
        "1 contract per month",
        "Basic contract templates",
        "PDF export",
        "Email support",
        "Standard security"
      ],
      limitations: [
        "No e-signature",
        "No client management",
        "No analytics",
        "No custom branding"
      ],
      cta: "Get Started Free",
      ctaLink: "/sign-up",
      popular: false
    },
    {
      name: "Pro",
      price: "$15",
      period: "per month",
      description: "Everything you need for professional contract management",
      features: [
        "Unlimited contracts",
        "Multi-party e-signatures",
        "Client management",
        "Advanced templates",
        "Analytics & insights",
        "Smart notifications",
        "Priority support",
        "Custom branding",
        "API access"
      ],
      limitations: [],
      cta: "Start Pro Trial",
      ctaLink: "/sign-up",
      popular: true
    }
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      question: "What happens to my contracts if I cancel?",
      answer: "Your contracts remain accessible for 30 days after cancellation. You can export all your data during this period."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees! You only pay the monthly subscription fee. No hidden costs or surprises."
    },
    {
      question: "Can I try Pro features before upgrading?",
      answer: "Yes! All new accounts get a 14-day free trial of Pro features. No credit card required to start."
    },
    {
      question: "Do you offer enterprise plans?",
      answer: "Yes! Contact our sales team for custom enterprise solutions with advanced features, dedicated support, and volume discounts."
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
                <Link href="/features" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-white px-3 py-2 text-sm font-medium">
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
            Simple, Transparent{' '}
            <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Choose the plan that fits your needs. Start free, upgrade when you're ready.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-slate-800/50 rounded-2xl p-8 border transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-emerald-500 shadow-emerald-500/20' 
                  : 'border-slate-700 hover:border-slate-600'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                      <StarIcon className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-slate-300">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckIcon className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-center opacity-50">
                      <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      </div>
                      <span className="text-slate-400">{limitation}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href={plan.ctaLink}
                  className={`w-full block text-center py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:shadow-lg'
                      : 'border border-slate-600 text-white hover:bg-slate-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-300">
              Everything you need to know about our pricing and plans.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
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
