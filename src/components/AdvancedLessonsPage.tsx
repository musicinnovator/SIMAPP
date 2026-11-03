import React, { useState } from 'react';
import { ArrowLeft, Music, Volume2, Shuffle, Target, Mic, Zap, Search } from 'lucide-react';
import { LyricAudioMatching } from './lessons/LyricAudioMatching';
import { GapSentenceOrdering } from './lessons/GapSentenceOrdering';
import { IntervalListeningQuiz } from './lessons/IntervalListeningQuiz';
import { RhythmicTapping } from './lessons/RhythmicTapping';
import { KaraokeMode } from './lessons/KaraokeMode';
import { MemorySequenceGame } from './lessons/MemorySequenceGame';
import { SpotTheError } from './lessons/SpotTheError';

type ActivityType =
  | 'lyricAudio'
  | 'gapSentence'
  | 'intervalQuiz'
  | 'rhythmicTapping'
  | 'karaoke'
  | 'memoryGame'
  | 'spotError'
  | null;

interface AdvancedLessonsPageProps {
  scripture?: {
    text: string;
    reference: string;
    key: string;
    tempo: number;
  };
}

export function AdvancedLessonsPage({ scripture }: AdvancedLessonsPageProps) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<{ [key: string]: number }>({});

  const defaultScripture = {
    text: "The Lord is my shepherd; I shall not want.\nHe makes me lie down in green pastures.\nHe leads me beside still waters.\nHe restores my soul.",
    reference: "Psalm 23:1-3",
    key: "C",
    tempo: 80
  };

  const activeScripture = scripture || defaultScripture;

  const activities = [
    {
      id: 'lyricAudio',
      title: 'Lyric-Audio Matching',
      description: 'Match audio clips with their corresponding lyrics',
      icon: Volume2,
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Medium'
    },
    {
      id: 'gapSentence',
      title: 'Gap-Sentence Ordering',
      description: 'Arrange shuffled Scripture lines in correct order',
      icon: Shuffle,
      color: 'from-green-500 to-emerald-500',
      difficulty: 'Medium'
    },
    {
      id: 'intervalQuiz',
      title: 'Interval Listening Quiz',
      description: 'Identify musical intervals between notes',
      icon: Music,
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Hard'
    },
    {
      id: 'rhythmicTapping',
      title: 'Rhythmic Tapping',
      description: 'Tap back the rhythm pattern accurately',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      difficulty: 'Medium'
    },
    {
      id: 'karaoke',
      title: 'Karaoke Mode',
      description: 'Sing along with Scripture and get scored',
      icon: Mic,
      color: 'from-pink-500 to-purple-500',
      difficulty: 'Hard'
    },
    {
      id: 'memoryGame',
      title: 'Memory Sequence Game',
      description: 'Remember and repeat phrase sequences (Simon-style)',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      difficulty: 'Hard'
    },
    {
      id: 'spotError',
      title: 'Spot the Error',
      description: 'Find and correct the error in Scripture text',
      icon: Search,
      color: 'from-red-500 to-orange-500',
      difficulty: 'Easy'
    }
  ];

  const handleActivityComplete = (activityId: string, score: number) => {
    setCompletedActivities(prev => new Set([...prev, activityId]));
    setScores(prev => ({ ...prev, [activityId]: Math.max(prev[activityId] || 0, score) }));
    setTimeout(() => {
      setSelectedActivity(null);
    }, 500);
  };

  const renderActivity = () => {
    switch (selectedActivity) {
      case 'lyricAudio':
        return (
          <LyricAudioMatching
            scripture={activeScripture}
            onComplete={(score) => handleActivityComplete('lyricAudio', score)}
          />
        );
      case 'gapSentence':
        return (
          <GapSentenceOrdering
            scripture={activeScripture}
            onComplete={(score) => handleActivityComplete('gapSentence', score)}
          />
        );
      case 'intervalQuiz':
        return (
          <IntervalListeningQuiz
            onComplete={(score) => handleActivityComplete('intervalQuiz', score)}
          />
        );
      case 'rhythmicTapping':
        return (
          <RhythmicTapping
            onComplete={(score) => handleActivityComplete('rhythmicTapping', score)}
          />
        );
      case 'karaoke':
        return (
          <KaraokeMode
            scripture={activeScripture}
            onComplete={(score) => handleActivityComplete('karaoke', score)}
          />
        );
      case 'memoryGame':
        return (
          <MemorySequenceGame
            scripture={activeScripture}
            onComplete={(score) => handleActivityComplete('memoryGame', score)}
          />
        );
      case 'spotError':
        return (
          <SpotTheError
            scripture={activeScripture}
            onComplete={(score) => handleActivityComplete('spotError', score)}
          />
        );
      default:
        return null;
    }
  };

  if (selectedActivity) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedActivity(null)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Activities</span>
        </button>
        {renderActivity()}
      </div>
    );
  }

  const completionRate = (completedActivities.size / activities.length) * 100;
  const averageScore = Object.values(scores).length > 0
    ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Advanced Learning Activities</h1>
        <p className="text-blue-100 text-lg max-w-3xl mx-auto">
          Master Scripture through interactive musical and memory challenges
        </p>
      </div>

      {/* Progress Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-blue-200 text-sm mb-2">Activities Completed</div>
          <div className="text-white text-3xl font-bold">
            {completedActivities.size} / {activities.length}
          </div>
          <div className="mt-2 bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-green-200 text-sm mb-2">Average Score</div>
          <div className="text-white text-3xl font-bold">
            {Math.round(averageScore)}%
          </div>
          <div className="text-green-300 text-sm mt-2">
            {averageScore >= 80 ? 'Excellent!' : averageScore >= 60 ? 'Good progress!' : 'Keep practicing!'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-purple-200 text-sm mb-2">Current Scripture</div>
          <div className="text-white text-lg font-bold line-clamp-2">
            {activeScripture.reference}
          </div>
          <div className="text-purple-300 text-sm mt-2">
            Key: {activeScripture.key} • {activeScripture.tempo} BPM
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => {
          const Icon = activity.icon;
          const isCompleted = completedActivities.has(activity.id);
          const score = scores[activity.id];

          return (
            <div
              key={activity.id}
              onClick={() => setSelectedActivity(activity.id as ActivityType)}
              className="group relative bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer hover:scale-105 hover:shadow-2xl"
            >
              {/* Difficulty Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activity.difficulty === 'Easy'
                    ? 'bg-green-500/30 text-green-300 border border-green-500'
                    : activity.difficulty === 'Medium'
                    ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500'
                    : 'bg-red-500/30 text-red-300 border border-red-500'
                }`}>
                  {activity.difficulty}
                </span>
              </div>

              {/* Icon */}
              <div className={`bg-gradient-to-r ${activity.color} p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {activity.title}
              </h3>
              <p className="text-blue-200 text-sm leading-relaxed mb-4">
                {activity.description}
              </p>

              {/* Status */}
              {isCompleted ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold">Completed</span>
                  </div>
                  {score !== undefined && (
                    <span className="text-white font-bold">{Math.round(score)}%</span>
                  )}
                </div>
              ) : (
                <div className="text-blue-300 text-sm font-semibold">
                  Click to start →
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">About Advanced Activities</h2>
        <div className="grid md:grid-cols-2 gap-6 text-blue-100">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-300">Learning Benefits:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Enhanced memory retention through multiple learning modes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Musical ear training with interval recognition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Improved timing and rhythm skills</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-300">Tips for Success:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Start with easier activities to build confidence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Practice regularly for best results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Use headphones for better audio quality</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
