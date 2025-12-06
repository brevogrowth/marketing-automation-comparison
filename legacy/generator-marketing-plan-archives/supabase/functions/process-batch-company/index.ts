
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { retryWithBackoff, RETRY_CONFIGS, CircuitBreaker } from './retryUtils.ts'
import { BatchErrorHandler } from './batchErrorHandler.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessRequest {
  batch_job_id: string;
  domain_index: number;
  webhook_url?: string;
  retry_attempt?: number;
}

// Create circuit breaker for external API
const marketingApiCircuitBreaker = new CircuitBreaker(5, 300000); // 5 failures, 5 minute recovery

// Create error handler for this batch
const batchErrorHandler = new BatchErrorHandler();

// Utility function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced function to start analysis with retry logic using front-end compatible API
async function startAnalysisWithRetry(domain: string, retryAttempt: number = 0): Promise<{ 
  success: boolean; 
  conversationId?: string; 
  error?: string; 
  shouldRetry?: boolean;
}> {
  const operationName = `startAnalysis-${domain}`;
  
  const result = await retryWithBackoff(
    async () => {
      console.log(`Starting analysis for domain: ${domain} (attempt ${retryAttempt + 1})`);
      
      // Use circuit breaker to protect against failing API
      return await marketingApiCircuitBreaker.execute(async () => {
        // Updated to use the same API endpoint as front-end with matching request format
        const response = await fetch('https://dusty-backend.netlify.app/.netlify/functions/start-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `Analyze company ${domain}`,
            inputs: { company: domain },
            agentConfigId: "RODve63vcy"
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle the response format from the front-end compatible API
        // The API returns conversationSId instead of conversation_id
        if (!data.conversationSId) {
          throw new Error('Invalid response: missing conversationSId');
        }
        
        console.log(`Analysis started for ${domain}, conversation ID: ${data.conversationSId}`);
        
        return data;
      });
    },
    operationName,
    RETRY_CONFIGS.START_ANALYSIS
  );
  
  if (result.success) {
    // Clear any previous errors for this domain
    batchErrorHandler.clearDomainErrors(domain);
    
    return {
      success: true,
      conversationId: result.data.conversationSId // Use conversationSId from the response
    };
  } else {
    // Record the error
    const batchError = batchErrorHandler.recordError(
      domain,
      result.error || 'Unknown error',
      result.attempts,
      result.error ? result.error.includes('50') || result.error.includes('timeout') : false
    );
    
    console.error(`Failed to start analysis for ${domain} after ${result.attempts} attempts:`, result.error);
    
    return {
      success: false,
      error: result.error,
      shouldRetry: batchError.shouldRetry && retryAttempt < 2
    };
  }
}

// Enhanced function to get analysis result with retry logic using front-end compatible API
async function getAnalysisAnswerWithRetry(conversationId: string, domain: string): Promise<{ 
  success: boolean; 
  data?: any; 
  error?: string; 
  isComplete?: boolean;
  shouldRetry?: boolean;
}> {
  const operationName = `getAnalysisAnswer-${domain}`;
  
  const result = await retryWithBackoff(
    async () => {
      return await marketingApiCircuitBreaker.execute(async () => {
        // Updated to use the same API endpoint as front-end
        const response = await fetch(`https://dusty-backend.netlify.app/.netlify/functions/analysis-answer?id=${conversationId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Analysis not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Check if analysis is complete using the same logic as front-end
        const isComplete = data.status === 'succeeded' || data.status === 'completed';
        
        let analysisData = null;
        if (isComplete && data.response?.data?.content) {
          analysisData = data.response.data.content;
        }
        
        return { data: analysisData, isComplete, rawResponse: data };
      });
    },
    operationName,
    RETRY_CONFIGS.GET_ANALYSIS
  );
  
  if (result.success) {
    return {
      success: true,
      data: result.data.data,
      isComplete: result.data.isComplete
    };
  } else {
    const batchError = batchErrorHandler.recordError(
      domain,
      result.error || 'Unknown error',
      result.attempts,
      result.error ? !result.error.includes('not found') : false
    );
    
    console.error(`Error getting analysis for ${domain}:`, result.error);
    
    return {
      success: false,
      error: result.error,
      shouldRetry: batchError.shouldRetry
    };
  }
}

// Enhanced function to save marketing plan with retry logic
async function saveMarketingPlanWithRetry(supabase: any, domain: string, email: string, planData: any): Promise<{ 
  success: boolean; 
  error?: string;
  shouldRetry?: boolean;
}> {
  const operationName = `saveMarketingPlan-${domain}`;
  
  const result = await retryWithBackoff(
    async () => {
      const { error } = await supabase
        .from('marketing_plans')
        .insert({
          company_domain: domain,
          email,
          form_data: planData,
          user_language: 'en'
        });

      if (error) {
        throw new Error(error.message);
      }
      
      return { success: true };
    },
    operationName,
    RETRY_CONFIGS.SAVE_PLAN
  );
  
  if (result.success) {
    console.log(`Marketing plan saved successfully for ${domain}`);
    return { success: true };
  } else {
    const batchError = batchErrorHandler.recordError(
      domain,
      result.error || 'Unknown error',
      result.attempts,
      true // Database errors are usually retryable
    );
    
    console.error(`Error saving marketing plan for ${domain}:`, result.error);
    
    return {
      success: false,
      error: result.error,
      shouldRetry: batchError.shouldRetry
    };
  }
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
    const { batch_job_id, domain_index, webhook_url, retry_attempt = 0 }: ProcessRequest = await req.json();
    
    console.log(`Processing company ${domain_index} for batch job ${batch_job_id} (retry attempt: ${retry_attempt})`);
    
    // Get batch job details
    const { data: batchJob, error: fetchError } = await supabase
      .from('batch_jobs')
      .select('*')
      .eq('id', batch_job_id)
      .single();
    
    if (fetchError || !batchJob) {
      throw new Error(`Batch job not found: ${fetchError?.message || 'Unknown error'}`);
    }
    
    if (domain_index >= batchJob.domains.length) {
      throw new Error(`Domain index ${domain_index} is out of range`);
    }
    
    const domain = batchJob.domains[domain_index];
    console.log(`Processing domain: ${domain}`);
    
    // Check if domain is blacklisted due to too many failures
    if (batchErrorHandler.isDomainBlacklisted(domain)) {
      console.log(`Domain ${domain} is blacklisted due to too many failures`);
      throw new Error(`Domain ${domain} has exceeded maximum failure threshold`);
    }
    
    let success = false;
    let errorMessage = '';
    let shouldRetryDomain = false;
    
    try {
      // Start analysis with retry logic using front-end compatible API
      const analysisResult = await startAnalysisWithRetry(domain, retry_attempt);
      
      if (!analysisResult.success) {
        shouldRetryDomain = analysisResult.shouldRetry || false;
        throw new Error(analysisResult.error || 'Failed to start analysis');
      }
      
      // Poll for completion with enhanced retry logic
      const maxAttempts = 30;
      let attempt = 0;
      let planData = null;
      
      while (attempt < maxAttempts) {
        attempt++;
        console.log(`Polling attempt ${attempt} for ${domain}`);
        
        const result = await getAnalysisAnswerWithRetry(analysisResult.conversationId!, domain);
        
        if (result.success && result.isComplete) {
          planData = result.data;
          break;
        }
        
        if (!result.success) {
          if (result.error?.includes('not found')) {
            throw new Error('Analysis conversation not found');
          }
          
          // Continue polling for other errors
          console.log(`Polling error for ${domain}, continuing...`);
        }
        
        // Wait before next attempt
        await delay(10000);
      }
      
      if (!planData) {
        throw new Error('Analysis timed out - plan generation took too long');
      }
      
      // Save to database with retry logic
      const saveResult = await saveMarketingPlanWithRetry(supabase, domain, batchJob.email, planData);
      
      if (!saveResult.success) {
        shouldRetryDomain = saveResult.shouldRetry || false;
        throw new Error(saveResult.error || 'Failed to save marketing plan');
      }
      
      success = true;
      console.log(`Successfully processed ${domain}`);
      
    } catch (error) {
      console.error(`Error processing ${domain}:`, error);
      errorMessage = error.message;
      success = false;
      
      // Log circuit breaker state
      const circuitState = marketingApiCircuitBreaker.getState();
      console.log(`Circuit breaker state:`, circuitState);
    }
    
    // Update batch job progress
    const newProcessedCount = batchJob.processed_domains + 1;
    const newFailedCount = success ? batchJob.failed_domains : batchJob.failed_domains + 1;
    const isComplete = newProcessedCount >= batchJob.total_domains;
    
    // Update results with retry information
    const updatedResults = { ...batchJob.results };
    updatedResults[domain] = {
      success,
      error: errorMessage || undefined,
      processed_at: new Date().toISOString(),
      retry_attempt,
      should_retry: shouldRetryDomain,
      circuit_breaker_state: marketingApiCircuitBreaker.getState()
    };
    
    const updateData: any = {
      processed_domains: newProcessedCount,
      failed_domains: newFailedCount,
      results: updatedResults
    };
    
    // Add error summary to batch job
    const errorSummary = batchErrorHandler.getErrorSummary();
    updateData.error_summary = errorSummary;
    
    if (isComplete) {
      updateData.status = newFailedCount === batchJob.total_domains ? 'failed' : 'completed';
      updateData.completed_at = new Date().toISOString();
      
      // Generate final error report
      console.log('Final error report:', errorSummary);
    }
    
    const { error: updateError } = await supabase
      .from('batch_jobs')
      .update(updateData)
      .eq('id', batch_job_id);
    
    if (updateError) {
      console.error('Error updating batch job:', updateError);
    }
    
    // Send webhook notification
    if (webhook_url) {
      try {
        await supabase.functions.invoke('batch-webhook', {
          body: {
            webhook_url,
            batch_job_id,
            domain,
            success,
            error: errorMessage || undefined,
            retry_attempt,
            should_retry: shouldRetryDomain,
            progress: {
              processed: newProcessedCount,
              total: batchJob.total_domains,
              failed: newFailedCount
            },
            is_complete: isComplete,
            error_summary: errorSummary
          }
        });
      } catch (webhookError) {
        console.error('Error sending webhook:', webhookError);
      }
    }
    
    // Handle retries and next processing
    if (!success && shouldRetryDomain && retry_attempt < 2) {
      // Schedule retry for this domain
      console.log(`Scheduling retry for ${domain} (attempt ${retry_attempt + 1})`);
      
      setTimeout(async () => {
        try {
          await supabase.functions.invoke('process-batch-company', {
            body: {
              batch_job_id,
              domain_index,
              webhook_url,
              retry_attempt: retry_attempt + 1
            }
          });
        } catch (retryError) {
          console.error('Error scheduling retry:', retryError);
        }
      }, 60000); // Wait 1 minute before retrying
      
    } else if (!isComplete) {
      // Trigger next company processing
      const nextIndex = domain_index + 1;
      console.log(`Triggering next company processing: index ${nextIndex}`);
      
      try {
        await supabase.functions.invoke('process-batch-company', {
          body: {
            batch_job_id,
            domain_index: nextIndex,
            webhook_url
          }
        });
      } catch (nextError) {
        console.error('Error triggering next company:', nextError);
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        domain,
        processing_success: success,
        error: errorMessage || undefined,
        retry_attempt,
        should_retry: shouldRetryDomain,
        is_complete: isComplete,
        progress: {
          processed: newProcessedCount,
          total: batchJob.total_domains,
          failed: newFailedCount
        },
        error_summary: errorSummary
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('Process batch company error:', error);
    
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
