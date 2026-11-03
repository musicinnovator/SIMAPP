/*
  # Audio Effects Suite System

  1. New Tables
    - `audio_effect_presets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, preset name)
      - `effect_type` (text, spatial/dynamics/modulation)
      - `parameters` (jsonb, effect-specific settings)
      - `is_public` (boolean, share preset publicly)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `audio_effect_chains`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, chain name)
      - `effects_order` (jsonb, array of effect IDs and settings)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_audio_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique, references auth.users)
      - `default_reverb` (jsonb)
      - `default_delay` (jsonb)
      - `default_compressor` (jsonb)
      - `default_eq` (jsonb)
      - `default_modulation` (jsonb)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage their own presets
    - Public read access for shared presets
*/

-- Audio Effect Presets Table
CREATE TABLE IF NOT EXISTS audio_effect_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  effect_type text NOT NULL CHECK (effect_type IN ('spatial', 'dynamics', 'modulation', 'eq', 'filter')),
  parameters jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audio Effect Chains Table
CREATE TABLE IF NOT EXISTS audio_effect_chains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  effects_order jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Audio Settings Table
CREATE TABLE IF NOT EXISTS user_audio_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  default_reverb jsonb DEFAULT '{"roomSize": 0.7, "dampening": 3000, "wet": 0.3, "dry": 0.7}'::jsonb,
  default_delay jsonb DEFAULT '{"delayTime": 0.25, "feedback": 0.3, "wet": 0.2, "dry": 0.8}'::jsonb,
  default_compressor jsonb DEFAULT '{"threshold": -24, "ratio": 4, "attack": 0.003, "release": 0.25, "knee": 30}'::jsonb,
  default_eq jsonb DEFAULT '{"low": 0, "mid": 0, "high": 0, "lowFreq": 250, "midFreq": 1000, "highFreq": 4000}'::jsonb,
  default_modulation jsonb DEFAULT '{"rate": 4, "depth": 0.5, "wet": 0.3, "dry": 0.7}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE audio_effect_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_effect_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_audio_settings ENABLE ROW LEVEL SECURITY;

-- Policies for audio_effect_presets
CREATE POLICY "Users can view own presets"
  ON audio_effect_presets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public presets"
  ON audio_effect_presets FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can create own presets"
  ON audio_effect_presets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presets"
  ON audio_effect_presets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own presets"
  ON audio_effect_presets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for audio_effect_chains
CREATE POLICY "Users can view own chains"
  ON audio_effect_chains FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chains"
  ON audio_effect_chains FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chains"
  ON audio_effect_chains FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chains"
  ON audio_effect_chains FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user_audio_settings
CREATE POLICY "Users can view own settings"
  ON user_audio_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own settings"
  ON user_audio_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_audio_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON user_audio_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audio_effect_presets_user_id ON audio_effect_presets(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_effect_presets_effect_type ON audio_effect_presets(effect_type);
CREATE INDEX IF NOT EXISTS idx_audio_effect_presets_is_public ON audio_effect_presets(is_public);
CREATE INDEX IF NOT EXISTS idx_audio_effect_chains_user_id ON audio_effect_chains(user_id);
CREATE INDEX IF NOT EXISTS idx_user_audio_settings_user_id ON user_audio_settings(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_audio_effect_presets_updated_at ON audio_effect_presets;
CREATE TRIGGER update_audio_effect_presets_updated_at
  BEFORE UPDATE ON audio_effect_presets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_audio_effect_chains_updated_at ON audio_effect_chains;
CREATE TRIGGER update_audio_effect_chains_updated_at
  BEFORE UPDATE ON audio_effect_chains
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_audio_settings_updated_at ON user_audio_settings;
CREATE TRIGGER update_user_audio_settings_updated_at
  BEFORE UPDATE ON user_audio_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
