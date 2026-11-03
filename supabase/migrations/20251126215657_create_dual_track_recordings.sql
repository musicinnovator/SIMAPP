/*
  # Create Dual-Track Recordings System

  1. New Tables
    - `dual_track_recordings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `project_name` (text)
      - `vocal_blob_url` (text) - URL to stored vocal track
      - `music_blob_url` (text) - URL to stored music track
      - `combined_blob_url` (text, nullable) - URL to combined export
      - `vocal_volume` (integer) - Volume setting for vocals (0-100)
      - `music_volume` (integer) - Volume setting for music (0-100)
      - `duration` (integer) - Duration in seconds
      - `metadata` (jsonb) - Additional project metadata
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `dual_track_recordings` table
    - Add policies for authenticated users to:
      - Read their own recordings
      - Create new recordings
      - Update their own recordings
      - Delete their own recordings
*/

CREATE TABLE IF NOT EXISTS dual_track_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_name text NOT NULL DEFAULT 'Untitled Recording',
  vocal_blob_url text,
  music_blob_url text,
  combined_blob_url text,
  vocal_volume integer DEFAULT 75 CHECK (vocal_volume >= 0 AND vocal_volume <= 100),
  music_volume integer DEFAULT 80 CHECK (music_volume >= 0 AND music_volume <= 100),
  duration integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dual_track_recordings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own recordings
CREATE POLICY "Users can view own dual-track recordings"
  ON dual_track_recordings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create new recordings
CREATE POLICY "Users can create dual-track recordings"
  ON dual_track_recordings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own recordings
CREATE POLICY "Users can update own dual-track recordings"
  ON dual_track_recordings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own recordings
CREATE POLICY "Users can delete own dual-track recordings"
  ON dual_track_recordings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_dual_track_recordings_user_id
  ON dual_track_recordings(user_id);

CREATE INDEX IF NOT EXISTS idx_dual_track_recordings_created_at
  ON dual_track_recordings(created_at DESC);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_dual_track_recordings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dual_track_recordings_timestamp
  BEFORE UPDATE ON dual_track_recordings
  FOR EACH ROW
  EXECUTE FUNCTION update_dual_track_recordings_updated_at();
