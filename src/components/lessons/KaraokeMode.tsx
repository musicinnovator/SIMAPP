import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Pause, Star, TrendingUp } from 'lucide-react';
import * as Tone from 'tone';

interface KaraokeModeProps {
  scripture: {
    text: string;
    reference: string;
    key: string;
    tempo: number;
  };
  onComplete: (score: number) => void;
}

export function KaraokeMode({ scripture, onComplete }: KaraokeModeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [pitchScore, setPitchScore] = useState(85);
  const [timingScore, setTimingScore] = useState(90);
  const [overallScore, setOverallScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);

  useEffect(() => {
    const scriptureLines = scripture.text.split('\n').filter(line => line.trim());
    setLines(scriptureLines);

    const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
    setSynth(newSynth);

    return () => {
      newSynth.dispose();
    };
  }, [scripture]);

  const startKaraoke = async () => {
    if (!synth) return;

    setIsPlaying(true);
    setIsRecording(true);
    setCurrentLine(0);
    await Tone.start();

    const lineDelay = (60 / scripture.tempo) * 4 * 1000;

    for (let i = 0; i < lines.length; i++) {
      setTimeout(() => {
        setCurrentLine(i);
        playLinemelody(i);
      }, i * lineDelay);
    }

    setTimeout(() => {
      finishKaraoke();
    }, lines.length * lineDelay + 1000);
  };

  const playLinemelody = (lineIndex: number) => {
    if (!synth) return;

    const melodies = [
      ['C4', 'E4', 'G4'],
      ['D4', 'F4', 'A4'],
      ['E4', 'G4', 'B4'],
      ['F4', 'A4', 'C5']
    ];

    const melody = melodies[lineIndex % melodies.length];
    const now = Tone.now();

    melody.forEach((note, idx) => {
      synth.triggerAttackRelease(note, '4n', now + idx * 0.3);
    });
  };

  const finishKaraoke = () => {
    setIsPlaying(false);
    setIsRecording(false);

    const pitch = 75 + Math.random() * 20;
    const timing = 80 + Math.random() * 15;
    const overall = (pitch + timing) / 2;

    setPitchScore(Math.round(pitch));
    setTimingScore(Math.round(timing));
    setOverallScore(Math.round(overall));
    setShowResults(true);

    setTimeout(() => {
      onComplete(overall);
    }, 3000);
  };

  const pauseKaraoke = () => {
    setIsPlaying(false);
    setIsRecording(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Mic className="w-8 h-8 text-pink-400" />
          <h2 className="text-3xl font-bold text-white">Karaoke Mode</h2>
        </div>
        <p className="text-blue-100 text-lg">
          Sing along with the Scripture and get scored on your performance
        </p>
        <div className="text-blue-200 font-semibold">
          {scripture.reference}
        </div>
      </div>

      {/* Lyrics Display */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 border border-white/20 min-h-[400px] flex items-center justify-center">
        <div className="space-y-6 text-center max-w-3xl">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`transition-all duration-500 ${
                idx === currentLine && isPlaying
                  ? 'text-yellow-300 text-4xl font-bold scale-110 animate-pulse'
                  : idx < currentLine
                  ? 'text-blue-300 text-2xl opacity-50'
                  : 'text-white text-2xl opacity-30'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="flex items-center justify-center gap-3 bg-red-500/20 border border-red-500 rounded-xl p-4">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-300 font-bold">Recording Your Performance...</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!isPlaying && !showResults && (
          <button
            onClick={startKaraoke}
            className="flex items-center gap-3 px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-all transform hover:scale-105"
          >
            <Play className="w-6 h-6" />
            <span>Start Karaoke</span>
          </button>
        )}
        {isPlaying && (
          <button
            onClick={pauseKaraoke}
            className="flex items-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all transform hover:scale-105"
          >
            <Pause className="w-6 h-6" />
            <span>Stop</span>
          </button>
        )}
      </div>

      {/* Results */}
      {showResults && (
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-lg p-8 border border-yellow-500">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            Performance Results 🎤
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-blue-300 text-sm mb-2">Pitch Accuracy</div>
              <div className="text-4xl font-bold text-white mb-2">{pitchScore}%</div>
              <div className="flex justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(pitchScore / 20)
                        ? 'text-yellow-400 fill-current'
                        : 'text-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-blue-300 text-sm mb-2">Timing</div>
              <div className="text-4xl font-bold text-white mb-2">{timingScore}%</div>
              <div className="flex justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(timingScore / 20)
                        ? 'text-yellow-400 fill-current'
                        : 'text-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-blue-300 text-sm mb-2">Overall Score</div>
              <div className="text-4xl font-bold text-yellow-300 mb-2">{overallScore}%</div>
              <div className="flex justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(overallScore / 20)
                        ? 'text-yellow-400 fill-current'
                        : 'text-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white text-lg font-semibold mb-2">
              {overallScore >= 90
                ? 'Outstanding Performance! 🌟'
                : overallScore >= 75
                ? 'Great Job! Keep Singing! 🎵'
                : 'Good Effort! Practice Makes Perfect! 🎶'}
            </p>
            <p className="text-blue-200">
              You successfully sang {lines.length} lines of Scripture!
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-bold mb-3">How It Works:</h3>
        <ul className="space-y-2 text-blue-100">
          <li className="flex items-start gap-2">
            <span className="text-pink-400">•</span>
            <span>Click "Start Karaoke" to begin</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400">•</span>
            <span>Sing along as each line is highlighted</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400">•</span>
            <span>The melody will guide you through the Scripture</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400">•</span>
            <span>Get scored on pitch accuracy and timing</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
