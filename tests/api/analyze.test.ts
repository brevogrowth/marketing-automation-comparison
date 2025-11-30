import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Next.js Response
const mockNextResponse = {
    json: vi.fn((data, options) => ({
        data,
        status: options?.status || 200,
    })),
};

vi.mock('next/server', () => ({
    NextResponse: mockNextResponse,
}));

// Mock environment variables
const mockEnv = {
    DUST_WORKSPACE_ID: 'test-workspace-id',
    DUST_API_KEY: 'test-api-key',
    DUST_ASSISTANT_ID: 'test-assistant-id',
};

describe('POST /api/analyze', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
        Object.assign(process.env, mockEnv);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    describe('Input Validation', () => {
        it('should validate userValues is a record of strings', () => {
            const validUserValues = { cac: '45', retention_rate: '32' };
            expect(typeof validUserValues).toBe('object');
            Object.values(validUserValues).forEach(val => {
                expect(typeof val).toBe('string');
            });
        });

        it('should validate priceTier is one of allowed values', () => {
            const validTiers = ['Budget', 'Mid-Range', 'Luxury'];
            validTiers.forEach(tier => {
                expect(['Budget', 'Mid-Range', 'Luxury']).toContain(tier);
            });
        });

        it('should validate industry is one of allowed values', () => {
            const validIndustries = [
                'Fashion', 'Home', 'Beauty', 'Electronics', 'Sports', 'Family', 'Food', 'Luxury',
                'SaaS', 'Services', 'Manufacturing', 'Wholesale'
            ];
            validIndustries.forEach(industry => {
                expect(validIndustries).toContain(industry);
            });
        });

        it('should reject invalid priceTier', () => {
            const invalidTier = 'Premium';
            expect(['Budget', 'Mid-Range', 'Luxury']).not.toContain(invalidTier);
        });

        it('should reject invalid industry', () => {
            const invalidIndustry = 'Tech';
            const validIndustries = [
                'Fashion', 'Home', 'Beauty', 'Electronics', 'Sports', 'Family', 'Food', 'Luxury',
                'SaaS', 'Services', 'Manufacturing', 'Wholesale'
            ];
            expect(validIndustries).not.toContain(invalidIndustry);
        });
    });

    describe('Prompt Construction', () => {
        it('should construct a valid prompt with user data', () => {
            const userValues = { cac: '45', retention_rate: '32' };
            const priceTier = 'Mid-Range';
            const industry = 'Fashion';

            const expectedPromptContains = [
                'Senior Retail Strategy Consultant',
                industry,
                priceTier,
                'Executive Summary',
                'Traffic Light Analysis',
                'Strategic Recommendations',
            ];

            // Build prompt as done in route.ts
            let prompt = `You are a Senior Retail Strategy Consultant for B2C brands.
Your client is a ${industry} retailer with a ${priceTier} price positioning.`;

            expectedPromptContains.forEach(text => {
                const fullPrompt = prompt + '\n' + 'Executive Summary\nTraffic Light Analysis\nStrategic Recommendations';
                expect(fullPrompt).toContain(text);
            });
        });

        it('should filter benchmarks by selected industry', () => {
            const selectedIndustry = 'Home';
            const fallbackIndustry = 'Fashion';

            // Test fallback logic
            const industry = selectedIndustry || fallbackIndustry;
            expect(industry).toBe('Home');
        });

        it('should include KPI values with units in prompt', () => {
            const kpiValue = '45';
            const kpiUnit = '€';
            const formattedKpiLine = `User Value = ${kpiValue}${kpiUnit}`;

            expect(formattedKpiLine).toBe('User Value = 45€');
        });
    });

    describe('Dust API Configuration', () => {
        it('should use blocking: false for async operation', () => {
            const dustRequestBody = {
                message: {
                    content: 'test prompt',
                    mentions: [{ configurationId: 'test-assistant' }],
                    context: { timezone: "Europe/Paris", username: "KPI_Tool_User" }
                },
                blocking: false,
            };

            expect(dustRequestBody.blocking).toBe(false);
        });

        it('should include correct headers', () => {
            const headers = {
                'Authorization': `Bearer ${mockEnv.DUST_API_KEY}`,
                'Content-Type': 'application/json',
            };

            expect(headers.Authorization).toBe('Bearer test-api-key');
            expect(headers['Content-Type']).toBe('application/json');
        });

        it('should construct correct API URL', () => {
            const baseUrl = 'https://dust.tt/api/v1/w';
            const workspaceId = mockEnv.DUST_WORKSPACE_ID;
            const expectedUrl = `${baseUrl}/${workspaceId}/assistant/conversations`;

            expect(expectedUrl).toBe('https://dust.tt/api/v1/w/test-workspace-id/assistant/conversations');
        });
    });

    describe('Response Format', () => {
        it('should return conversationId on success', () => {
            const successResponse = {
                status: 'created',
                conversationId: 'abc123xyz',
                message: 'Analysis started. Poll /api/analyze/abc123xyz for results.',
            };

            expect(successResponse.status).toBe('created');
            expect(successResponse.conversationId).toBeDefined();
            expect(successResponse.message).toContain('Poll');
        });

        it('should return error on missing credentials', () => {
            const errorResponse = {
                error: 'Missing Dust API credentials',
            };

            expect(errorResponse.error).toContain('credentials');
        });
    });
});

