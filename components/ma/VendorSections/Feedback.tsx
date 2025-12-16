'use client';

import React from 'react';
import type { Vendor, VendorFeedback } from '@/src/types/ma';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeedbackProps {
  vendor: Vendor;
}

export function Feedback({ vendor }: FeedbackProps) {
  const { t } = useLanguage();
  const ma = t.ma;

  const pros = vendor.feedback.filter((f) => f.type === 'pro');
  const cons = vendor.feedback.filter((f) => f.type === 'con');

  if (vendor.feedback.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No user feedback available yet.
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Pros */}
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-green-800 mb-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          {ma?.vendors?.feedback?.pros || 'What users love'}
        </h4>
        <ul className="space-y-2">
          {pros.slice(0, 5).map((item, idx) => (
            <li key={idx} className="text-sm text-green-700">
              <span className="font-medium">{item.theme}</span>
              {item.description && (
                <p className="text-green-600 text-xs mt-0.5">{item.description}</p>
              )}
            </li>
          ))}
          {pros.length === 0 && (
            <li className="text-sm text-green-600 italic">No pros listed</li>
          )}
        </ul>
      </div>

      {/* Cons */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-800 mb-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {ma?.vendors?.feedback?.cons || 'Common concerns'}
        </h4>
        <ul className="space-y-2">
          {cons.slice(0, 5).map((item, idx) => (
            <li key={idx} className="text-sm text-yellow-700">
              <span className="font-medium">{item.theme}</span>
              {item.description && (
                <p className="text-yellow-600 text-xs mt-0.5">{item.description}</p>
              )}
            </li>
          ))}
          {cons.length === 0 && (
            <li className="text-sm text-yellow-600 italic">No concerns listed</li>
          )}
        </ul>
      </div>

      {/* Source attribution */}
      <p className="md:col-span-2 text-xs text-gray-400 text-right">
        {ma?.vendors?.feedback?.basedOn || 'Based on review themes'}
      </p>
    </div>
  );
}
