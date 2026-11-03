import React, { useState, useEffect } from 'react';
import { ArrowLeft, Music, Heart, CloudRain, Waves, Brain, Sun, TrendingUp, Wind, Zap, Flame, User, Clock, Gift, Activity, Anchor } from 'lucide-react';
import * as Tone from 'tone';

type LessonType =
  | 'melodies' | 'harmonies' | 'minor' | 'gentle' | 'complex'
  | 'joy' | 'hope' | 'peace' | 'strength' | 'love'
  | 'worship' | 'gratitude' | 'humility' | 'fellowship' | 'redemption'
  | null;

interface LessonData {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  scriptureTheme: string;
  features: string[];
  tempo: number;
  musicType: 'melody' | 'harmony' | 'rhythm' | 'progression';
}

export function CompleteMusicLessonsHub() {
  const [selectedLesson, setSelectedLesson] = useState<LessonType>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);

  useEffect(() => {
    const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
    setSynth(newSynth);
    return () => newSynth.dispose();
  }, []);

  const lessons: LessonData[] = [
    {
      id: 'melodies',
      title: 'Melodies of Praise',
      description: 'Ascending melodies using partial, composite, and full scales',
      icon: Music,
      color: 'from-blue-500 to-cyan-500',
      scriptureTheme: 'Sing to the Lord a new song',
      features: ['Ascending patterns', 'Editable notes', 'Partial & composite scales'],
      tempo: 90,
      musicType: 'melody'
    },
    {
      id: 'harmonies',
      title: 'Harmonies of Trust',
      description: 'Stable progressions with no altered chords',
      icon: Heart,
      color: 'from-green-500 to-emerald-500',
      scriptureTheme: 'Trust in the Lord with all your heart',
      features: ['Stable chords', 'Moderate tempo', 'Peaceful harmonies'],
      tempo: 70,
      musicType: 'harmony'
    },
    {
      id: 'minor',
      title: 'Minor Keys of Repentance',
      description: 'Minor progressions where minor key dominates',
      icon: CloudRain,
      color: 'from-indigo-500 to-purple-500',
      scriptureTheme: 'Create in me a clean heart',
      features: ['Minor dominance', 'Slow tempo', 'Reflective mood'],
      tempo: 60,
      musicType: 'progression'
    },
    {
      id: 'gentle',
      title: 'Gentle Rhythms of Comfort',
      description: 'Slow, gentle rhythms that soothe the soul',
      icon: Waves,
      color: 'from-teal-500 to-cyan-500',
      scriptureTheme: 'Come to me and I will give you rest',
      features: ['Slow rhythms', 'Gentle patterns', 'Easy to play'],
      tempo: 55,
      musicType: 'rhythm'
    },
    {
      id: 'complex',
      title: 'Complex Harmonies of Wisdom',
      description: 'Sophisticated progressions revealing depth',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      scriptureTheme: 'The fear of the Lord is wisdom',
      features: ['Rich progressions', 'Sophisticated chords', 'Deep exploration'],
      tempo: 65,
      musicType: 'harmony'
    },
    {
      id: 'joy',
      title: 'Major Scales of Joy',
      description: 'Bright major keys celebrating gladness',
      icon: Sun,
      color: 'from-yellow-500 to-orange-500',
      scriptureTheme: 'Rejoice in the Lord always',
      features: ['Bright major keys', 'Joyful patterns', 'Ascending celebration'],
      tempo: 110,
      musicType: 'melody'
    },
    {
      id: 'hope',
      title: 'Rising Melodies of Hope',
      description: 'Uplifting melodic lines expressing faith',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      scriptureTheme: 'Hope does not put us to shame',
      features: ['Rising patterns', 'Hopeful expression', 'Upward movement'],
      tempo: 85,
      musicType: 'melody'
    },
    {
      id: 'peace',
      title: 'Sustained Notes of Peace',
      description: 'Long tones with slow harmonic rhythm',
      icon: Wind,
      color: 'from-blue-500 to-indigo-500',
      scriptureTheme: 'Peace I leave with you',
      features: ['Long sustained notes', 'Slow changes', 'Profound tranquility'],
      tempo: 50,
      musicType: 'harmony'
    },
    {
      id: 'strength',
      title: 'Bold Rhythms of Strength',
      description: 'Strong, steady beats conveying power',
      icon: Zap,
      color: 'from-red-500 to-orange-500',
      scriptureTheme: 'The Lord is my strength',
      features: ['Strong beats', 'Powerful chords', 'Steady rhythm'],
      tempo: 100,
      musicType: 'rhythm'
    },
    {
      id: 'love',
      title: 'Warm Harmonies of Love',
      description: 'Rich, warm chords expressing divine love',
      icon: Flame,
      color: 'from-pink-500 to-red-500',
      scriptureTheme: 'God is love',
      features: ['Warm chords', 'Added color tones', 'Rich expression'],
      tempo: 72,
      musicType: 'harmony'
    },
    {
      id: 'worship',
      title: 'Reverent Tempos of Worship',
      description: 'Slow, meditative rhythms for adoration',
      icon: User,
      color: 'from-indigo-500 to-blue-500',
      scriptureTheme: 'Worship the Lord in spirit',
      features: ['Slow tempo', 'Meditative rhythm', 'Sacred space'],
      tempo: 45,
      musicType: 'rhythm'
    },
    {
      id: 'gratitude',
      title: 'Rhythmic Patterns of Gratitude',
      description: 'Joyful syncopation expressing thanks',
      icon: Gift,
      color: 'from-green-500 to-yellow-500',
      scriptureTheme: 'Give thanks in all circumstances',
      features: ['Syncopated rhythms', 'Joyful patterns', 'Celebration'],
      tempo: 95,
      musicType: 'rhythm'
    },
    {
      id: 'humility',
      title: 'Gentle Intervals of Humility',
      description: 'Small melodic steps showing meekness',
      icon: Activity,
      color: 'from-teal-500 to-green-500',
      scriptureTheme: 'Blessed are the meek',
      features: ['Stepwise motion', 'Small intervals', 'Gentle approach'],
      tempo: 68,
      musicType: 'melody'
    },
    {
      id: 'fellowship',
      title: 'United Chords of Fellowship',
      description: 'Blended voices creating harmony',
      icon: Clock,
      color: 'from-blue-500 to-purple-500',
      scriptureTheme: 'Where two or three gather',
      features: ['Blended chords', 'Multiple voices', 'Unity'],
      tempo: 75,
      musicType: 'harmony'
    },
    {
      id: 'redemption',
      title: 'Musical Resolution of Redemption',
      description: 'Tension resolving to perfect peace',
      icon: Anchor,
      color: 'from-purple-500 to-pink-500',
      scriptureTheme: 'In Him we have redemption',
      features: ['Tension & release', 'Dissonance to consonance', 'Resolution'],
      tempo: 62,
      musicType: 'progression'
    }
  ];

  const playLesson = async (lesson: LessonData) => {
    if (!synth || isPlaying) return;

    setIsPlaying(true);
    await Tone.start();

    const beatDuration = 60 / lesson.tempo;
    const now = Tone.now();

    if (lesson.musicType === 'melody') {
      const melody = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
      melody.forEach((note, idx) => {
        synth.triggerAttackRelease(note, '4n', now + idx * beatDuration);
      });
    } else if (lesson.musicType === 'harmony') {
      const chords = [
        ['C4', 'E4', 'G4'],
        ['F4', 'A4', 'C5'],
        ['G4', 'B4', 'D5'],
        ['C4', 'E4', 'G4']
      ];
      chords.forEach((chord, idx) => {
        synth.triggerAttackRelease(chord, beatDuration * 1.5, now + idx * beatDuration * 2);
      });
    }

    setTimeout(() => setIsPlaying(false), 8000);
  };

  const completeLesson = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    setScores(prev => ({ ...prev, [lessonId]: 100 }));
    setSelectedLesson(null);
  };

  if (selectedLesson) {
    const lesson = lessons.find(l => l.id === selectedLesson);
    if (!lesson) return null;

    return (
      <div className="space-y-8 animate-fadeIn">
        <button
          onClick={() => setSelectedLesson(null)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Lessons
        </button>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <lesson.icon className="w-10 h-10 text-white" />
            <h2 className="text-4xl font-bold text-white">{lesson.title}</h2>
          </div>
          <p className="text-blue-100 text-xl">{lesson.description}</p>
          <div className="inline-block bg-white/10 rounded-xl px-6 py-3 border border-white/20">
            <p className="text-blue-100 italic">"{lesson.scriptureTheme}"</p>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${lesson.color}/20 backdrop-blur-md rounded-lg p-8 border border-white/20`}>
          <h3 className="text-2xl font-bold text-white mb-6">Musical Exercise</h3>
          <div className="space-y-4">
            <div className="text-white">
              <p className="text-lg mb-4">This lesson teaches {lesson.musicType} at {lesson.tempo} BPM</p>
              <div className="bg-white/10 rounded-xl p-6 space-y-4">
                {lesson.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => playLesson(lesson)}
              disabled={isPlaying}
              className={`w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                isPlaying
                  ? 'bg-green-500 animate-pulse'
                  : `bg-gradient-to-r ${lesson.color} hover:scale-105`
              } text-white shadow-2xl`}
            >
              {isPlaying ? 'Playing...' : 'Play Example'}
            </button>

            <button
              onClick={() => completeLesson(lesson.id)}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Complete Lesson
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completionRate = (completedLessons.size / lessons.length) * 100;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-white drop-shadow-glow">Learn Scripture Through Music</h1>
        <p className="text-blue-100 text-xl max-w-3xl mx-auto">
          Explore 15 unique musical approaches to deepen your understanding of God's Word
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-blue-200 text-sm mb-2">Lessons Completed</div>
          <div className="text-white text-3xl font-bold mb-2">
            {completedLessons.size} / {lessons.length}
          </div>
          <div className="bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, idx) => {
          const Icon = lesson.icon;
          const isCompleted = completedLessons.has(lesson.id);

          return (
            <div
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson.id as LessonType)}
              className={`group bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl animate-slideIn`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`bg-gradient-to-r ${lesson.color} p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{lesson.title}</h3>
              <p className="text-blue-200 text-sm mb-4">{lesson.description}</p>

              {isCompleted && (
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">Completed</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
