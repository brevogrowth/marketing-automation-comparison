'use client';

import { useState, useCallback } from 'react';
import { submitLead } from '../core/api';
import { markLeadCaptured } from '../core/storage';
import type { UseLeadFormReturn, LeadCaptureConfig } from '../core/types';

export function useLeadForm(config: LeadCaptureConfig = {}): UseLeadFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = useCallback(async (
    email: string,
    customFields?: Record<string, string>
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await submitLead(config.apiEndpoint || '/api/lead', {
        email,
        projectId: config.projectId,
        customFields,
        timestamp: new Date().toISOString(),
        language: config.language || 'en',
      });

      // Mark as captured in localStorage
      markLeadCaptured(email, config.storageKey);

      setIsSuccess(true);
    } catch (err) {
      setError(String(err));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [config.apiEndpoint, config.projectId, config.storageKey, config.language]);

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
  }, []);

  return {
    submit,
    isSubmitting,
    error,
    isSuccess,
    reset,
  };
}
