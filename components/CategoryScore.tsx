import React from 'react';

interface CategoryScoreProps {
  title: string;
  subtitle: string;
  score: 'strong' | 'moderate' | 'weak';
  focusMessage: string;
}

export const CategoryScore: React.FC<CategoryScoreProps> = ({
  title,
  subtitle,
  score,
  focusMessage,
}) => {
  const scoreConfig = {
    strong: {
      label: 'Strong',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-500',
    },
    moderate: {
      label: 'Moderate',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-500',
    },
    weak: {
      label: 'Needs Attention',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-500',
    },
  };

  const config = scoreConfig[score];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className={`px-4 py-2 rounded-full border-2 ${config.borderColor} ${config.bgColor}`}>
          <span className={`font-bold text-sm ${config.textColor}`}>
            {config.label}
          </span>
        </div>
      </div>

      {focusMessage && (
        <div className="bg-brevo-light border-l-4 border-brevo-green p-3 rounded mb-4">
          <p className="text-sm font-medium text-brevo-dark">
            💡 What to focus on here: {focusMessage}
          </p>
        </div>
      )}
    </div>
  );
};
