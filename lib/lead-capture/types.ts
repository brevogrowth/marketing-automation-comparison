/**
 * Lead Capture Module - Type Definitions
 * Reusable lead capture system for Next.js applications
 */

export interface LeadCaptureConfig {
  /** API endpoint for lead submission */
  apiEndpoint: string;
  /** localStorage key for tracking captured leads */
  storageKey?: string; // default: 'lead_captured'
  /** Modal behavior mode */
  mode?: 'blocking' | 'passive'; // default: 'blocking'
  /** Block free email providers (gmail, yahoo, etc.) */
  blockFreeEmails?: boolean; // default: true
  /** Additional domains to block beyond the default list */
  customBlockedDomains?: string[];
  /** Override default translations */
  translations?: Partial<LeadCaptureTranslations>;
  /** Language override (defaults to navigator.language) */
  language?: string;
}

export interface LeadCaptureTranslations {
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitButton: string;
  loadingButton: string;
  freeEmailError: string;
  invalidEmailError: string;
  networkError: string;
  successMessage: string;
  legalText: string;
}

export interface LeadData {
  email: string;
  timestamp: string;
  language: string;
  source: {
    page: string;
    trigger: string;
    industry?: string;
    priceTier?: string;
  };
  metadata: {
    userAgent: string;
    referrer: string;
  };
}

export interface TriggerOptions {
  /** Reason for triggering the lead capture (for analytics) */
  reason: string;
  /** Additional context data to include */
  context?: Record<string, string>;
  /** Callback executed after successful lead capture */
  onSuccess: () => void;
  /** Callback executed if user cancels (only in passive mode) */
  onCancel?: () => void;
}

export interface LeadCaptureContextValue {
  /** Whether the user has already provided their email */
  isUnlocked: boolean;
  /** Whether the modal is currently open */
  isModalOpen: boolean;
  /** Current trigger options (for modal to access callbacks) */
  currentTrigger: TriggerOptions | null;
  /** Request lead capture before proceeding */
  requireLead: (options: TriggerOptions) => void;
  /** Close the modal (only works in passive mode) */
  closeModal: () => void;
  /** Mark as unlocked and call pending callback */
  unlock: () => void;
  /** Configuration */
  config: LeadCaptureConfig;
}

export type SupportedLanguage = 'en' | 'fr' | 'de' | 'es';
