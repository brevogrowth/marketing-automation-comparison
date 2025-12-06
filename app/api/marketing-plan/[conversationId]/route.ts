/**
 * GET /api/marketing-plan/[conversationId]
 *
 * Poll for marketing plan generation status.
 *
 * Response:
 * - Processing: { status: 'pending', message: 'Processing...' }
 * - Complete: { status: 'complete', plan: MarketingPlan }
 * - Error: { status: 'error', error: string }
 */

import { NextResponse } from 'next/server';
import { parsePlanData } from '@/src/utils/marketing-plan-parser';
import { upsertMarketingPlan } from '@/lib/marketing-plan/db';
import type { MarketingPlan } from '@/src/types/marketing-plan';

export const runtime = 'nodejs';
export const maxDuration = 10;

// Job ID format validation (e.g., dust_abc123)
const JOB_ID_REGEX = /^[a-z]+_[a-zA-Z0-9_-]+$/;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId: jobId } = await params;

  // Validate format
  if (!JOB_ID_REGEX.test(jobId)) {
    return NextResponse.json(
      { status: 'error', error: 'Invalid job ID format' },
      { status: 400 }
    );
  }

  const gatewayUrl = process.env.AI_GATEWAY_URL;
  const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

  if (!gatewayUrl || !gatewayApiKey) {
    return NextResponse.json(
      { status: 'error', error: 'AI Gateway not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${gatewayUrl}/api/v1/analyze/${jobId}`, {
      headers: {
        'x-api-key': gatewayApiKey,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { status: 'error', error: 'Plan not found' },
          { status: 404 }
        );
      }
      console.error('[Poll] Gateway error:', response.status);
      return NextResponse.json(
        { status: 'error', error: 'AI service error' },
        { status: 502 }
      );
    }

    const data = await response.json();

    switch (data.status) {
      case 'completed': {
        // Parse and validate the AI response
        let plan: MarketingPlan;

        try {
          const parseResult = parsePlanData(data.result, data.metadata?.domain);
          if (!parseResult) {
            throw new Error('Failed to parse marketing plan - null result');
          }
          plan = parseResult;

          // Save to database if we have metadata
          if (data.metadata?.domain && data.metadata?.language) {
            const email = data.metadata?.email || 'ai-generated@brevo.com';
            await upsertMarketingPlan(
              data.metadata.domain,
              email,
              plan,
              data.metadata.language
            );
          }
        } catch (parseError) {
          // Log error type only, not content which may be sensitive
          console.error('[Poll] Parse error:', parseError instanceof Error ? parseError.name : 'Unknown');
          return NextResponse.json({
            status: 'error',
            error: 'Failed to parse AI response',
          });
        }

        return NextResponse.json({
          status: 'complete',
          plan,
        });
      }

      case 'failed':
        return NextResponse.json({
          status: 'error',
          error: data.error || 'Plan generation failed',
        });

      case 'pending':
      case 'running':
      default:
        return NextResponse.json({
          status: 'pending',
          message: data.message || 'Generating your marketing plan...',
        });
    }

  } catch (error) {
    // Log error type only, not full details
    console.error('[Poll] Error:', error instanceof Error ? error.name : 'Unknown');
    return NextResponse.json(
      { status: 'error', error: 'Failed to check plan status' },
      { status: 500 }
    );
  }
}
