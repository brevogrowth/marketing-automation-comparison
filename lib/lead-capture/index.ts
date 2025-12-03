/**
 * Lead Capture Module
 * Re-exports from the @brevo/lead-capture package (packages/lead-capture)
 *
 * This file provides backwards compatibility with existing imports.
 * For new code, import directly from the package once published to npm.
 */

// Re-export everything from the package source
// Modal Mode
export { LeadCaptureProvider } from '../../packages/lead-capture/src/modal/LeadCaptureProvider';
export { LeadGateModal } from '../../packages/lead-capture/src/modal/LeadGateModal';
export { useLeadGate } from '../../packages/lead-capture/src/modal/useLeadGate';

// Form Mode
export { LeadCaptureForm } from '../../packages/lead-capture/src/form/LeadCaptureForm';
export { useLeadForm } from '../../packages/lead-capture/src/form/useLeadForm';

// Core Utilities
export {
  isValidEmail,
  isFreeEmail,
  validateProfessionalEmail,
  getEmailDomain,
  DEFAULT_FREE_EMAIL_DOMAINS,
} from '../../packages/lead-capture/src/core/validation';
export { submitLead, retryFailedLeads } from '../../packages/lead-capture/src/core/api';
export {
  isLeadCaptured,
  markLeadCaptured,
  getCapturedLead,
  resetLeadCapture,
} from '../../packages/lead-capture/src/core/storage';
export { getTranslations, translations } from '../../packages/lead-capture/src/core/translations';

// Re-export types
export type {
  ThemeConfig,
  LeadCaptureConfig,
  ModalConfig,
  TriggerOptions,
  UseLeadGateReturn,
  CustomField,
  LeadCaptureFormProps,
  UseLeadFormReturn,
  LeadData,
  LeadFormData,
  LeadCaptureTranslations,
} from '../../packages/lead-capture/src/core/types';
