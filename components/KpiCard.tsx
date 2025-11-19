import React from 'react';
import { Card } from './Card';

interface KpiCardProps {
  title: string;
  value: string;
  threshold: string;
  lowRange: string;
  highRange: string;
  lowExamples: string[];
  highExamples: string[];
  badExamples?: string[];
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  threshold,
  lowRange,
  highRange,
  lowExamples,
  highExamples,
  badExamples,
}) => {
  return (
    <Card className="h-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-gray-600">Target:</span>
          <span className="text-2xl font-bold text-brevo-green">{value}</span>
        </div>
      </div>

      {/* Side-by-side Low and High sections */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Low $$ Drivers */}
        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
          <p className="text-sm font-semibold text-red-800 mb-2">
            &#60; Low $$ Drivers
          </p>
          <ul className="space-y-1">
            {lowExamples.map((example, idx) => (
              <li key={idx} className="text-xs text-red-600">
                • {example}
              </li>
            ))}
          </ul>
        </div>

        {/* High $$ Drivers */}
        <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
          <p className="text-sm font-semibold text-green-800 mb-2">
            &#62; High $$ Drivers
          </p>
          <ul className="space-y-1">
            {highExamples.map((example, idx) => (
              <li key={idx} className="text-xs text-green-600">
                • {example}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bad Examples section (if provided) */}
      {badExamples && badExamples.length > 0 && (
        <div className="bg-gray-50 border-l-4 border-gray-400 p-3 rounded">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            ⚠ Bad Examples
          </p>
          <ul className="space-y-1">
            {badExamples.map((example, idx) => (
              <li key={idx} className="text-xs text-gray-600">
                • {example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
