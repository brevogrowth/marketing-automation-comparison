/**
 * Polling Utilities for AI Plan Generation
 *
 * Utilities for async polling pattern when waiting for AI responses.
 */

/**
 * Loading messages to display during AI generation
 * Indexed by poll count ranges
 */
export const LOADING_MESSAGES = [
  'Checking for existing plan...',
  'Initializing analysis...',
  'Gathering company information...',
  'Analyzing your website...',
  'Identifying marketing opportunities...',
  'Building your customized plan...',
  'Crafting program recommendations...',
  'Finalizing your marketing strategy...',
  'Almost there...',
  'This is taking longer than usual...',
] as const;

/**
 * Get loading message based on poll count
 */
export function getLoadingMessage(pollCount: number): string {
  if (pollCount === 0) return LOADING_MESSAGES[0];
  if (pollCount === 1) return LOADING_MESSAGES[1];
  if (pollCount <= 4) return LOADING_MESSAGES[2];
  if (pollCount <= 7) return LOADING_MESSAGES[3];
  if (pollCount <= 10) return LOADING_MESSAGES[4];
  if (pollCount <= 14) return LOADING_MESSAGES[5];
  if (pollCount <= 18) return LOADING_MESSAGES[6];
  if (pollCount <= 22) return LOADING_MESSAGES[7];
  if (pollCount <= 30) return LOADING_MESSAGES[8];
  return LOADING_MESSAGES[9];
}

/**
 * Calculate progress percentage based on poll count
 * Uses progressive increment that slows down over time
 * Caps at 85% until completion
 */
export function getWaitingProgress(pollCount: number): number {
  let progress = 0;

  // Polls 1-10: +2% per poll = 20%
  const firstPhase = Math.min(pollCount, 10);
  progress += firstPhase * 2;

  // Polls 11-30: +1% per poll = 20%
  if (pollCount > 10) {
    const secondPhase = Math.min(pollCount - 10, 20);
    progress += secondPhase;
  }

  // Polls 31-60: +0.5% per poll = 15%
  if (pollCount > 30) {
    const thirdPhase = Math.min(pollCount - 30, 30);
    progress += thirdPhase * 0.5;
  }

  // Polls 60+: +0.2% per poll
  if (pollCount > 60) {
    const fourthPhase = pollCount - 60;
    progress += fourthPhase * 0.2;
  }

  // Cap at 85% until completion
  return Math.min(progress, 85);
}

/**
 * Get progressive polling interval
 * Increases delay over time to reduce server load
 *
 * @param attemptNumber - Current attempt number (1-based)
 * @returns Delay in milliseconds
 */
export function getProgressivePollingInterval(attemptNumber: number): number {
  // Attempts 1-10: 5 second intervals
  if (attemptNumber <= 10) return 5000;

  // Attempts 11-20: 10 second intervals
  if (attemptNumber <= 20) return 10000;

  // Attempts 21-30: 15 second intervals
  if (attemptNumber <= 30) return 15000;

  // Attempts 31+: 20 second intervals
  return 20000;
}

/**
 * Default polling configuration
 */
export const POLLING_CONFIG = {
  /** Maximum number of polling attempts */
  MAX_POLLS: 60,
  /** Default interval between polls (ms) */
  DEFAULT_INTERVAL: 5000,
  /** Total timeout duration (ms) - approximately 5 minutes */
  TOTAL_TIMEOUT: 5 * 60 * 1000,
} as const;

/**
 * Validate conversation ID format
 */
export function isValidConversationIdFormat(conversationId: string): boolean {
  if (!conversationId) return false;
  // Must be at least 8 chars, alphanumeric with dashes/underscores
  return /^[a-zA-Z0-9_-]{8,}$/.test(conversationId);
}

/**
 * Check if an error indicates invalid conversation ID
 */
export function isInvalidConversationIdError(errorMessage: string): boolean {
  const invalidPatterns = [
    '404',
    'not found',
    'invalid conversation',
    'conversation not found',
    'does not exist',
  ];

  const lowerMessage = errorMessage.toLowerCase();
  return invalidPatterns.some((pattern) => lowerMessage.includes(pattern));
}

/**
 * Determine if polling should stop based on error
 */
export function shouldStopPolling(
  errorMessage: string,
  consecutiveErrors: number
): boolean {
  // Stop immediately for invalid conversation errors
  if (isInvalidConversationIdError(errorMessage)) return true;

  // Stop after 3 consecutive errors for other types
  if (consecutiveErrors >= 3) return true;

  return false;
}
