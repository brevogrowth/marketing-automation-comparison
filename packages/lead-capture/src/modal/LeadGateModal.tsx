'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLeadCaptureContext } from './LeadCaptureContext';
import { validateProfessionalEmail } from '../core/validation';
import { submitLead } from '../core/api';
import { getTranslations } from '../core/translations';

export function LeadGateModal() {
  const { isModalOpen, closeModal, unlock, config, pendingCallback } = useLeadCaptureContext();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const t = getTranslations(config.language, config.translations);
  const isPassive = config.mode === 'passive';

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isModalOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isModalOpen || !isPassive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen, isPassive, closeModal]);

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

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const validationError = validateProfessionalEmail(
      email,
      config.blockFreeEmails !== false,
      config.customBlockedDomains,
      { invalidEmailError: t.invalidEmailError, freeEmailError: t.freeEmailError }
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Submit to webhook
      await submitLead(config.apiEndpoint || '/api/lead', {
        email,
        projectId: config.projectId,
        trigger: pendingCallback?.reason,
        context: pendingCallback?.context,
        timestamp: new Date().toISOString(),
        language: config.language || 'en',
      });

      // Success - unlock
      unlock(email);
    } catch {
      setError(t.networkError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={isPassive ? closeModal : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '28rem',
          width: '100%',
          padding: '2rem',
          position: 'relative',
          animation: 'leadModalFadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button (passive mode only) */}
        {isPassive && (
          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#9CA3AF',
              lineHeight: 1,
            }}
            aria-label={t.closeButton}
          >
            x
          </button>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: 'rgba(0, 146, 93, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5V21H19V11Z" stroke="#00925D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 11V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V11" stroke="#00925D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2
            id="lead-modal-title"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '0.5rem',
            }}
          >
            {t.modalTitle}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            {t.modalDescription}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="lead-email"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.25rem',
              }}
            >
              {t.emailLabel}
            </label>
            <input
              ref={inputRef}
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: `1px solid ${error ? '#EF4444' : '#D1D5DB'}`,
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00925D';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 146, 93, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? '#EF4444' : '#D1D5DB';
                e.target.style.boxShadow = 'none';
              }}
            />
            {error && (
              <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem' }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: isLoading ? '#9CA3AF' : '#00925D',
              color: 'white',
              fontWeight: 700,
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#007A4D';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#00925D';
            }}
          >
            {isLoading ? t.loadingButton : t.submitButton}
          </button>

          <p
            style={{
              fontSize: '0.75rem',
              color: '#9CA3AF',
              textAlign: 'center',
              marginTop: '1rem',
            }}
          >
            {t.legalText}
          </p>
        </form>
      </div>

      {/* Keyframe animation (injected once) */}
      <style>{`
        @keyframes leadModalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
