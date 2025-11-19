import React from 'react';
import { Card } from './Card';

interface KpiCardV3Props {
  title: string;
  value: string;
  benchmark: string;
  position: 'below' | 'inline' | 'above';
  whatThisMeans: string;
  whyItMatters: string;
  lowDrivers: string[];
  highDrivers: string[];
}

export const KpiCardV3: React.FC<KpiCardV3Props> = ({
  title,
  value,
  benchmark,
  position,
  whatThisMeans,
  whyItMatters,
  lowDrivers,
  highDrivers,
}) => {
  const positionConfig = {
    below: {
      label: 'Below Benchmark',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-700',
      icon: '↓',
    },
    inline: {
      label: 'In Line with Benchmark',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-700',
      icon: '→',
    },
    above: {
      label: 'Above Benchmark',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-700',
      icon: '↑',
    },
  };

  const config = positionConfig[position];

  return (
    <Card className="h-full">
      {/* Header with position indicator */}
      <div className="mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 ${config.bgColor} border ${config.borderColor}`}>
          <span className="text-xl">{config.icon}</span>
          <span className={`text-xs font-semibold ${config.textColor}`}>
            {config.label}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm text-gray-600">Your position:</span>
          <span className="text-xl font-bold text-brevo-green">{value}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-gray-600">Benchmark:</span>
          <span className="text-sm font-semibold text-gray-700">{benchmark}</span>
        </div>
      </div>

      {/* What this means / Why it matters */}
      <div className="mb-4 space-y-2">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
          <p className="text-xs font-semibold text-blue-900 mb-1">What this means:</p>
          <p className="text-xs text-blue-800">{whatThisMeans}</p>
        </div>
        <div className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded">
          <p className="text-xs font-semibold text-purple-900 mb-1">Why it matters:</p>
          <p className="text-xs text-purple-800">{whyItMatters}</p>
        </div>
      </div>

      {/* Side-by-side Low and High Drivers */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-red-50 border-l-4 border-red-400 p-2 rounded">
          <p className="text-xs font-semibold text-red-800 mb-1">Low $$ Drivers</p>
          <ul className="space-y-1">
            {lowDrivers.map((driver, idx) => (
              <li key={idx} className="text-xs text-red-600">
                • {driver}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-2 rounded">
          <p className="text-xs font-semibold text-green-800 mb-1">High $$ Drivers</p>
          <ul className="space-y-1">
            {highDrivers.map((driver, idx) => (
              <li key={idx} className="text-xs text-green-600">
                • {driver}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
