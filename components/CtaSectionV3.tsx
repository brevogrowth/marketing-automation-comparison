'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';

export const CtaSectionV3: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [acceptsComms, setAcceptsComms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { email, firstName, acceptsComms });
    alert('For this example, the data is just displayed in the console.');
  };

  return (
    <section className="mb-12">
      <SectionTitle
        title="Get Your Personalized Benchmark Report"
        subtitle="Receive this analysis plus tailored recommendations in your inbox"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Lead Capture Form */}
        <Card className="bg-gradient-to-br from-brevo-light to-white">
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              📊 Download Full Report
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@company.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brevo-green focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name (optional)
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brevo-green focus:border-transparent"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptComms"
                  checked={acceptsComms}
                  onChange={(e) => setAcceptsComms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-brevo-green border-gray-300 rounded focus:ring-brevo-green"
                />
                <label htmlFor="acceptComms" className="text-sm text-gray-700">
                  I agree to receive marketing communications from Brevo about products and services.
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brevo-green hover:bg-brevo-dark text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
              Send Me the Report
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              You'll receive a PDF report with detailed insights and action steps
            </p>
          </form>
        </Card>

        {/* Right: Talk to Expert */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              💬 Talk to a Brevo Expert
            </h3>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Want to discuss your benchmark results with a marketing automation specialist?
              Book a 30-minute consultation to:
            </p>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-brevo-green font-bold text-lg">✓</span>
                <span className="text-gray-700">
                  Deep-dive into your specific challenges
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brevo-green font-bold text-lg">✓</span>
                <span className="text-gray-700">
                  Get custom recommendations for your stack
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brevo-green font-bold text-lg">✓</span>
                <span className="text-gray-700">
                  See Brevo's platform in action
                </span>
              </li>
            </ul>
          </div>

          <button className="w-full bg-white border-2 border-brevo-green text-brevo-green hover:bg-brevo-green hover:text-white font-semibold py-3 px-6 rounded-md transition-colors">
            Schedule a Consultation →
          </button>
        </Card>
      </div>
    </section>
  );
};
