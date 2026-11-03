import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, BookOpen, Music, Target, Calendar, Flame, Star, Trophy, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../hooks/useAuth';

interface ActivityData {
  date: string;
  count: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  goal: number;
  color: string;
}

export function ProgressPage() {
  const { user, isGuest } = useAuth();
  const { progress } = useProgress();
  const [streak, setStreak] = useState(7);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const scripturesCompleted = Object.keys(progress).length;
    setTotalTime(scripturesCompleted * 15);
  }, [progress]);

  const scripturesCompleted = Object.keys(progress).length;
  const averageScore = Object.values(progress).reduce((acc, val) => acc + val, 0) / (scripturesCompleted || 1);

  const activityData: ActivityData[] = [
    { date: 'Mon', count: 3 },
    { date: 'Tue', count: 5 },
    { date: 'Wed', count: 2 },
    { date: 'Thu', count: 7 },
    { date: 'Fri', count: 4 },
    { date: 'Sat', count: 6 },
    { date: 'Sun', count: 8 }
  ];

  const maxActivity = Math.max(...activityData.map(d => d.count));

  const categoryProgress = [
    { name: 'Psalms', completed: 12, total: 20, color: 'bg-blue-500' },
    { name: 'Gospels', completed: 8, total: 15, color: 'bg-green-500' },
    { name: 'Proverbs', completed: 5, total: 10, color: 'bg-yellow-500' },
    { name: 'Torah', completed: 3, total: 12, color: 'bg-purple-500' }
  ];

  const achievements: Achievement[] = [
    {
      id: 'first_song',
      title: 'First Song',
      description: 'Complete your first Scripture song',
      icon: Music,
      unlocked: scripturesCompleted >= 1,
      progress: Math.min(scripturesCompleted, 1),
      goal: 1,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'beginner',
      title: 'Scripture Beginner',
      description: 'Complete 5 Scripture songs',
      icon: BookOpen,
      unlocked: scripturesCompleted >= 5,
      progress: Math.min(scripturesCompleted, 5),
      goal: 5,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'intermediate',
      title: 'Scripture Learner',
      description: 'Complete 10 Scripture songs',
      icon: Target,
      unlocked: scripturesCompleted >= 10,
      progress: Math.min(scripturesCompleted, 10),
      goal: 10,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'expert',
      title: 'Scripture Expert',
      description: 'Complete 25 Scripture songs',
      icon: Trophy,
      unlocked: scripturesCompleted >= 25,
      progress: Math.min(scripturesCompleted, 25),
      goal: 25,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'perfect_score',
      title: 'Perfect Harmony',
      description: 'Get 100% on a quiz',
      icon: Star,
      unlocked: averageScore >= 100,
      progress: Math.min(averageScore, 100),
      goal: 100,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'streak_week',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: Flame,
      unlocked: streak >= 7,
      progress: Math.min(streak, 7),
      goal: 7,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const stats = [
    {
      label: 'Scriptures Learned',
      value: scripturesCompleted,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      change: '+3 this week'
    },
    {
      label: 'Average Score',
      value: `${Math.round(averageScore)}%`,
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      change: '+5% improvement'
    },
    {
      label: 'Current Streak',
      value: `${streak} days`,
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      change: 'Keep it up!'
    },
    {
      label: 'Time Spent',
      value: `${totalTime} min`,
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      change: `${Math.round(totalTime / 60)} hours total`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <BarChart3 className="w-12 h-12 text-blue-400" />
          <h1 className="text-4xl font-bold text-white">Your Progress</h1>
        </div>
        <p className="text-xl text-blue-100">
          Track your Scripture learning journey and celebrate achievements
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-green-400 text-xs font-medium">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Chart */}
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-400" />
          Weekly Activity
        </h2>

        <div className="flex items-end justify-between gap-4 h-64">
          {activityData.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-3">
              <div className="relative w-full flex-1 flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all duration-500 hover:from-blue-400 hover:to-cyan-300 cursor-pointer"
                  style={{ height: `${(day.count / maxActivity) * 100}%` }}
                  title={`${day.count} activities`}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/30 opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-bold">{day.count}</p>
                  </div>
                </div>
              </div>
              <p className="text-blue-200 text-sm font-medium">{day.date}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-blue-200 text-sm">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span>You're on track! Keep up the great work.</span>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-green-400" />
          Scripture Categories
        </h2>

        <div className="space-y-6">
          {categoryProgress.map((category, idx) => {
            const percentage = (category.completed / category.total) * 100;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{category.name}</span>
                  <span className="text-blue-200 text-sm">
                    {category.completed} / {category.total}
                  </span>
                </div>
                <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 ${category.color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-blue-300 text-xs">{Math.round(percentage)}% complete</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Achievements ({unlockedAchievements.length} / {achievements.length})
        </h2>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-yellow-300 mb-4">Unlocked</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`bg-gradient-to-r ${achievement.color} p-6 rounded-xl border border-white/30 shadow-lg transform hover:scale-105 transition-all`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold mb-1">{achievement.title}</h4>
                        <p className="text-white/80 text-sm">{achievement.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-white" />
                          <span className="text-white text-xs font-medium">Completed!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-4">In Progress</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                const progressPercentage = (achievement.progress / achievement.goal) * 100;
                return (
                  <div
                    key={achievement.id}
                    className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-white/10 p-3 rounded-lg opacity-50">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold mb-1">{achievement.title}</h4>
                        <p className="text-blue-200 text-sm mb-3">{achievement.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-300">Progress</span>
                            <span className="text-blue-200">{achievement.progress} / {achievement.goal}</span>
                          </div>
                          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Milestones Timeline */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Star className="w-6 h-6 text-purple-400" />
          Recent Milestones
        </h2>

        <div className="space-y-4">
          {[
            { text: 'Completed Psalm 23 with 95% accuracy', date: '2 days ago', icon: CheckCircle, color: 'text-green-400' },
            { text: 'Unlocked "Scripture Beginner" achievement', date: '1 week ago', icon: Award, color: 'text-yellow-400' },
            { text: 'Reached 5-day learning streak', date: '1 week ago', icon: Flame, color: 'text-orange-400' },
            { text: 'Started first Scripture lesson', date: '2 weeks ago', icon: BookOpen, color: 'text-blue-400' }
          ].map((milestone, idx) => {
            const Icon = milestone.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all"
              >
                <Icon className={`w-6 h-6 ${milestone.color} flex-shrink-0 mt-1`} />
                <div className="flex-1">
                  <p className="text-white font-medium">{milestone.text}</p>
                  <p className="text-blue-300 text-sm mt-1">{milestone.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivation Section */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Keep Going!</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          You're doing amazing! Every Scripture you learn brings you closer to God's Word.
          Continue your journey and unlock more achievements.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-yellow-300">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-semibold">Level {Math.floor(scripturesCompleted / 5) + 1}</span>
          </div>
          <div className="text-blue-200">•</div>
          <div className="flex items-center gap-2 text-green-300">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Great Progress</span>
          </div>
          <div className="text-blue-200">•</div>
          <div className="flex items-center gap-2 text-orange-300">
            <Flame className="w-5 h-5" />
            <span className="font-semibold">{streak} Day Streak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
