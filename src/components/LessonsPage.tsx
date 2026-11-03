import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Music, Target, Clock, Star, ChevronRight, Volume2, Mic, Award, TrendingUp } from 'lucide-react';
import { lessonModules, allScriptures } from '../data/scriptures';
import { LyricMatchingGame } from './lessons/LyricMatchingGame';
import { FillInBlankQuiz } from './lessons/FillInBlankQuiz';
import { MelodyMapping } from './lessons/MelodyMapping';
import { CallAndResponse } from './lessons/CallAndResponse';
import { TextGrouping } from './lessons/TextGrouping';
import { PartialText } from './lessons/PartialText';
import { CombinationSongs } from './lessons/CombinationSongs';
import { useLessons } from '../hooks/useLessons';
import { initializeLessons } from '../utils/seedLessons';

export function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [filterTheme, setFilterTheme] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [dbInitialized, setDbInitialized] = useState(false);

  const {
    lessons: dbLessons,
    userProgress,
    loading,
    startLesson,
    getUserBadges
  } = useLessons();

  // Initialize database with sample lessons on mount
  useEffect(() => {
    const init = async () => {
      await initializeLessons();
      setDbInitialized(true);
    };
    init();
  }, []);

  const themes = ['all', 'praise', 'trust', 'repentance', 'comfort', 'wisdom', 'joy', 'hope', 'peace', 'strength', 'love', 'worship', 'gratitude', 'humility', 'unity', 'redemption'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredLessons = lessonModules.filter(lesson => {
    const matchesTheme = filterTheme === 'all' || lesson.theme.toLowerCase() === filterTheme;
    const matchesDifficulty = filterDifficulty === 'all' || lesson.difficulty === filterDifficulty;
    return matchesTheme && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500 text-green-100';
      case 'Intermediate': return 'bg-yellow-600 text-white';
      case 'Advanced': return 'bg-red-500 text-red-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  const getThemeColor = (theme: string) => {
    const colors = {
      praise: 'bg-yellow-500/30 text-yellow-100',
      trust: 'bg-blue-500/30 text-blue-100',
      repentance: 'bg-purple-500/30 text-purple-100',
      comfort: 'bg-green-500/30 text-green-100',
      wisdom: 'bg-indigo-500/30 text-indigo-100',
      joy: 'bg-orange-500/30 text-orange-100',
      hope: 'bg-cyan-500/30 text-cyan-100',
      peace: 'bg-emerald-500/30 text-emerald-100',
      strength: 'bg-red-500/30 text-red-100',
      love: 'bg-pink-500/30 text-pink-100',
      worship: 'bg-violet-500/30 text-violet-100',
      gratitude: 'bg-amber-500/30 text-amber-100',
      humility: 'bg-slate-500/30 text-slate-100',
      unity: 'bg-teal-500/30 text-teal-100',
      redemption: 'bg-rose-500/30 text-rose-100'
    };
    return colors[theme.toLowerCase() as keyof typeof colors] || 'bg-gray-500/30 text-gray-100';
  };

  const renderActivity = () => {
    if (!selectedLesson || !selectedActivity) return null;

    const lesson = lessonModules.find(l => l.id === selectedLesson);
    if (!lesson) return null;

    const lessonScriptures = lesson.scriptures.map(id => 
      allScriptures.find(s => s.id === id)
    ).filter(Boolean);

    switch (selectedActivity) {
      case 'lyric-matching':
        return <LyricMatchingGame lesson={lesson} scriptures={lessonScriptures} />;
      case 'fill-in-blank':
        return <FillInBlankQuiz lesson={lesson} scriptures={lessonScriptures} />;
      case 'melody-mapping':
        return <MelodyMapping lesson={lesson} scriptures={lessonScriptures} />;
      case 'call-response':
        return <CallAndResponse lesson={lesson} scriptures={lessonScriptures} />;
      case 'text-grouping':
        return <TextGrouping lesson={lesson} scriptures={lessonScriptures} />;
      case 'partial-text':
        return <PartialText lesson={lesson} scriptures={lessonScriptures} />;
      case 'combination-songs':
        return <CombinationSongs lesson={lesson} scriptures={lessonScriptures} />;
      default:
        return null;
    }
  };

  if (selectedActivity) {
    return (
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setSelectedActivity(null)}
          className="mb-6 flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span>Back to Lesson</span>
        </button>
        {renderActivity()}
      </div>
    );
  }

  if (selectedLesson) {
    const lesson = lessonModules.find(l => l.id === selectedLesson);
    if (!lesson) return null;

    const activityTypes = {
      'lyric-matching': {
        name: 'Lyric to Verse Matching',
        description: 'Match hymn lyrics with their corresponding Scripture verses',
        icon: Music
      },
      'fill-in-blank': {
        name: 'Fill in the Blank Audio Quiz',
        description: 'Listen to sung Scripture and fill in missing words',
        icon: Volume2
      },
      'melody-mapping': {
        name: 'Melody Mapping',
        description: 'See how melody mirrors emotional tones in Scripture',
        icon: Target
      },
      'call-response': {
        name: 'Call and Response',
        description: 'Interactive singing and recitation practice',
        icon: Mic
      },
      'text-grouping': {
        name: 'Text Grouping',
        description: 'Group related Scripture passages by theme',
        icon: BookOpen
      },
      'partial-text': {
        name: 'Partial Text Practice',
        description: 'Practice with Scripture fragments and phrases',
        icon: Book
      },
      'combination-songs': {
        name: 'Combination Scripture Songs',
        description: 'Learn songs that combine multiple Scripture passages',
        icon: Star
      }
    };

    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={() => setSelectedLesson(null)}
          className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span>Back to Lessons</span>
        </button>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-white">{lesson.title}</h1>
            <p className="text-xl text-blue-100">{lesson.description}</p>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <span className={`px-4 py-2 text-sm font-medium ${getThemeColor(lesson.theme)}`}>
                {lesson.theme}
              </span>
              <span className={`px-4 py-2 text-sm font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                {lesson.difficulty}
              </span>
              <span className="bg-white/20 text-white px-4 py-2 text-sm font-medium flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration}</span>
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Musical Concept</h3>
            <p className="text-blue-100 text-lg">{lesson.musicalConcept}</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Activities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {lesson.activities.map((activityId) => {
                const activity = activityTypes[activityId as keyof typeof activityTypes];
                if (!activity) return null;

                const Icon = activity.icon;
                return (
                  <button
                    key={activityId}
                    onClick={() => setSelectedActivity(activityId)}
                    className="bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-6 border border-white/20 hover:from-white/15 hover:to-white/10 transition-all duration-300 text-left group hover:scale-105"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent-50 p-3 rounded-full group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-200">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">
                          {activity.name}
                        </h4>
                        <p className="text-blue-100 text-sm mt-1">{activity.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading || !dbInitialized) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Interactive Lessons</h1>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-blue-100">Loading lessons...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Interactive Lessons</h1>
        <p className="text-xl text-blue-100">Learn Scripture through music with engaging activities</p>
      </div>

      {/* Progress Stats */}
      {Object.keys(userProgress).length > 0 && (
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Your Progress</h3>
                <p className="text-blue-100 text-sm">
                  {Object.values(userProgress).filter(p => p.status === 'completed').length} of {dbLessons.length} lessons completed
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-400">
                  {Object.values(userProgress).reduce((sum, p) => sum + p.total_score, 0)}
                </p>
                <p className="text-blue-200 text-sm">Total Points</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">
                  {Math.round(
                    Object.values(userProgress).reduce((sum, p) => sum + p.completion_percentage, 0) /
                    Math.max(Object.values(userProgress).length, 1)
                  )}%
                </p>
                <p className="text-blue-200 text-sm">Avg. Completion</p>
              </div>
              <button
                onClick={async () => {
                  const badges = await getUserBadges();
                  alert(`You have ${badges.length} badges!`);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:from-yellow-400 hover:to-orange-400 transition-all"
              >
                <Award className="w-5 h-5" />
                <span>Badges</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-white font-medium mb-2 block">Filter by Theme</label>
            <select
              value={filterTheme}
              onChange={(e) => setFilterTheme(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {themes.map(theme => (
                <option key={theme} value={theme} className="bg-gray-800">
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-white font-medium mb-2 block">Filter by Difficulty</label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty} className="bg-gray-800">
                  {difficulty === 'all' ? 'All Levels' : difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lesson Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson.id)}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-blue-200 text-sm mt-1">{lesson.description}</p>
                </div>
                <BookOpen className="w-6 h-6 text-yellow-500 group-hover:text-yellow-300 transition-colors" />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 text-sm font-medium ${getThemeColor(lesson.theme)}`}>
                  {lesson.theme}
                </span>
                <span className={`px-3 py-1 text-sm font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty}
                </span>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-blue-100 text-sm font-medium">{lesson.musicalConcept}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-blue-200">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{lesson.activities.length} activities</span>
                </div>
              </div>

              {lesson.completed && (
                <div className="flex items-center space-x-2 text-green-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-10 h-10 text-blue-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No lessons found</h3>
          <p className="text-blue-200">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}