import React from 'react';
import { Card } from './Card';

export const BusinessAssumptions: React.FC = () => {
  return (
    <Card className="mb-8 bg-blue-50 border border-blue-100">
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Refine the benchmark based on YOUR business model
      </h3>
      <p className="text-gray-600 mb-6">
        This benchmark is based on a few simple assumptions. In the final product, you'll be able to
        adjust these values. For this example, we've used an online fashion retailer with a €65 basket
        and just over 2 purchases per year.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="avgBasket" className="block text-sm font-medium text-gray-700 mb-2">
            Average basket (€)
          </label>
          <input
            type="text"
            id="avgBasket"
            value="65"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="purchaseFreq" className="block text-sm font-medium text-gray-700 mb-2">
            Purchase frequency (purchases / year)
          </label>
          <input
            type="text"
            id="purchaseFreq"
            value="2.1"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="customerBase" className="block text-sm font-medium text-gray-700 mb-2">
            Customer base size
          </label>
          <select
            id="customerBase"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-500 cursor-not-allowed"
          >
            <option value="low">&lt; 100k</option>
            <option value="medium" selected>100–500k</option>
            <option value="high">&gt; 500k</option>
          </select>
        </div>
      </div>

      <button
        disabled
        className="px-6 py-2 bg-gray-300 text-gray-500 rounded-md font-medium cursor-not-allowed"
      >
        Update Analysis
      </button>
    </Card>
  );
};
