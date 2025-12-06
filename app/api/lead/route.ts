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

/**
 * Extract the traffic source from available data
 * Priority: utm_source > referrer domain > 'direct'
 */
function extractTrafficSource(leadData: LeadData): string {
  // 1. Try to extract utm_source from the page URL
  try {
    const pageUrl = new URL(leadData.source.page, 'http://localhost');
    const utmSource = pageUrl.searchParams.get('utm_source');
    if (utmSource) {
      return utmSource;
    }
  } catch {
    // Invalid URL, continue to next source
  }

  // 2. Try to extract domain from referrer
  if (leadData.source.referrer) {
    try {
      const referrerUrl = new URL(leadData.source.referrer);
      // Return simplified domain (e.g., "google" from "www.google.com")
      const hostname = referrerUrl.hostname.replace(/^www\./, '');
      const domain = hostname.split('.')[0];
      if (domain && domain !== 'localhost') {
        return domain;
      }
    } catch {
      // Invalid referrer URL, continue
    }
  }

  // 3. Default to 'direct' (no referrer, no UTM)
  return 'direct';
}

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
              source: extractTrafficSource(leadData), // utm_source > referrer > 'direct'
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

        if (!response.ok) {
          // Log status only, not response body
          console.error('[Lead API] Lead Hub error status:', response.status);
        }
      } catch (webhookError) {
        // Log error type only (fail-open pattern)
        console.error('[Lead API] Lead Hub error:', webhookError instanceof Error ? webhookError.name : 'Unknown');
      }
    } else {
      // Log warning only, no sensitive data
      console.warn('[Lead API] LEAD_HUB_URL not configured - lead captured but not forwarded');
    }

    // Always return success (fail-open)
    return NextResponse.json({
      success: true,
      message: 'Lead received',
    });
  } catch (error) {
    // Log error type only, not details
    console.error('[Lead API] Error:', error instanceof Error ? error.name : 'Unknown');

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
