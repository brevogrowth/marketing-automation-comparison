import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 10;

// Regex to validate conversationId format for security
const CONVERSATION_ID_REGEX = /^[a-zA-Z0-9_-]{5,50}$/;

interface AgentMessage {
    type: string;
    status?: string;
    content?: string;
    error?: {
        message?: string;
    };
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    const { conversationId } = await params;

    // Security validation: prevent injection attacks
    if (!CONVERSATION_ID_REGEX.test(conversationId)) {
        return NextResponse.json(
            { status: 'error', error: 'Invalid conversation ID format' },
            { status: 400 }
        );
    }

    const workspaceId = process.env.DUST_WORKSPACE_ID;
    const apiKey = process.env.DUST_API_KEY;

    if (!workspaceId || !apiKey) {
        return NextResponse.json(
            { status: 'error', error: 'Missing Dust API credentials' },
            { status: 500 }
        );
    }

    try {
        // Fetch conversation status from Dust
        const response = await fetch(
            `https://dust.tt/api/v1/w/${workspaceId}/assistant/conversations/${conversationId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { status: 'error', error: 'Conversation not found' },
                    { status: 404 }
                );
            }
            const errorText = await response.text();
            return NextResponse.json(
                { status: 'error', error: `Dust API error ${response.status}: ${errorText.substring(0, 100)}` },
                { status: 502 }
            );
        }

        const data = await response.json();
        const contentArrays = data.conversation?.content || [];

        if (contentArrays.length === 0) {
            return NextResponse.json({
                status: 'pending',
                message: 'Conversation initializing...'
            });
        }

        // Find the agent message in the nested content structure
        // content is a 2D array: content[0] = user messages, content[1] = agent messages, etc.
        let agentMessage: AgentMessage | null = null;
        for (const messageGroup of contentArrays) {
            if (Array.isArray(messageGroup)) {
                const agent = messageGroup.find((m: AgentMessage) => m.type === 'agent_message');
                if (agent) {
                    agentMessage = agent;
                    break;
                }
            }
        }

        if (!agentMessage) {
            return NextResponse.json({
                status: 'pending',
                message: 'Waiting for agent to start...'
            });
        }

        // Check agent message status
        const agentStatus = agentMessage.status;

        if (agentStatus === 'succeeded' && agentMessage.content) {
            return NextResponse.json({
                status: 'complete',
                analysis: agentMessage.content
            });
        }

        if (agentStatus === 'failed' || agentStatus === 'cancelled') {
            return NextResponse.json({
                status: 'error',
                error: agentMessage.error?.message || `Agent ${agentStatus}`
            });
        }

        // Still processing (created, running, etc.)
        return NextResponse.json({
            status: 'pending',
            message: `Agent is ${agentStatus || 'processing'}...`
        });

    } catch (error) {
        console.error('Error polling conversation:', error);
        return NextResponse.json(
            {
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
}
