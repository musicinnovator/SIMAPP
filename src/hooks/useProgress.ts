import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  updateScriptureProgress as updateSupabaseProgress,
  getUserProgress,
  getUserStats,
  getUserAchievements,
  getRecentSessions,
  UserStats,
  isSupabaseConfigured
} from '../lib/supabase';

interface Progress {
  [scriptureId: string]: {
    attempts: number;
    bestScore: number;
    lastAttempt: string;
    completed: boolean;
  };
}

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  earned_at: string;
  metadata: any;
}

interface RecentSession {
  id: string;
  scripture_id: string;
  session_type: string;
  score: number;
  duration: number;
  completed: boolean;
  created_at: string;
}

export function useProgress() {
  const { user, isGuest } = useAuth();
  const [progress, setProgress] = useState<Progress>({});
  const [userStats, setUserStats] = useState<UserStats>({
    total_scriptures_attempted: 0,
    completed_scriptures: 0,
    total_attempts: 0,
    average_score: 0,
    total_time_minutes: 0,
    current_streak: 0,
    achievements_count: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [loading, setLoading] = useState(false);

  // Load progress based on auth state
  useEffect(() => {
    if (user) {
      loadUserData();
    } else if (isGuest) {
      loadGuestProgress();
    }
  }, [user, isGuest]);

  const loadUserData = async () => {
    if (!user || !isSupabaseConfigured) return;
    
    setLoading(true);
    try {
      // Load progress
      const progressData = await getUserProgress(user.id);
      const progressMap: Progress = {};
      progressData.forEach(p => {
        progressMap[p.scripture_id] = {
          attempts: p.attempts,
          bestScore: p.best_score,
          lastAttempt: p.last_attempt_at,
          completed: p.completed
        };
      });
      setProgress(progressMap);

      // Load stats
      const stats = await getUserStats(user.id);
      setUserStats(stats);

      // Load achievements
      const achievementsData = await getUserAchievements(user.id);
      setAchievements(achievementsData);

      // Load recent sessions
      const sessionsData = await getRecentSessions(user.id);
      setRecentSessions(sessionsData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGuestProgress = () => {
    const savedProgress = localStorage.getItem('scriptureProgress');
    if (savedProgress) {
      try {
        const guestProgress = JSON.parse(savedProgress);
        setProgress(guestProgress);
        
        // Calculate guest stats
        const scriptures = Object.values(guestProgress);
        setUserStats({
          total_scriptures_attempted: scriptures.length,
          completed_scriptures: scriptures.filter((s: any) => s.completed).length,
          total_attempts: scriptures.reduce((sum: number, s: any) => sum + s.attempts, 0),
          average_score: scriptures.length > 0 
            ? Math.round(scriptures.reduce((sum: number, s: any) => sum + s.bestScore, 0) / scriptures.length)
            : 0,
          total_time_minutes: 0, // Not tracked for guests
          current_streak: 0, // Not tracked for guests
          achievements_count: 0 // Not tracked for guests
        });
      } catch (error) {
        console.error('Error loading guest progress:', error);
      }
    }
  };

  // Save guest progress to localStorage
  useEffect(() => {
    if (isGuest) {
      localStorage.setItem('scriptureProgress', JSON.stringify(progress));
    }
  }, [progress, isGuest]);

  const updateProgress = async (scriptureId: string, score: number, timeSpent: number = 0, sessionType: 'quiz' | 'practice' | 'lesson' | 'recording' = 'quiz') => {
    if (user && isSupabaseConfigured) {
      // Update in Supabase for authenticated users
      try {
        await updateSupabaseProgress(user.id, scriptureId, score, timeSpent, sessionType);
        await loadUserData(); // Refresh data
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    } else {
      // Update locally for guests
      setProgress(prev => {
        const current = prev[scriptureId] || { attempts: 0, bestScore: 0, lastAttempt: '', completed: false };
        
        const newProgress = {
          ...prev,
          [scriptureId]: {
            attempts: current.attempts + 1,
            bestScore: Math.max(current.bestScore, score),
            lastAttempt: new Date().toISOString(),
            completed: score >= 80
          }
        };
        
        // Update guest stats
        const scriptures = Object.values(newProgress);
        setUserStats({
          total_scriptures_attempted: scriptures.length,
          completed_scriptures: scriptures.filter((s: any) => s.completed).length,
          total_attempts: scriptures.reduce((sum: number, s: any) => sum + s.attempts, 0),
          average_score: scriptures.length > 0 
            ? Math.round(scriptures.reduce((sum: number, s: any) => sum + s.bestScore, 0) / scriptures.length)
            : 0,
          total_time_minutes: 0,
          current_streak: 0,
          achievements_count: 0
        });
        
        return newProgress;
      });
    }
  };

  const getScriptureProgress = (scriptureId: string) => {
    return progress[scriptureId] || { attempts: 0, bestScore: 0, lastAttempt: '', completed: false };
  };

  const migrateGuestDataToUser = async () => {
    if (!user || !isGuest || !isSupabaseConfigured) return;
    
    const guestProgress = localStorage.getItem('scriptureProgress');
    if (!guestProgress) return;
    
    try {
      const guestData = JSON.parse(guestProgress);
      
      // Migrate each scripture progress
      for (const [scriptureId, progressData] of Object.entries(guestData)) {
        const data = progressData as any;
        await updateSupabaseProgress(
          user.id,
          scriptureId,
          data.bestScore,
          0, // No time data for guest sessions
          'practice'
        );
      }
      
      // Clear guest data
      localStorage.removeItem('scriptureProgress');
      setIsGuest(false);
      
      // Reload user data
      await loadUserData();
    } catch (error) {
      console.error('Error migrating guest data:', error);
    }
  };

  return {
    progress,
    userStats,
    achievements,
    recentSessions,
    loading,
    updateProgress,
    getScriptureProgress,
    migrateGuestDataToUser,
    refreshData: loadUserData
  };
}