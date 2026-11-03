import React from 'react';
import { Volume2, VolumeX, Mic, Music } from 'lucide-react';

interface RealTimeMixerProps {
  vocalVolume: number;
  musicVolume: number;
  vocalMuted: boolean;
  musicMuted: boolean;
  vocalLevel: number;
  musicLevel: number;
  onVocalVolumeChange: (volume: number) => void;
  onMusicVolumeChange: (volume: number) => void;
  onVocalMutedChange: (muted: boolean) => void;
  onMusicMutedChange: (muted: boolean) => void;
  allowAdjustWhileRecording?: boolean;
  isRecording?: boolean;
}

export function RealTimeMixer({
  vocalVolume,
  musicVolume,
  vocalMuted,
  musicMuted,
  vocalLevel,
  musicLevel,
  onVocalVolumeChange,
  onMusicVolumeChange,
  onVocalMutedChange,
  onMusicMutedChange,
  allowAdjustWhileRecording = true,
  isRecording = false
}: RealTimeMixerProps) {
  const disabled = isRecording && !allowAdjustWhileRecording;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Live Mixer</h3>
        {isRecording && allowAdjustWhileRecording && (
          <div className="flex items-center space-x-2 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live adjustments enabled</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Vocal Channel */}
        <div className="bg-black/30 rounded-lg p-4 border border-pink-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-pink-400" />
              <span className="text-white font-medium">Vocals</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-pink-300 text-sm font-mono w-12 text-right">
                {vocalVolume}%
              </span>
              <button
                onClick={() => onVocalMutedChange(!vocalMuted)}
                className={`p-2 rounded-lg transition-colors ${
                  vocalMuted
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {vocalMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={vocalVolume}
            onChange={(e) => onVocalVolumeChange(Number(e.target.value))}
            disabled={disabled || vocalMuted}
            className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            style={{
              background: vocalMuted
                ? '#374151'
                : `linear-gradient(to right, #ec4899 0%, #ec4899 ${vocalVolume}%, #374151 ${vocalVolume}%, #374151 100%)`
            }}
          />

          {/* Level Meter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-white/80 w-12">Level:</span>
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                style={{ width: `${vocalLevel}%` }}
              />
            </div>
            <span className="text-xs text-pink-300 font-mono w-12 text-right">
              {Math.round(vocalLevel)}%
            </span>
          </div>
        </div>

        {/* Music Channel */}
        <div className="bg-black/30 rounded-lg p-4 border border-blue-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Music className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Music</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-blue-300 text-sm font-mono w-12 text-right">
                {musicVolume}%
              </span>
              <button
                onClick={() => onMusicMutedChange(!musicMuted)}
                className={`p-2 rounded-lg transition-colors ${
                  musicMuted
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {musicMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={(e) => onMusicVolumeChange(Number(e.target.value))}
            disabled={disabled || musicMuted}
            className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            style={{
              background: musicMuted
                ? '#374151'
                : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${musicVolume}%, #374151 ${musicVolume}%, #374151 100%)`
            }}
          />

          {/* Level Meter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-white/80 w-12">Level:</span>
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                style={{ width: `${musicLevel}%` }}
              />
            </div>
            <span className="text-xs text-blue-300 font-mono w-12 text-right">
              {Math.round(musicLevel)}%
            </span>
          </div>
        </div>

        {/* Balance Indicator */}
        <div className="bg-black/20 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/80">Balance:</span>
            <div className="flex items-center space-x-2">
              <span className="text-pink-300">Vocal {vocalVolume}%</span>
              <span className="text-white/60">|</span>
              <span className="text-blue-300">Music {musicVolume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
