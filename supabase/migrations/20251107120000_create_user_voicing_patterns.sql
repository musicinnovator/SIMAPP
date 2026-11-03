/*
  # Create User Voicing Patterns System

  ## Overview
  This migration creates a system for users to save and manage custom voicing patterns
  for Block, Arpeggiated, and Broken voicing techniques.

  ## New Tables

  ### `user_voicing_patterns`
  Stores custom user-created voicing patterns alongside built-in patterns.

  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for the pattern
  - `user_id` (uuid, foreign key) - References auth.users
  - `pattern_type` (text) - Type of voicing: 'block', 'arpeggiated', or 'broken'
  - `pattern_name` (text) - User-defined name for the pattern
  - `pattern_data` (jsonb) - Complete pattern configuration (BlockPattern | ArpeggiatedPattern | BrokenPattern)
  - `is_favorite` (boolean) - Whether user marked as favorite
  - `created_at` (timestamptz) - When pattern was created
  - `updated_at` (timestamptz) - Last modification time

  ## Security

  ### Row Level Security (RLS)
  - **Enabled** on `user_voicing_patterns` table
  - Users can only read, create, update, and delete their own patterns
  - No public access - all operations require authentication

  ### RLS Policies
  1. **"Users can view own voicing patterns"** - SELECT access to own patterns
  2. **"Users can create own voicing patterns"** - INSERT new patterns
  3. **"Users can update own voicing patterns"** - UPDATE existing patterns
  4. **"Users can delete own voicing patterns"** - DELETE patterns

  ## Indexes
  - Primary key index on `id`
  - Index on `user_id` for fast user lookups
  - Index on `pattern_type` for filtering by type
  - Composite index on (`user_id`, `pattern_type`) for common queries

  ## Notes
  - Pattern data validation should be done client-side before insertion
  - The `pattern_data` JSONB column allows flexible storage of different pattern types
  - Triggers automatically update `updated_at` timestamp on modifications
*/

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
