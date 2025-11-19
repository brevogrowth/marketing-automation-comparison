import React from 'react';
import { Card } from './Card';

export const BusinessAssumptionsV2: React.FC = () => {
  return (
    <Card className="mb-8 bg-blue-50 border border-blue-100">
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Refine the benchmark based on YOUR business model
      </h3>
      <p className="text-gray-600 mb-6">
        This benchmark is based on a few simple assumptions. In the final product, you'll be able to adjust
        these values. For this example, we've taken a B2B SaaS company with specific metrics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-2">
            Annual Revenue ($M)
          </label>
          <input
            type="text"
            id="revenue"
            value="8.5"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="employees" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Employees
          </label>
          <input
            type="text"
            id="employees"
            value="120"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="marketingBudget" className="block text-sm font-medium text-gray-700 mb-2">
            Marketing Budget (% of revenue)
          </label>
          <input
            type="text"
            id="marketingBudget"
            value="18%"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="customerBase" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Base Size
          </label>
          <select
            id="customerBase"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-500 cursor-not-allowed"
          >
            <option value="low">&lt; 500</option>
            <option value="medium" selected>500-2000</option>
            <option value="high">&gt; 2000</option>
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
