'use client';

import { useState, useCallback, useRef } from 'react';
import { apiConfig } from '@/config/api';

interface AnalysisState {
  isLoading: boolean;
  analysis: string;
  error: string | null;
  logs: string[];
}

interface AnalysisParams {
  userValues: Record<string, string>;
  selectedKpis: string[];
  industry: string;
  priceTier: string;
  language: string;
}

interface UseAnalysisReturn extends AnalysisState {
  runAnalysis: (params: AnalysisParams) => Promise<void>;
  reset: () => void;
  analysisRef: React.RefObject<HTMLDivElement | null>;
}

const initialState: AnalysisState = {
  isLoading: false,
  analysis: '',
  error: null,
  logs: [],
};

/**
 * Custom hook for managing AI analysis state and API calls.
 *
 * Usage:
 * ```tsx
 * const { isLoading, analysis, error, logs, runAnalysis, reset, analysisRef } = useAnalysis();
 *
 * const handleAnalyze = () => {
 *   runAnalysis({ userValues, selectedKpis, industry, priceTier, language });
 * };
 * ```
 */
export function useAnalysis(): UseAnalysisReturn {
  const [state, setState] = useState<AnalysisState>(initialState);
  const analysisRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, message],
    }));
  }, []);

  const updateLastLog = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs.slice(0, -1), message],
    }));
  }, []);

  const runAnalysis = useCallback(async (params: AnalysisParams) => {
    const { userValues, selectedKpis, industry, priceTier, language } = params;

    // Reset and start loading
    setState({
      isLoading: true,
      analysis: '',
      error: null,
      logs: [],
    });

    // Scroll to analysis section
    setTimeout(() => {
      analysisRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Filter values to only include selected KPIs
    const selectedValues = Object.fromEntries(
      Object.entries(userValues).filter(([key]) => selectedKpis.includes(key))
    );

    try {
      // Step 1: Create the analysis job
      addLog('Starting analysis...');

      const createResponse = await fetch(apiConfig.analyze.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userValues: selectedValues,
          priceTier,
          industry,
          language,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || `HTTP ${createResponse.status}: ${createResponse.statusText}`);
      }

      const { conversationId, status: createStatus } = await createResponse.json();

      if (createStatus !== 'created' || !conversationId) {
        throw new Error('Failed to create analysis job');
      }

      addLog(`Job created (ID: ${conversationId.slice(0, 8)}...)`);
      addLog('Waiting for AI agent to process...');

      // Step 2: Poll for results
      const { maxPolls, pollingInterval } = apiConfig.dust;
      const startTime = Date.now();

      for (let i = 0; i < maxPolls; i++) {
        await new Promise(resolve => setTimeout(resolve, pollingInterval));

        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        updateLastLog(`Polling... (${elapsed}s elapsed)`);

        const pollResponse = await fetch(`${apiConfig.analyze.endpoint}/${conversationId}`);

        if (!pollResponse.ok) {
          const errorData = await pollResponse.json();
          throw new Error(errorData.error || `Polling failed: ${pollResponse.status}`);
        }

        const pollData = await pollResponse.json();

        if (pollData.status === 'complete') {
          addLog('Analysis complete!');
          setState(prev => ({
            ...prev,
            isLoading: false,
            analysis: pollData.analysis,
          }));
          return;
        }

        if (pollData.status === 'error') {
          throw new Error(pollData.error || 'Analysis failed');
        }

        // Still pending - update log with status message
        if (pollData.message) {
          updateLastLog(`${pollData.message} (${elapsed}s)`);
        }
      }

      // Timeout after max polls
      throw new Error('Analysis timed out after 5 minutes. Please try again.');

    } catch (err: unknown) {
      console.error('Error during analysis:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'An unexpected error occurred',
      }));
    }
  }, [addLog, updateLastLog]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    runAnalysis,
    reset,
    analysisRef,
  };
}
