/**
 * Lead Capture Module
 * Reusable lead capture system for Next.js applications
 *
 * @example
 * ```tsx
 * // In your layout.tsx
 * import { LeadCaptureProvider } from '@/lib/lead-capture';
 *
 * export default function Layout({ children }) {
 *   return (
 *     <LeadCaptureProvider config={{
 *       apiEndpoint: '/api/lead',
 *       blockFreeEmails: true,
 *     }}>
 *       {children}
 *     </LeadCaptureProvider>
 *   );
 * }
 *
 * // In your component
 * import { useLeadGate } from '@/lib/lead-capture';
 *
 * function MyComponent() {
 *   const { requireLead } = useLeadGate();
 *
 *   const handleAction = () => {
 *     requireLead({
 *       reason: 'feature_access',
 *       onSuccess: () => doSomething(),
 *     });
 *   };
 *
 *   return <button onClick={handleAction}>Access Feature</button>;
 * }
 * ```
 */

// Core exports
export { LeadCaptureProvider, useLeadCaptureContext } from './LeadCaptureProvider';
export { useLeadGate } from './useLeadGate';
export { LeadGateModal } from './LeadGateModal';

// Utilities
export { submitLead, buildLeadData } from './api';
export {
  isValidEmail,
  isFreeEmail,
  validateLeadEmail,
  getEmailDomain,
} from './validation';

// Types
export type {
  LeadCaptureConfig,
  LeadCaptureTranslations,
  LeadData,
  TriggerOptions,
  LeadCaptureContextValue,
  SupportedLanguage,
} from './types';
