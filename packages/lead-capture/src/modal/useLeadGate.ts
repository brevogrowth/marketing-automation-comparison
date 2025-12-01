'use client';

import { useLeadCaptureContext } from './LeadCaptureContext';
import type { UseLeadGateReturn } from '../core/types';

export function useLeadGate(): UseLeadGateReturn {
  const { isUnlocked, isModalOpen, requireLead, closeModal, reset } = useLeadCaptureContext();

  return {
    isUnlocked,
    isModalOpen,
    requireLead,
    closeModal,
    reset,
  };
}
