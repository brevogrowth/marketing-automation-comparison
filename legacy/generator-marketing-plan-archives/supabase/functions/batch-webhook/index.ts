import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookRequest {
  webhook_url: string;
  batch_job_id: string;
  domain: string;
  success: boolean;
  error?: string;
  progress: {
    processed: number;
    total: number;
    failed: number;
  };
  is_complete: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      webhook_url,
      batch_job_id,
      domain,
      success,
      error,
      progress,
      is_complete
    }: WebhookRequest = await req.json();
    
    console.log(`Sending webhook for batch ${batch_job_id}, domain: ${domain}`);
    
    // Prepare webhook payload
    const webhookPayload = {
      event_type: is_complete ? 'batch_completed' : 'company_processed',
      batch_job_id,
      domain,
      success,
      error,
      progress,
      is_complete,
      timestamp: new Date().toISOString()
    };
    
    // Send webhook
    try {
      const webhookResponse = await fetch(webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'BatchMarketingPlans/1.0'
        },
        body: JSON.stringify(webhookPayload)
      });
      
      const responseText = await webhookResponse.text();
      
      if (!webhookResponse.ok) {
        console.error(`Webhook failed with status ${webhookResponse.status}: ${responseText}`);
        throw new Error(`Webhook failed: ${webhookResponse.status} ${responseText}`);
      }
      
      console.log(`Webhook sent successfully for ${domain}, response: ${responseText}`);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Webhook sent successfully',
          webhook_response_status: webhookResponse.status
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
      
    } catch (webhookError) {
      console.error(`Error sending webhook to ${webhook_url}:`, webhookError);
      
      // Don't fail the entire process if webhook fails
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to send webhook: ${webhookError.message}`,
          webhook_url
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
  } catch (error) {
    console.error('Batch webhook error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});