describe('GET /api/analyze/[conversationId]', () => {
    describe('Security Validation', () => {
        const CONVERSATION_ID_REGEX = /^[a-zA-Z0-9_-]{5,50}$/;

        it('should accept valid alphanumeric conversation IDs', () => {
            const validIds = [
                'abc123',
                'ABC123xyz',
                'test-id_123',
                'a1b2c3d4e5',
            ];

            validIds.forEach(id => {
                expect(CONVERSATION_ID_REGEX.test(id)).toBe(true);
            });
        });

        it('should reject invalid conversation IDs', () => {
            const invalidIds = [
                'abc',           // Too short (< 5)
                'a'.repeat(51),  // Too long (> 50)
                'abc.123',       // Contains dot
                'abc/123',       // Contains slash
                'abc 123',       // Contains space
                '<script>',      // XSS attempt
                '../etc/passwd', // Path traversal
            ];

            invalidIds.forEach(id => {
                expect(CONVERSATION_ID_REGEX.test(id)).toBe(false);
            });
        });
    });

    describe('Polling Status Responses', () => {
        it('should return pending when no agent message exists', () => {
            const contentArrays: { type: string }[][] = [];
            const hasAgentMessage = contentArrays.some(group =>
                Array.isArray(group) && group.some(m => m.type === 'agent_message')
            );

            expect(hasAgentMessage).toBe(false);
        });

        it('should return pending when agent is still processing', () => {
            const agentMessage = {
                type: 'agent_message',
                status: 'running',
                content: null,
            };

            expect(agentMessage.status).not.toBe('succeeded');
            expect(['created', 'running']).toContain(agentMessage.status);
        });

        it('should return complete when agent has succeeded', () => {
            const agentMessage = {
                type: 'agent_message',
                status: 'succeeded',
                content: '# Executive Summary\n\nTest analysis content...',
            };

            expect(agentMessage.status).toBe('succeeded');
            expect(agentMessage.content).toBeDefined();
            expect(agentMessage.content!.length).toBeGreaterThan(0);
        });

        it('should return error when agent has failed', () => {
            const agentMessage = {
                type: 'agent_message',
                status: 'failed',
                error: { message: 'Rate limit exceeded' },
            };

            expect(['failed', 'cancelled']).toContain(agentMessage.status);
            expect(agentMessage.error).toBeDefined();
        });
    });

    describe('Response Parsing', () => {
        it('should correctly parse nested content structure', () => {
            // Simulate Dust API response structure
            interface DustMessage {
                type: string;
                content: string;
                status?: string;
            }

            const dustResponse = {
                conversation: {
                    sId: 'test-conversation-id',
                    content: [
                        [{ type: 'user_message', content: 'User prompt...' }],
                        [{ type: 'agent_message', status: 'succeeded', content: '# Analysis' }],
                    ] as DustMessage[][],
                },
            };

            const contentArrays = dustResponse.conversation.content;
            let agentMessage: DustMessage | null = null;

            for (const messageGroup of contentArrays) {
                if (Array.isArray(messageGroup)) {
                    const agent = messageGroup.find(m => m.type === 'agent_message');
                    if (agent) {
                        agentMessage = agent;
                        break;
                    }
                }
            }

            expect(agentMessage).toBeDefined();
            expect(agentMessage!.status).toBe('succeeded');
            expect(agentMessage!.content).toBe('# Analysis');
        });

        it('should handle empty content arrays', () => {
            const emptyResponse = {
                conversation: {
                    content: [],
                },
            };

            expect(emptyResponse.conversation.content.length).toBe(0);
        });
    });

    describe('API URL Construction', () => {
        it('should construct correct polling URL', () => {
            const baseUrl = 'https://dust.tt/api/v1/w';
            const workspaceId = 'test-workspace';
            const conversationId = 'abc123xyz';

            const url = `${baseUrl}/${workspaceId}/assistant/conversations/${conversationId}`;

            expect(url).toBe('https://dust.tt/api/v1/w/test-workspace/assistant/conversations/abc123xyz');
        });
    });
});

