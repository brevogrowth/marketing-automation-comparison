
-- Create batch_jobs table for tracking batch processing requests
CREATE TABLE public.batch_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domains TEXT[] NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  results JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  total_domains INTEGER NOT NULL,
  processed_domains INTEGER NOT NULL DEFAULT 0,
  failed_domains INTEGER NOT NULL DEFAULT 0
);

-- Add RLS policies for batch_jobs
ALTER TABLE public.batch_jobs ENABLE ROW LEVEL SECURITY;

-- Allow public access to batch_jobs (since we don't have user authentication)
CREATE POLICY "Allow public access to batch_jobs" 
  ON public.batch_jobs 
  FOR ALL 
  USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_batch_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER batch_jobs_updated_at_trigger
  BEFORE UPDATE ON public.batch_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_batch_jobs_updated_at();
