
-- Add the missing error_summary column to batch_jobs table
ALTER TABLE public.batch_jobs 
ADD COLUMN error_summary JSONB DEFAULT '{}';

-- Add an index on the error_summary column for better query performance
CREATE INDEX idx_batch_jobs_error_summary ON public.batch_jobs USING GIN (error_summary);

-- Update the trigger function to handle the new column
CREATE OR REPLACE FUNCTION update_batch_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
