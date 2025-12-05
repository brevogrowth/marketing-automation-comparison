import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 10;

// Format: provider_id (e.g., dust_abc123)
const JOB_ID_REGEX = /^[a-z]+_[a-zA-Z0-9_-]+$/;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    const { conversationId: jobId } = await params;

    // Validation du format
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
                    { status: 'error', error: 'Analysis not found' },
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

        // Map to format expected by frontend (hooks/useAnalysis.ts)
        switch (data.status) {
            case 'completed':
                return NextResponse.json({
                    status: 'complete',  // Frontend expects "complete" (without 'd')
                    analysis: data.result,
                });

            case 'failed':
                return NextResponse.json({
                    status: 'error',
                    error: data.error || 'Analysis failed',
                });

            case 'pending':
            case 'running':
            default:
                return NextResponse.json({
                    status: 'pending',
                    message: data.message || 'Processing...',
                });
        }

    } catch (error) {
        console.error('[Poll] Error:', error);
        return NextResponse.json(
            { status: 'error', error: 'Failed to check analysis status' },
            { status: 500 }
        );
    }
}
