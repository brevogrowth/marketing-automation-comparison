import React from 'react';
import { Card } from './Card';

export const CompanyProfileCard: React.FC = () => {
  return (
    <Card className="mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🏢</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">TechFlow Solutions</h3>
          <p className="text-gray-600 text-sm mb-4">
            TechFlow Solutions is a rapidly growing B2B SaaS company that provides workflow automation and business
            intelligence tools for mid-market enterprises. Founded in 2019, the company secured a Series A funding and
            is leader in the CRM/Marketing and Sales productivity software market.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Industry</p>
              <p className="font-semibold text-gray-900">B2B SaaS Platform</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Company Size</p>
              <p className="font-semibold text-gray-900">50-200 employees</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold text-gray-900">Berlin, Germany</p>
            </div>
          </div>
        </div>
        <button className="px-4 py-2 bg-brevo-green text-white text-sm font-medium rounded hover:bg-brevo-dark transition-colors">
          Compare Similar
        </button>
      </div>
    </Card>
  );
};
