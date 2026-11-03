/*
  # Chord Progressions Storage

  1. New Tables
    - `chord_progressions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - User-defined name for the progression
      - `chords` (jsonb) - Array of chord names
      - `key_signature` (text) - Key signature
      - `tempo` (text) - Tempo setting
      - `voicing_technique` (text) - block, arpeggiated, broken, partial
      - `arpeggio_pattern` (text) - Pattern like "1-3-5-3", "1-5-3-5", etc
      - `inversion` (integer) - 0=root, 1=first, 2=second
      - `is_public` (boolean) - Whether progression can be shared
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `chord_progressions` table
    - Add policies for authenticated users to manage their own progressions
    - Public progressions can be viewed by anyone
*/

CREATE TABLE IF NOT EXISTS chord_progressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  chords jsonb NOT NULL,
  key_signature text DEFAULT 'C Major',
  tempo text DEFAULT 'Moderato',
  voicing_technique text DEFAULT 'block',
  arpeggio_pattern text DEFAULT '1-3-5',
  inversion integer DEFAULT 0,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chord_progressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progressions"
  ON chord_progressions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own progressions"
  ON chord_progressions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progressions"
  ON chord_progressions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progressions"
  ON chord_progressions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_chord_progressions_updated_at
  BEFORE UPDATE ON chord_progressions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();