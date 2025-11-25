import React from 'react';
import { Industry, PriceTier } from '@/data/benchmarks';

interface SidebarInputsProps {
  industry: Industry;
  setIndustry: (i: Industry) => void;
  priceTier: PriceTier;
  setPriceTier: (p: PriceTier) => void;
  isComparing: boolean;
  setIsComparing: (b: boolean) => void;
}

export const SidebarInputs = ({
  industry,
  setIndustry,
  priceTier,
  setPriceTier,
  isComparing,
  setIsComparing
}: SidebarInputsProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">1. Business Profile</h2>
        <p className="text-sm text-gray-500 mb-6">
          Define your business model to benchmark against relevant peers.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as Industry)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-brevo-green focus:ring-brevo-green sm:text-sm p-2 border"
            >
              <optgroup label="B2C Retail">
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Home">Home & Living</option>
                <option value="Beauty">Beauty & Wellness</option>
                <option value="Electronics">Electronics & Tech</option>
                <option value="Sports">Sports & Outdoor</option>
                <option value="Family">Family & Pets</option>
                <option value="Food">Food & Beverage</option>
                <option value="Luxury">Luxury & Jewelry</option>
              </optgroup>
              <optgroup label="B2B">
                <option value="SaaS">SaaS & Software</option>
                <option value="Services">Professional Services</option>
                <option value="Manufacturing">Manufacturing & Industrial</option>
                <option value="Wholesale">Wholesale & Distribution</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Positioning
            </label>
            <select
              value={priceTier}
              onChange={(e) => setPriceTier(e.target.value as PriceTier)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-brevo-green focus:ring-brevo-green sm:text-sm p-2 border"
            >
              <option value="Budget">Entry-Level (AOV &lt; 50€)</option>
              <option value="Mid-Range">Mid-Market (AOV 50-150€)</option>
              <option value="Luxury">Premium (AOV &gt; 150€)</option>
            </select>
          </div>
        </div>
      </div>

      <hr className="border-gray-100 mb-8" />

      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">2. Analysis Mode</h2>
        <p className="text-sm text-gray-500 mb-6">
          Input your own data to unlock AI-powered insights and recommendations.
        </p>

        <button
          onClick={() => setIsComparing(!isComparing)}
          className={`w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${isComparing
            ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'bg-brevo-green border-transparent text-white hover:bg-brevo-dark-green shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
        >
          {isComparing ? 'Exit Analysis Mode' : 'Start Analysis'}
        </button>
      </div>

      {isComparing && (
        <div className="mt-auto bg-brevo-light p-4 rounded-lg border border-brevo-green/20">
          <h4 className="text-sm font-bold text-brevo-dark-green mb-1">🚀 Ready to Analyze</h4>
          <p className="text-xs text-brevo-dark-green/80">
            Fill in your metrics in the grid, then click "Generate AI Analysis" at the bottom of the page.
          </p>
        </div>
      )}
    </div>
  );
};
