import React, { useState, useEffect } from 'react';
import { Trophy, Target, Flame, Calendar, TrendingUp, Star, Clock, BookOpen, Music, Award, BarChart3, Users, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import { allScriptures } from '../data/scriptures';
import { isSupabaseConfigured } from '../lib/supabase';

interface ProgressDashboardProps {
  progress: any;
}

export function ProgressDashboard({ progress }: ProgressDashboardProps) {
  const { user, isGuest, signOut } = useAuth();
  const { 
    userStats, 
    achievements, 
    recentSessions, 
    loading, 
    refreshData,
    migrateGuestDataToUser 
  } = useProgress();
  
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'sessions' | 'analytics'>('overview');
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);

  // Check if guest has data that could be migrated
  useEffect(() => {
    if (user && !isGuest) {
      const guestData = localStorage.getItem('scriptureProgress');
      if (guestData) {
        setShowMigrationPrompt(true);
      }
    }
  }, [user, isGuest]);

  const handleMigrateData = async () => {
    try {
      await migrateGuestDataToUser();
      setShowMigrationPrompt(false);
    } catch (error) {
      console.error('Migration failed:', error);
    }
  };

  const getScriptureTitle = (scriptureId: string) => {
    const scripture = allScriptures.find(s => s.id === scriptureId);
    return scripture ? scripture.title : scriptureId;
  };

  const getScriptureReference = (scriptureId: string) => {
    const scripture = allScriptures.find(s => s.id === scriptureId);
    return scripture ? scripture.reference : scriptureId;
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'milestone': return Trophy;
      case 'performance': return Target;
      case 'dedication': return Flame;
      case 'category': return BookOpen;
      default: return Star;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'from-yellow-500 to-yellow-600';
      case 'performance': return 'from-green-500 to-green-600';
      case 'dedication': return 'from-red-500 to-red-600';
      case 'category': return 'from-blue-500 to-blue-600';
      default: return 'from-purple-500 to-purple-600';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return Target;
      case 'practice': return BookOpen;
      case 'lesson': return Star;
      case 'recording': return Music;
      default: return BookOpen;
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-blue-500/30 text-blue-100';
      case 'practice': return 'bg-green-500/30 text-green-100';
      case 'lesson': return 'bg-purple-500/30 text-purple-100';
      case 'recording': return 'bg-red-500/30 text-red-100';
      default: return 'bg-gray-500/30 text-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500 text-green-100';
    if (score >= 70) return 'bg-yellow-500 text-yellow-900';
    return 'bg-red-500 text-red-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-3xl font-bold text-white">{userStats.completed_scriptures}</div>
              <div className="text-green-200 text-sm">Scriptures Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-3xl font-bold text-white">{userStats.average_score}%</div>
              <div className="text-blue-200 text-sm">Average Score</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center space-x-3">
            <Flame className="w-8 h-8 text-orange-400" />
            <div>
              <div className="text-3xl font-bold text-white">{userStats.current_streak}</div>
              <div className="text-orange-200 text-sm">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-3xl font-bold text-white">{userStats.total_time_minutes}m</div>
              <div className="text-purple-200 text-sm">Total Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Learning Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-blue-200">Total Attempts:</span>
              <span className="text-white font-bold">{userStats.total_attempts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Scriptures Attempted:</span>
              <span className="text-white font-bold">{userStats.total_scriptures_attempted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Completion Rate:</span>
              <span className="text-white font-bold">
                {userStats.total_scriptures_attempted > 0 
                  ? Math.round((userStats.completed_scriptures / userStats.total_scriptures_attempted) * 100)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Achievements Earned:</span>
              <span className="text-white font-bold">{userStats.achievements_count}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {achievements.slice(0, 3).map((achievement) => {
              const Icon = getAchievementIcon(achievement.achievement_type);
              return (
                <div key={achievement.id} className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${getAchievementColor(achievement.achievement_type)}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{achievement.achievement_name}</p>
                    <p className="text-blue-200 text-xs">{formatDate(achievement.earned_at)}</p>
                  </div>
                </div>
              );
            })}
            {achievements.length === 0 && (
              <p className="text-blue-300 text-sm italic">No achievements yet. Keep learning!</p>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentSessions.slice(0, 3).map((session) => {
              const Icon = getSessionTypeIcon(session.session_type);
              return (
                <div key={session.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        {getScriptureTitle(session.scripture_id)}
                      </p>
                      <p className="text-blue-200 text-xs">{formatDate(session.created_at)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(session.score)}`}>
                    {session.score}%
                  </span>
                </div>
              );
            })}
            {recentSessions.length === 0 && (
              <p className="text-blue-300 text-sm italic">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Your Achievements</h2>
        <p className="text-blue-100">Celebrate your Scripture learning milestones</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const Icon = getAchievementIcon(achievement.achievement_type);
          return (
            <div
              key={achievement.id}
              className={`bg-white/10 backdrop-blur-md p-6 border-l-4 ${getAchievementColor(achievement.achievement_type).replace('from-', 'border-').replace(' to-' + getAchievementColor(achievement.achievement_type).split(' ')[1], '')}`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{achievement.achievement_name}</h3>
                  <p className="text-blue-200 text-sm">
                    {achievement.metadata?.description || 'Achievement earned'}
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
                    Earned {formatDate(achievement.earned_at)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-10 h-10 text-blue-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No achievements yet</h3>
          <p className="text-blue-200">Complete scriptures and practice regularly to earn achievements!</p>
        </div>
      )}
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Learning Sessions</h2>
        <p className="text-blue-100">Your detailed learning history</p>
      </div>

      <div className="space-y-4">
        {recentSessions.map((session) => {
          const Icon = getSessionTypeIcon(session.session_type);
          return (
            <div
              key={session.id}
              className="bg-white/10 backdrop-blur-md p-6 border-l-4 border-white/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {getScriptureTitle(session.scripture_id)}
                    </h3>
                    <p className="text-blue-200 text-sm">{getScriptureReference(session.scripture_id)}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-blue-300">
                      <span className="capitalize">{session.session_type}</span>
                      <span>{Math.round(session.duration / 60)} minutes</span>
                      <span>{formatDate(session.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-4 py-2 text-lg font-bold ${getScoreColor(session.score)}`}>
                    {session.score}%
                  </div>
                  {session.completed && (
                    <div className="flex items-center space-x-1 mt-2 text-green-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {recentSessions.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-10 h-10 text-blue-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No sessions yet</h3>
          <p className="text-blue-200">Start learning to see your session history here!</p>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Learning Analytics</h2>
        <p className="text-blue-100">Detailed insights into your progress</p>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Score Trends</h3>
        <div className="h-64 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-blue-300 mx-auto mb-2" />
            <p className="text-blue-200">Performance charts coming soon</p>
            <p className="text-blue-300 text-sm">Track your improvement over time</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Scripture Categories</h3>
          <div className="space-y-3">
            {['psalms', 'gospels', 'proverbs', 'hymns'].map((category) => {
              const categoryProgress = Object.entries(progress).filter(([id]) => 
                allScriptures.find(s => s.id === id)?.category === category
              );
              const completed = categoryProgress.filter(([, p]) => p.completed).length;
              const total = categoryProgress.length;
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-200 capitalize">{category}</span>
                    <span className="text-white font-bold">{completed}/{total}</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-success-50 h-full transition-all duration-500"
                      style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Learning Patterns</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-blue-200">Most Active Day:</span>
              <span className="text-white font-bold">Sunday</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Preferred Session Type:</span>
              <span className="text-white font-bold capitalize">
                {recentSessions.length > 0 
                  ? recentSessions.reduce((acc, session) => {
                      acc[session.session_type] = (acc[session.session_type] || 0) + 1;
                      return acc;
                    }, {} as any)
                  : 'Quiz'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Average Session:</span>
              <span className="text-white font-bold">
                {recentSessions.length > 0 
                  ? Math.round(recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length / 60)
                  : 0} min
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Your Progress</h1>
          <p className="text-xl text-blue-100">
            {user ? (
              <>Welcome back, {user.user_metadata?.display_name || user.email}!</>
            ) : isGuest ? (
              'Guest Mode - Progress saved locally'
            ) : (
              'Track your Scripture learning journey'
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {user && (
            <>
              <button
                onClick={refreshData}
                className="bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={signOut}
                className="bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Migration Prompt */}
      {showMigrationPrompt && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="text-lg font-bold text-yellow-300">Migrate Guest Data</h3>
                <p className="text-yellow-100 text-sm">
                  We found progress from guest mode. Would you like to transfer it to your account?
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleMigrateData}
                className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-all duration-200"
              >
                Migrate Data
              </button>
              <button
                onClick={() => setShowMigrationPrompt(false)}
                className="bg-white/10 text-yellow-200 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Status */}
      <div className={`rounded-xl p-4 border ${
        user 
          ? 'bg-green-500/20 border-green-500/30' 
          : 'bg-blue-500/20 border-blue-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              user ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              {user ? <User className="w-5 h-5 text-white" /> : <Users className="w-5 h-5 text-white" />}
            </div>
            <div>
              <p className={`font-bold ${user ? 'text-green-300' : 'text-blue-300'}`}>
                {user ? 'Signed In' : isGuest ? 'Guest Mode' : 'Not Signed In'}
              </p>
              <p className={`text-sm ${user ? 'text-green-100' : 'text-blue-100'}`}>
                {user 
                  ? 'Progress synced across devices' 
                  : isGuest 
                    ? 'Progress saved locally only'
                    : 'Sign in to sync progress'
                }
              </p>
              {!isSupabaseConfigured && (
                <p className="text-yellow-200 text-xs mt-1">
                  ⚠️ Supabase not configured - using local storage only
                </p>
              )}
            </div>
          </div>
          {user && (
            <div className="text-right">
              <p className="text-white font-medium">{user.user_metadata?.username || 'User'}</p>
              <p className="text-blue-200 text-sm">{user.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <div className="flex">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'sessions', label: 'Sessions', icon: Clock },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'achievements' && renderAchievements()}
        {selectedTab === 'sessions' && renderSessions()}
        {selectedTab === 'analytics' && renderAnalytics()}
      </div>

      {/* Guest Upgrade Prompt */}
      {isGuest && (
        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-purple-300">Upgrade Your Experience</h3>
            <p className="text-purple-100">
              Create an account to sync your progress across devices, earn achievements, 
              and access advanced features.
            </p>
            <button
              onClick={() => window.location.reload()} // This will trigger auth modal
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-400 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Create Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}