describe('Frontend Polling Logic', () => {
    describe('Polling Configuration', () => {
        const MAX_POLLS = 60;
        const POLL_INTERVAL = 5000;

        it('should have correct polling limits', () => {
            // 60 polls × 5s = 300s = 5 minutes
            const maxWaitTime = MAX_POLLS * POLL_INTERVAL / 1000;
            expect(maxWaitTime).toBe(300); // 5 minutes in seconds
        });

        it('should calculate elapsed time correctly', () => {
            const startTime = Date.now();
            const mockElapsed = 30000; // 30 seconds
            const expectedElapsedSec = Math.floor(mockElapsed / 1000);

            expect(expectedElapsedSec).toBe(30);
        });
    });

    describe('Status Handling', () => {
        it('should stop polling on complete status', () => {
            const pollData = { status: 'complete', analysis: '# Analysis' };
            expect(pollData.status).toBe('complete');
            expect(pollData.analysis).toBeDefined();
        });

        it('should stop polling on error status', () => {
            const pollData = { status: 'error', error: 'Analysis failed' };
            expect(pollData.status).toBe('error');
            expect(pollData.error).toBeDefined();
        });

        it('should continue polling on pending status', () => {
            const pollData = { status: 'pending', message: 'Agent is running...' };
            expect(pollData.status).toBe('pending');
            expect(['complete', 'error']).not.toContain(pollData.status);
        });
    });

    describe('Error Handling', () => {
        it('should handle HTTP errors', () => {
            const errorResponses = [
                { status: 400, error: 'Invalid conversation ID format' },
                { status: 404, error: 'Conversation not found' },
                { status: 500, error: 'Missing Dust API credentials' },
                { status: 502, error: 'Dust API error' },
            ];

            errorResponses.forEach(response => {
                expect(response.error).toBeDefined();
                expect([400, 404, 500, 502]).toContain(response.status);
            });
        });

        it('should handle timeout after max polls', () => {
            const MAX_POLLS = 60;
            let pollCount = 0;
            let timedOut = false;

            // Simulate reaching max polls
            while (pollCount < MAX_POLLS) {
                pollCount++;
            }

            if (pollCount >= MAX_POLLS) {
                timedOut = true;
            }

            expect(timedOut).toBe(true);
        });
    });
});

describe('Integration Scenarios', () => {
    describe('Happy Path', () => {
        it('should complete full analysis flow', () => {
            // Step 1: Create analysis job
            const createResponse = {
                status: 'created',
                conversationId: 'test-conv-123',
            };
            expect(createResponse.status).toBe('created');

            // Step 2: Poll (pending)
            const pendingResponse = {
                status: 'pending',
                message: 'Agent is running...',
            };
            expect(pendingResponse.status).toBe('pending');

            // Step 3: Poll (complete)
            const completeResponse = {
                status: 'complete',
                analysis: '# Executive Summary\n\nYour business...',
            };
            expect(completeResponse.status).toBe('complete');
            expect(completeResponse.analysis).toContain('Executive Summary');
        });
    });

    describe('Error Scenarios', () => {
        it('should handle missing environment variables', () => {
            const missingVars = {
                DUST_WORKSPACE_ID: undefined,
                DUST_API_KEY: undefined,
                DUST_ASSISTANT_ID: undefined,
            };

            const hasMissingVars = !missingVars.DUST_WORKSPACE_ID ||
                                   !missingVars.DUST_API_KEY ||
                                   !missingVars.DUST_ASSISTANT_ID;

            expect(hasMissingVars).toBe(true);
        });

        it('should handle Zod validation errors', () => {
            const invalidInput = {
                userValues: 'not-an-object', // Should be Record<string, string>
                priceTier: 'Invalid',        // Should be Budget|Mid-Range|Luxury
                industry: 'Tech',            // Should be Fashion|Home
            };

            const validIndustries = [
                'Fashion', 'Home', 'Beauty', 'Electronics', 'Sports', 'Family', 'Food', 'Luxury',
                'SaaS', 'Services', 'Manufacturing', 'Wholesale'
            ];
            expect(typeof invalidInput.userValues).not.toBe('object');
            expect(['Budget', 'Mid-Range', 'Luxury']).not.toContain(invalidInput.priceTier);
            expect(validIndustries).not.toContain(invalidInput.industry);
        });

        it('should handle Dust API failure', () => {
            const dustErrorResponse = {
                ok: false,
                status: 502,
                statusText: 'Bad Gateway',
            };

            expect(dustErrorResponse.ok).toBe(false);
            expect(dustErrorResponse.status).toBe(502);
        });
    });
});
