'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, X, Sparkles, RefreshCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoadingStateProps {
  message?: string;
  onCancel?: () => void;
  onRetryConnection?: () => void;
  companyDomain?: string;
  progress?: number;
  pollCount?: number;
  elapsedTimeOverride?: number;
  initialStartTime?: number;
  isPaused?: boolean;
}

// Marketing jokes to show during loading
const marketingJokes = [
  "Why did the marketer break up with the calendar? Too many dates!",
  "A/B testing is like asking your mom and dad which outfit looks better...",
  "The best time to send an email is... always.",
  "I told my boss I needed a break. He said, 'Go check your conversion rates.'",
  "Why don't marketers ever get lost? They always follow the funnel!",
  "Marketing meetings: where good ideas go to become \"action items.\"",
  "The only thing that grows faster than my to-do list is my email list.",
  "ROI: Return On Insomnia",
  "I don't always test my emails, but when I do, it's in production.",
  "Content is king, but distribution is the kingdom.",
];

export function LoadingState({
  message,
  onCancel,
  onRetryConnection,
  companyDomain,
  progress = 5,
  pollCount = 0,
  elapsedTimeOverride,
  initialStartTime,
  isPaused = false
}: LoadingStateProps) {
  const [currentJokeIndex, setCurrentJokeIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(elapsedTimeOverride || 0);
  const [progressValue, setProgressValue] = useState(progress);
  const { t } = useLanguage();

  // Track timer state with refs
  const startTimeRef = useRef<number>(initialStartTime || Date.now());
  const isMountedRef = useRef(true);

  // Handle elapsed time tracking
  useEffect(() => {
    if (elapsedTimeOverride !== undefined || isPaused) {
      if (elapsedTimeOverride !== undefined) {
        setElapsedTime(elapsedTimeOverride);
      }
      return;
    }

    if (!initialStartTime) {
      startTimeRef.current = Date.now();
    }

    const timerId = setInterval(() => {
      if (isMountedRef.current && !isPaused) {
        const newElapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(newElapsedSeconds);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [elapsedTimeOverride, initialStartTime, isPaused]);

  // Handle progress updates
  useEffect(() => {
    if (progress !== undefined && progress > 0) {
      setProgressValue(progress);
    } else {
      const progressTimer = setInterval(() => {
        if (isMountedRef.current) {
          setProgressValue(prev => {
            if (prev < 90) {
              const increment = prev < 30 ? 0.8 : prev < 60 ? 0.4 : 0.2;
              return Math.min(90, prev + increment);
            }
            return prev;
          });
        }
      }, 5000);

      return () => clearInterval(progressTimer);
    }
  }, [progress]);

  // Rotate jokes every 10 seconds
  useEffect(() => {
    const jokeTimer = setInterval(() => {
      if (isMountedRef.current) {
        setCurrentJokeIndex(prevIndex => (prevIndex + 1) % marketingJokes.length);
      }
    }, 10000);

    return () => clearInterval(jokeTimer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get dynamic status message
  const getStatusMessage = (): string => {
    if (message) return message;

    if (elapsedTime < 60) {
      return t.marketingPlan?.loadingInitializing || `Initializing analysis for ${companyDomain || 'your company'}...`;
    } else if (elapsedTime < 120) {
      return t.marketingPlan?.loadingAnalyzing || "Analyzing company data and market trends...";
    } else if (elapsedTime < 180) {
      return t.marketingPlan?.loadingProcessing || "Processing marketing strategies...";
    } else if (elapsedTime < 240) {
      return t.marketingPlan?.loadingFinalizing || "Finalizing your customized marketing plan...";
    } else {
      return t.marketingPlan?.loadingLonger || "This is taking longer than usual, but we're still working on it...";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-brevo-green">
            {t.marketingPlan?.draftingPlan || 'Drafting your Marketing Plan'}
          </h2>
        </div>
        <p className="text-gray-500 text-sm">
          {t.marketingPlan?.mightTake || 'This might take 2-5 minutes...'}
        </p>
      </div>

      {/* Spinner */}
      <div className="flex justify-center mb-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-brevo-green" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-brevo-light animate-pulse"></div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full mb-4">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brevo-green transition-all duration-500 ease-out"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>

      {/* Status message */}
      <div className="text-center mb-6">
        <p className="text-gray-700 font-medium text-sm mb-2">
          {getStatusMessage()}
        </p>
        <span className="text-xs text-gray-400">
          {t.marketingPlan?.timeElapsed || 'Time elapsed'}: {formatTime(elapsedTime)}
          {pollCount > 0 && ` | Polls: ${pollCount}`}
          {companyDomain && ` | ${companyDomain}`}
        </span>
      </div>

      {/* Retry button */}
      {onRetryConnection && (
        <div className="flex justify-center mb-4">
          <button
            onClick={onRetryConnection}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            {t.marketingPlan?.retryConnection || 'Retry connection'}
          </button>
        </div>
      )}

      {/* Jokes section */}
      <div className="text-center text-sm text-gray-500 mb-4">
        <p>
          {t.marketingPlan?.enjoyJokes || 'While you wait, enjoy our marketing jokes:'}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <p className="text-center italic text-gray-600 text-sm min-h-[60px] flex items-center justify-center">
          "{marketingJokes[currentJokeIndex]}"
        </p>
      </div>

      {/* Cancel button */}
      {onCancel && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
          >
            <X className="h-4 w-4" />
            {t.marketingPlan?.cancel || 'Cancel'}
          </button>
        </div>
      )}
    </div>
  );
}

export default LoadingState;
