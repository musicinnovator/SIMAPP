import React from 'react';
import { Music2, Play, Settings } from 'lucide-react';

export interface LiveMusicSettings {
  instrument: string;
  tempo: number;
  key: string;
  pattern: 'block' | 'arpeggio' | 'strum' | 'broken';
  meter: '3/4' | '4/4' | '6/8' | '12/8';
  inversion: 'root' | 'first' | 'second';
  chordProgression: string;
  voiceLeading: boolean;
}

interface LiveMusicControlsProps {
  settings: LiveMusicSettings;
  onSettingsChange: (settings: Partial<LiveMusicSettings>) => void;
  onPreview: () => void;
  isRecording: boolean;
  isPlaying: boolean;
}

export function LiveMusicControls({
  settings,
  onSettingsChange,
  onPreview,
  isRecording,
  isPlaying
}: LiveMusicControlsProps) {
  const instruments = [
    'Acoustic Grand Piano',
    'Electric Piano',
    'Acoustic Guitar',
    'Electric Guitar',
    'Strings',
    'Choir',
    'Organ',
    'Harp'
  ];

  const keys = [
    'C Major', 'G Major', 'D Major', 'A Major', 'E Major',
    'F Major', 'Bb Major', 'Eb Major', 'Ab Major',
    'A Minor', 'E Minor', 'B Minor', 'D Minor'
  ];

  const patterns = [
    { value: 'block', label: 'Block (All notes together)' },
    { value: 'arpeggio', label: 'Arpeggio (Notes in sequence)' },
    { value: 'strum', label: 'Strum (Guitar style)' },
    { value: 'broken', label: 'Broken (Pattern style)' }
  ];

  const meters = [
    { value: '4/4', label: '4/4 (Common time)' },
    { value: '3/4', label: '3/4 (Waltz)' },
    { value: '6/8', label: '6/8 (Compound)' },
    { value: '12/8', label: '12/8 (Gospel)' }
  ];

  const inversions = [
    { value: 'root', label: 'Root Position' },
    { value: 'first', label: 'First Inversion' },
    { value: 'second', label: 'Second Inversion' }
  ];

  const disabled = isRecording;

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-lg p-6 border border-indigo-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Music2 className="w-6 h-6 text-indigo-300" />
          <h3 className="text-xl font-bold text-white">Music Controls</h3>
        </div>
        <button
          onClick={onPreview}
          disabled={isRecording}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
            isRecording
              ? 'bg-gray-600 cursor-not-allowed text-white/50'
              : isPlaying
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>{isPlaying ? 'Playing...' : 'Preview'}</span>
        </button>
      </div>

      {isRecording && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
          🔒 Music settings locked during recording. Stop recording to make changes.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Instrument */}
        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">
            Instrument
          </label>
          <select
            value={settings.instrument}
            onChange={(e) => onSettingsChange({ instrument: e.target.value })}
            disabled={disabled}
            className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg text-white focus:border-indigo-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {instruments.map(inst => (
              <option key={inst} value={inst}>{inst}</option>
            ))}
          </select>
        </div>

        {/* Key */}
        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">
            Key
          </label>
          <select
            value={settings.key}
            onChange={(e) => onSettingsChange({ key: e.target.value })}
            disabled={disabled}
            className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg text-white focus:border-indigo-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {keys.map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>

        {/* Tempo */}
        <div className="col-span-2">
          <label className="block text-indigo-200 text-sm font-medium mb-2">
            Tempo: {settings.tempo} BPM
          </label>
          <input
            type="range"
            min="40"
            max="200"
            value={settings.tempo}
            onChange={(e) => onSettingsChange({ tempo: Number(e.target.value) })}
            disabled={disabled}
            className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((settings.tempo - 40) / 160) * 100}%, rgba(0,0,0,0.3) ${((settings.tempo - 40) / 160) * 100}%, rgba(0,0,0,0.3) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-indigo-300 mt-1">
            <span>Slow (40)</span>
            <span>Moderate (120)</span>
            <span>Fast (200)</span>
          </div>
        </div>

        {/* Pattern */}
        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">
            Pattern
          </label>
          <select
            value={settings.pattern}
            onChange={(e) => onSettingsChange({ pattern: e.target.value as any })}
            disabled={disabled}
            className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg text-white focus:border-indigo-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {patterns.map(pat => (
              <option key={pat.value} value={pat.value}>{pat.label}</option>
            ))}
          </select>
        </div>

        {/* Meter */}
        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">
            Time Signature
          </label>
          <select
            value={settings.meter}
            onChange={(e) => onSettingsChange({ meter: e.target.value as any })}
            disabled={disabled}
            className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg text-white focus:border-indigo-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {meters.map(met => (
              <option key={met.value} value={met.value}>{met.label}</option>
            ))}
          </select>
        </div>

        {/* Inversion */}
        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">
            Chord Inversion
          </label>
          <select
            value={settings.inversion}
            onChange={(e) => onSettingsChange({ inversion: e.target.value as any })}
            disabled={disabled}
            className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg text-white focus:border-indigo-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {inversions.map(inv => (
              <option key={inv.value} value={inv.value}>{inv.label}</option>
            ))}
          </select>
        </div>

        {/* Voice Leading */}
        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">
            Voice Leading
          </label>
          <button
            onClick={() => onSettingsChange({ voiceLeading: !settings.voiceLeading })}
            disabled={disabled}
            className={`w-full px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
              settings.voiceLeading
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-black/30 hover:bg-black/50 text-white border border-indigo-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {settings.voiceLeading ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
    </div>
  );
}
