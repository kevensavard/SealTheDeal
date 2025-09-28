import Link from 'next/link';
import { ArrowRightIcon, HeartIcon, LightBulbIcon, ShieldCheckIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  const values = [
    {
      icon: LightBulbIcon,
      title: "Innovation",
      description: "We're constantly pushing the boundaries of what's possible in contract management, using cutting-edge AI and technology to solve real-world problems."
    },
    {
      icon: ShieldCheckIcon,
      title: "Trust & Security",
      description: "Your data and contracts are protected with enterprise-grade security. We take privacy and security seriously, implementing the highest standards."
    },
    {
      icon: UsersIcon,
      title: "User-Centric",
      description: "Every feature we build is designed with our users in mind. We listen to feedback and continuously improve based on real user needs."
    },
    {
      icon: HeartIcon,
      title: "Simplicity",
      description: "Complex legal processes shouldn't be complicated. We believe in making contract management accessible to everyone, regardless of legal expertise."
    }
  ];

  const team = [
    {
      name: "Keven Savard",
      role: "Founder & CEO",
      description: "Passionate about simplifying legal processes for small businesses and freelancers.",
      image: "/api/placeholder/150/150"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Contracts Generated" },
    { number: "5,000+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
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
                <Link href="/pricing" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Pricing
                </Link>
                <Link href="/templates" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Templates
                </Link>
                <Link href="/about" className="text-white px-3 py-2 text-sm font-medium">
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
            About{' '}
            <span className="gradient-text">SealTheDeal</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            We're on a mission to democratize contract management, making it accessible, affordable, and simple for everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 rounded-2xl p-8 md:p-12 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Story</h2>
            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p>
                SealTheDeal was born from a simple observation: contract management is unnecessarily complex and expensive. 
                Small businesses, freelancers, and entrepreneurs were spending thousands of dollars on legal fees for simple contracts 
                that could be standardized and automated.
              </p>
              <p>
                We saw an opportunity to leverage artificial intelligence and modern technology to create a platform that would 
                make professional contract creation accessible to everyone. Our goal was to eliminate the barriers that prevent 
                people from protecting their business relationships with proper legal documentation.
              </p>
              <p>
                Today, SealTheDeal serves thousands of users worldwide, helping them create, manage, and execute contracts 
                with confidence. We're proud to be part of their success stories, from freelancers landing their first big 
                client to startups securing their first major partnership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-slate-300">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-slate-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 gradient-text">
                  {stat.number}
                </div>
                <div className="text-slate-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-slate-300">
              The passionate people behind SealTheDeal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-emerald-400 font-medium mb-4">{member.role}</p>
                <p className="text-slate-300 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Our Mission</h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-12">
            To empower every business owner, freelancer, and entrepreneur with the tools they need to create 
            professional contracts without the complexity, cost, or legal barriers that have traditionally 
            stood in their way.
          </p>
          <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-8 border border-slate-700">
            <p className="text-lg text-slate-300 italic">
              "We believe that everyone deserves access to professional legal tools, regardless of their 
              budget or legal expertise. That's why we built SealTheDeal."
            </p>
            <p className="text-slate-400 mt-4">— The SealTheDeal Team</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500/10 to-emerald-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Start creating professional contracts today and be part of the future of contract management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="border border-slate-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-800 transition-all duration-200">
              Contact Us
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
