import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BatchRequest {
  domains: string[];
  email: string;
  webhook_url?: string;
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
    console.log('Batch marketing plans request received');
    
    const { domains, email, webhook_url }: BatchRequest = await req.json();
    
    // Validate input
    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      throw new Error('Domains array is required and must not be empty');
    }
    
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required');
    }
    
    // Validate domains (basic validation)
    const validDomains = domains.filter(domain => {
      const cleaned = domain.trim();
      return cleaned.length > 0 && cleaned.includes('.');
    });
    
    if (validDomains.length === 0) {
      throw new Error('No valid domains provided');
    }
    
    console.log(`Creating batch job for ${validDomains.length} domains, email: ${email}`);
    
    // Create batch job record
    const { data: batchJob, error: insertError } = await supabase
      .from('batch_jobs')
      .insert({
        domains: validDomains,
        email,
        total_domains: validDomains.length,
        status: 'pending'
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating batch job:', insertError);
      throw new Error(`Failed to create batch job: ${insertError.message}`);
    }
    
    console.log(`Batch job created with ID: ${batchJob.id}`);
    
    // Update status to processing and set started_at
    const { error: updateError } = await supabase
      .from('batch_jobs')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', batchJob.id);
    
    if (updateError) {
      console.error('Error updating batch job status:', updateError);
    }
    
    // Trigger processing of the first company
    try {
      const { error: functionError } = await supabase.functions.invoke('process-batch-company', {
        body: {
          batch_job_id: batchJob.id,
          domain_index: 0,
          webhook_url
        }
      });
      
      if (functionError) {
        console.error('Error invoking process-batch-company:', functionError);
        // Don't throw here as the batch job is created, just log the error
      } else {
        console.log('Successfully triggered first company processing');
      }
    } catch (error) {
      console.error('Error triggering first company processing:', error);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        batch_job_id: batchJob.id,
        total_domains: validDomains.length,
        status: 'processing',
        message: 'Batch processing started successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('Batch marketing plans error:', error);
    
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