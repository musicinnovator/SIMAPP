import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, CheckCircle, Target, Timer } from 'lucide-react';
import * as Tone from 'tone';

interface Beat {
  time: number;
  duration: number;
  note: string;
}

interface RhythmicTappingProps {
  onComplete: (score: number) => void;
}

export function RhythmicTapping({ onComplete }: RhythmicTappingProps) {
  const [pattern, setPattern] = useState<Beat[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userTaps, setUserTaps] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [metronome, setMetronome] = useState<Tone.Synth | null>(null);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newSynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
    }).toDestination();

    const newMetronome = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
    }).toDestination();

    setSynth(newSynth);
    setMetronome(newMetronome);

    generatePattern();

    return () => {
      newSynth.dispose();
      newMetronome.dispose();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const generatePattern = () => {
    const patterns = [
      [
        { time: 0, duration: 0.5, note: 'C5' },
        { time: 0.5, duration: 0.5, note: 'C5' },
        { time: 1, duration: 0.5, note: 'C5' },
        { time: 1.5, duration: 0.5, note: 'C5' }
      ],
      [
        { time: 0, duration: 1, note: 'C5' },
        { time: 1, duration: 0.5, note: 'C5' },
        { time: 1.5, duration: 0.5, note: 'C5' }
      ],
      [
        { time: 0, duration: 0.5, note: 'C5' },
        { time: 0.5, duration: 0.5, note: 'C5' },
        { time: 1, duration: 1, note: 'C5' }
      ]
    ];

    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    setPattern(selectedPattern);
  };

  const playPattern = async () => {
    if (!synth || !metronome || isPlaying) return;

    setIsPlaying(true);
    await Tone.start();

    const now = Tone.now();

    for (let i = 0; i < 4; i++) {
      metronome.triggerAttackRelease('G6', '32n', now + i * 0.5);
    }

    pattern.forEach((beat) => {
      synth.triggerAttackRelease(beat.note, beat.duration, now + beat.time);
      setTimeout(() => {
        setCurrentBeat(pattern.indexOf(beat) + 1);
      }, beat.time * 1000);
    });

    timeoutRef.current = setTimeout(() => {
      setIsPlaying(false);
      setCurrentBeat(0);
    }, 2500);
  };

  const startRecording = () => {
    setIsRecording(true);
    setUserTaps([]);
    setStartTime(Date.now());
    setScore(null);
    setShowResult(false);

    timeoutRef.current = setTimeout(() => {
      stopRecording();
    }, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    calculateScore();
  };

  const handleTap = () => {
    if (!isRecording || !startTime) return;

    const tapTime = (Date.now() - startTime) / 1000;
    setUserTaps(prev => [...prev, tapTime]);

    if (synth) {
      synth.triggerAttackRelease('C5', '32n');
    }
  };

  const calculateScore = () => {
    if (userTaps.length === 0) {
      setScore(0);
      setShowResult(true);
      return;
    }

    const expectedTimes = pattern.map(beat => beat.time);
    let totalError = 0;
    let matchedTaps = 0;

    expectedTimes.forEach(expectedTime => {
      const closestTap = userTaps.reduce((prev, curr) => {
        return Math.abs(curr - expectedTime) < Math.abs(prev - expectedTime) ? curr : prev;
      });

      const error = Math.abs(closestTap - expectedTime);
      if (error < 0.15) {
        matchedTaps++;
        totalError += error;
      }
    });

    const accuracy = (matchedTaps / expectedTimes.length) * 100;
    const timingScore = matchedTaps > 0 ? Math.max(0, 100 - (totalError / matchedTaps) * 200) : 0;
    const finalScore = (accuracy * 0.7 + timingScore * 0.3);

    setScore(Math.round(finalScore));
    setShowResult(true);

    setTimeout(() => {
      onComplete(finalScore);
    }, 3000);
  };

  const getRhythmNotation = (beat: Beat): string => {
    if (beat.duration >= 1) return '𝅝';
    if (beat.duration >= 0.5) return '♩';
    return '♪';
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Music className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Rhythmic Tapping</h2>
        </div>
        <p className="text-blue-100 text-lg">
          Listen to the rhythm and tap it back accurately
        </p>
      </div>

      {/* Rhythm Notation Display */}
      <div className="bg-white/10 backdrop-blur-md p-8 border-l-4 border-purple-500">
        <h3 className="text-white font-bold text-lg mb-6 text-center">Rhythm Pattern</h3>
        <div className="flex items-center justify-center gap-8">
          {pattern.map((beat, idx) => (
            <div
              key={idx}
              className={`transition-all ${
                currentBeat === idx + 1 ? 'scale-150 text-yellow-300' : 'text-white'
              }`}
            >
              <span className="text-6xl">{getRhythmNotation(beat)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <div className="inline-block bg-white/10 rounded-lg px-4 py-2">
            <p className="text-blue-200 text-sm">
              {pattern.length} beats in 2 seconds
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={playPattern}
          disabled={isPlaying || isRecording}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
            isPlaying
              ? 'bg-green-500 animate-pulse'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400'
          } text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6" />
            <span>{isPlaying ? 'Playing Pattern...' : 'Listen to Pattern'}</span>
          </div>
        </button>

        <div className="text-center">
          <div className="text-blue-300 mb-4">👇 Then tap the rhythm below 👇</div>
          <button
            onClick={isRecording ? handleTap : startRecording}
            disabled={isPlaying}
            className={`w-48 h-48 font-bold text-xl transition-all transform active:scale-95 shadow-xl border-4 ${
              isRecording
                ? 'bg-red-600 border-red-400 animate-pulse'
                : 'bg-green-600 border-green-400 hover:bg-green-500'
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRecording ? (
              <div className="flex flex-col items-center gap-2">
                <Target className="w-8 h-8" />
                <span>TAP!</span>
                <span className="text-sm">{userTaps.length} taps</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Timer className="w-8 h-8" />
                <span>Start Tapping</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {showResult && score !== null && (
        <div className={`text-center p-8 rounded-lg border-2 ${
          score >= 80
            ? 'bg-green-500/20 border-green-500'
            : score >= 60
            ? 'bg-yellow-500/20 border-yellow-500'
            : 'bg-red-500/20 border-red-500'
        }`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            {score >= 80 ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <Target className="w-8 h-8 text-yellow-400" />
            )}
            <span className={`text-4xl font-bold ${
              score >= 80 ? 'text-green-300' : score >= 60 ? 'text-yellow-300' : 'text-red-300'
            }`}>
              {score}%
            </span>
          </div>
          <p className="text-white text-lg mb-2">
            {score >= 80
              ? 'Excellent rhythm! 🎵'
              : score >= 60
              ? 'Good timing! Keep practicing! 🎶'
              : 'Keep working on your timing! 🎼'}
          </p>
          <p className="text-blue-200">
            You tapped {userTaps.length} times (Expected: {pattern.length})
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-bold mb-3">How to Play:</h3>
        <ol className="space-y-2 text-blue-100">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">1.</span>
            <span>Click "Listen to Pattern" to hear the rhythm</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">2.</span>
            <span>Click "Start Tapping" to begin recording</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">3.</span>
            <span>Tap the large circle in rhythm with what you heard</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">4.</span>
            <span>Your accuracy score will be calculated automatically</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
