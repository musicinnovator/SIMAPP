import React, { useState, useEffect } from 'react';
import { Play, Pause, Plus, Trash2, Music, CreditCard as Edit3, Save, Volume2, Sparkles } from 'lucide-react';
import * as Tone from 'tone';

interface Note {
  pitch: string;
  duration: string;
  time: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  scaleType: 'partial' | 'composite' | 'full';
  baseNotes: string[];
  scripture: string;
}

interface MelodiesOfPraiseProps {
  onComplete: (score: number) => void;
}

export function MelodiesOfPraise({ onComplete }: MelodiesOfPraiseProps) {
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [melody, setMelody] = useState<Note[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);

  const lessons: Lesson[] = [
    {
      id: 'partial-scale-1',
      title: 'Partial Pentatonic Praise',
      description: 'Ascending melody using 5 notes of the pentatonic scale',
      scaleType: 'partial',
      baseNotes: ['C4', 'D4', 'E4', 'G4', 'A4'],
      scripture: 'Sing to the Lord a new song (Psalm 96:1)'
    },
    {
      id: 'partial-scale-2',
      title: 'Three-Note Ascension',
      description: 'Simple ascending pattern with three pure notes',
      scaleType: 'partial',
      baseNotes: ['C4', 'E4', 'G4'],
      scripture: 'Let everything that has breath praise the Lord (Psalm 150:6)'
    },
    {
      id: 'partial-scale-3',
      title: 'Four-Note Foundation',
      description: 'Building melodies with four fundamental scale degrees',
      scaleType: 'partial',
      baseNotes: ['C4', 'D4', 'F4', 'G4'],
      scripture: 'Make a joyful noise unto the Lord (Psalm 100:1)'
    },
    {
      id: 'composite-scale-1',
      title: 'Composite Major Climb',
      description: 'Combining major scale segments into ascending praise',
      scaleType: 'composite',
      baseNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
      scripture: 'I will exalt you, my God the King (Psalm 145:1)'
    },
    {
      id: 'composite-scale-2',
      title: 'Lydian Lift',
      description: 'Bright composite scale with raised fourth for joy',
      scaleType: 'composite',
      baseNotes: ['C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5'],
      scripture: 'Praise Him with resounding cymbals (Psalm 150:5)'
    },
    {
      id: 'composite-scale-3',
      title: 'Mixolydian March',
      description: 'Folk-inspired scale with lowered seventh for earthly praise',
      scaleType: 'composite',
      baseNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'C5'],
      scripture: 'Clap your hands, all you nations (Psalm 47:1)'
    },
    {
      id: 'full-scale-1',
      title: 'Full Octave Praise',
      description: 'Complete ascending octave expressing complete devotion',
      scaleType: 'full',
      baseNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
      scripture: 'Praise the Lord from the heavens (Psalm 148:1)'
    },
    {
      id: 'full-scale-2',
      title: 'Ascending Hallelujah',
      description: 'Extended range melody reaching towards heaven',
      scaleType: 'full',
      baseNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5'],
      scripture: 'My soul magnifies the Lord (Luke 1:46)'
    }
  ];

  useEffect(() => {
    const newSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 0.8 }
    }).toDestination();
    setSynth(newSynth);

    return () => {
      newSynth.dispose();
    };
  }, []);

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    const defaultMelody = lesson.baseNotes.map((note, idx) => ({
      pitch: note,
      duration: '4n',
      time: idx * 0.5
    }));
    setMelody(defaultMelody);
    setIsEditing(false);
    setCompleted(false);
  };

  const playMelody = async () => {
    if (!synth || isPlaying || melody.length === 0) return;

    setIsPlaying(true);
    await Tone.start();

    const now = Tone.now();
    melody.forEach((note, idx) => {
      const time = now + note.time;
      synth.triggerAttackRelease(note.pitch, note.duration, time);

      setTimeout(() => {
        setActiveNoteIndex(idx);
      }, note.time * 1000);
    });

    setTimeout(() => {
      setIsPlaying(false);
      setActiveNoteIndex(null);
    }, (melody[melody.length - 1].time + 1) * 1000);
  };

  const addNote = () => {
    if (!currentLesson) return;

    const lastNote = melody[melody.length - 1];
    const availableNotes = currentLesson.baseNotes;
    const currentIndex = availableNotes.indexOf(lastNote?.pitch || availableNotes[0]);
    const nextNoteIndex = Math.min(currentIndex + 1, availableNotes.length - 1);
    const newTime = lastNote ? lastNote.time + 0.5 : 0;

    const newNote: Note = {
      pitch: availableNotes[nextNoteIndex],
      duration: '4n',
      time: newTime
    };

    setMelody([...melody, newNote]);
  };

  const removeNote = (index: number) => {
    if (melody.length <= 1) return;
    const newMelody = melody.filter((_, idx) => idx !== index);
    const retimedMelody = newMelody.map((note, idx) => ({
      ...note,
      time: idx * 0.5
    }));
    setMelody(retimedMelody);
    setSelectedNoteIndex(null);
  };

  const changeNotePitch = (index: number, direction: 'up' | 'down') => {
    if (!currentLesson) return;

    const note = melody[index];
    const availableNotes = currentLesson.baseNotes;
    const currentIndex = availableNotes.indexOf(note.pitch);

    let newIndex;
    if (direction === 'up') {
      newIndex = Math.min(currentIndex + 1, availableNotes.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }

    const newMelody = [...melody];
    newMelody[index] = { ...note, pitch: availableNotes[newIndex] };
    setMelody(newMelody);
  };

  const completeLesson = () => {
    const isAscending = melody.every((note, idx) => {
      if (idx === 0) return true;
      const prevNoteValue = Tone.Frequency(melody[idx - 1].pitch).toMidi();
      const currNoteValue = Tone.Frequency(note.pitch).toMidi();
      return currNoteValue >= prevNoteValue;
    });

    const lessonScore = isAscending && melody.length >= 3 ? 100 : 70;
    setScore(lessonScore);
    setCompleted(true);

    setTimeout(() => {
      onComplete(lessonScore);
    }, 2000);
  };

  const getNoteName = (pitch: string): string => {
    return pitch.replace(/[0-9]/g, '');
  };

  const getOctave = (pitch: string): string => {
    return pitch.replace(/[A-Z#]/g, '');
  };

  if (!currentLesson) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 animate-slideDown">
            <Music className="w-10 h-10 text-blue-400 animate-pulse" />
            <h2 className="text-4xl font-bold text-white drop-shadow-glow">Melodies of Praise</h2>
            <Sparkles className="w-8 h-8 text-cyan-400 animate-bounce" />
          </div>
          <p className="text-blue-100 text-xl max-w-3xl mx-auto animate-slideUp">
            Learn to create ascending melodies that lift your spirit in worship
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              onClick={() => selectLesson(lesson)}
              className="group bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20 hover:border-blue-400/60 transition-all duration-500 ease-out cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 animate-slideIn"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-blue-500/50">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                    lesson.scaleType === 'partial'
                      ? 'bg-green-500/30 text-green-300 border border-green-500 group-hover:bg-green-500/50'
                      : lesson.scaleType === 'composite'
                      ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500 group-hover:bg-yellow-500/50'
                      : 'bg-red-500/30 text-red-300 border border-red-500 group-hover:bg-red-500/50'
                  }`}>
                    {lesson.scaleType === 'partial' ? 'Beginner' : lesson.scaleType === 'composite' ? 'Intermediate' : 'Advanced'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                  {lesson.title}
                </h3>

                <p className="text-blue-200 leading-relaxed group-hover:text-blue-100 transition-colors duration-300">
                  {lesson.description}
                </p>

                <div className="bg-white/10 rounded-lg p-3 border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-300">
                  <p className="text-blue-100 text-sm italic">
                    "{lesson.scripture}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 text-sm">
                    {lesson.baseNotes.length} notes available
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between animate-slideDown">
        <button
          onClick={() => setCurrentLesson(null)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105"
        >
          ← Back to Lessons
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg ${
            isEditing
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/50'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/50'
          }`}
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{isEditing ? 'Done Editing' : 'Edit Melody'}</span>
        </button>
      </div>

      <div className="text-center space-y-4 animate-slideUp">
        <h2 className="text-3xl font-bold text-white drop-shadow-glow">{currentLesson.title}</h2>
        <p className="text-blue-100 text-lg">{currentLesson.description}</p>
        <div className="inline-block bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20 hover:border-white/40 transition-all duration-300">
          <p className="text-blue-100 italic">"{currentLesson.scripture}"</p>
        </div>
      </div>

      {/* Note Editor with immersive animations */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20 hover:border-white/30 transition-all duration-500 shadow-xl hover:shadow-purple-500/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Your Ascending Melody</h3>
          {isEditing && (
            <button
              onClick={addNote}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-green-500/50 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-4 min-h-[200px] bg-white/10 rounded-xl p-6 border border-white/20">
          {melody.map((note, idx) => {
            const noteHeight = Tone.Frequency(note.pitch).toMidi();
            const minHeight = Tone.Frequency(currentLesson.baseNotes[0]).toMidi();
            const maxHeight = Tone.Frequency(currentLesson.baseNotes[currentLesson.baseNotes.length - 1]).toMidi();
            const heightPercent = ((noteHeight - minHeight) / (maxHeight - minHeight)) * 100;

            return (
              <div
                key={idx}
                onClick={() => isEditing && setSelectedNoteIndex(idx)}
                className={`relative group transition-all duration-500 ease-out ${
                  isEditing ? 'cursor-pointer hover:scale-110' : ''
                } ${
                  selectedNoteIndex === idx ? 'ring-4 ring-yellow-400 scale-110' : ''
                } ${
                  activeNoteIndex === idx ? 'scale-125 brightness-150' : ''
                } animate-slideIn`}
                style={{
                  height: `${Math.max(heightPercent, 20)}%`,
                  animationDelay: `${idx * 50}ms`
                }}
              >
                <div className={`w-16 h-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg flex items-center justify-center relative shadow-lg transition-all duration-300 ${
                  activeNoteIndex === idx ? 'shadow-cyan-400/60 animate-pulse' : ''
                }`}>
                  <div className="text-white font-bold text-sm">
                    <div>{getNoteName(note.pitch)}</div>
                    <div className="text-xs opacity-75">{getOctave(note.pitch)}</div>
                  </div>

                  {isEditing && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-md rounded-lg p-1 flex flex-col gap-1 border border-white/30 shadow-xl">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeNotePitch(idx, 'up');
                          }}
                          className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                          ▲
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeNotePitch(idx, 'down');
                          }}
                          className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  )}

                  {isEditing && melody.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNote(idx);
                      }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-125 active:scale-95"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                    </button>
                  )}
                </div>
                <div className="text-center mt-2 text-blue-200 text-xs">{idx + 1}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={playMelody}
          disabled={isPlaying || melody.length === 0}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl ${
            isPlaying
              ? 'bg-green-500 animate-pulse shadow-green-500/50'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 shadow-blue-500/50'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPlaying ? <Pause className="w-6 h-6 animate-spin-slow" /> : <Play className="w-6 h-6" />}
          <span>{isPlaying ? 'Playing...' : 'Play Melody'}</span>
        </button>

        {!completed && (
          <button
            onClick={completeLesson}
            disabled={melody.length < 3}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Lesson
          </button>
        )}
      </div>

      {/* Completion */}
      {completed && (
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-lg p-8 border-2 border-green-500 text-center animate-bounceIn shadow-2xl shadow-green-500/30">
          <Sparkles className="w-16 h-16 text-green-300 mx-auto mb-4 animate-pulse" />
          <h3 className="text-3xl font-bold text-green-300 mb-4 drop-shadow-glow">Lesson Complete! 🎵</h3>
          <p className="text-white text-xl mb-2">Score: {score}%</p>
          <p className="text-blue-200">
            You've created a beautiful ascending melody of praise!
          </p>
        </div>
      )}
    </div>
  );
}
