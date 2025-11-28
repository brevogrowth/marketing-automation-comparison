'use client';

import React, { Suspense } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';

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
    <Suspense fallback={<ProvidersFallback />}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </Suspense>
  );
}
