/**
 * Lead Capture Module - API Client
 * Handles lead submission to the backend
 */

import type { LeadData } from './types';

/** Timeout for API requests (5 seconds) */
const API_TIMEOUT = 5000;

/**
 * Submit lead data to the API endpoint
 * Uses fail-open pattern: resolves even on network errors
 *
 * @param endpoint - API endpoint URL
 * @param data - Lead data to submit
 * @throws Error only on explicit rejection from server (4xx responses)
 */
export async function submitLead(endpoint: string, data: LeadData): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Only throw on client errors (4xx) - server errors (5xx) are fail-open
    if (response.status >= 400 && response.status < 500) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Invalid request');
    }

    // Success or server error - both are acceptable (fail-open)
  } catch (error) {
    clearTimeout(timeoutId);

    // Re-throw client errors
    if (error instanceof Error && error.message !== 'Invalid request') {
      // Network errors, timeouts, etc. - fail-open, don't throw
      if (error.name === 'AbortError') {
        console.warn('[LeadCapture] Request timed out - proceeding anyway');
        return;
      }
      console.warn('[LeadCapture] Network error - proceeding anyway:', error.message);
      return;
    }

    // Re-throw validation/client errors
    throw error;
  }
}

/**
 * Build lead data object from form input and context
 */
export function buildLeadData(
  email: string,
  trigger: string,
  context?: Record<string, string>
): LeadData {
  return {
    email: email.trim().toLowerCase(),
    timestamp: new Date().toISOString(),
    language: detectLanguage(),
    source: {
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      trigger,
      industry: context?.industry,
      priceTier: context?.priceTier,
    },
    metadata: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    },
  };
}

/**
 * Detect user's language from browser
 */
function detectLanguage(): string {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const lang = navigator.language || 'en';
  // Return just the language code (e.g., 'fr' from 'fr-FR')
  return lang.split('-')[0].toLowerCase();
}
