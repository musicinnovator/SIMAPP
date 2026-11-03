/*
  # Interactive Lessons System

  1. New Tables
    - `lessons`
      - `id` (uuid, primary key)
      - `title` (text) - Lesson name
      - `description` (text) - Lesson overview
      - `song_id` (text) - Reference to scripture/song
      - `audio_url` (text) - Main audio file URL
      - `lyrics` (jsonb) - Full lyrics with phrase breakdown
      - `melody_data` (jsonb) - Note sequences mapped to phrases
      - `difficulty_level` (text) - beginner, intermediate, advanced
      - `order_index` (integer) - Lesson sequence
      - `category` (text) - e.g., Torah, Gospel, Proverbs
      - `is_published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `lesson_activities`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, references lessons)
      - `activity_type` (text) - call-response, fill-blank, melody-map, etc.
      - `activity_order` (integer) - Order within lesson
      - `title` (text)
      - `instructions` (text)
      - `content` (jsonb) - Activity-specific data
      - `correct_answers` (jsonb) - Answer key
      - `hints` (jsonb) - Hints array
      - `max_attempts` (integer)
      - `points_possible` (integer)
      - `time_limit_seconds` (integer)
      - `created_at` (timestamptz)

    - `user_lesson_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `lesson_id` (uuid, references lessons)
      - `status` (text) - not_started, in_progress, completed
      - `current_activity_id` (uuid)
      - `total_score` (integer)
      - `total_possible` (integer)
      - `completion_percentage` (integer)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `last_accessed_at` (timestamptz)

    - `user_activity_attempts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `activity_id` (uuid, references lesson_activities)
      - `attempt_number` (integer)
      - `user_answer` (jsonb) - User's response
      - `is_correct` (boolean)
      - `score` (integer)
      - `hints_used` (integer)
      - `time_taken_seconds` (integer)
      - `attempted_at` (timestamptz)

    - `user_badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `badge_type` (text) - perfect_score, streak_3, lesson_master, etc.
      - `badge_name` (text)
      - `badge_description` (text)
      - `earned_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can view published lessons
    - Users can read/write their own progress and attempts
    - Users can read their own badges
*/

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  song_id text,
  audio_url text,
  lyrics jsonb DEFAULT '[]'::jsonb,
  melody_data jsonb DEFAULT '{}'::jsonb,
  difficulty_level text DEFAULT 'beginner',
  order_index integer DEFAULT 0,
  category text DEFAULT 'general',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lesson activities table
CREATE TABLE IF NOT EXISTS lesson_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_order integer DEFAULT 0,
  title text NOT NULL,
  instructions text,
  content jsonb DEFAULT '{}'::jsonb,
  correct_answers jsonb DEFAULT '{}'::jsonb,
  hints jsonb DEFAULT '[]'::jsonb,
  max_attempts integer DEFAULT 3,
  points_possible integer DEFAULT 10,
  time_limit_seconds integer DEFAULT 300,
  created_at timestamptz DEFAULT now()
);

-- User lesson progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  status text DEFAULT 'not_started',
  current_activity_id uuid,
  total_score integer DEFAULT 0,
  total_possible integer DEFAULT 0,
  completion_percentage integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_accessed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- User activity attempts table
CREATE TABLE IF NOT EXISTS user_activity_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id uuid REFERENCES lesson_activities(id) ON DELETE CASCADE,
  attempt_number integer DEFAULT 1,
  user_answer jsonb DEFAULT '{}'::jsonb,
  is_correct boolean DEFAULT false,
  score integer DEFAULT 0,
  hints_used integer DEFAULT 0,
  time_taken_seconds integer DEFAULT 0,
  attempted_at timestamptz DEFAULT now()
);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type text NOT NULL,
  badge_name text NOT NULL,
  badge_description text,
  earned_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Lessons policies
CREATE POLICY "Anyone can view published lessons"
  ON lessons FOR SELECT
  USING (is_published = true);

-- Activities policies
CREATE POLICY "Anyone can view activities for published lessons"
  ON lesson_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      WHERE lessons.id = lesson_activities.lesson_id
      AND lessons.is_published = true
    )
  );

-- Progress policies
CREATE POLICY "Users can view own progress"
  ON user_lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Attempts policies
CREATE POLICY "Users can view own attempts"
  ON user_activity_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON user_activity_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can award badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_activities_lesson ON lesson_activities(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON user_activity_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_activity ON user_activity_attempts(activity_id);
CREATE INDEX IF NOT EXISTS idx_badges_user ON user_badges(user_id);