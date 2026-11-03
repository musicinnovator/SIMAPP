import React, { useState, useEffect, useRef } from 'react';
import { Gauge, Zap, CheckCircle } from 'lucide-react';

interface TempoAutomationProps {
  currentTempo: number;
  onTempoChange: (newTempo: number, smooth?: boolean) => void;
  isPlaying: boolean;
}

export function TempoAutomation({ currentTempo, onTempoChange, isPlaying }: TempoAutomationProps) {
  const [tempoBPM, setTempoBPM] = useState(currentTempo);
  const [smoothTransition, setSmoothTransition] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTempoBPM(currentTempo);
  }, [currentTempo]);

  const handleTempoChange = (newTempo: number) => {
    setTempoBPM(newTempo);
    onTempoChange(newTempo, smoothTransition);

    setShowFeedback(true);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setShowFeedback(false);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const presets = [
    { name: 'Slow', bpm: 60 },
    { name: 'Medium', bpm: 100 },
    { name: 'Fast', bpm: 140 },
  ];

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Gauge className="w-5 h-5 text-blue-300" />
          <label className="text-blue-300 text-sm font-medium">Real-Time Tempo Control</label>
        </div>
        {isPlaying && (
          <div className="flex items-center space-x-1 text-xs text-green-300">
            <Zap className="w-3 h-3" />
            <span>Live</span>
          </div>
        )}
      </div>

      {/* Tempo Slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-200 text-sm">40 BPM</span>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{tempoBPM}</div>
            <div className="text-xs text-blue-300">BPM</div>
          </div>
          <span className="text-blue-200 text-sm">240 BPM</span>
        </div>
        <input
          type="range"
          min="40"
          max="240"
          step="1"
          value={tempoBPM}
          onChange={(e) => handleTempoChange(Number(e.target.value))}
          className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((tempoBPM - 40) / 200) * 100}%, rgba(255,255,255,0.2) ${((tempoBPM - 40) / 200) * 100}%, rgba(255,255,255,0.2) 100%)`
          }}
        />
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handleTempoChange(preset.bpm)}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              Math.abs(tempoBPM - preset.bpm) < 5
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            {preset.name}
            <div className="text-xs opacity-75">{preset.bpm} BPM</div>
          </button>
        ))}
      </div>

      {/* Smooth Transition Toggle */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-blue-300">Gradual transition</span>
        <button
          onClick={() => setSmoothTransition(!smoothTransition)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
            smoothTransition ? 'bg-blue-500' : 'bg-white/20'
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
              smoothTransition ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isPlaying && (
        <div className="mt-3 text-xs text-blue-200 bg-blue-900/20 rounded p-2">
          {smoothTransition
            ? 'Tempo changes will transition smoothly over 2 seconds'
            : 'Tempo changes will apply immediately'}
        </div>
      )}

      {showFeedback && (
        <div className="mt-3 flex items-center space-x-2 text-sm text-green-300 bg-green-900/20 rounded p-2 animate-pulse">
          <CheckCircle className="w-4 h-4" />
          <span>Tempo updated to {tempoBPM} BPM</span>
        </div>
      )}
    </div>
  );
}
