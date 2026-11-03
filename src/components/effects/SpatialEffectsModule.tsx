import React from 'react';
import { Power, Waves } from 'lucide-react';
import type { EffectState } from '../../types/audioEffects';

interface SpatialEffectsModuleProps {
  effectState: EffectState['spatial'];
  isInitialized: boolean;
  onUpdateEffect: (effectName: string, params: Record<string, any>) => void;
  onToggleEffect: (effectName: string) => void;
}

export function SpatialEffectsModule({
  effectState,
  isInitialized,
  onUpdateEffect,
  onToggleEffect,
}: SpatialEffectsModuleProps) {
  const renderKnob = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    unit: string,
    onChange: (value: number) => void,
    color: string = 'cyan'
  ) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const rotation = (percentage / 100) * 270 - 135; // -135 to +135 degrees

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-20 h-20">
          {/* Knob Background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-inner" />

          {/* Knob Track */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
              strokeDasharray="213"
              strokeDashoffset="53.25"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke={`var(--${color}-500)`}
              strokeWidth="4"
              strokeDasharray="213"
              strokeDashoffset={213 - (percentage / 100) * 159.75}
              className={`transition-all duration-300 drop-shadow-glow-${color}`}
            />
          </svg>

          {/* Knob Indicator */}
          <div
            className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className={`w-1 h-6 bg-gradient-to-b from-${color}-400 to-${color}-600 rounded-full absolute top-2`} />
          </div>

          {/* Input Overlay */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={!isInitialized}
          />
        </div>

        <div className="text-center">
          <div className="text-white text-xs font-medium">{label}</div>
          <div className={`text-${color}-400 text-sm font-bold`}>
            {value.toFixed(2)}
            {unit}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Reverb Module */}
      <div className={`relative bg-gradient-to-br from-gray-900 via-cyan-900/10 to-gray-900 rounded-lg p-6 border-2 transition-all duration-300 ${
        effectState.reverb.enabled ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20' : 'border-white/10'
      }`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/5 to-violet-500/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.reverb.enabled ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50' : 'bg-white/10'
              }`}>
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Reverb</h3>
                <p className="text-gray-400 text-sm">Spatial ambience and room simulation</p>
              </div>
            </div>

            <button
              onClick={() => onToggleEffect('reverb')}
              disabled={!isInitialized}
              className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.reverb.enabled
                  ? 'bg-cyan-500 text-white shadow-lg hover:bg-cyan-400'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {renderKnob(
              'Room Size',
              effectState.reverb.roomSize,
              0,
              1,
              0.01,
              '',
              (value) => onUpdateEffect('reverb', { roomSize: value }),
              'cyan'
            )}
            {renderKnob(
              'Dampening',
              effectState.reverb.dampening,
              500,
              10000,
              100,
              ' Hz',
              (value) => onUpdateEffect('reverb', { dampening: value }),
              'cyan'
            )}
            {renderKnob(
              'Wet',
              effectState.reverb.wet,
              0,
              1,
              0.01,
              '',
              (value) => onUpdateEffect('reverb', { wet: value }),
              'cyan'
            )}
            {renderKnob(
              'Dry',
              effectState.reverb.dry,
              0,
              1,
              0.01,
              '',
              (value) => onUpdateEffect('reverb', { dry: value }),
              'cyan'
            )}
          </div>
        </div>
      </div>

      {/* Delay Module */}
      <div className={`relative bg-gradient-to-br from-gray-900 via-violet-900/10 to-gray-900 rounded-lg p-6 border-2 transition-all duration-300 ${
        effectState.delay.enabled ? 'border-violet-500 shadow-2xl shadow-violet-500/20' : 'border-white/10'
      }`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/5 to-purple-500/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.delay.enabled ? 'bg-violet-500 shadow-lg shadow-violet-500/50' : 'bg-white/10'
              }`}>
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Delay</h3>
                <p className="text-gray-400 text-sm">Echo and rhythmic repetitions</p>
              </div>
            </div>

            <button
              onClick={() => onToggleEffect('delay')}
              disabled={!isInitialized}
              className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.delay.enabled
                  ? 'bg-violet-500 text-white shadow-lg hover:bg-violet-400'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {renderKnob(
              'Delay Time',
              effectState.delay.delayTime,
              0,
              2,
              0.01,
              ' s',
              (value) => onUpdateEffect('delay', { delayTime: value }),
              'violet'
            )}
            {renderKnob(
              'Feedback',
              effectState.delay.feedback,
              0,
              0.9,
              0.01,
              '',
              (value) => onUpdateEffect('delay', { feedback: value }),
              'violet'
            )}
            {renderKnob(
              'Wet',
              effectState.delay.wet,
              0,
              1,
              0.01,
              '',
              (value) => onUpdateEffect('delay', { wet: value }),
              'violet'
            )}
            {renderKnob(
              'Dry',
              effectState.delay.dry,
              0,
              1,
              0.01,
              '',
              (value) => onUpdateEffect('delay', { dry: value }),
              'violet'
            )}
          </div>
        </div>
      </div>

      {/* Panning Module */}
      <div className={`relative bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 rounded-lg p-6 border-2 transition-all duration-300 ${
        effectState.panning.enabled ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-white/10'
      }`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.panning.enabled ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-white/10'
              }`}>
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Stereo Panning</h3>
                <p className="text-gray-400 text-sm">Left-right stereo positioning</p>
              </div>
            </div>

            <button
              onClick={() => onToggleEffect('panning')}
              disabled={!isInitialized}
              className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.panning.enabled
                  ? 'bg-blue-500 text-white shadow-lg hover:bg-blue-400'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>L</span>
                <span>Center</span>
                <span>R</span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={effectState.panning.pan}
                onChange={(e) => onUpdateEffect('panning', { pan: Number(e.target.value) })}
                disabled={!isInitialized}
                className="w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full appearance-none cursor-pointer disabled:opacity-50"
              />
              <div className="text-center mt-2">
                <span className="text-blue-400 text-lg font-bold">
                  {effectState.panning.pan.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
