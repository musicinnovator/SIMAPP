/*
  # Create Tiered Arpeggio System Tables

  1. New Tables
    - `user_arpeggio_sequences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `description` (text)
      - `notes` (text) - e.g., "1-3-5-3"
      - `is_long` (boolean)
      - `length` (integer)
      - `category` (text) - 'short', 'medium', 'long', 'continuous'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_rhythm_patterns`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `description` (text)
      - `type` (text) - 'even', 'dotted', 'swing', 'shuffle', 'syncopated', 'triplet', 'combination', 'custom'
      - `subdivision` (text) - 'whole', 'half', 'quarter', 'eighth', 'sixteenth', etc.
      - `durations` (jsonb) - array of relative durations
      - `swing_amount` (numeric, nullable)
      - `accent_pattern` (jsonb, nullable) - array of velocity multipliers
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_arpeggio_configs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `description` (text)
      - `sequence_id` (uuid, nullable) - references user_arpeggio_sequences or null for built-in
      - `rhythm_id` (uuid, nullable) - references user_rhythm_patterns or null for built-in
      - `sequence_data` (jsonb) - full sequence data for built-in patterns
      - `rhythm_data` (jsonb) - full rhythm data for built-in patterns
      - `distribution_config` (jsonb) - distribution settings
      - `restrict_incompatible` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only read/write their own patterns
    - Add policies for authenticated users
*/

-- Create user_arpeggio_sequences table
CREATE TABLE IF NOT EXISTS user_arpeggio_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  notes text NOT NULL,
  is_long boolean DEFAULT false,
  length integer NOT NULL,
  category text NOT NULL CHECK (category IN ('short', 'medium', 'long', 'continuous')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_arpeggio_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own arpeggio sequences"
  ON user_arpeggio_sequences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own arpeggio sequences"
  ON user_arpeggio_sequences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own arpeggio sequences"
  ON user_arpeggio_sequences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own arpeggio sequences"
  ON user_arpeggio_sequences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_rhythm_patterns table
CREATE TABLE IF NOT EXISTS user_rhythm_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL CHECK (type IN ('even', 'dotted', 'swing', 'shuffle', 'syncopated', 'triplet', 'combination', 'custom')),
  subdivision text NOT NULL,
  durations jsonb NOT NULL,
  swing_amount numeric,
  accent_pattern jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_rhythm_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rhythm patterns"
  ON user_rhythm_patterns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rhythm patterns"
  ON user_rhythm_patterns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rhythm patterns"
  ON user_rhythm_patterns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own rhythm patterns"
  ON user_rhythm_patterns FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_arpeggio_configs table
CREATE TABLE IF NOT EXISTS user_arpeggio_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  sequence_id uuid REFERENCES user_arpeggio_sequences(id) ON DELETE SET NULL,
  rhythm_id uuid REFERENCES user_rhythm_patterns(id) ON DELETE SET NULL,
  sequence_data jsonb,
  rhythm_data jsonb,
  distribution_config jsonb NOT NULL DEFAULT '{"mode": "continuous", "enabled": false}'::jsonb,
  restrict_incompatible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_arpeggio_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own arpeggio configs"
  ON user_arpeggio_configs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own arpeggio configs"
  ON user_arpeggio_configs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own arpeggio configs"
  ON user_arpeggio_configs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own arpeggio configs"
  ON user_arpeggio_configs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_arpeggio_sequences_user_id ON user_arpeggio_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_arpeggio_sequences_category ON user_arpeggio_sequences(category);
CREATE INDEX IF NOT EXISTS idx_user_rhythm_patterns_user_id ON user_rhythm_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rhythm_patterns_type ON user_rhythm_patterns(type);
CREATE INDEX IF NOT EXISTS idx_user_arpeggio_configs_user_id ON user_arpeggio_configs(user_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_user_arpeggio_sequences_updated_at ON user_arpeggio_sequences;
CREATE TRIGGER update_user_arpeggio_sequences_updated_at
  BEFORE UPDATE ON user_arpeggio_sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_rhythm_patterns_updated_at ON user_rhythm_patterns;
CREATE TRIGGER update_user_rhythm_patterns_updated_at
  BEFORE UPDATE ON user_rhythm_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_arpeggio_configs_updated_at ON user_arpeggio_configs;
CREATE TRIGGER update_user_arpeggio_configs_updated_at
  BEFORE UPDATE ON user_arpeggio_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();