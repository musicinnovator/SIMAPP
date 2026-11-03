import React from 'react';
import { Sliders, Zap, Music2, TrendingUp } from 'lucide-react';
import { AdvancedStrumControls as AdvancedStrumControlsType } from '../types/voicingPatterns';

interface AdvancedStrumControlsProps {
  controls: AdvancedStrumControlsType;
  onChange: (controls: AdvancedStrumControlsType) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function AdvancedStrumControls({
  controls,
  onChange,
  isExpanded,
  onToggle
}: AdvancedStrumControlsProps) {

  const handleDensityChange = (value: number) => {
    onChange({ ...controls, densityMultiplier: value });
  };

  const handleSwingChange = (value: number) => {
    onChange({ ...controls, swingAmount: value });
  };

  const handleSyncopationChange = (value: number) => {
    onChange({ ...controls, syncopationShift: value });
  };

  const handleGhostNoteChange = (value: number) => {
    onChange({ ...controls, ghostNoteIntensity: value });
  };

  const handleAccentPatternChange = (pattern: AdvancedStrumControlsType['accentPattern']) => {
    onChange({ ...controls, accentPattern: pattern });
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-xl p-4 border border-purple-400/30">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-4 text-white hover:text-purple-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          <span className="font-bold text-lg">Advanced Strum Controls</span>
        </div>
        <span className="text-sm">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="space-y-6 animate-fadeIn">

          {/* Density Multiplier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <TrendingUp className="w-4 h-4 text-purple-300" />
                <label className="text-sm font-semibold">Strum Density</label>
              </div>
              <span className="text-purple-300 text-sm font-mono">
                {controls.densityMultiplier.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.25"
              max="2"
              step="0.25"
              value={controls.densityMultiplier}
              onChange={(e) => handleDensityChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-500/30 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-purple-300">
              <span>Sparse (0.25x)</span>
              <span>Normal (1x)</span>
              <span>Dense (2x)</span>
            </div>
          </div>

          {/* Swing Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Music2 className="w-4 h-4 text-blue-300" />
                <label className="text-sm font-semibold">Swing Amount</label>
              </div>
              <span className="text-blue-300 text-sm font-mono">
                {Math.round(controls.swingAmount * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={controls.swingAmount}
              onChange={(e) => handleSwingChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-blue-500/30 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-blue-300">
              <span>Straight (0%)</span>
              <span>Triplet (66%)</span>
              <span>Extreme (100%)</span>
            </div>
          </div>

          {/* Syncopation Shift */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Zap className="w-4 h-4 text-yellow-300" />
                <label className="text-sm font-semibold">Syncopation Shift</label>
              </div>
              <span className="text-yellow-300 text-sm font-mono">
                {controls.syncopationShift > 0 ? '+' : ''}{controls.syncopationShift.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="-0.25"
              max="0.25"
              step="0.0625"
              value={controls.syncopationShift}
              onChange={(e) => handleSyncopationChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-yellow-500/30 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-yellow-300">
              <span>Early</span>
              <span>On-beat</span>
              <span>Late</span>
            </div>
          </div>

          {/* Ghost Note Intensity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Music2 className="w-4 h-4 text-green-300" />
                <label className="text-sm font-semibold">Ghost Note Intensity</label>
              </div>
              <span className="text-green-300 text-sm font-mono">
                {Math.round(controls.ghostNoteIntensity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={controls.ghostNoteIntensity}
              onChange={(e) => handleGhostNoteChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-green-500/30 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-green-300">
              <span>None (0%)</span>
              <span>Subtle (50%)</span>
              <span>Prominent (100%)</span>
            </div>
          </div>

          {/* Accent Pattern */}
          <div className="space-y-2">
            <label className="text-white text-sm font-semibold block">Accent Pattern</label>
            <div className="grid grid-cols-2 gap-2">
              {(['none', 'downbeats', 'offbeats', 'alternating'] as const).map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => handleAccentPatternChange(pattern)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    controls.accentPattern === pattern
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-black/20 rounded-lg p-3 border border-white/10">
            <p className="text-white/70 text-xs leading-relaxed">
              <span className="font-bold text-white">Tip:</span> These controls modify the selected strum pattern's timing and dynamics.
              Combine multiple settings for unique rhythmic variations!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
