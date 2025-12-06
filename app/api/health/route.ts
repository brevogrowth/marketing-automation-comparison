import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Health check endpoint for monitoring.
 *
 * Returns:
 * - 200 OK if the service is healthy
 * - Basic service information
 *
 * Usage:
 * GET /api/health
 */
export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'brevo-marketing-plan',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      aiGateway: !!process.env.AI_GATEWAY_URL,
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
  };

  // Check if critical environment variables are set
  const allChecksPass = Object.values(healthCheck.checks).every(Boolean);

  if (!allChecksPass) {
    return NextResponse.json(
      {
        ...healthCheck,
        status: 'degraded',
        message: 'Some integrations are not configured',
      },
      { status: 200 } // Still return 200 - degraded is not unhealthy
    );
  }

  return NextResponse.json(healthCheck, { status: 200 });
}
