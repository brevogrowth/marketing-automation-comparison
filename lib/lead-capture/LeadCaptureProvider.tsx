'use client';

/**
 * Lead Capture Module - Context Provider
 * Manages lead capture state and provides context to child components
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { LeadCaptureConfig, LeadCaptureContextValue, TriggerOptions } from './types';
import { LeadGateModal } from './LeadGateModal';

const DEFAULT_STORAGE_KEY = 'lead_captured';

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

interface LeadCaptureProviderProps {
  children: React.ReactNode;
  config: LeadCaptureConfig;
}

export function LeadCaptureProvider({ children, config }: LeadCaptureProviderProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState<TriggerOptions | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const storageKey = config.storageKey || DEFAULT_STORAGE_KEY;

  // Check localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'true') {
        setIsUnlocked(true);
      }
      setIsHydrated(true);
    }
  }, [storageKey]);

  const requireLead = useCallback((options: TriggerOptions) => {
    // If already unlocked, call success immediately
    if (isUnlocked) {
      options.onSuccess();
      return;
    }

    // Store the trigger options and open modal
    setCurrentTrigger(options);
    setIsModalOpen(true);
  }, [isUnlocked]);

  const closeModal = useCallback(() => {
    // Only allow closing in passive mode
    if (config.mode === 'passive') {
      setIsModalOpen(false);
      if (currentTrigger?.onCancel) {
        currentTrigger.onCancel();
      }
      setCurrentTrigger(null);
    }
  }, [config.mode, currentTrigger]);

  const unlock = useCallback(() => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'true');
    }

    setIsUnlocked(true);
    setIsModalOpen(false);

    // Call the pending success callback
    if (currentTrigger?.onSuccess) {
      currentTrigger.onSuccess();
    }

    setCurrentTrigger(null);
  }, [storageKey, currentTrigger]);

  const contextValue = useMemo<LeadCaptureContextValue>(() => ({
    isUnlocked,
    isModalOpen,
    currentTrigger,
    requireLead,
    closeModal,
    unlock,
    config,
  }), [isUnlocked, isModalOpen, currentTrigger, requireLead, closeModal, unlock, config]);

  // Don't render modal until hydrated to avoid hydration mismatch
  if (!isHydrated) {
    return (
      <LeadCaptureContext.Provider value={contextValue}>
        {children}
      </LeadCaptureContext.Provider>
    );
  }

  return (
    <LeadCaptureContext.Provider value={contextValue}>
      {children}
      <LeadGateModal />
    </LeadCaptureContext.Provider>
  );
}

/**
 * Hook to access lead capture context
 * @throws Error if used outside LeadCaptureProvider
 */
export function useLeadCaptureContext(): LeadCaptureContextValue {
  const context = useContext(LeadCaptureContext);

  if (!context) {
    throw new Error('useLeadCaptureContext must be used within a LeadCaptureProvider');
  }

  return context;
}
