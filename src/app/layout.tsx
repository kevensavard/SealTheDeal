import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SealTheDeal - AI-Powered Contract Management & E-Signature Platform',
  description: 'Generate, customize, and sign professional contracts in seconds. AI-powered contract creation, multi-party e-signatures, and smart client management for freelancers, startups, and small businesses.',
  keywords: [
    'contract management',
    'e-signature',
    'digital contracts',
    'AI contract generator',
    'electronic signature',
    'contract templates',
    'freelance contracts',
    'business contracts',
    'legal documents',
    'contract automation',
    'digital signing',
    'contract software',
    'online contracts',
    'contract creation',
    'signature software',
    'document management',
    'legal tech',
    'contract workflow',
    'business automation',
    'freelancer tools'
  ],
  authors: [{ name: 'SealTheDeal Team' }],
  creator: 'SealTheDeal',
  publisher: 'SealTheDeal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sealthedeal.app'),
  alternates: {
    canonical: 'https://sealthedeal.app',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/favicon-32x32.png',
  },
  openGraph: {
    title: 'SealTheDeal - AI-Powered Contract Management & E-Signature Platform',
    description: 'Generate, customize, and sign professional contracts in seconds. AI-powered contract creation, multi-party e-signatures, and smart client management.',
    url: 'https://sealthedeal.app',
    siteName: 'SealTheDeal',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'SealTheDeal - AI Contract Generator & E-Signature Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SealTheDeal - AI-Powered Contract Management & E-Signature Platform',
    description: 'Generate, customize, and sign professional contracts in seconds. AI-powered contract creation, multi-party e-signatures, and smart client management.',
    images: ['/opengraph-image'],
    creator: '@sealthedeal',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="theme-color" content="#1e293b" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "SealTheDeal",
                "description": "AI-powered contract management and e-signature platform for freelancers, startups, and small businesses.",
                "url": "https://sealthedeal.app",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "Free plan available"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "150"
                },
                "author": {
                  "@type": "Organization",
                  "name": "SealTheDeal",
                  "url": "https://sealthedeal.app"
                },
                "featureList": [
                  "AI-powered contract generation",
                  "Multi-party e-signatures",
                  "Client management",
                  "Contract templates",
                  "Analytics and insights",
                  "PDF export",
                  "Email integration"
                ]
              })
            }}
          />
          
          {/* Organization Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "SealTheDeal",
                "url": "https://sealthedeal.app",
                "logo": "https://sealthedeal.app/logo.png",
                "description": "AI-powered contract management and e-signature platform",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+1-555-0123",
                  "contactType": "customer service",
                  "email": "support@mail.sealthedeal.app"
                },
                "sameAs": [
                  "https://twitter.com/sealthedeal",
                  "https://linkedin.com/company/sealthedeal"
                ]
              })
            }}
          />
        </head>
        <body className={inter.className}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}