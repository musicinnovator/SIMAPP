/*
  # Add Real-Time Parameter Change Settings

  1. Schema Changes
    - Add `realtime_change_settings` column to `user_preferences` table
    - Stores user preferences for when parameter changes should be applied during playback

  2. Settings Structure
    - `enabled`: boolean - Whether real-time changes are enabled
    - `defaultTiming`: 'immediately' | 'next-chord' | 'next-loop' | 'manual'
    - `showNotifications`: boolean - Whether to show visual feedback
    - `notificationDuration`: number - Duration in milliseconds

  3. Security
    - Uses existing RLS policies on user_preferences table
    - No additional permissions needed

  4. Notes
    - ADDITIVE-ONLY: Does not modify existing functionality
    - Backward compatible: Existing preferences remain unchanged
    - Default value allows system to work without user configuration
*/

-- Add realtime_change_settings column to user_preferences
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'realtime_change_settings'
  ) THEN
    ALTER TABLE user_preferences
    ADD COLUMN realtime_change_settings jsonb DEFAULT jsonb_build_object(
      'enabled', true,
      'defaultTiming', 'next-loop',
      'showNotifications', true,
      'notificationDuration', 3000
    );

    -- Add comment
    COMMENT ON COLUMN user_preferences.realtime_change_settings IS
      'Settings for real-time parameter changes during playback. Controls when changes are applied (immediately, next-chord, next-loop, manual).';

    -- Create index for faster queries
    CREATE INDEX IF NOT EXISTS idx_user_preferences_realtime_settings
      ON user_preferences USING gin (realtime_change_settings);

  END IF;
END $$;

-- Update existing rows to have default settings if null
UPDATE user_preferences
SET realtime_change_settings = jsonb_build_object(
  'enabled', true,
  'defaultTiming', 'next-loop',
  'showNotifications', true,
  'notificationDuration', 3000
)
WHERE realtime_change_settings IS NULL;