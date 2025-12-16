'use client';

import React, { Suspense } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LeadCaptureProvider } from '@/lib/lead-capture';
import { ErrorBoundary } from './ErrorBoundary';

interface ProvidersProps {
  children: React.ReactNode;
}

function ProvidersFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-brevo-green border-t-transparent"></div>
    </div>
  );
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ProvidersFallback />}>
        <LanguageProvider>
          <LeadCaptureProvider
            config={{
              apiEndpoint: '/api/lead',
              storageKey: 'brevo_ma_comparison_lead',
              mode: 'blocking',
              blockFreeEmails: true,
            }}
          >
            {children}
          </LeadCaptureProvider>
        </LanguageProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
