import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const url = new URL(req.url);
    const batchJobId = url.pathname.split('/').pop();
    
    if (!batchJobId) {
      throw new Error('Batch job ID is required');
    }
    
    console.log(`Getting status for batch job: ${batchJobId}`);
    
    // Get batch job details
    const { data: batchJob, error } = await supabase
      .from('batch_jobs')
      .select('*')
      .eq('id', batchJobId)
      .single();
    
    if (error) {
      console.error('Error fetching batch job:', error);
      throw new Error(`Batch job not found: ${error.message}`);
    }
    
    if (!batchJob) {
      throw new Error('Batch job not found');
    }
    
    // Calculate progress percentage
    const progressPercentage = batchJob.total_domains > 0 
      ? Math.round((batchJob.processed_domains / batchJob.total_domains) * 100)
      : 0;
    
    // Calculate estimated time remaining (rough estimate based on average processing time)
    const avgProcessingTimePerCompany = 180000; // 3 minutes in milliseconds
    const remainingCompanies = batchJob.total_domains - batchJob.processed_domains;
    const estimatedTimeRemaining = remainingCompanies * avgProcessingTimePerCompany;
    
    const response = {
      batch_job_id: batchJob.id,
      status: batchJob.status,
      progress: {
        processed: batchJob.processed_domains,
        total: batchJob.total_domains,
        failed: batchJob.failed_domains,
        successful: batchJob.processed_domains - batchJob.failed_domains,
        percentage: progressPercentage
      },
      timing: {
        created_at: batchJob.created_at,
        started_at: batchJob.started_at,
        completed_at: batchJob.completed_at,
        estimated_remaining_ms: batchJob.status === 'processing' ? estimatedTimeRemaining : 0
      },
      email: batchJob.email,
      domains: batchJob.domains,
      results: batchJob.results || {},
      error_message: batchJob.error_message
    };
    
    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('Batch status error:', error);
    
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