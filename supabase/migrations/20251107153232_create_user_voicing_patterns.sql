-- Create user_voicing_patterns table
CREATE TABLE IF NOT EXISTS user_voicing_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_type text NOT NULL CHECK (pattern_type IN ('block', 'arpeggiated', 'broken')),
  pattern_name text NOT NULL,
  pattern_data jsonb NOT NULL,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT pattern_name_not_empty CHECK (length(trim(pattern_name)) > 0)
);

-- Enable Row Level Security
ALTER TABLE user_voicing_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own voicing patterns
CREATE POLICY "Users can view own voicing patterns"
  ON user_voicing_patterns
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policy: Users can create their own voicing patterns
CREATE POLICY "Users can create own voicing patterns"
  ON user_voicing_patterns
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own voicing patterns
CREATE POLICY "Users can update own voicing patterns"
  ON user_voicing_patterns
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own voicing patterns
CREATE POLICY "Users can delete own voicing patterns"
  ON user_voicing_patterns
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_voicing_patterns_user_id
  ON user_voicing_patterns(user_id);

CREATE INDEX IF NOT EXISTS idx_user_voicing_patterns_pattern_type
  ON user_voicing_patterns(pattern_type);

CREATE INDEX IF NOT EXISTS idx_user_voicing_patterns_user_pattern_type
  ON user_voicing_patterns(user_id, pattern_type);

CREATE INDEX IF NOT EXISTS idx_user_voicing_patterns_is_favorite
  ON user_voicing_patterns(user_id, is_favorite) WHERE is_favorite = true;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_voicing_patterns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row modification
DROP TRIGGER IF EXISTS trigger_update_user_voicing_patterns_updated_at ON user_voicing_patterns;

CREATE TRIGGER trigger_update_user_voicing_patterns_updated_at
  BEFORE UPDATE ON user_voicing_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_user_voicing_patterns_updated_at();

-- Add helpful comment to table
COMMENT ON TABLE user_voicing_patterns IS 'Stores user-created custom voicing patterns for Block, Arpeggiated, and Broken techniques';
COMMENT ON COLUMN user_voicing_patterns.pattern_data IS 'JSONB containing complete pattern configuration (BlockPattern | ArpeggiatedPattern | BrokenPattern)';