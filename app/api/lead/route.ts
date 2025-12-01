/**
 * Lead Capture API Route
 * Receives lead data and forwards to webhook (Zapier, Make, n8n, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema for lead data validation
const LeadDataSchema = z.object({
  email: z.string().email(),
  timestamp: z.string().datetime(),
  language: z.string().min(2).max(10),
  source: z.object({
    page: z.string(),
    trigger: z.string(),
    industry: z.string().optional(),
    priceTier: z.string().optional(),
  }),
  metadata: z.object({
    userAgent: z.string(),
    referrer: z.string(),
  }),
});

type LeadData = z.infer<typeof LeadDataSchema>;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate with Zod
    const validation = LeadDataSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid lead data',
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const leadData: LeadData = validation.data;

    // Get webhook URL from environment
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;

    if (webhookUrl) {
      // Forward to webhook (fire-and-forget, fail-open)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...leadData,
            // Add server-side data
            receivedAt: new Date().toISOString(),
            source: {
              ...leadData.source,
              // Add client IP if available
              ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
      } catch (webhookError) {
        // Log error but don't fail the request (fail-open pattern)
        console.error('[Lead API] Webhook error:', webhookError);
      }
    } else {
      // No webhook configured - log the lead data for debugging
      console.log('[Lead API] No LEAD_WEBHOOK_URL configured. Lead received:', {
        email: leadData.email,
        timestamp: leadData.timestamp,
        trigger: leadData.source.trigger,
        industry: leadData.source.industry,
      });
    }

    // Always return success (fail-open)
    return NextResponse.json({
      success: true,
      message: 'Lead received',
    });
  } catch (error) {
    console.error('[Lead API] Error processing lead:', error);

    // Even on error, return 200 (fail-open)
    // This ensures the user flow isn't blocked
    return NextResponse.json({
      success: true,
      message: 'Lead received',
    });
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
