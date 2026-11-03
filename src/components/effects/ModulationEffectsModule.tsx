import React from 'react';
import { Power, Radio } from 'lucide-react';
import type { EffectState } from '../../types/audioEffects';

interface ModulationEffectsModuleProps {
  effectState: EffectState['modulation'];
  isInitialized: boolean;
  onUpdateEffect: (effectName: string, params: Record<string, any>) => void;
  onToggleEffect: (effectName: string) => void;
}

export function ModulationEffectsModule({
  effectState,
  isInitialized,
  onUpdateEffect,
  onToggleEffect,
}: ModulationEffectsModuleProps) {
  const renderSlider = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    unit: string,
    onChange: (value: number) => void,
    color: string = 'emerald'
  ) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white text-sm font-medium">{label}</label>
          <span className={`text-${color}-400 text-sm font-bold`}>
            {value.toFixed(value < 1 ? 2 : 1)}
            {unit}
          </span>
        </div>
        <div className="relative h-2 bg-gray-800 rounded-full shadow-inner">
          <div
            className={`absolute left-0 top-0 h-full bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-full transition-all duration-200 shadow-lg shadow-${color}-500/50`}
            style={{ width: `${percentage}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={!isInitialized}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:opacity-50"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Chorus Module */}
      <div className={`relative bg-gradient-to-br from-gray-900 via-emerald-900/10 to-gray-900 rounded-lg p-6 border-2 transition-all duration-300 ${
        effectState.chorus.enabled ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20' : 'border-white/10'
      }`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.chorus.enabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse' : 'bg-white/10'
              }`}>
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Chorus</h3>
                <p className="text-gray-400 text-sm">Rich, ensemble-like depth and movement</p>
              </div>
            </div>

            <button
              onClick={() => onToggleEffect('chorus')}
              disabled={!isInitialized}
              className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.chorus.enabled
                  ? 'bg-emerald-500 text-white shadow-lg hover:bg-emerald-400'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {renderSlider(
              'Frequency',
              effectState.chorus.frequency,
              0.1,
              10,
              0.1,
              ' Hz',
              (value) => onUpdateEffect('chorus', { frequency: value }),
              'emerald'
            )}
            {renderSlider(
              'Delay Time',
              effectState.chorus.delayTime,
              1,
              10,
              0.1,
              ' ms',
              (value) => onUpdateEffect('chorus', { delayTime: value }),
              'emerald'
            )}
            {renderSlider(
              'Depth',
              effectState.chorus.depth,
              0,
              1,
              0.01,
              '',
              (value) => onUpdateEffect('chorus', { depth: value }),
              'emerald'
            )}
            {renderSlider(
              'Wet',
              effectState.chorus.wet,
              0,
              1,
              0.01,
              '',
              (value) => onUpdateEffect('chorus', { wet: value }),
              'emerald'
            )}
          </div>
        </div>
      </div>

      {/* Phaser Module */}
      <div className={`relative bg-gradient-to-br from-gray-900 via-teal-900/10 to-gray-900 rounded-lg p-6 border-2 transition-all duration-300 ${
        effectState.phaser.enabled ? 'border-teal-500 shadow-2xl shadow-teal-500/20' : 'border-white/10'
      }`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500/5 to-cyan-500/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.phaser.enabled ? 'bg-teal-500 shadow-lg shadow-teal-500/50 animate-pulse' : 'bg-white/10'
              }`}>
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Phaser</h3>
                <p className="text-gray-400 text-sm">Sweeping notch filter for psychedelic effects</p>
              </div>
            </div>

            <button
              onClick={() => onToggleEffect('phaser')}
              disabled={!isInitialized}
              className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.phaser.enabled
                  ? 'bg-teal-500 text-white shadow-lg hover:bg-teal-400'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {renderSlider(
              'Frequency',
              effectState.phaser.frequency,
              0.1,
              10,
              0.1,
              ' Hz',
              (value) => onUpdateEffect('phaser', { frequency: value }),
              'teal'
            )}
            {renderSlider(
              'Octaves',
              effectState.phaser.octaves,
              1,
              8,
              1,
              '',
              (value) => onUpdateEffect('phaser', { octaves: value }),
              'teal'
            )}
            {renderSlider(
              'Base Frequency',
              effectState.phaser.baseFrequency,
              100,
              1000,
              10,
              ' Hz',
              (value) => onUpdateEffect('phaser', { baseFrequency: value }),
              'teal'
            )}
            {renderSlider(
              'Wet',
              effectState.phaser.wet,
              0,
              1,
              0.01,
              '',
              (value) => onUpdateEffect('phaser', { wet: value }),
              'teal'
            )}
          </div>
        </div>
      </div>

      {/* Tremolo Module */}
      <div className={`relative bg-gradient-to-br from-gray-900 via-green-900/10 to-gray-900 rounded-lg p-6 border-2 transition-all duration-300 ${
        effectState.tremolo.enabled ? 'border-green-500 shadow-2xl shadow-green-500/20' : 'border-white/10'
      }`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.tremolo.enabled ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' : 'bg-white/10'
              }`}>
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Tremolo</h3>
                <p className="text-gray-400 text-sm">Rhythmic volume modulation</p>
              </div>
            </div>

            <button
              onClick={() => onToggleEffect('tremolo')}
              disabled={!isInitialized}
              className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.tremolo.enabled
                  ? 'bg-green-500 text-white shadow-lg hover:bg-green-400'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {renderSlider(
              'Frequency',
              effectState.tremolo.frequency,
              0.1,
              20,
              0.1,
              ' Hz',
              (value) => onUpdateEffect('tremolo', { frequency: value }),
              'green'
            )}
            {renderSlider(
              'Depth',
              effectState.tremolo.depth,
              0,
              1,
              0.01,
              '',
              (value) => onUpdateEffect('tremolo', { depth: value }),
              'green'
            )}
            {renderSlider(
              'Wet',
              effectState.tremolo.wet,
              0,
              1,
              0.01,
              '',
              (value) => onUpdateEffect('tremolo', { wet: value }),
              'green'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
