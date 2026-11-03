/*
  # User Preferences System

  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `theme` (jsonb) - Visual theme settings
      - `fonts` (jsonb) - Font customization
      - `layout` (jsonb) - Layout preferences
      - `accessibility` (jsonb) - Accessibility settings
      - `notifications` (jsonb) - Notification preferences
      - `keyboard_shortcuts` (jsonb) - Custom shortcuts
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_preferences` table
    - Add policies for authenticated users to manage their own preferences
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  theme jsonb DEFAULT '{
    "background": "gradient",
    "finish": "satin",
    "colorScheme": "cyberpunk",
    "accentColor": "#00ffff",
    "textColor": "#ffffff",
    "mode": "dark"
  }'::jsonb,
  fonts jsonb DEFAULT '{
    "family": "system-ui",
    "size": "medium",
    "weight": "normal"
  }'::jsonb,
  layout jsonb DEFAULT '{
    "density": "comfortable",
    "iconStyle": "modern",
    "buttonStyle": "rounded"
  }'::jsonb,
  accessibility jsonb DEFAULT '{
    "textScaling": 1.0,
    "highContrast": false,
    "reducedMotion": false
  }'::jsonb,
  notifications jsonb DEFAULT '{
    "enabled": true,
    "sound": true,
    "frequency": "normal"
  }'::jsonb,
  keyboard_shortcuts jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();