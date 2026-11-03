import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Check if we have real Supabase credentials
const hasValidSupabaseConfig = supabaseUrl !== 'https://placeholder.supabase.co' && 
                               supabaseAnonKey !== 'placeholder-anon-key' &&
                               supabaseUrl.includes('supabase.co');

export const supabase = hasValidSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}) : null;

// Export flag to check if Supabase is properly configured
export const isSupabaseConfigured = hasValidSupabaseConfig;

// Database types
export interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScriptureProgress {
  id: string;
  user_id: string;
  scripture_id: string;
  attempts: number;
  best_score: number;
  total_time_spent: number;
  completed: boolean;
  last_attempt_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  earned_at: string;
  metadata: any;
}

export interface LearningSession {
  id: string;
  user_id: string;
  scripture_id: string;
  session_type: 'quiz' | 'practice' | 'lesson' | 'recording';
  score: number;
  duration: number;
  completed: boolean;
  session_data: any;
  created_at: string;
}

export interface UserStats {
  total_scriptures_attempted: number;
  completed_scriptures: number;
  total_attempts: number;
  average_score: number;
  total_time_minutes: number;
  current_streak: number;
  achievements_count: number;
}

// Auth helper functions
export const signUp = async (email: string, password: string, username: string, displayName: string) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName
      }
    }
  });

  if (error) throw error;

  // Create user profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        username,
        display_name: displayName
      });

    if (profileError) throw profileError;
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Progress management functions
export const updateScriptureProgress = async (
  userId: string,
  scriptureId: string,
  score: number,
  timeSpent: number,
  sessionType: 'quiz' | 'practice' | 'lesson' | 'recording' = 'quiz'
) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  // Update or insert scripture progress
  const { data: existingProgress } = await supabase
    .from('scripture_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('scripture_id', scriptureId)
    .single();

  const newAttempts = (existingProgress?.attempts || 0) + 1;
  const newBestScore = Math.max(existingProgress?.best_score || 0, score);
  const newTotalTime = (existingProgress?.total_time_spent || 0) + timeSpent;
  const isCompleted = newBestScore >= 80; // 80% threshold for completion

  const progressData = {
    user_id: userId,
    scripture_id: scriptureId,
    attempts: newAttempts,
    best_score: newBestScore,
    total_time_spent: newTotalTime,
    completed: isCompleted,
    last_attempt_at: new Date().toISOString()
  };

  const { error: progressError } = await supabase
    .from('scripture_progress')
    .upsert(progressData);

  if (progressError) throw progressError;

  // Record learning session
  const { error: sessionError } = await supabase
    .from('learning_sessions')
    .insert({
      user_id: userId,
      scripture_id: scriptureId,
      session_type: sessionType,
      score,
      duration: timeSpent,
      completed: score >= 80,
      session_data: { timestamp: new Date().toISOString() }
    });

  if (sessionError) throw sessionError;

  // Check for new achievements
  const { error: achievementError } = await supabase.rpc('check_and_award_achievements', {
    user_uuid: userId
  });

  if (achievementError) console.error('Achievement check failed:', achievementError);
};

export const getUserProgress = async (userId: string) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('scripture_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

export const getUserStats = async (userId: string): Promise<UserStats> => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.rpc('get_user_stats', {
    user_uuid: userId
  });

  if (error) throw error;
  return data || {
    total_scriptures_attempted: 0,
    completed_scriptures: 0,
    total_attempts: 0,
    average_score: 0,
    total_time_minutes: 0,
    current_streak: 0,
    achievements_count: 0
  };
};

export const getUserAchievements = async (userId: string) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getRecentSessions = async (userId: string, limit: number = 10) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('learning_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};