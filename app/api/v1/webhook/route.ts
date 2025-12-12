/**
 * POST /api/v1/webhook
 *
 * Webhook endpoint for AI Gateway callbacks.
 * Called when plan generation is complete.
 *
 * Request body (from AI Gateway):
 * {
 *   "event": "job.completed",
 *   "jobId": "dust_abc123",
 *   "agentAlias": "marketing-plan-generator",
 *   "status": "completed",
 *   "result": { company_summary, programs_list, ... },
 *   "metadata": { domain, language, industry, ... },
 *   "completedAt": "2025-12-12T10:30:00Z",
 *   "durationMs": 180000
 * }
 *
 * Headers:
 * - X-Webhook-Signature: secret (if configured)
 * - X-Webhook-Event: job.completed
 * - X-Webhook-Delivery: unique delivery ID
 *
 * This endpoint saves the generated plan to the database.
 */

import { NextResponse } from 'next/server';
import { parsePlanData } from '@/src/utils/marketing-plan-parser';
import { upsertMarketingPlan } from '@/lib/marketing-plan/db';
import { normalizeDomain } from '@/lib/marketing-plan/normalize';

export const runtime = 'nodejs';
export const maxDuration = 10;

// Signature verification
function verifySignature(request: Request): boolean {
  const signature = request.headers.get('x-webhook-signature');
  const secret = process.env.WEBHOOK_SECRET;

  // If no secret configured on our side, accept all requests
  if (!secret) return true;

  // If secret configured but no signature provided, reject
  if (!signature) {
    console.warn('[Webhook] No signature provided but WEBHOOK_SECRET is configured');
    return false;
  }

  // Check if signature matches our secret
  return signature === secret;
}

export async function POST(request: Request) {
  const deliveryId = request.headers.get('x-webhook-delivery') || 'unknown';
  const eventType = request.headers.get('x-webhook-event') || 'unknown';

  console.log(`[Webhook] Received event: ${eventType}, delivery: ${deliveryId}`);

  try {
    const rawBody = await request.text();

    // Verify webhook signature
    if (!verifySignature(request)) {
      console.error('[Webhook] Invalid signature for delivery:', deliveryId);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const data = JSON.parse(rawBody);

    console.log('[Webhook] Payload:', {
      event: data.event,
      status: data.status,
      jobId: data.jobId,
      agentAlias: data.agentAlias,
      hasResult: !!data.result,
      metadata: data.metadata,
      durationMs: data.durationMs,
    });

    // Handle different event types
    const event = data.event || (data.status === 'completed' ? 'job.completed' : data.status);

    // Only process completed jobs
    if (event !== 'job.completed' && data.status !== 'completed') {
      console.log('[Webhook] Ignoring event:', event, 'status:', data.status);
      return NextResponse.json({
        received: true,
        processed: false,
        reason: `Event is ${event}, status is ${data.status}`,
      });
    }

    // Extract metadata
    const metadata = data.metadata || {};
    const domain = metadata.domain;
    const language = metadata.language || 'en';
    const email = metadata.email || 'ai-generated@brevo.com';

    if (!domain) {
      console.error('[Webhook] No domain in metadata for job:', data.jobId);
      return NextResponse.json(
        { error: 'No domain in metadata', jobId: data.jobId },
        { status: 400 }
      );
    }

    // Normalize domain
    const normalizedDomain = normalizeDomain(domain);
    if (!normalizedDomain) {
      console.error('[Webhook] Invalid domain:', domain);
      return NextResponse.json(
        { error: 'Invalid domain', domain },
        { status: 400 }
      );
    }

    // Parse the plan data
    const plan = parsePlanData(data.result, normalizedDomain);
    if (!plan) {
      console.error('[Webhook] Failed to parse plan data for:', normalizedDomain);
      console.error('[Webhook] Result type:', typeof data.result);
      console.error('[Webhook] Result preview:', JSON.stringify(data.result)?.substring(0, 500));
      return NextResponse.json(
        {
          error: 'Failed to parse plan data',
          domain: normalizedDomain,
          resultType: typeof data.result,
        },
        { status: 400 }
      );
    }

    // Save to database
    console.log('[Webhook] Saving plan to DB:', {
      domain: normalizedDomain,
      language,
      email,
      jobId: data.jobId,
    });

    const dbResult = await upsertMarketingPlan(
      normalizedDomain,
      email,
      plan,
      language
    );

    if (!dbResult.success) {
      console.error('[Webhook] DB save failed:', dbResult.error);
      return NextResponse.json(
        { error: 'Failed to save plan', details: dbResult.error },
        { status: 500 }
      );
    }

    console.log('[Webhook] ✅ Plan saved successfully:', {
      domain: normalizedDomain,
      language,
      jobId: data.jobId,
      durationMs: data.durationMs,
    });

    // Return success with plan URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brevo-marketing-relationship-plan.netlify.app';

    return NextResponse.json({
      received: true,
      processed: true,
      domain: normalizedDomain,
      language,
      jobId: data.jobId,
      plan_url: `${baseUrl}/${encodeURIComponent(normalizedDomain)}?lang=${language}`,
    });

  } catch (error) {
    console.error('[Webhook] Error processing delivery:', deliveryId, error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        deliveryId,
      },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/v1/webhook',
    description: 'AI Gateway webhook endpoint for plan completion callbacks',
    expectedHeaders: {
      'X-Webhook-Signature': 'Secret for verification (optional)',
      'X-Webhook-Event': 'Event type (e.g., job.completed)',
      'X-Webhook-Delivery': 'Unique delivery ID',
    },
    expectedBody: {
      event: 'job.completed',
      jobId: 'string',
      status: 'completed | failed',
      result: 'Plan JSON object',
      metadata: {
        domain: 'required',
        language: 'optional (default: en)',
        email: 'optional',
      },
    },
  });
}
