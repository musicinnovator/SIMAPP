import React from 'react';
import { Power, Volume2 } from 'lucide-react';
import type { EffectState } from '../../types/audioEffects';

interface DynamicsEffectsModuleProps {
  effectState: EffectState['dynamics'];
  isInitialized: boolean;
  onUpdateEffect: (effectName: string, params: Record<string, any>) => void;
  onToggleEffect: (effectName: string) => void;
}

export function DynamicsEffectsModule({
  effectState,
  isInitialized,
  onUpdateEffect,
  onToggleEffect,
}: DynamicsEffectsModuleProps) {
  const renderFader = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    unit: string,
    onChange: (value: number) => void,
    color: string = 'amber'
  ) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="relative h-40 w-12">
          {/* Fader Track */}
          <div className="absolute inset-x-2 top-0 bottom-0 bg-gray-800 rounded-full shadow-inner" />

          {/* Fader Fill */}
          <div
            className={`absolute inset-x-2 bottom-0 bg-gradient-to-t from-${color}-500 to-${color}-400 rounded-full transition-all duration-200 shadow-lg shadow-${color}-500/50`}
            style={{ height: `${percentage}%` }}
          />

          {/* Fader Handle */}
          <div
            className={`absolute left-0 right-0 h-6 bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-lg shadow-xl cursor-pointer hover:scale-110 transition-transform`}
            style={{ bottom: `calc(${percentage}% - 12px)` }}
          >
            <div className="absolute inset-0.5 bg-gradient-to-r from-white/20 to-transparent rounded-lg" />
          </div>

          {/* Input Overlay */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            orient="vertical"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' } as React.CSSProperties}
            disabled={!isInitialized}
          />
        </div>

        <div className="text-center">
          <div className="text-white text-xs font-medium">{label}</div>
          <div className={`text-${color}-400 text-sm font-bold`}>
            {value.toFixed(value < 1 ? 3 : 1)}
            {unit}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Compressor Module */}
      <div className={`relative bg-gradient-to-br from-gray-900 via-amber-900/10 to-gray-900 rounded-lg p-6 border-2 transition-all duration-300 ${
        effectState.compressor.enabled ? 'border-amber-500 shadow-2xl shadow-amber-500/20' : 'border-white/10'
      }`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/5 to-orange-500/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.compressor.enabled ? 'bg-amber-500 shadow-lg shadow-amber-500/50' : 'bg-white/10'
              }`}>
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Compressor</h3>
                <p className="text-gray-400 text-sm">Dynamic range compression for punch and consistency</p>
              </div>
            </div>

            <button
              onClick={() => onToggleEffect('compressor')}
              disabled={!isInitialized}
              className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.compressor.enabled
                  ? 'bg-amber-500 text-white shadow-lg hover:bg-amber-400'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-8">
            {renderFader(
              'Threshold',
              effectState.compressor.threshold,
              -60,
              0,
              1,
              ' dB',
              (value) => onUpdateEffect('compressor', { threshold: value }),
              'amber'
            )}
            {renderFader(
              'Ratio',
              effectState.compressor.ratio,
              1,
              20,
              0.1,
              ':1',
              (value) => onUpdateEffect('compressor', { ratio: value }),
              'amber'
            )}
            {renderFader(
              'Attack',
              effectState.compressor.attack,
              0.001,
              1,
              0.001,
              ' s',
              (value) => onUpdateEffect('compressor', { attack: value }),
              'amber'
            )}
            {renderFader(
              'Release',
              effectState.compressor.release,
              0.01,
              1,
              0.01,
              ' s',
              (value) => onUpdateEffect('compressor', { release: value }),
              'amber'
            )}
            {renderFader(
              'Knee',
              effectState.compressor.knee,
              0,
              40,
              1,
              ' dB',
              (value) => onUpdateEffect('compressor', { knee: value }),
              'amber'
            )}
          </div>
        </div>
      </div>

      {/* Limiter Module */}
      <div className={`relative bg-gradient-to-br from-gray-900 via-red-900/10 to-gray-900 rounded-lg p-6 border-2 transition-all duration-300 ${
        effectState.limiter.enabled ? 'border-red-500 shadow-2xl shadow-red-500/20' : 'border-white/10'
      }`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.limiter.enabled ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-white/10'
              }`}>
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Limiter</h3>
                <p className="text-gray-400 text-sm">Prevent clipping and control peak levels</p>
              </div>
            </div>

            <button
              onClick={() => onToggleEffect('limiter')}
              disabled={!isInitialized}
              className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.limiter.enabled
                  ? 'bg-red-500 text-white shadow-lg hover:bg-red-400'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center">
            {renderFader(
              'Threshold',
              effectState.limiter.threshold,
              -20,
              0,
              0.1,
              ' dB',
              (value) => onUpdateEffect('limiter', { threshold: value }),
              'red'
            )}
          </div>
        </div>
      </div>

      {/* Gate Module */}
      <div className={`relative bg-gradient-to-br from-gray-900 via-orange-900/10 to-gray-900 rounded-lg p-6 border-2 transition-all duration-300 ${
        effectState.gate.enabled ? 'border-orange-500 shadow-2xl shadow-orange-500/20' : 'border-white/10'
      }`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/5 to-amber-500/5 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.gate.enabled ? 'bg-orange-500 shadow-lg shadow-orange-500/50' : 'bg-white/10'
              }`}>
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Noise Gate</h3>
                <p className="text-gray-400 text-sm">Reduce noise and control signal flow</p>
              </div>
            </div>

            <button
              onClick={() => onToggleEffect('gate')}
              disabled={!isInitialized}
              className={`p-3 rounded-xl transition-all duration-300 ${
                effectState.gate.enabled
                  ? 'bg-orange-500 text-white shadow-lg hover:bg-orange-400'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {renderFader(
              'Threshold',
              effectState.gate.threshold,
              -80,
              -20,
              1,
              ' dB',
              (value) => onUpdateEffect('gate', { threshold: value }),
              'orange'
            )}
            {renderFader(
              'Attack',
              effectState.gate.attack,
              0.001,
              0.1,
              0.001,
              ' s',
              (value) => onUpdateEffect('gate', { attack: value }),
              'orange'
            )}
            {renderFader(
              'Release',
              effectState.gate.release,
              0.01,
              1,
              0.01,
              ' s',
              (value) => onUpdateEffect('gate', { release: value }),
              'orange'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
