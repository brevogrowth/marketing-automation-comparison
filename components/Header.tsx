import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-brevo-green">Brevo</h1>
            <span className="ml-4 text-gray-600">Marketing KPI Benchmark</span>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            Share
          </button>
        </div>
      </div>
    </header>
  );
};
