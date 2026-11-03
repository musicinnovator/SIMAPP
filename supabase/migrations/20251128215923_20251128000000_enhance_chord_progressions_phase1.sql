/*
  # Phase 1: Enhanced Chord Progressions System

  ## Summary
  This migration extends the chord_progressions table with Phase 1 features:
  tags, search metadata, favorites, and usage tracking.

  ## Changes Made

  1. **New Columns Added to chord_progressions:**
     - `tags` (text[]) - Array of user-defined tags for organization (gospel, jazz, worship, etc.)
     - `description` (text) - Optional longer description of the progression
     - `style` (text) - Musical style category (pop, jazz, gospel, blues, classical, etc.)
     - `is_favorite` (boolean) - Quick access to favorite progressions
     - `times_played` (integer) - Usage tracking counter
     - `clone_count` (integer) - How many times this progression was cloned
     - `parent_id` (uuid) - References original progression if this is a clone/variation

  2. **Indexes for Performance:**
     - GIN index on tags array for fast tag searches
     - Index on style for category filtering
     - Index on is_favorite for quick favorites list
     - Index on times_played for "most used" sorting

  3. **Security:**
     - All existing RLS policies remain unchanged
     - No modifications to existing permissions

  ## Important Notes
  - This is a NON-DESTRUCTIVE migration
  - All existing progressions remain unchanged
  - All new columns have safe defaults
  - No data loss possible
*/

-- Add new columns to chord_progressions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'tags'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'description'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN description text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'style'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN style text DEFAULT 'custom';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'is_favorite'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN is_favorite boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'times_played'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN times_played integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'clone_count'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN clone_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN parent_id uuid REFERENCES chord_progressions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_chord_progressions_tags ON chord_progressions USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_chord_progressions_style ON chord_progressions(style);
CREATE INDEX IF NOT EXISTS idx_chord_progressions_is_favorite ON chord_progressions(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_chord_progressions_times_played ON chord_progressions(times_played DESC);
CREATE INDEX IF NOT EXISTS idx_chord_progressions_user_id ON chord_progressions(user_id);

-- Helper function to increment play count
CREATE OR REPLACE FUNCTION increment_progression_play_count(progression_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE chord_progressions
  SET times_played = times_played + 1
  WHERE id = progression_id;
END;
$$;

-- Helper function to increment clone count
CREATE OR REPLACE FUNCTION increment_progression_clone_count(progression_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE chord_progressions
  SET clone_count = clone_count + 1
  WHERE id = progression_id;
END;
$$;