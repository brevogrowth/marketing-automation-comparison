import React from 'react';
import { Industry, PriceTier } from '@/data/retailBenchmarks';

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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">1. Market Context</h2>
        <p className="text-sm text-gray-500 mb-6">
          Select your industry and positioning to load relevant market standards.
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
              <option value="Fashion">Fashion & Apparel</option>
              <option value="Home">Home & Living</option>
              <option value="Beauty">Beauty & Cosmetics</option>
              <option value="Electronics">Consumer Electronics</option>
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
              <option value="Budget">Budget / Mass Market</option>
              <option value="Mid-Range">Mid-Range / Premium High Street</option>
              <option value="Luxury">Luxury / Designer</option>
            </select>
          </div>
        </div>
      </div>

      <hr className="border-gray-100 mb-8" />

      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">2. Comparison</h2>
        <p className="text-sm text-gray-500 mb-6">
          Unlock the ability to input your own data and see how you stack up.
        </p>

        <button
          onClick={() => setIsComparing(!isComparing)}
          className={`w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${isComparing
              ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'bg-brevo-green border-transparent text-white hover:bg-brevo-dark-green shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
        >
          {isComparing ? 'Hide My Data' : 'Compare My Numbers'}
        </button>
      </div>

      {isComparing && (
        <div className="mt-auto bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="text-sm font-bold text-blue-900 mb-1">💡 Pro Tip</h4>
          <p className="text-xs text-blue-700">
            Enter your data in the main grid to see instant status indicators (Red/Yellow/Green).
          </p>
        </div>
      )}
    </div>
  );
};
