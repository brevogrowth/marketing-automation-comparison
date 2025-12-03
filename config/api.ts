/**
 * API Configuration
 *
 * Centralized configuration for all API endpoints and settings.
 */

export const apiConfig = {
  /** Dust.tt AI analysis configuration */
  dust: {
    /** Base URL for Dust API */
    baseUrl: 'https://dust.tt/api/v1',
    /** Request timeout in milliseconds */
    timeout: 10000,
    /** Polling interval for async results (ms) */
    pollingInterval: 5000,
    /** Maximum number of poll attempts */
    maxPolls: 60,
  },

  /** Lead capture configuration */
  lead: {
    /** API endpoint for lead submission */
    endpoint: '/api/lead',
    /** LocalStorage key for captured leads */
    storageKey: 'brevo_kpi_lead',
    /** Failed leads storage key (for retry) */
    failedLeadsKey: 'lead_capture_failed',
  },

  /** Rate limiting configuration */
  rateLimit: {
    /** Maximum requests per window */
    maxRequests: 10,
    /** Time window in milliseconds */
    windowMs: 60 * 1000, // 1 minute
  },

  /** Analyze endpoint configuration */
  analyze: {
    /** API endpoint for analysis */
    endpoint: '/api/analyze',
    /** Maximum duration for serverless function (ms) */
    maxDuration: 10000,
  },
} as const;

/** Type for the API configuration */
export type ApiConfig = typeof apiConfig;
