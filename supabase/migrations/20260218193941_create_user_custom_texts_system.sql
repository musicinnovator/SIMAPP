/*
  # User Custom Texts System

  ## Purpose
  Allow authenticated users to create, save, and manage their own custom scripture/text content
  with labels, musical settings, and personal organization.

  ## New Tables
  
  ### `user_custom_texts`
  Stores user-created text content with musical parameters
  - `id` (uuid, primary key) - Unique identifier for each custom text
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `title` (text, required) - User-defined title/name for the text
  - `text_content` (text, required) - The actual text content
  - `label` (text, optional) - Category/label (e.g., "Prayer", "Meditation", "Personal Scripture")
  - `key_signature` (text, default 'C') - Musical key for playback
  - `tempo` (integer, default 90) - BPM for playback
  - `time_signature` (text, default '4/4') - Time signature
  - `is_public` (boolean, default false) - Whether other users can see this
  - `tags` (text[], default '{}') - Array of user-defined tags
  - `notes` (text, optional) - Personal notes about this text
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on user_custom_texts
  - Users can only view/edit/delete their own texts
  - Public texts can be viewed by anyone (future feature)
  
  ## Indexes
  - user_id for fast user queries
  - label for filtering by category
  - tags using GIN for array search
*/

-- Create user_custom_texts table
CREATE TABLE IF NOT EXISTS user_custom_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
  text_content text NOT NULL CHECK (char_length(text_content) >= 1),
  label text CHECK (char_length(label) <= 100),
  key_signature text DEFAULT 'C' NOT NULL,
  tempo integer DEFAULT 90 CHECK (tempo >= 40 AND tempo <= 240),
  time_signature text DEFAULT '4/4' NOT NULL,
  is_public boolean DEFAULT false NOT NULL,
  tags text[] DEFAULT '{}' NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_custom_texts_user_id ON user_custom_texts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_texts_label ON user_custom_texts(label);
CREATE INDEX IF NOT EXISTS idx_user_custom_texts_tags ON user_custom_texts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_user_custom_texts_created_at ON user_custom_texts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_custom_texts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Users can view their own custom texts
CREATE POLICY "Users can view own custom texts"
  ON user_custom_texts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own custom texts
CREATE POLICY "Users can create own custom texts"
  ON user_custom_texts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own custom texts
CREATE POLICY "Users can update own custom texts"
  ON user_custom_texts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own custom texts
CREATE POLICY "Users can delete own custom texts"
  ON user_custom_texts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_custom_texts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_custom_texts_updated_at_trigger ON user_custom_texts;
CREATE TRIGGER update_user_custom_texts_updated_at_trigger
  BEFORE UPDATE ON user_custom_texts
  FOR EACH ROW
  EXECUTE FUNCTION update_user_custom_texts_updated_at();

-- Create statistics table for tracking usage
CREATE TABLE IF NOT EXISTS user_custom_texts_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  custom_text_id uuid REFERENCES user_custom_texts(id) ON DELETE CASCADE NOT NULL,
  play_count integer DEFAULT 0 NOT NULL,
  last_played_at timestamptz,
  total_practice_time integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, custom_text_id)
);

-- Enable RLS on stats table
ALTER TABLE user_custom_texts_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own stats
CREATE POLICY "Users can view own custom text stats"
  ON user_custom_texts_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own stats
CREATE POLICY "Users can create own custom text stats"
  ON user_custom_texts_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own stats
CREATE POLICY "Users can update own custom text stats"
  ON user_custom_texts_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
