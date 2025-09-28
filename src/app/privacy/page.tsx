import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - SealTheDeal',
  description: 'Privacy Policy for SealTheDeal contract management platform',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-slate-300 mb-4">
                SealTheDeal ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our contract management platform and services.
              </p>
              <p className="text-slate-300 mb-4">
                By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">2.1 Personal Information</h3>
              <p className="text-slate-300 mb-4">We may collect the following types of personal information:</p>
              <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, profile picture</li>
                <li><strong>Usage Information:</strong> How you interact with our Service</li>
                <li><strong>Content:</strong> Contracts, documents, and other content you create or upload</li>
                <li><strong>Client Information:</strong> Names, email addresses, and contact details of your clients</li>
                <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely by third-party providers)</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
                <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance your experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-300 mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                <li>Provide and maintain our Service</li>
                <li>Process transactions and manage subscriptions</li>
                <li>Generate AI-powered contract content</li>
                <li>Send notifications and updates</li>
                <li>Improve our Service and develop new features</li>
                <li>Provide customer support</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-slate-300 mb-4">We do not sell, trade, or rent your personal information. We may share your information in the following circumstances:</p>
              
              <h3 className="text-xl font-medium text-white mb-3">4.1 Service Providers</h3>
              <p className="text-slate-300 mb-4">
                We may share information with trusted third-party service providers who assist us in operating our Service, including:
              </p>
              <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                <li>Authentication services (Clerk)</li>
                <li>Database hosting (Neon)</li>
                <li>AI services (OpenAI)</li>
                <li>Payment processing (Stripe)</li>
                <li>Email delivery services</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">4.2 Legal Requirements</h3>
              <p className="text-slate-300 mb-4">
                We may disclose your information if required by law or in response to valid legal requests from government authorities.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">4.3 Business Transfers</h3>
              <p className="text-slate-300 mb-4">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
              <p className="text-slate-300 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication systems</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection</li>
              </ul>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <p className="text-yellow-400">
                  <strong>Note:</strong> While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
              <p className="text-slate-300 mb-4">
                We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. Specifically:
              </p>
              <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                <li>Account information is retained while your account is active</li>
                <li>Contract data is retained according to your subscription plan</li>
                <li>Usage data may be retained for analytics and service improvement</li>
                <li>We may retain certain information for legal compliance purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights and Choices</h2>
              <p className="text-slate-300 mb-4">Depending on your location, you may have the following rights regarding your personal information:</p>
              
              <h3 className="text-xl font-medium text-white mb-3">7.1 Access and Portability</h3>
              <p className="text-slate-300 mb-4">
                You can access and download your personal data through your account settings or by contacting us.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">7.2 Correction and Updates</h3>
              <p className="text-slate-300 mb-4">
                You can update your account information through your profile settings.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">7.3 Deletion</h3>
              <p className="text-slate-300 mb-4">
                You can request deletion of your account and associated data. Note that some information may be retained for legal or business purposes.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">7.4 Marketing Communications</h3>
              <p className="text-slate-300 mb-4">
                You can opt out of marketing emails by clicking the unsubscribe link or updating your preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-slate-300 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our Service. You can control cookie settings through your browser preferences.
              </p>
              
              <h3 className="text-xl font-medium text-white mb-3">8.1 Types of Cookies We Use</h3>
              <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic Service functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our Service</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. International Data Transfers</h2>
              <p className="text-slate-300 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers, including standard contractual clauses and adequacy decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. Children's Privacy</h2>
              <p className="text-slate-300 mb-4">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-slate-300 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
              <p className="text-slate-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-300">
                  Email: privacy@mail.sealthedeal.app<br />
                  Address: [Your Business Address]<br />
                  Phone: [Your Phone Number]<br />
                  Data Protection Officer: dpo@mail.sealthedeal.app
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">13. Regional Privacy Rights</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">13.1 GDPR (European Union)</h3>
              <p className="text-slate-300 mb-4">
                If you are in the European Union, you have additional rights under the General Data Protection Regulation (GDPR), including the right to data portability, the right to be forgotten, and the right to object to processing.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">13.2 CCPA (California)</h3>
              <p className="text-slate-300 mb-4">
                If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected and how it's used, the right to delete personal information, and the right to opt out of the sale of personal information.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
