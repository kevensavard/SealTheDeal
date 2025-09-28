'use client';

import { useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  QuestionMarkCircleIcon,
  BugAntIcon,
  LightBulbIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function SupportPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  const supportTabs = [
    { id: 'overview', name: 'Overview', icon: QuestionMarkCircleIcon },
    { id: 'contact', name: 'Contact Us', icon: ChatBubbleLeftRightIcon },
    { id: 'bug-report', name: 'Report Bug', icon: BugAntIcon },
    { id: 'feature-request', name: 'Request Feature', icon: LightBulbIcon },
    { id: 'documentation', name: 'Documentation', icon: BookOpenIcon },
    { id: 'faq', name: 'FAQ', icon: DocumentTextIcon }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <QuestionMarkCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Support Center</h1>
                  <p className="text-slate-400">Get help, report issues, and access documentation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-white mb-4">Support Options</h3>
                <nav className="space-y-2">
                  {supportTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && <SupportOverview />}
              {activeTab === 'contact' && <ContactForm isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />}
              {activeTab === 'bug-report' && <BugReportForm isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />}
              {activeTab === 'feature-request' && <FeatureRequestForm isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />}
              {activeTab === 'documentation' && <DocumentationSection />}
              {activeTab === 'faq' && <FAQSection />}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Support Overview Component
function SupportOverview() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Welcome to Support</h2>
        <p className="text-slate-300 mb-6">
          We're here to help you get the most out of SealTheDeal. Choose from the options below to get the assistance you need.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-3 mb-3">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-medium text-white">Contact Us</h3>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              Have a question? Need help with your account? Send us a message and we'll get back to you within 24 hours.
            </p>
            <div className="text-xs text-slate-400">
              <div className="flex items-center gap-2 mb-1">
                <ClockIcon className="w-4 h-4" />
                Response time: 24 hours
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                Available 7 days a week
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-3 mb-3">
              <BugAntIcon className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-medium text-white">Report a Bug</h3>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              Found something that's not working? Help us improve by reporting bugs with detailed information.
            </p>
            <div className="text-xs text-slate-400">
              <div className="flex items-center gap-2 mb-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                Include steps to reproduce
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                We'll investigate immediately
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-3 mb-3">
              <LightBulbIcon className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-medium text-white">Request Features</h3>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              Have an idea for a new feature? We'd love to hear your suggestions to make SealTheDeal better.
            </p>
            <div className="text-xs text-slate-400">
              <div className="flex items-center gap-2 mb-1">
                <UserGroupIcon className="w-4 h-4" />
                Community-driven development
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                Regular feature updates
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-3 mb-3">
              <BookOpenIcon className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-medium text-white">Documentation</h3>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              Comprehensive guides, tutorials, and API documentation to help you master SealTheDeal.
            </p>
            <div className="text-xs text-slate-400">
              <div className="flex items-center gap-2 mb-1">
                <DocumentTextIcon className="w-4 h-4" />
                Step-by-step guides
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                Always up-to-date
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Info */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
            <EnvelopeIcon className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm font-medium text-white">Email</div>
              <div className="text-xs text-slate-400">support@mail.sealthedeal.app</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
            <GlobeAltIcon className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-sm font-medium text-white">Website</div>
              <div className="text-xs text-slate-400">sealthedeal.app/support</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
            <ClockIcon className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-sm font-medium text-white">Hours</div>
              <div className="text-xs text-slate-400">24/7 Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Form Component
function ContactForm({ isSubmitting, setIsSubmitting, submitStatus, setSubmitStatus }: any) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', priority: 'medium' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Contact Us</h2>
      
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="font-medium">Message sent successfully!</span>
          </div>
          <p className="text-emerald-300 text-sm mt-1">We'll get back to you within 24 hours.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-400">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="font-medium">Failed to send message</span>
          </div>
          <p className="text-red-300 text-sm mt-1">Please try again or contact us directly.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Subject *</label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of your inquiry"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low - General question</option>
            <option value="medium">Medium - Account issue</option>
            <option value="high">High - Urgent problem</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
          <textarea
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Please provide as much detail as possible about your inquiry..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

// Bug Report Form Component
function BugReportForm({ isSubmitting, setIsSubmitting, submitStatus, setSubmitStatus }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: '',
    expected: '',
    actual: '',
    browser: '',
    device: '',
    severity: 'medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/support/bug-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          title: '',
          description: '',
          steps: '',
          expected: '',
          actual: '',
          browser: '',
          device: '',
          severity: 'medium'
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Report a Bug</h2>
      
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="font-medium">Bug report submitted!</span>
          </div>
          <p className="text-emerald-300 text-sm mt-1">We'll investigate and get back to you soon.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-400">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="font-medium">Failed to submit bug report</span>
          </div>
          <p className="text-red-300 text-sm mt-1">Please try again or contact us directly.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Bug Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of the bug"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed description of what went wrong"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Steps to Reproduce *</label>
          <textarea
            required
            rows={4}
            value={formData.steps}
            onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Expected Behavior *</label>
            <textarea
              required
              rows={3}
              value={formData.expected}
              onChange={(e) => setFormData({ ...formData, expected: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What should have happened?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Actual Behavior *</label>
            <textarea
              required
              rows={3}
              value={formData.actual}
              onChange={(e) => setFormData({ ...formData, actual: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What actually happened?"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Severity</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low - Minor issue</option>
              <option value="medium">Medium - Moderate impact</option>
              <option value="high">High - Major issue</option>
              <option value="critical">Critical - System down</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Browser</label>
            <input
              type="text"
              value={formData.browser}
              onChange={(e) => setFormData({ ...formData, browser: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Chrome, Firefox, Safari..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Device</label>
            <input
              type="text"
              value={formData.device}
              onChange={(e) => setFormData({ ...formData, device: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Desktop, Mobile, Tablet..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
        </button>
      </form>
    </div>
  );
}

// Feature Request Form Component
function FeatureRequestForm({ isSubmitting, setIsSubmitting, submitStatus, setSubmitStatus }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    useCase: '',
    priority: 'medium',
    category: 'general'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/support/feature-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          title: '',
          description: '',
          useCase: '',
          priority: 'medium',
          category: 'general'
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Request a Feature</h2>
      
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="font-medium">Feature request submitted!</span>
          </div>
          <p className="text-emerald-300 text-sm mt-1">Thank you for your suggestion. We'll review it and consider it for future updates.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-400">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="font-medium">Failed to submit feature request</span>
          </div>
          <p className="text-red-300 text-sm mt-1">Please try again or contact us directly.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Feature Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of the feature"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed description of the feature and how it should work"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Use Case *</label>
          <textarea
            required
            rows={4}
            value={formData.useCase}
            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="How would this feature help you? What problem does it solve?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">General</option>
              <option value="contracts">Contracts</option>
              <option value="esignature">E-signature</option>
              <option value="templates">Templates</option>
              <option value="analytics">Analytics</option>
              <option value="integrations">Integrations</option>
              <option value="ui-ux">UI/UX</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low - Nice to have</option>
              <option value="medium">Medium - Would be helpful</option>
              <option value="high">High - Important for workflow</option>
              <option value="critical">Critical - Blocking current work</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feature Request'}
        </button>
      </form>
    </div>
  );
}

// Documentation Section Component
function DocumentationSection() {
  const docs = [
    {
      category: 'Getting Started',
      items: [
        { title: 'Getting Started Guide', description: 'Complete guide to setting up and using SealTheDeal', link: '/docs/getting-started' }
      ]
    },
    {
      category: 'Contracts',
      items: [
        { title: 'Managing Contracts', description: 'Complete guide to creating, editing, and managing contracts', link: '/docs/contracts' }
      ]
    },
    {
      category: 'E-signatures',
      items: [
        { title: 'E-Signatures Guide', description: 'Complete guide to sending, managing, and tracking e-signatures', link: '/docs/e-signatures' }
      ]
    },
    {
      category: 'Advanced Features',
      items: [
        { title: 'Advanced Features', description: 'Client management, analytics, templates, and more', link: '/docs/advanced-features' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Documentation</h2>
        <p className="text-slate-300 mb-6">
          Comprehensive guides and tutorials to help you master SealTheDeal. All documentation is regularly updated and maintained.
        </p>

        {docs.map((section, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">{section.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  href={item.link}
                  className="block p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-colors"
                >
                  <h4 className="text-white font-medium mb-2">{item.title}</h4>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/docs/advanced-features" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
            <DocumentTextIcon className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-white font-medium">Advanced Features</div>
              <div className="text-slate-400 text-sm">Analytics, client management, and more</div>
            </div>
          </Link>
          <Link href="/docs/e-signatures" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-white font-medium">E-Signature Troubleshooting</div>
              <div className="text-slate-400 text-sm">Common e-signature issues and solutions</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// FAQ Section Component
function FAQSection() {
  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'What is SealTheDeal?',
          a: 'SealTheDeal is a comprehensive contract management platform that helps you create, manage, and execute contracts with AI-powered generation and e-signature capabilities.'
        },
        {
          q: 'How much does it cost?',
          a: 'We offer a free tier with 1 contract per month, and Pro plans starting at $15/month for unlimited contracts and advanced features.'
        },
        {
          q: 'Is my data secure?',
          a: 'Yes, we use enterprise-grade security with encryption, secure data centers, and comply with industry standards to protect your sensitive contract data.'
        }
      ]
    },
    {
      category: 'Contracts',
      questions: [
        {
          q: 'What types of contracts can I create?',
          a: 'You can create various contract types including freelance agreements, service contracts, car sales, property rentals, equipment leases, NDAs, and more.'
        },
        {
          q: 'How does AI contract generation work?',
          a: 'Our AI analyzes your input (contract type, parties, terms) and generates a comprehensive, legally-sound contract using advanced language models trained on legal documents.'
        },
        {
          q: 'Can I edit generated contracts?',
          a: 'Yes, all AI-generated contracts can be edited. You can modify any section, add clauses, or customize terms before saving or sending for signature.'
        }
      ]
    },
    {
      category: 'E-signatures',
      questions: [
        {
          q: 'How do e-signatures work?',
          a: 'E-signatures are legally binding. We send secure links to signers, they review the contract, sign digitally, and the signed contract is automatically saved and distributed.'
        },
        {
          q: 'Can I have multiple people sign?',
          a: 'Yes, you can have multiple parties sign the same contract. Each person gets their own secure signing link and can sign in any order.'
        },
        {
          q: 'Are e-signatures legally valid?',
          a: 'Yes, e-signatures are legally valid in most jurisdictions when properly implemented. We follow ESIGN Act and eIDAS regulations.'
        }
      ]
    },
    {
      category: 'Account & Billing',
      questions: [
        {
          q: 'How do I upgrade my plan?',
          a: 'Go to Settings > Subscription & Billing and click "Upgrade to Pro". You can upgrade anytime and your new features will be available immediately.'
        },
        {
          q: 'Can I cancel my subscription?',
          a: 'Yes, you can cancel anytime from your account settings. Your Pro features will remain active until the end of your billing period.'
        },
        {
          q: 'What happens to my contracts if I cancel?',
          a: 'All your contracts remain accessible. You can view, download, and manage existing contracts even after canceling your subscription.'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
        <p className="text-slate-300 mb-6">
          Find answers to common questions about SealTheDeal. Can't find what you're looking for? Contact us directly.
        </p>

        {faqs.map((section, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">{section.category}</h3>
            <div className="space-y-4">
              {section.questions.map((faq, faqIndex) => (
                <div key={faqIndex} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <h4 className="text-white font-medium mb-2">{faq.q}</h4>
                  <p className="text-slate-300 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Still Need Help?</h3>
        <p className="text-slate-300 mb-4">
          If you couldn't find the answer to your question, we're here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:support@mail.sealthedeal.app"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <EnvelopeIcon className="w-4 h-4" />
            Email Support
          </a>
          <Link
            href="/support?tab=contact"
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            Contact Form
          </Link>
        </div>
      </div>
    </div>
  );
}
