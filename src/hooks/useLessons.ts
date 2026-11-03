import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  song_id: string;
  audio_url: string;
  lyrics: any[];
  melody_data: any;
  difficulty_level: string;
  order_index: number;
  category: string;
  is_published: boolean;
}

export interface LessonActivity {
  id: string;
  lesson_id: string;
  activity_type: string;
  activity_order: number;
  title: string;
  instructions: string;
  content: any;
  correct_answers: any;
  hints: string[];
  max_attempts: number;
  points_possible: number;
  time_limit_seconds: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  current_activity_id: string | null;
  total_score: number;
  total_possible: number;
  completion_percentage: number;
  started_at: string;
  completed_at: string | null;
  last_accessed_at: string;
}

export interface ActivityAttempt {
  id: string;
  user_id: string;
  activity_id: string;
  attempt_number: number;
  user_answer: any;
  is_correct: boolean;
  score: number;
  hints_used: number;
  time_taken_seconds: number;
  attempted_at: string;
}

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLessons();
    loadUserProgress();
  }, []);

  const loadLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('is_published', true)
        .order('order_index');

      if (error) throw error;
      setLessons(data || []);
    } catch (err) {
      console.error('Error loading lessons:', err);
      setError(err instanceof Error ? err.message : 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const progressMap: Record<string, UserProgress> = {};
      data?.forEach(p => {
        progressMap[p.lesson_id] = p;
      });
      setUserProgress(progressMap);
    } catch (err) {
      console.error('Error loading progress:', err);
    }
  };

  const getLessonActivities = async (lessonId: string): Promise<LessonActivity[]> => {
    try {
      const { data, error } = await supabase
        .from('lesson_activities')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('activity_order');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error loading activities:', err);
      return [];
    }
  };

  const startLesson = async (lessonId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          status: 'in_progress',
          started_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        })
        .select()
        .single();

      if (error) throw error;

      setUserProgress(prev => ({
        ...prev,
        [lessonId]: data
      }));

      return data;
    } catch (err) {
      console.error('Error starting lesson:', err);
      throw err;
    }
  };

  const recordAttempt = async (
    activityId: string,
    userAnswer: any,
    isCorrect: boolean,
    score: number,
    hintsUsed: number,
    timeTaken: number
  ): Promise<ActivityAttempt | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get current attempt number
      const { data: attempts } = await supabase
        .from('user_activity_attempts')
        .select('attempt_number')
        .eq('user_id', user.id)
        .eq('activity_id', activityId)
        .order('attempt_number', { ascending: false })
        .limit(1);

      const attemptNumber = (attempts?.[0]?.attempt_number || 0) + 1;

      const { data, error } = await supabase
        .from('user_activity_attempts')
        .insert({
          user_id: user.id,
          activity_id: activityId,
          attempt_number: attemptNumber,
          user_answer: userAnswer,
          is_correct: isCorrect,
          score: score,
          hints_used: hintsUsed,
          time_taken_seconds: timeTaken,
          attempted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error recording attempt:', err);
      return null;
    }
  };

  const updateProgress = async (
    lessonId: string,
    updates: Partial<UserProgress>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .update({
          ...updates,
          last_accessed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .select()
        .single();

      if (error) throw error;

      setUserProgress(prev => ({
        ...prev,
        [lessonId]: data
      }));

      return data;
    } catch (err) {
      console.error('Error updating progress:', err);
      throw err;
    }
  };

  const completeLesson = async (lessonId: string, totalScore: number, totalPossible: number) => {
    return updateProgress(lessonId, {
      status: 'completed',
      total_score: totalScore,
      total_possible: totalPossible,
      completion_percentage: 100,
      completed_at: new Date().toISOString()
    });
  };

  const getUserBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error loading badges:', err);
      return [];
    }
  };

  const awardBadge = async (
    badgeType: string,
    badgeName: string,
    badgeDescription: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_badges')
        .insert({
          user_id: user.id,
          badge_type: badgeType,
          badge_name: badgeName,
          badge_description: badgeDescription,
          earned_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error awarding badge:', err);
      return null;
    }
  };

  return {
    lessons,
    userProgress,
    loading,
    error,
    getLessonActivities,
    startLesson,
    recordAttempt,
    updateProgress,
    completeLesson,
    getUserBadges,
    awardBadge,
    refreshLessons: loadLessons,
    refreshProgress: loadUserProgress
  };
}
