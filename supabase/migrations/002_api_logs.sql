-- API Logs Table
-- Tracks all external API calls for monitoring and debugging

CREATE TABLE IF NOT EXISTS api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  endpoint VARCHAR(100) NOT NULL,
  method VARCHAR(10) NOT NULL,
  domain VARCHAR(255),
  api_key_hash VARCHAR(64),
  status_code INT NOT NULL,
  response_time_ms INT,
  error_message TEXT,
  metadata JSONB
);

-- Index for faster queries by timestamp
CREATE INDEX idx_api_logs_timestamp ON api_logs (timestamp DESC);

-- Index for filtering by status code
CREATE INDEX idx_api_logs_status ON api_logs (status_code);

-- Index for filtering by endpoint
CREATE INDEX idx_api_logs_endpoint ON api_logs (endpoint);

-- Enable RLS
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role full access
CREATE POLICY "Service role has full access to api_logs"
  ON api_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comment for documentation
COMMENT ON TABLE api_logs IS 'Logs all external API calls for monitoring and debugging';
