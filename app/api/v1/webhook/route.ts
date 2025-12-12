/**
 * POST /api/v1/webhook
 *
 * Webhook endpoint for AI Gateway callbacks.
 * Called when plan generation is complete.
 *
 * Request body (from AI Gateway):
 * - status: 'completed' | 'failed'
 * - result: The generated plan data
 * - metadata: { domain, language, email, ... }
 * - jobId: The conversation/job ID
 *
 * This endpoint saves the generated plan to the database.
 */

import { NextResponse } from 'next/server';
import { parsePlanData } from '@/src/utils/marketing-plan-parser';
import { upsertMarketingPlan } from '@/lib/marketing-plan/db';
import { normalizeDomain } from '@/lib/marketing-plan/normalize';

export const runtime = 'nodejs';
export const maxDuration = 10;

// Simple signature verification (optional, for security)
function verifySignature(request: Request, body: string): boolean {
  const signature = request.headers.get('x-webhook-signature');
  const secret = process.env.WEBHOOK_SECRET;

  // If no secret configured, skip verification
  if (!secret) return true;

  // If secret configured but no signature provided, reject
  if (!signature) return false;

  // Simple HMAC verification could be added here
  // For now, just check if signature matches secret
  return signature === secret;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // Verify webhook signature (optional)
    if (!verifySignature(request, rawBody)) {
      console.error('[Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const data = JSON.parse(rawBody);

    console.log('[Webhook] Received callback:', {
      status: data.status,
      jobId: data.jobId,
      hasResult: !!data.result,
      metadata: data.metadata,
    });

    // Only process completed jobs
    if (data.status !== 'completed') {
      console.log('[Webhook] Ignoring non-completed status:', data.status);
      return NextResponse.json({
        received: true,
        processed: false,
        reason: `Status is ${data.status}, not completed`,
      });
    }

    // Extract metadata
    const metadata = data.metadata || {};
    const domain = metadata.domain;
    const language = metadata.language || 'en';
    const email = metadata.email || 'ai-generated@brevo.com';

    if (!domain) {
      console.error('[Webhook] No domain in metadata');
      return NextResponse.json(
        { error: 'No domain in metadata' },
        { status: 400 }
      );
    }

    // Normalize domain
    const normalizedDomain = normalizeDomain(domain);
    if (!normalizedDomain) {
      console.error('[Webhook] Invalid domain:', domain);
      return NextResponse.json(
        { error: 'Invalid domain' },
        { status: 400 }
      );
    }

    // Parse the plan data
    const plan = parsePlanData(data.result, normalizedDomain);
    if (!plan) {
      console.error('[Webhook] Failed to parse plan data');
      return NextResponse.json(
        { error: 'Failed to parse plan data' },
        { status: 400 }
      );
    }

    // Save to database
    console.log('[Webhook] Saving plan to DB:', {
      domain: normalizedDomain,
      language,
      email,
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

    console.log('[Webhook] Plan saved successfully for:', normalizedDomain);

    // Return success with plan URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brevo-marketing-relationship-plan.netlify.app';

    return NextResponse.json({
      received: true,
      processed: true,
      domain: normalizedDomain,
      language,
      plan_url: `${baseUrl}/${encodeURIComponent(normalizedDomain)}?lang=${language}`,
    });

  } catch (error) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
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
  });
}
