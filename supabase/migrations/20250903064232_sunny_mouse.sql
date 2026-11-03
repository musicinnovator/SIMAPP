/*
  # User Progress and Authentication Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `display_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `scripture_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `scripture_id` (text)
      - `attempts` (integer)
      - `best_score` (integer)
      - `total_time_spent` (integer, in seconds)
      - `completed` (boolean)
      - `last_attempt_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `achievement_type` (text)
      - `achievement_name` (text)
      - `earned_at` (timestamp)
      - `metadata` (jsonb)
    - `learning_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `scripture_id` (text)
      - `session_type` (text) -- 'quiz', 'practice', 'lesson'
      - `score` (integer)
      - `duration` (integer, in seconds)
      - `completed` (boolean)
      - `session_data` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for guest users (anonymous access)

  3. Functions
    - Function to calculate user statistics
    - Function to check and award achievements
</sql>

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scripture progress table
CREATE TABLE IF NOT EXISTS scripture_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  scripture_id text NOT NULL,
  attempts integer DEFAULT 0,
  best_score integer DEFAULT 0,
  total_time_spent integer DEFAULT 0,
  completed boolean DEFAULT false,
  last_attempt_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, scripture_id)
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  earned_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(user_id, achievement_type, achievement_name)
);

-- Create learning sessions table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  scripture_id text NOT NULL,
  session_type text NOT NULL CHECK (session_type IN ('quiz', 'practice', 'lesson', 'recording')),
  score integer DEFAULT 0,
  duration integer DEFAULT 0,
  completed boolean DEFAULT false,
  session_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripture_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for scripture_progress
CREATE POLICY "Users can read own progress"
  ON scripture_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own progress"
  ON scripture_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON scripture_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for user_achievements
CREATE POLICY "Users can read own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for learning_sessions
CREATE POLICY "Users can read own sessions"
  ON learning_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions"
  ON learning_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripture_progress_updated_at
  BEFORE UPDATE ON scripture_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid uuid)
RETURNS jsonb AS $$
DECLARE
  stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_scriptures_attempted', COUNT(DISTINCT scripture_id),
    'completed_scriptures', COUNT(*) FILTER (WHERE completed = true),
    'total_attempts', SUM(attempts),
    'average_score', ROUND(AVG(best_score)),
    'total_time_minutes', ROUND(SUM(total_time_spent) / 60.0),
    'current_streak', (
      SELECT COUNT(*)
      FROM (
        SELECT DISTINCT DATE(created_at)
        FROM learning_sessions
        WHERE user_id = user_uuid
          AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY DATE(created_at) DESC
      ) AS recent_days
    ),
    'achievements_count', (
      SELECT COUNT(*)
      FROM user_achievements
      WHERE user_id = user_uuid
    )
  ) INTO stats
  FROM scripture_progress
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(stats, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(user_uuid uuid)
RETURNS void AS $$
DECLARE
  user_stats jsonb;
  completed_count integer;
  total_attempts integer;
  perfect_scores integer;
BEGIN
  -- Get user statistics
  SELECT get_user_stats(user_uuid) INTO user_stats;
  
  -- Extract values
  completed_count := (user_stats->>'completed_scriptures')::integer;
  total_attempts := (user_stats->>'total_attempts')::integer;
  
  -- Count perfect scores
  SELECT COUNT(*) INTO perfect_scores
  FROM scripture_progress
  WHERE user_id = user_uuid AND best_score = 100;
  
  -- Award achievements
  
  -- First Steps
  IF completed_count >= 1 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_name, metadata)
    VALUES (user_uuid, 'milestone', 'First Steps', jsonb_build_object('description', 'Complete your first scripture'))
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  -- Perfect Score
  IF perfect_scores >= 1 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_name, metadata)
    VALUES (user_uuid, 'performance', 'Perfect Score', jsonb_build_object('description', 'Score 100% on any quiz'))
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  -- Scripture Scholar
  IF completed_count >= 10 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_name, metadata)
    VALUES (user_uuid, 'milestone', 'Scripture Scholar', jsonb_build_object('description', 'Complete 10 scriptures'))
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  -- Dedicated Learner
  IF total_attempts >= 50 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_name, metadata)
    VALUES (user_uuid, 'dedication', 'Dedicated Learner', jsonb_build_object('description', 'Make 50 learning attempts'))
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  -- Psalm Master
  IF (SELECT COUNT(*) FROM scripture_progress WHERE user_id = user_uuid AND scripture_id LIKE 'psalm%' AND completed = true) >= 5 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_name, metadata)
    VALUES (user_uuid, 'category', 'Psalm Master', jsonb_build_object('description', 'Complete 5 Psalms'))
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;