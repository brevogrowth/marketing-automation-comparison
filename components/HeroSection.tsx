import React from 'react';
import { Card } from './Card';

export const HeroSection: React.FC = () => {
  return (
    <Card className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brevo-light text-brevo-dark text-sm font-medium mb-4">
            E-commerce • Fashion & Accessories • Europe
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How your industry performs on key marketing KPIs
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            In online fashion, performance is primarily driven by site conversion and the
            ability to bring customers back at least 2 to 3 times per year.
          </p>
        </div>

        <div className="lg:w-80 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Profile</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average basket:</span>
              <span className="font-semibold text-gray-900">€65</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Purchase frequency:</span>
              <span className="font-semibold text-gray-900">2.1 / year</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated annual revenue:</span>
              <span className="font-semibold text-gray-900">€8–12M</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Business model:</span>
              <p className="font-medium text-gray-900 mt-1">Small baskets, frequent purchases</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
