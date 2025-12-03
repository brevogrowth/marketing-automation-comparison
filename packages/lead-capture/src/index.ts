// ============================================
// MODAL MODE (Gate contextuel)
// ============================================
export { LeadCaptureProvider } from './modal/LeadCaptureProvider';
export { LeadGateModal } from './modal/LeadGateModal';
export { useLeadGate } from './modal/useLeadGate';

// ============================================
// FORM MODE (Formulaire inline)
// ============================================
export { LeadCaptureForm } from './form/LeadCaptureForm';
export { useLeadForm } from './form/useLeadForm';

// ============================================
// CORE UTILITIES
// ============================================
export { isValidEmail, isFreeEmail, validateProfessionalEmail, getEmailDomain, DEFAULT_FREE_EMAIL_DOMAINS } from './core/validation';
export { submitLead, retryFailedLeads } from './core/api';
export { isLeadCaptured, markLeadCaptured, getCapturedLead, resetLeadCapture } from './core/storage';
export { getTranslations, translations } from './core/translations';

// ============================================
// TYPES
// ============================================
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
} from './core/types';
