
/**
 * Error handling utilities for batch processing
 */

export interface BatchError {
  domain: string;
  error: string;
  errorType: 'retryable' | 'non-retryable' | 'permanent';
  timestamp: string;
  attemptNumber: number;
  shouldRetry: boolean;
}

export interface BatchErrorSummary {
  totalErrors: number;
  retryableErrors: number;
  nonRetryableErrors: number;
  permanentErrors: number;
  errorsByDomain: Record<string, BatchError[]>;
  commonErrors: Array<{ error: string; count: number }>;
}

export class BatchErrorHandler {
  private errors: BatchError[] = [];
  
  recordError(
    domain: string,
    error: string,
    attemptNumber: number,
    isRetryable: boolean
  ): BatchError {
    const errorType = this.categorizeError(error, isRetryable);
    
    const batchError: BatchError = {
      domain,
      error,
      errorType,
      timestamp: new Date().toISOString(),
      attemptNumber,
      shouldRetry: errorType === 'retryable' && attemptNumber < 3
    };
    
    this.errors.push(batchError);
    return batchError;
  }
  
  getErrorSummary(): BatchErrorSummary {
    const errorsByDomain: Record<string, BatchError[]> = {};
    const errorCounts: Record<string, number> = {};
    
    let retryableErrors = 0;
    let nonRetryableErrors = 0;
    let permanentErrors = 0;
    
    this.errors.forEach(error => {
      if (!errorsByDomain[error.domain]) {
        errorsByDomain[error.domain] = [];
      }
      errorsByDomain[error.domain].push(error);
      
      switch (error.errorType) {
        case 'retryable':
          retryableErrors++;
          break;
        case 'non-retryable':
          nonRetryableErrors++;
          break;
        case 'permanent':
          permanentErrors++;
          break;
      }
      
      errorCounts[error.error] = (errorCounts[error.error] || 0) + 1;
    });
    
    const commonErrors = Object.entries(errorCounts)
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalErrors: this.errors.length,
      retryableErrors,
      nonRetryableErrors,
      permanentErrors,
      errorsByDomain,
      commonErrors
    };
  }
  
  getDomainsForRetry(): string[] {
    const retryDomains = new Set<string>();
    
    this.errors.forEach(error => {
      if (error.shouldRetry) {
        retryDomains.add(error.domain);
      }
    });
    
    return Array.from(retryDomains);
  }
  
  isDomainBlacklisted(domain: string, maxFailures: number = 3): boolean {
    const domainErrors = this.errors.filter(e => e.domain === domain);
    return domainErrors.length >= maxFailures;
  }
  
  clearDomainErrors(domain: string): void {
    this.errors = this.errors.filter(e => e.domain !== domain);
  }
  
  private categorizeError(error: string, isRetryable: boolean): 'retryable' | 'non-retryable' | 'permanent' {
    const errorLower = error.toLowerCase();
    
    const permanentPatterns = [
      'invalid domain',
      'domain not found',
      'malformed domain',
      'blacklisted domain'
    ];
    
    if (permanentPatterns.some(pattern => errorLower.includes(pattern))) {
      return 'permanent';
    }
    
    return isRetryable ? 'retryable' : 'non-retryable';
  }
}
