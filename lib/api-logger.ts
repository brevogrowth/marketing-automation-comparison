/**
 * API Logger
 *
 * Logs API calls to Supabase for monitoring and debugging.
 */

import { getSupabaseClient, isSupabaseConfigured } from './marketing-plan/supabase';

export interface ApiLogEntry {
  endpoint: string;
  method: string;
  domain?: string;
  api_key_hash?: string;
  status_code: number;
  response_time_ms: number;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an API call to the database
 */
export async function logApiCall(entry: ApiLogEntry): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    const supabase = getSupabaseClient();

    await supabase.from('api_logs').insert([
      {
        timestamp: new Date().toISOString(),
        endpoint: entry.endpoint,
        method: entry.method,
        domain: entry.domain,
        api_key_hash: entry.api_key_hash,
        status_code: entry.status_code,
        response_time_ms: entry.response_time_ms,
        error_message: entry.error_message,
        metadata: entry.metadata,
      },
    ]);
  } catch (error) {
    // Don't throw - logging should not break the API
    console.error('[API Logger] Failed to log:', error);
  }
}

/**
 * Create a timer for measuring response time
 */
export function createTimer(): () => number {
  const start = Date.now();
  return () => Date.now() - start;
}

/**
 * Hash an API key for safe logging (first 8 chars + ...)
 */
export function hashApiKey(apiKey: string | null): string {
  if (!apiKey) return 'none';
  return apiKey.substring(0, 8) + '...';
}
