/*
  # Recording History System

  1. New Tables
    - `recording_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - Recording name/title
      - `mode` (text) - Recording mode: 'voice-only', 'live-mix', 'post-mix'
      - `duration` (numeric) - Recording duration in seconds
      - `voice_storage_path` (text) - Path to voice file in storage
      - `music_storage_path` (text, nullable) - Path to music file in storage
      - `chord_snapshots` (jsonb, nullable) - Chord progression data
      - `voice_volume` (integer) - Voice volume (0-100)
      - `music_volume` (integer) - Music volume (0-100)
      - `effects_settings` (jsonb, nullable) - Audio effects configuration
      - `waveform_data` (jsonb, nullable) - Pre-computed waveform visualization data
      - `file_size` (bigint) - File size in bytes
      - `mime_type` (text) - Audio mime type
      - `is_favorite` (boolean) - Favorite flag
      - `tags` (text[]) - User tags for organization
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Storage
    - Create storage bucket for recordings with RLS

  3. Security
    - Enable RLS on `recording_history` table
    - Add policies for authenticated users to manage their own recordings
*/

-- Create recording_history table
CREATE TABLE IF NOT EXISTS recording_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('voice-only', 'live-mix', 'post-mix')),
  duration numeric NOT NULL DEFAULT 0,
  voice_storage_path text,
  music_storage_path text,
  chord_snapshots jsonb,
  voice_volume integer DEFAULT 80 CHECK (voice_volume >= 0 AND voice_volume <= 100),
  music_volume integer DEFAULT 50 CHECK (music_volume >= 0 AND music_volume <= 100),
  effects_settings jsonb,
  waveform_data jsonb,
  file_size bigint DEFAULT 0,
  mime_type text DEFAULT 'audio/webm',
  is_favorite boolean DEFAULT false,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE recording_history ENABLE ROW LEVEL SECURITY;

-- Policies for recording_history
CREATE POLICY "Users can view own recordings"
  ON recording_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recordings"
  ON recording_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recordings"
  ON recording_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recordings"
  ON recording_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_recording_history_user_id ON recording_history(user_id);
CREATE INDEX IF NOT EXISTS idx_recording_history_created_at ON recording_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recording_history_mode ON recording_history(mode);
CREATE INDEX IF NOT EXISTS idx_recording_history_is_favorite ON recording_history(is_favorite) WHERE is_favorite = true;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_recording_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recording_history_updated_at
  BEFORE UPDATE ON recording_history
  FOR EACH ROW
  EXECUTE FUNCTION update_recording_history_updated_at();

-- Create storage bucket for recordings (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('recordings', 'recordings', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for recordings bucket
CREATE POLICY "Users can upload own recordings"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'recordings' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own recordings"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'recordings' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own recordings"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'recordings' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own recordings"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'recordings' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
