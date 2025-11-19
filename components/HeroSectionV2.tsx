import React from 'react';
import { Card } from './Card';

export const HeroSectionV2: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        Marketing Budget Benchmark
      </h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Compare your marketing spend, profitability benchmarks, and team structure
      </p>
    </div>
  );
};
