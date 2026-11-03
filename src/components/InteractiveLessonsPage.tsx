import React, { useState, useEffect } from 'react';
import {
  Music, Play, Brain, Mic, Puzzle, Target, ListOrdered,
  BookOpen, Volume2, Zap, Award, TrendingUp, ArrowLeft,
  Check, Lock, Star, Clock, Trophy
} from 'lucide-react';
import { CallAndResponse } from './lessons/CallAndResponse';
import { FillInBlankQuiz } from './lessons/FillInBlankQuiz';
import { MelodyMapping } from './lessons/MelodyMapping';
import { CombinationSongs } from './lessons/CombinationSongs';
import { PartialText } from './lessons/PartialText';
import { TextGrouping } from './lessons/TextGrouping';
import { LyricMatchingGame } from './lessons/LyricMatchingGame';
import { useLessons } from '../hooks/useLessons';
import { initializeLessons } from '../utils/seedLessons';

interface Activity {
  id: string;
  name: string;
  description: string;
  icon: any;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  estimatedTime: string;
  component: string;
  color: string;
}

const activities: Activity[] = [
  {
    id: 'call-response',
    name: 'Call and Response',
    description: 'Listen to a musical phrase and respond with the correct continuation. Perfect your musical memory!',
    icon: Mic,
    difficulty: 'beginner',
    points: 20,
    estimatedTime: '5-10 min',
    component: 'CallAndResponse',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'fill-blank',
    name: 'Fill in the Blanks',
    description: 'Complete scripture lyrics by filling in missing words. Test your memorization skills!',
    icon: BookOpen,
    difficulty: 'beginner',
    points: 15,
    estimatedTime: '5-8 min',
    component: 'FillInBlankQuiz',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'melody-map',
    name: 'Melody Mapping',
    description: 'Match lyrics to musical notes on the staff. Learn how melodies are structured!',
    icon: Music,
    difficulty: 'intermediate',
    points: 25,
    estimatedTime: '8-12 min',
    component: 'MelodyMapping',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'combination',
    name: 'Combination Songs',
    description: 'Arrange song phrases in the correct order to build complete verses. Compose like a pro!',
    icon: Puzzle,
    difficulty: 'intermediate',
    points: 30,
    estimatedTime: '10-15 min',
    component: 'CombinationSongs',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'partial-text',
    name: 'Complete the Verse',
    description: 'Given the first part of a verse, complete the rest. Build your lyrical intuition!',
    icon: Target,
    difficulty: 'beginner',
    points: 15,
    estimatedTime: '5-8 min',
    component: 'PartialText',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    id: 'text-grouping',
    name: 'Categorize Phrases',
    description: 'Group scripture phrases by theme or structure. Understand deeper meanings!',
    icon: ListOrdered,
    difficulty: 'intermediate',
    points: 20,
    estimatedTime: '8-10 min',
    component: 'TextGrouping',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'lyric-matching',
    name: 'Lyric Matching Game',
    description: 'Match lyrics to audio clips in this memory challenge. Sharpen your recall!',
    icon: Brain,
    difficulty: 'beginner',
    points: 20,
    estimatedTime: '5-10 min',
    component: 'LyricMatchingGame',
    color: 'from-pink-500 to-rose-500'
  }
];

export function InteractiveLessonsPage() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [showWelcome, setShowWelcome] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  const {
    userProgress,
    loading,
    getUserBadges
  } = useLessons();

  useEffect(() => {
    const init = async () => {
      await initializeLessons();
      setDbInitialized(true);
    };
    init();
  }, []);

  const filteredActivities = filterDifficulty === 'all'
    ? activities
    : activities.filter(a => a.difficulty === filterDifficulty);

  const totalPoints = Object.values(userProgress).reduce((sum, p) => sum + p.total_score, 0);
  const completedActivities = Object.keys(userProgress).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500 text-white';
      case 'intermediate': return 'bg-yellow-500 text-gray-900';
      case 'advanced': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const renderActivityComponent = () => {
    const activity = activities.find(a => a.id === selectedActivity);
    if (!activity) return null;

    const ComponentMap: Record<string, any> = {
      CallAndResponse,
      FillInBlankQuiz,
      MelodyMapping,
      CombinationSongs,
      PartialText,
      TextGrouping,
      LyricMatchingGame
    };

    const Component = ComponentMap[activity.component];

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedActivity(null)}
          className="flex items-center space-x-2 text-blue-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Activities</span>
        </button>

        <Component lesson={null} scriptures={[]} />
      </div>
    );
  };

  if (loading || !dbInitialized) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-white text-lg">Loading Interactive Lessons...</p>
        </div>
      </div>
    );
  }

  if (selectedActivity) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderActivityComponent()}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white">Interactive Lessons</h1>
        </div>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
          Master Scripture through engaging musical activities. Choose your challenge and start learning!
        </p>
      </div>

      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20 relative">
          <button
            onClick={() => setShowWelcome(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            ×
          </button>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Welcome to Interactive Learning! 🎵</h2>
            <p className="text-blue-100">
              Choose from 7 engaging activities designed to help you memorize Scripture through music.
              Each activity offers unique challenges, from singing call-and-response to arranging complete songs.
            </p>
            <div className="grid md:grid-cols-3 gap-4 pt-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <h3 className="font-bold text-white">Learn by Doing</h3>
                </div>
                <p className="text-sm text-blue-100">Interactive exercises that adapt to your skill level</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold text-white">Earn Rewards</h3>
                </div>
                <p className="text-sm text-blue-100">Collect points and badges as you progress</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-white">Track Progress</h3>
                </div>
                <p className="text-sm text-blue-100">See your improvement over time</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Stats */}
      {completedActivities > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Award className="w-10 h-10 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Your Progress</h3>
                <p className="text-blue-200">Keep up the great work!</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-yellow-400">{totalPoints}</p>
                <p className="text-blue-200 text-sm">Total Points</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400">{completedActivities}</p>
                <p className="text-blue-200 text-sm">Activities Done</p>
              </div>
              <button
                onClick={async () => {
                  const badges = await getUserBadges();
                  alert(`🏆 You've earned ${badges.length} badge${badges.length !== 1 ? 's' : ''}!\n\nKeep learning to earn more!`);
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>View Badges</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-lg font-bold text-white">Filter by Difficulty:</h3>
          <div className="flex space-x-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
              <button
                key={level}
                onClick={() => setFilterDifficulty(level)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterDifficulty === level
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            onClick={() => setSelectedActivity(activity.id)}
            className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className={`bg-gradient-to-r ${activity.color} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                  <activity.icon className="w-8 h-8 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(activity.difficulty)}`}>
                  {activity.difficulty.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors mb-2">
                  {activity.name}
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {activity.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{activity.points} pts</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-300">
                    <Clock className="w-4 h-4" />
                    <span>{activity.estimatedTime}</span>
                  </div>
                </div>
                <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-xs font-medium group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  Start →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Activities */}
      <div className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">More Activities Coming Soon! 🚀</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            We're working on 10+ additional interactive activities including:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto pt-4">
            {[
              'Gap Sentence Ordering',
              'Interval Listening Quiz',
              'Rhythmic Clapping/Tapping',
              'Karaoke Mode with Scoring',
              'Memory Sequence Game',
              'Translation Mapping',
              'Cross-Song Comparison',
              'Fill Melody by Ear',
              'Spot the Error',
              'Cloze Challenge'
            ].map((name, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-3 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
