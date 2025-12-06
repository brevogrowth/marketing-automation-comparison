/**
 * Rate Limiting Module
 *
 * Provides rate limiting functionality with support for:
 * - In-memory storage (development/fallback)
 * - Upstash Redis (production) - requires @upstash/ratelimit package
 *
 * Configuration via environment variables:
 * - UPSTASH_REDIS_REST_URL: Upstash Redis REST URL
 * - UPSTASH_REDIS_REST_TOKEN: Upstash Redis REST token
 *
 * If Upstash is not configured, falls back to in-memory rate limiting
 * (note: in-memory is ephemeral in serverless environments)
 */

import { apiConfig } from '@/config/api';

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // timestamp in ms
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (fallback for development or when Upstash not configured)
const memoryStore = new Map<string, RateLimitRecord>();

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    memoryStore.forEach((record, key) => {
      if (now > record.resetTime) {
        memoryStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

/**
 * Check rate limit using in-memory store (fallback)
 */
function checkMemoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const record = memoryStore.get(identifier);

  // If no record or window expired, create new one
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    memoryStore.set(identifier, { count: 1, resetTime });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetTime,
    };
  }

  // Check if limit exceeded
  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}

/**
 * Check rate limit using Upstash Redis (production)
 * Requires @upstash/ratelimit and @upstash/redis packages
 */
async function checkUpstashRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Fall back to memory if not configured
    return checkMemoryRateLimit(identifier, limit, windowMs);
  }

  try {
    // Use Upstash Redis REST API directly for simplicity
    // This avoids adding another dependency
    const key = `ratelimit:${identifier}`;
    const windowSeconds = Math.ceil(windowMs / 1000);

    // Get current count
    const getResponse = await fetch(`${url}/get/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData = await getResponse.json();
    const currentCount = parseInt(getData.result || '0', 10);

    if (currentCount >= limit) {
      // Get TTL for reset time
      const ttlResponse = await fetch(`${url}/ttl/${key}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ttlData = await ttlResponse.json();
      const ttl = parseInt(ttlData.result || windowSeconds.toString(), 10);

      return {
        success: false,
        limit,
        remaining: 0,
        reset: Date.now() + ttl * 1000,
      };
    }

    // Increment counter with expiry
    // Using MULTI/EXEC for atomic operation
    const incrResponse = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, windowSeconds, 'NX'], // Only set expiry if not exists
      ]),
    });
    const incrData = await incrResponse.json();
    const newCount = incrData[0]?.result || currentCount + 1;

    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - newCount),
      reset: Date.now() + windowMs,
    };
  } catch (error) {
    console.error('[RateLimit] Upstash error, falling back to memory:', error);
    return checkMemoryRateLimit(identifier, limit, windowMs);
  }
}

/**
 * Rate limit checker function
 *
 * @param identifier - Unique identifier for the rate limit (e.g., IP address)
 * @param options - Optional configuration overrides
 * @returns RateLimitResult with success status and metadata
 *
 * Usage:
 * ```ts
 * const result = await rateLimit(ip);
 * if (!result.success) {
 *   return new Response('Too many requests', { status: 429 });
 * }
 * ```
 */
export async function rateLimit(
  identifier: string,
  options?: {
    limit?: number;
    windowMs?: number;
  }
): Promise<RateLimitResult> {
  const limit = options?.limit ?? apiConfig.rateLimit.maxRequests;
  const windowMs = options?.windowMs ?? apiConfig.rateLimit.windowMs;

  // Use Upstash if configured, otherwise fall back to memory
  const useUpstash = !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );

  if (useUpstash) {
    return checkUpstashRateLimit(identifier, limit, windowMs);
  }

  return checkMemoryRateLimit(identifier, limit, windowMs);
}

/**
 * Extract client IP from request headers
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Create rate limit response headers
 */
export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}
