'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';

export const CtaSection: React.FC = () => {
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
        title="Receive this benchmark and action plan by email"
        subtitle="Get a complete PDF version of this analysis"
      />

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address <span className="text-red-500">*</span>
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
                First name (optional)
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
                I agree to receive communications from Brevo regarding its marketing products and services.
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brevo-green hover:bg-brevo-dark text-white font-semibold py-3 px-6 rounded-md transition-colors"
          >
            Send the report
          </button>

          <div className="text-center mt-6">
            <a
              href="#"
              className="text-brevo-green hover:text-brevo-dark font-medium text-sm underline"
            >
              Talk to a Brevo expert
            </a>
          </div>
        </form>
      </Card>
    </section>
  );
};
