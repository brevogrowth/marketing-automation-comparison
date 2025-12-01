'use client';

import React, { useState, useCallback } from 'react';
import { validateProfessionalEmail } from '../core/validation';
import { submitLead } from '../core/api';
import { markLeadCaptured } from '../core/storage';
import { getTranslations } from '../core/translations';
import type { LeadCaptureFormProps, CustomField } from '../core/types';

export function LeadCaptureForm({
  apiEndpoint = '/api/lead',
  storageKey = 'lead_captured',
  projectId,
  blockFreeEmails = true,
  customBlockedDomains = [],
  language,
  translations: translationOverrides,
  customFields = [],
  onSubmit,
  onSuccess,
  onError,
  submitLabel,
  loadingLabel,
  layout = 'stacked',
  className = '',
  classNames = {},
  showLegalText = true,
}: LeadCaptureFormProps) {
  const t = getTranslations(language, translationOverrides);

  const [email, setEmail] = useState('');
  const [fields, setFields] = useState<Record<string, string>>(() => {
    // Initialize with default values
    const initial: Record<string, string> = {};
    customFields.forEach((field) => {
      if (field.defaultValue) {
        initial[field.name] = field.defaultValue;
      }
    });
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailError = validateProfessionalEmail(
      email,
      blockFreeEmails,
      customBlockedDomains,
      { invalidEmailError: t.invalidEmailError, freeEmailError: t.freeEmailError }
    );
    if (emailError) {
      newErrors.email = emailError;
    }

    // Custom fields validation
    customFields.forEach((field) => {
      const value = fields[field.name] || '';

      if (field.required && !value.trim()) {
        newErrors[field.name] = t.requiredFieldError;
      } else if (field.validation) {
        const fieldError = field.validation(value);
        if (fieldError) {
          newErrors[field.name] = fieldError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, fields, customFields, blockFreeEmails, customBlockedDomains, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const data = {
        email,
        customFields: fields,
        timestamp: new Date().toISOString(),
        language: language || (typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en'),
      };

      // Submit to webhook
      await submitLead(apiEndpoint, {
        email,
        projectId,
        customFields: fields,
        timestamp: data.timestamp,
        language: data.language,
      });

      // Mark as captured
      markLeadCaptured(email, storageKey);

      // Custom onSubmit callback
      if (onSubmit) {
        await onSubmit(data);
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (err) {
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (name: string, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const renderField = (field: CustomField) => {
    const value = fields[field.name] || '';
    const hasError = !!errors[field.name];

    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: `1px solid ${hasError ? '#EF4444' : '#D1D5DB'}`,
      fontSize: '1rem',
      outline: 'none',
      boxSizing: 'border-box',
    };

    if (field.type === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          style={inputStyle}
          className={classNames.select}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
          className={classNames.textarea}
        />
      );
    }

    return (
      <input
        type={field.type}
        value={value}
        onChange={(e) => handleFieldChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        style={inputStyle}
        className={classNames.input}
      />
    );
  };

  // Success state
  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
            <circle cx="12" cy="12" r="10" stroke="#059669" strokeWidth="2"/>
            <path d="M8 12L11 15L16 9" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p style={{ color: '#059669', fontWeight: 600 }}>{t.successMessage}</p>
      </div>
    );
  }

  const formStyle: React.CSSProperties = {
    display: layout === 'inline' ? 'flex' : 'block',
    gap: layout === 'inline' ? '0.5rem' : undefined,
    alignItems: layout === 'inline' ? 'flex-end' : undefined,
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: layout === 'stacked' ? '1rem' : 0,
    flex: layout === 'inline' ? 1 : undefined,
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle} className={`${className} ${classNames.form || ''}`}>
      {/* Email field */}
      <div style={fieldStyle} className={classNames.field}>
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '0.25rem',
          }}
          className={classNames.label}
        >
          {t.emailLabel}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors((prev) => {
                const next = { ...prev };
                delete next.email;
                return next;
              });
            }
          }}
          placeholder={t.emailPlaceholder}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: `1px solid ${errors.email ? '#EF4444' : '#D1D5DB'}`,
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          className={classNames.input}
        />
        {errors.email && (
          <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem' }} className={classNames.error}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Custom fields */}
      {customFields.map((field) => (
        <div key={field.name} style={fieldStyle} className={classNames.field}>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '0.25rem',
            }}
            className={classNames.label}
          >
            {field.label}
            {field.required && <span style={{ color: '#EF4444' }}> *</span>}
          </label>
          {renderField(field)}
          {errors[field.name] && (
            <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem' }} className={classNames.error}>
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: isLoading ? '#9CA3AF' : '#00925D',
          color: 'white',
          fontWeight: 700,
          borderRadius: '0.5rem',
          border: 'none',
          fontSize: '1rem',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          width: layout === 'stacked' ? '100%' : 'auto',
          whiteSpace: 'nowrap',
        }}
        className={classNames.button}
      >
        {isLoading ? (loadingLabel || t.loadingButton) : (submitLabel || t.submitButton)}
      </button>

      {/* Legal text */}
      {showLegalText && layout === 'stacked' && (
        <p
          style={{
            fontSize: '0.75rem',
            color: '#9CA3AF',
            textAlign: 'center',
            marginTop: '1rem',
          }}
          className={classNames.legalText}
        >
          {t.legalText}
        </p>
      )}
    </form>
  );
}
