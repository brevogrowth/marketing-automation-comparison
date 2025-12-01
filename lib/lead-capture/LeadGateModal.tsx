'use client';

/**
 * Lead Capture Module - Modal Component
 * Professional lead capture modal with email validation and i18n
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLeadCaptureContext } from './LeadCaptureProvider';
import { validateLeadEmail } from './validation';
import { submitLead, buildLeadData } from './api';
import type { LeadCaptureTranslations, SupportedLanguage } from './types';

// Import translations
import enTranslations from './translations/en.json';
import frTranslations from './translations/fr.json';
import deTranslations from './translations/de.json';
import esTranslations from './translations/es.json';

const translationsMap: Record<SupportedLanguage, LeadCaptureTranslations> = {
  en: enTranslations,
  fr: frTranslations,
  de: deTranslations,
  es: esTranslations,
};

function getTranslations(language?: string): LeadCaptureTranslations {
  const lang = language?.split('-')[0].toLowerCase() as SupportedLanguage;
  return translationsMap[lang] || translationsMap.en;
}

function detectBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language || 'en';
}

export function LeadGateModal() {
  const {
    isModalOpen,
    currentTrigger,
    closeModal,
    unlock,
    config,
  } = useLeadCaptureContext();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get translations
  const language = config.language || detectBrowserLanguage();
  const baseTranslations = getTranslations(language);
  const t: LeadCaptureTranslations = useMemo(() => ({
    ...baseTranslations,
    ...config.translations,
  }), [baseTranslations, config.translations]);

  const isPassiveMode = config.mode === 'passive';
  const blockFreeEmails = config.blockFreeEmails !== false;

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      // Small delay to ensure animation starts first
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  // Handle escape key (only in passive mode)
  useEffect(() => {
    if (!isModalOpen || !isPassiveMode) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen, isPassiveMode, closeModal]);

  // Trap focus within modal
  useEffect(() => {
    if (!isModalOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    const validation = validateLeadEmail(
      email,
      blockFreeEmails,
      config.customBlockedDomains
    );

    if (!validation.isValid) {
      if (validation.error === 'free') {
        setError(t.freeEmailError);
      } else {
        setError(t.invalidEmailError);
      }
      return;
    }

    setIsLoading(true);

    try {
      // Build and submit lead data
      const leadData = buildLeadData(
        email,
        currentTrigger?.reason || 'unknown',
        currentTrigger?.context
      );

      await submitLead(config.apiEndpoint, leadData);

      // Show success briefly
      setShowSuccess(true);
      setTimeout(() => {
        unlock();
        setEmail('');
        setShowSuccess(false);
      }, 1000);
    } catch {
      setError(t.networkError);
    } finally {
      setIsLoading(false);
    }
  }, [email, blockFreeEmails, config, t, currentTrigger, unlock]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  }, [error]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (isPassiveMode && e.target === e.currentTarget) {
      closeModal();
    }
  }, [isPassiveMode, closeModal]);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl animate-scaleIn"
      >
        {/* Close button (passive mode only) */}
        {isPassiveMode && (
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-brevo-green/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-brevo-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Title & Description */}
          <h2
            id="lead-modal-title"
            className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2"
          >
            {t.title}
          </h2>
          <p className="text-gray-600 text-center mb-6 text-sm sm:text-base">
            {t.description}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="lead-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.emailLabel}
              </label>
              <input
                ref={inputRef}
                id="lead-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder={t.emailPlaceholder}
                disabled={isLoading || showSuccess}
                className={`
                  w-full px-4 py-3 rounded-lg border transition-all duration-200
                  ${error
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-brevo-green focus:border-brevo-green'
                  }
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  disabled:bg-gray-50 disabled:cursor-not-allowed
                `}
                aria-invalid={!!error}
                aria-describedby={error ? 'lead-email-error' : undefined}
              />
              {error && (
                <p
                  id="lead-email-error"
                  className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  role="alert"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || showSuccess || !email.trim()}
              className={`
                w-full py-3 px-4 rounded-lg font-semibold text-white
                transition-all duration-200 flex items-center justify-center gap-2
                ${showSuccess
                  ? 'bg-green-500'
                  : 'bg-brevo-green hover:bg-brevo-dark-green'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-brevo-green focus:ring-offset-2
              `}
            >
              {showSuccess ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t.successMessage}
                </>
              ) : isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t.loadingButton}
                </>
              ) : (
                t.submitButton
              )}
            </button>
          </form>

          {/* Legal text */}
          <p className="mt-4 text-xs text-gray-500 text-center leading-relaxed">
            {t.legalText}
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
