'use client';

import React, { ReactNode } from 'react';
import { LeadCaptureContextProvider } from './LeadCaptureContext';
import { LeadGateModal } from './LeadGateModal';
import type { ModalConfig } from '../core/types';

interface Props {
  children: ReactNode;
  config?: ModalConfig;
}

export function LeadCaptureProvider({ children, config }: Props) {
  return (
    <LeadCaptureContextProvider config={config}>
      {children}
      <LeadGateModal />
    </LeadCaptureContextProvider>
  );
}
