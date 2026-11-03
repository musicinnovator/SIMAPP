import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle, XCircle, Play, TrendingUp, TrendingDown } from 'lucide-react';
import * as Tone from 'tone';

interface IntervalQuestion {
  note1: string;
  note2: string;
  interval: string;
  direction: 'ascending' | 'descending';
  type: 'step' | 'leap';
}

interface IntervalListeningQuizProps {
  onComplete: (score: number) => void;
}

export function IntervalListeningQuiz({ onComplete }: IntervalListeningQuizProps) {
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<IntervalQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalQuestions] = useState(8);

  const intervals = [
    { name: 'Minor 2nd', semitones: 1, type: 'step' },
    { name: 'Major 2nd', semitones: 2, type: 'step' },
    { name: 'Minor 3rd', semitones: 3, type: 'leap' },
    { name: 'Major 3rd', semitones: 4, type: 'leap' },
    { name: 'Perfect 4th', semitones: 5, type: 'leap' },
    { name: 'Perfect 5th', semitones: 7, type: 'leap' },
    { name: 'Octave', semitones: 12, type: 'leap' }
  ];

  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

  useEffect(() => {
    const newSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5
      }
    }).toDestination();
    setSynth(newSynth);

    generateQuestion();

    return () => {
      newSynth.dispose();
    };
  }, []);

  const noteToMidi = (note: string): number => {
    const noteMap: { [key: string]: number } = {
      'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
    };
    const noteName = note[0];
    const octave = parseInt(note[1]);
    return (octave + 1) * 12 + noteMap[noteName];
  };

  const midiToNote = (midi: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const noteIndex = midi % 12;
    return noteNames[noteIndex] + octave;
  };

  const generateQuestion = () => {
    const interval = intervals[Math.floor(Math.random() * intervals.length)];
    const direction = Math.random() > 0.5 ? 'ascending' : 'descending';
    const baseNoteIndex = Math.floor(Math.random() * 4);
    const note1 = notes[baseNoteIndex];
    const note1Midi = noteToMidi(note1);
    const note2Midi = direction === 'ascending'
      ? note1Midi + interval.semitones
      : note1Midi - interval.semitones;
    const note2 = midiToNote(note2Midi);

    setCurrentQuestion({
      note1,
      note2,
      interval: interval.name,
      direction,
      type: interval.type as 'step' | 'leap'
    });
  };

  const playInterval = async () => {
    if (!synth || !currentQuestion || isPlaying) return;

    setIsPlaying(true);
    await Tone.start();

    const now = Tone.now();
    synth.triggerAttackRelease(currentQuestion.note1, '4n', now);
    synth.triggerAttackRelease(currentQuestion.note2, '4n', now + 0.6);

    setTimeout(() => setIsPlaying(false), 1500);
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || feedback) return;

    let isCorrect = false;

    if (answer === 'direction') {
      isCorrect = true;
    } else if (answer === 'ascending') {
      isCorrect = currentQuestion.direction === 'ascending';
    } else if (answer === 'descending') {
      isCorrect = currentQuestion.direction === 'descending';
    } else if (answer === 'step') {
      isCorrect = currentQuestion.type === 'step';
    } else if (answer === 'leap') {
      isCorrect = currentQuestion.type === 'leap';
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      if (questionNumber + 1 < totalQuestions) {
        setQuestionNumber(prev => prev + 1);
        generateQuestion();
      } else {
        const finalScore = ((score + (isCorrect ? 1 : 0)) / totalQuestions) * 100;
        onComplete(finalScore);
      }
    }, 1500);
  };

  if (!currentQuestion) return null;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Volume2 className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Interval Listening Quiz</h2>
        </div>
        <p className="text-blue-100 text-lg">
          Listen to the two notes and identify the interval characteristics
        </p>
        <div className="flex items-center justify-center gap-6 text-blue-200">
          <span>Question {questionNumber + 1} / {totalQuestions}</span>
          <span>•</span>
          <span>Score: {score} / {questionNumber + 1}</span>
        </div>
      </div>

      {/* Play Button */}
      <div className="text-center">
        <button
          onClick={playInterval}
          disabled={isPlaying || feedback !== null}
          className={`px-12 py-6 rounded-lg font-bold text-xl transition-all transform hover:scale-105 ${
            isPlaying
              ? 'bg-green-500 animate-pulse'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400'
          } text-white shadow-lg`}
        >
          <div className="flex items-center gap-3">
            <Play className="w-8 h-8" />
            <span>{isPlaying ? 'Playing...' : 'Play Interval'}</span>
          </div>
        </button>
        <p className="text-blue-300 mt-4">Click to hear the two notes</p>
      </div>

      {/* Answer Options */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Direction */}
        <div className="space-y-3">
          <h3 className="text-white font-bold text-lg">Direction:</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer('ascending')}
              disabled={feedback !== null}
              className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                feedback === 'correct' && currentQuestion.direction === 'ascending'
                  ? 'bg-green-500/30 border-green-500'
                  : feedback === 'incorrect' && currentQuestion.direction === 'ascending'
                  ? 'bg-red-500/30 border-red-500'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-blue-400'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <span className="text-white font-semibold">Ascending</span>
                <span className="text-blue-200 text-sm">Going up</span>
              </div>
            </button>

            <button
              onClick={() => handleAnswer('descending')}
              disabled={feedback !== null}
              className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                feedback === 'correct' && currentQuestion.direction === 'descending'
                  ? 'bg-green-500/30 border-green-500'
                  : feedback === 'incorrect' && currentQuestion.direction === 'descending'
                  ? 'bg-red-500/30 border-red-500'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-blue-400'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <TrendingDown className="w-8 h-8 text-red-400" />
                <span className="text-white font-semibold">Descending</span>
                <span className="text-blue-200 text-sm">Going down</span>
              </div>
            </button>
          </div>
        </div>

        {/* Type */}
        <div className="space-y-3">
          <h3 className="text-white font-bold text-lg">Type:</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer('step')}
              disabled={feedback !== null}
              className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                feedback === 'correct' && currentQuestion.type === 'step'
                  ? 'bg-green-500/30 border-green-500'
                  : feedback === 'incorrect' && currentQuestion.type === 'step'
                  ? 'bg-red-500/30 border-red-500'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-purple-400'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl">🚶</div>
                <span className="text-white font-semibold">Step</span>
                <span className="text-blue-200 text-sm">Close together</span>
              </div>
            </button>

            <button
              onClick={() => handleAnswer('leap')}
              disabled={feedback !== null}
              className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                feedback === 'correct' && currentQuestion.type === 'leap'
                  ? 'bg-green-500/30 border-green-500'
                  : feedback === 'incorrect' && currentQuestion.type === 'leap'
                  ? 'bg-red-500/30 border-red-500'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-purple-400'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl">🦘</div>
                <span className="text-white font-semibold">Leap</span>
                <span className="text-blue-200 text-sm">Jump between notes</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`text-center p-6 rounded-xl border-2 ${
          feedback === 'correct'
            ? 'bg-green-500/20 border-green-500'
            : 'bg-red-500/20 border-red-500'
        }`}>
          <div className="flex items-center justify-center gap-3 mb-2">
            {feedback === 'correct' ? (
              <>
                <CheckCircle className="w-8 h-8 text-green-400" />
                <span className="text-green-300 text-2xl font-bold">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-red-400" />
                <span className="text-red-300 text-2xl font-bold">Not quite!</span>
              </>
            )}
          </div>
          <p className="text-blue-100">
            The interval was: {currentQuestion.interval} ({currentQuestion.direction})
          </p>
        </div>
      )}
    </div>
  );
}
