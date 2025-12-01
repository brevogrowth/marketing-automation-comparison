'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { ModalConfig, TriggerOptions, UseLeadGateReturn } from '../core/types';
import { isLeadCaptured, markLeadCaptured, resetLeadCapture } from '../core/storage';

interface LeadCaptureContextValue extends UseLeadGateReturn {
  config: ModalConfig;
  pendingCallback: TriggerOptions | null;
  unlock: (email: string) => void;
}

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

interface LeadCaptureProviderProps {
  children: ReactNode;
  config?: ModalConfig;
}

export function LeadCaptureContextProvider({ children, config = {} }: LeadCaptureProviderProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<TriggerOptions | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const storageKey = config.storageKey || 'lead_captured';

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsUnlocked(isLeadCaptured(storageKey));
      setIsHydrated(true);
    }
  }, [storageKey]);

  const requireLead = useCallback((options: TriggerOptions) => {
    if (isUnlocked) {
      // Already unlocked, execute immediately
      options.onSuccess();
      return;
    }

    // Store callback and open modal
    setPendingCallback(options);
    setIsModalOpen(true);
  }, [isUnlocked]);

  const closeModal = useCallback(() => {
    // Only allow closing in passive mode
    if (config.mode === 'passive') {
      setIsModalOpen(false);

      // Call onCancel if provided
      if (pendingCallback?.onCancel) {
        pendingCallback.onCancel();
      }

      setPendingCallback(null);
    }
  }, [config.mode, pendingCallback]);

  const unlock = useCallback((email: string) => {
    markLeadCaptured(email, storageKey);
    setIsUnlocked(true);
    setIsModalOpen(false);

    // Execute pending callback
    if (pendingCallback?.onSuccess) {
      pendingCallback.onSuccess();
    }

    setPendingCallback(null);
  }, [storageKey, pendingCallback]);

  const reset = useCallback(() => {
    resetLeadCapture(storageKey);
    setIsUnlocked(false);
  }, [storageKey]);

  const value: LeadCaptureContextValue = {
    isUnlocked,
    isModalOpen,
    requireLead,
    closeModal,
    reset,
    config,
    pendingCallback,
    unlock,
  };

  // Don't render modal until hydrated to avoid hydration mismatch
  if (!isHydrated) {
    return (
      <LeadCaptureContext.Provider value={value}>
        {children}
      </LeadCaptureContext.Provider>
    );
  }

  return (
    <LeadCaptureContext.Provider value={value}>
      {children}
    </LeadCaptureContext.Provider>
  );
}

export function useLeadCaptureContext() {
  const context = useContext(LeadCaptureContext);
  if (!context) {
    throw new Error('useLeadCaptureContext must be used within LeadCaptureProvider');
  }
  return context;
}
