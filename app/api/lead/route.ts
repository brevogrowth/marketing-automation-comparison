/**
 * Lead Capture API Route
 * Receives lead data from @brevogrowth/lead-capture package and forwards to Brevo Lead Hub.
 *
 * This API accepts the generic LeadData format from the package and enriches it
 * with app-specific data before forwarding to Lead Hub.
 *
 * Required environment variables:
 * - LEAD_HUB_URL: https://brevo-lead-hub.netlify.app/api/capture
 * - LEAD_HUB_API_KEY: API key for authentication with lead-hub
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema matching @brevogrowth/lead-capture LeadData interface
// This is the generic format sent by the package - app-agnostic
const LeadDataSchema = z.object({
  email: z.string().email(),
  timestamp: z.string(),
  language: z.string().min(2).max(10),
  projectId: z.string().optional(),
  trigger: z.string().optional(),
  source: z.object({
    page: z.string(),
    referrer: z.string(),
    userAgent: z.string(),
  }),
  context: z.record(z.unknown()).optional(), // App-specific data (industry, priceTier, etc.)
  customFields: z.record(z.string()).optional(),
});

type LeadData = z.infer<typeof LeadDataSchema>;

export async function POST(request: NextRequest) {
  // Debug result tracking
  let forwardResult: { status?: number; body?: string; error?: string } = {};

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

    // Get lead-hub configuration from environment
    const leadHubUrl = process.env.LEAD_HUB_URL;
    const leadHubApiKey = process.env.LEAD_HUB_API_KEY;

    if (leadHubUrl) {
      // Forward to Brevo Lead Hub with authentication
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Add API key authentication if configured
        if (leadHubApiKey) {
          headers['Authorization'] = `Bearer ${leadHubApiKey}`;
        }

        // Format payload according to Lead Hub CaptureRequestSchema
        const response = await fetch(leadHubUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            // Lead object (required by Lead Hub schema)
            lead: {
              email: leadData.email,
              projectId: 'kpi-benchmark', // Required by Lead Hub
              source: leadData.trigger || 'website',
              metadata: {
                // App-specific context
                language: leadData.language,
                trigger: leadData.trigger,
                context: leadData.context, // { industry, priceTier, ... }
                customFields: leadData.customFields,
                // Browser/client metadata
                page: leadData.source.page,
                referrer: leadData.source.referrer,
                userAgent: leadData.source.userAgent,
                ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
              },
            },
            // Optional timestamp
            timestamp: leadData.timestamp,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseText = await response.text();
        forwardResult = { status: response.status, body: responseText };

        if (!response.ok) {
          console.error('[Lead API] Lead Hub returned error:', response.status, responseText);
        } else {
          console.log('[Lead API] Lead Hub success:', response.status, responseText);
        }
      } catch (webhookError) {
        // Log error but don't fail the request (fail-open pattern)
        const errorMsg = webhookError instanceof Error ? webhookError.message : String(webhookError);
        forwardResult = { error: errorMsg };
        console.error('[Lead API] Lead Hub error:', errorMsg);
      }
    } else {
      console.warn('[Lead API] LEAD_HUB_URL not configured - check Netlify environment variables');
      forwardResult = { error: 'LEAD_HUB_URL not configured' };
      // No lead-hub configured - log the lead data for debugging
      console.log('[Lead API] No LEAD_HUB_URL configured. Lead received:', {
        email: leadData.email,
        timestamp: leadData.timestamp,
        trigger: leadData.trigger,
        context: leadData.context,
      });
    }

    // Always return success (fail-open)
    // Include debug info temporarily to diagnose forwarding issues
    return NextResponse.json({
      success: true,
      message: 'Lead received',
      _debug: {
        leadHubConfigured: !!leadHubUrl,
        leadHubUrl: leadHubUrl ? `${leadHubUrl.substring(0, 50)}...` : null,
        apiKeyConfigured: !!leadHubApiKey,
        forwardResult,
      },
    });
  } catch (error) {
    console.error('[Lead API] Error processing lead:', error);

    // Even on error, return 200 (fail-open)
    // This ensures the user flow isn't blocked
    return NextResponse.json({
      success: true,
      message: 'Lead received',
      _debug: { error: error instanceof Error ? error.message : 'Unknown error' },
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
