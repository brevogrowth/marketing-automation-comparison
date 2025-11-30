'use client';

import React, { memo, useCallback } from 'react';
import { Industry, PriceTier } from '@/data/benchmarks';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarInputsProps {
  industry: Industry;
  setIndustry: (i: Industry) => void;
  priceTier: PriceTier;
  setPriceTier: (p: PriceTier) => void;
  isComparing: boolean;
  setIsComparing: (b: boolean) => void;
}

const SidebarInputsComponent = ({
  industry,
  setIndustry,
  priceTier,
  setPriceTier,
  isComparing,
  setIsComparing
}: SidebarInputsProps) => {
  const { t } = useLanguage();

  const handleIndustryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setIndustry(e.target.value as Industry);
  }, [setIndustry]);

  const handlePriceTierChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriceTier(e.target.value as PriceTier);
  }, [setPriceTier]);

  const handleCompareToggle = useCallback(() => {
    setIsComparing(!isComparing);
  }, [setIsComparing, isComparing]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">{t.sidebar.step1Title}</h2>
        <p className="text-sm text-gray-500 mb-6">
          {t.sidebar.step1Desc}
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.sidebar.industryLabel}
            </label>
            <select
              value={industry}
              onChange={handleIndustryChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-brevo-green focus:ring-brevo-green sm:text-sm p-2 border"
            >
              <optgroup label={t.industries.b2cRetail}>
                <option value="Fashion">{t.industries.Fashion}</option>
                <option value="Home">{t.industries.Home}</option>
                <option value="Beauty">{t.industries.Beauty}</option>
                <option value="Electronics">{t.industries.Electronics}</option>
                <option value="Sports">{t.industries.Sports}</option>
                <option value="Family">{t.industries.Family}</option>
                <option value="Food">{t.industries.Food}</option>
                <option value="Luxury">{t.industries.Luxury}</option>
              </optgroup>
              <optgroup label={t.industries.b2b}>
                <option value="SaaS">{t.industries.SaaS}</option>
                <option value="Services">{t.industries.Services}</option>
                <option value="Manufacturing">{t.industries.Manufacturing}</option>
                <option value="Wholesale">{t.industries.Wholesale}</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.sidebar.priceTierLabel}
            </label>
            <select
              value={priceTier}
              onChange={handlePriceTierChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-brevo-green focus:ring-brevo-green sm:text-sm p-2 border"
            >
              <option value="Budget">{t.priceTiers.Budget}</option>
              <option value="Mid-Range">{t.priceTiers['Mid-Range']}</option>
              <option value="Luxury">{t.priceTiers.Luxury}</option>
            </select>
          </div>
        </div>
      </div>

      <hr className="border-gray-100 mb-8" />

      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">{t.sidebar.step2Title}</h2>
        <p className="text-sm text-gray-500 mb-6">
          {t.sidebar.step2Desc}
        </p>

        <button
          onClick={handleCompareToggle}
          className={`w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${isComparing
            ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'bg-brevo-green border-transparent text-white hover:bg-brevo-dark-green shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
        >
          {isComparing ? t.sidebar.doneComparing : t.sidebar.enterKpis}
        </button>
      </div>

      {isComparing && (
        <div className="mt-auto bg-brevo-light p-4 rounded-lg border border-brevo-green/20">
          <h4 className="text-sm font-bold text-brevo-dark-green mb-1">{t.sidebar.readyTitle}</h4>
          <p className="text-xs text-brevo-dark-green/80">
            {t.sidebar.readyDesc}
          </p>
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const SidebarInputs = memo(SidebarInputsComponent);
