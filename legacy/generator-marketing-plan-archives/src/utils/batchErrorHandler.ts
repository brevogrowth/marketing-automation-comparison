
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
  
  /**
   * Record an error for a domain
   */
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
  
  /**
   * Get summary of all errors
   */
  getErrorSummary(): BatchErrorSummary {
    const errorsByDomain: Record<string, BatchError[]> = {};
    const errorCounts: Record<string, number> = {};
    
    let retryableErrors = 0;
    let nonRetryableErrors = 0;
    let permanentErrors = 0;
    
    this.errors.forEach(error => {
      // Group by domain
      if (!errorsByDomain[error.domain]) {
        errorsByDomain[error.domain] = [];
      }
      errorsByDomain[error.domain].push(error);
      
      // Count error types
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
      
      // Count common errors
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
  
  /**
   * Get domains that should be retried
   */
  getDomainsForRetry(): string[] {
    const retryDomains = new Set<string>();
    
    this.errors.forEach(error => {
      if (error.shouldRetry) {
        retryDomains.add(error.domain);
      }
    });
    
    return Array.from(retryDomains);
  }
  
  /**
   * Check if a domain has had too many failures
   */
  isDomainBlacklisted(domain: string, maxFailures: number = 3): boolean {
    const domainErrors = this.errors.filter(e => e.domain === domain);
    return domainErrors.length >= maxFailures;
  }
  
  /**
   * Clear errors for a domain (when it succeeds)
   */
  clearDomainErrors(domain: string): void {
    this.errors = this.errors.filter(e => e.domain !== domain);
  }
  
  /**
   * Get recent errors (last 10 minutes)
   */
  getRecentErrors(minutesAgo: number = 10): BatchError[] {
    const cutoff = Date.now() - (minutesAgo * 60 * 1000);
    return this.errors.filter(e => new Date(e.timestamp).getTime() > cutoff);
  }
  
  private categorizeError(error: string, isRetryable: boolean): 'retryable' | 'non-retryable' | 'permanent' {
    const errorLower = error.toLowerCase();
    
    // Permanent errors that should never be retried
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

/**
 * Global error handler instance
 */
export const globalBatchErrorHandler = new BatchErrorHandler();

/**
 * Generate error report for batch job
 */
export function generateErrorReport(errorHandler: BatchErrorHandler): string {
  const summary = errorHandler.getErrorSummary();
  
  let report = `Batch Processing Error Report\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  report += `Summary:\n`;
  report += `- Total Errors: ${summary.totalErrors}\n`;
  report += `- Retryable Errors: ${summary.retryableErrors}\n`;
  report += `- Non-Retryable Errors: ${summary.nonRetryableErrors}\n`;
  report += `- Permanent Errors: ${summary.permanentErrors}\n\n`;
  
  if (summary.commonErrors.length > 0) {
    report += `Most Common Errors:\n`;
    summary.commonErrors.forEach(({ error, count }) => {
      report += `- ${error}: ${count} occurrences\n`;
    });
    report += `\n`;
  }
  
  if (Object.keys(summary.errorsByDomain).length > 0) {
    report += `Errors by Domain:\n`;
    Object.entries(summary.errorsByDomain).forEach(([domain, errors]) => {
      report += `- ${domain}: ${errors.length} errors\n`;
      errors.forEach(error => {
        report += `  - ${error.error} (${error.errorType})\n`;
      });
    });
  }
  
  return report;
}
