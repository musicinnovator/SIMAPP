/*
  # Enhanced Chord Features

  1. Updates to chord_progressions table
    - Add `chord_quality_mode` column for quality mode settings
    - Add `time_signature` column for time signature settings
    - Add `chord_type` column to store the chord type (triad, 7th, etc.)

  2. Notes
    - Uses IF NOT EXISTS to safely add columns
    - Provides default values for backward compatibility
*/

-- Add chord quality mode column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'chord_quality_mode'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN chord_quality_mode text DEFAULT 'key-aware';
  END IF;
END $$;

-- Add time signature column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'time_signature'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN time_signature text DEFAULT '4/4';
  END IF;
END $$;

-- Add chord type column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'chord_type'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN chord_type text DEFAULT 'triad';
  END IF;
END $$;

-- Add partial mode column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'partial_mode'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN partial_mode text DEFAULT 'root-third';
  END IF;
END $$;

-- Add broken style column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chord_progressions' AND column_name = 'broken_style'
  ) THEN
    ALTER TABLE chord_progressions ADD COLUMN broken_style text DEFAULT 'syncopated';
  END IF;
END $$;
