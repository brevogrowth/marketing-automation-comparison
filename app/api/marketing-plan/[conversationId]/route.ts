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

  // Get optional query parameters for fallback
  const { searchParams } = new URL(request.url);
  const queryDomain = searchParams.get('domain');
  const queryLanguage = searchParams.get('language');

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

    // Debug: Log full AI Gateway response structure
    console.log('[Poll] AI Gateway response:', JSON.stringify({
      status: data.status,
      hasResult: !!data.result,
      resultType: typeof data.result,
      hasMetadata: !!data.metadata,
      metadata: data.metadata,
      topLevelKeys: Object.keys(data),
    }));

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

          // Extract domain/language from multiple sources (in priority order)
          // 1. AI Gateway metadata (if returned)
          // 2. Query parameters (passed by frontend)
          // 3. Plan data (company_summary.website)
          const extractedDomain =
            data.metadata?.domain ||
            queryDomain ||
            plan.company_summary?.website?.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

          const extractedLanguage =
            data.metadata?.language ||
            queryLanguage ||
            'en'; // Default fallback

          // Debug: Log metadata sources
          console.log('[Poll] Metadata sources:', {
            gatewayMetadata: data.metadata,
            queryParams: { domain: queryDomain, language: queryLanguage },
            planWebsite: plan.company_summary?.website,
            extracted: { domain: extractedDomain, language: extractedLanguage },
          });

          // Save to database if we have domain
          if (extractedDomain) {
            const email = data.metadata?.email || 'ai-generated@brevo.com';
            console.log('[Poll] Saving to DB:', { domain: extractedDomain, language: extractedLanguage, email });

            const dbResult = await upsertMarketingPlan(
              extractedDomain,
              email,
              plan,
              extractedLanguage
            );

            if (dbResult.success) {
              console.log('[Poll] DB save completed successfully');
            } else {
              console.error('[Poll] DB save FAILED:', dbResult.error);
              // Continue anyway - plan can still be returned to user
            }
          } else {
            console.warn('[Poll] Skipping DB save - no domain found from any source');
          }
        } catch (parseError) {
          // Log detailed error for debugging
          console.error('[Poll] Parse error:', parseError instanceof Error ? parseError.message : 'Unknown');

          // Capture raw data structure for debugging
          const resultPreview = typeof data.result === 'string'
            ? data.result.substring(0, 1000)
            : JSON.stringify(data.result, null, 2).substring(0, 1000);

          console.error('[Poll] Data structure:', JSON.stringify({
            hasResult: !!data.result,
            resultType: typeof data.result,
            resultKeys: data.result && typeof data.result === 'object' ? Object.keys(data.result) : [],
            metadata: data.metadata,
            resultPreview,
          }));

          return NextResponse.json({
            status: 'error',
            error: 'Failed to parse AI response',
            debug: {
              errorMessage: parseError instanceof Error ? parseError.message : 'Unknown error',
              resultType: typeof data.result,
              dataKeys: data.result && typeof data.result === 'object' ? Object.keys(data.result) : [],
              resultPreview,
            }
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
