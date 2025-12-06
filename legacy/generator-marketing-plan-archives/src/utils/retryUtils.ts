
/**
 * Retry utilities for batch processing operations
 */

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors: string[];
  nonRetryableErrors: string[];
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  retryableErrors: [
    'timeout',
    'network error',
    'connection failed',
    'http error! status: 500',
    'http error! status: 502',
    'http error! status: 503',
    'http error! status: 504',
    'analysis timeout',
    'server error'
  ],
  nonRetryableErrors: [
    'http error! status: 404',
    'http error! status: 401',
    'http error! status: 403',
    'invalid domain',
    'conversation not found',
    'no agent response found'
  ]
};

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  attempts: number;
  totalDelay: number;
  lastError?: Error;
}

/**
 * Determine if an error is retryable based on error patterns
 */
export function isRetryableError(error: string, config: RetryConfig = DEFAULT_RETRY_CONFIG): boolean {
  const errorLower = error.toLowerCase();
  
  // Check if it's explicitly non-retryable
  const isNonRetryable = config.nonRetryableErrors.some(pattern => 
    errorLower.includes(pattern.toLowerCase())
  );
  
  if (isNonRetryable) {
    return false;
  }
  
  // Check if it's explicitly retryable
  const isRetryable = config.retryableErrors.some(pattern => 
    errorLower.includes(pattern.toLowerCase())
  );
  
  return isRetryable;
}

/**
 * Calculate delay with exponential backoff and jitter
 */
export function calculateDelay(
  attempt: number, 
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const exponentialDelay = Math.min(
    config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
    config.maxDelay
  );
  
  // Add jitter (±25% of the calculated delay)
  const jitter = exponentialDelay * 0.25 * (Math.random() - 0.5);
  
  return Math.max(100, exponentialDelay + jitter);
}

/**
 * Generic retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  operationName: string,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<RetryResult<T>> {
  let lastError: Error | null = null;
  let totalDelay = 0;
  
  for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
    try {
      console.log(`[Retry] ${operationName} - Attempt ${attempt}/${config.maxRetries + 1}`);
      
      const result = await operation();
      
      if (attempt > 1) {
        console.log(`[Retry] ${operationName} succeeded after ${attempt} attempts`);
      }
      
      return {
        success: true,
        data: result,
        attempts: attempt,
        totalDelay
      };
      
    } catch (error) {
      lastError = error as Error;
      console.log(`[Retry] ${operationName} failed on attempt ${attempt}:`, error.message);
      
      // If this is the last attempt, don't retry
      if (attempt > config.maxRetries) {
        break;
      }
      
      // Check if error is retryable
      if (!isRetryableError(error.message, config)) {
        console.log(`[Retry] ${operationName} failed with non-retryable error:`, error.message);
        break;
      }
      
      // Calculate delay and wait
      const delay = calculateDelay(attempt, config);
      totalDelay += delay;
      
      console.log(`[Retry] ${operationName} retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return {
    success: false,
    error: lastError?.message || 'Unknown error',
    attempts: config.maxRetries + 1,
    totalDelay,
    lastError
  };
}

/**
 * Retry configuration for different operation types
 */
export const RETRY_CONFIGS = {
  START_ANALYSIS: {
    ...DEFAULT_RETRY_CONFIG,
    maxRetries: 2,
    baseDelay: 2000,
    maxDelay: 10000
  },
  
  GET_ANALYSIS: {
    ...DEFAULT_RETRY_CONFIG,
    maxRetries: 5,
    baseDelay: 3000,
    maxDelay: 15000
  },
  
  SAVE_PLAN: {
    ...DEFAULT_RETRY_CONFIG,
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 8000
  }
} as const;

/**
 * Circuit breaker pattern for failing services
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private failureThreshold: number = 5,
    private recoveryTimeout: number = 60000 // 1 minute
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private shouldAttemptReset(): boolean {
    return this.lastFailureTime !== null && 
           Date.now() - this.lastFailureTime >= this.recoveryTimeout;
  }
  
  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'closed';
  }
  
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
    }
  }
  
  getState(): { state: string; failureCount: number; lastFailureTime: number | null } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    };
  }
}
