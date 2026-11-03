/*
  # Create Recording Presets System

  1. New Tables
    - `recording_presets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text) - User-friendly preset name
      - `settings` (jsonb) - All music and effects settings
      - `scripture_reference` (text, nullable) - Optional link to specific scripture
      - `is_favorite` (boolean) - User can mark favorites
      - `use_count` (integer) - Track how often used
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `recording_presets` table
    - Add policies for authenticated users to:
      - Read their own presets
      - Create new presets
      - Update their own presets
      - Delete their own presets
*/

CREATE TABLE IF NOT EXISTS recording_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT 'Untitled Preset',
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  scripture_reference text,
  is_favorite boolean DEFAULT false,
  use_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE recording_presets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own presets
CREATE POLICY "Users can view own recording presets"
  ON recording_presets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create new presets
CREATE POLICY "Users can create recording presets"
  ON recording_presets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own presets
CREATE POLICY "Users can update own recording presets"
  ON recording_presets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own presets
CREATE POLICY "Users can delete own recording presets"
  ON recording_presets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_recording_presets_user_id
  ON recording_presets(user_id);

CREATE INDEX IF NOT EXISTS idx_recording_presets_is_favorite
  ON recording_presets(user_id, is_favorite)
  WHERE is_favorite = true;

CREATE INDEX IF NOT EXISTS idx_recording_presets_use_count
  ON recording_presets(user_id, use_count DESC);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_recording_presets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_recording_presets_timestamp
  BEFORE UPDATE ON recording_presets
  FOR EACH ROW
  EXECUTE FUNCTION update_recording_presets_updated_at();
