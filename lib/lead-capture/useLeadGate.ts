'use client';

/**
 * Lead Capture Module - useLeadGate Hook
 * Simplified hook for components that need to gate features behind lead capture
 */

import { useLeadCaptureContext } from './LeadCaptureProvider';
import type { TriggerOptions } from './types';

export interface UseLeadGateReturn {
  /** Whether the user has already provided their email */
  isUnlocked: boolean;
  /** Whether the modal is currently open */
  isModalOpen: boolean;
  /** Request lead capture before proceeding with an action */
  requireLead: (options: TriggerOptions) => void;
  /** Close the modal (only works in passive mode) */
  closeModal: () => void;
}

/**
 * Hook to gate features behind lead capture
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { requireLead, isUnlocked } = useLeadGate();
 *
 *   const handleAction = () => {
 *     requireLead({
 *       reason: 'generate_analysis',
 *       context: { industry: 'Fashion' },
 *       onSuccess: () => {
 *         // This runs after lead is captured (or immediately if already unlocked)
 *         startAnalysis();
 *       },
 *       onCancel: () => {
 *         // Optional: runs if user closes modal (passive mode only)
 *       }
 *     });
 *   };
 *
 *   return <button onClick={handleAction}>Generate Analysis</button>;
 * }
 * ```
 */
export function useLeadGate(): UseLeadGateReturn {
  const { isUnlocked, isModalOpen, requireLead, closeModal } = useLeadCaptureContext();

  return {
    isUnlocked,
    isModalOpen,
    requireLead,
    closeModal,
  };
}
