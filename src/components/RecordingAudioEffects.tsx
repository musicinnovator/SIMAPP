import React, { useState, useEffect } from 'react';
import { Sliders, Volume2, Music, RotateCcw } from 'lucide-react';

export interface RecordingEffectsSettings {
  // Reverb
  reverbEnabled: boolean;
  reverbAmount: number; // 0-100
  reverbDecay: number; // 0-100

  // EQ (3-band)
  eqEnabled: boolean;
  eqLow: number; // -12 to +12 dB
  eqMid: number; // -12 to +12 dB
  eqHigh: number; // -12 to +12 dB

  // Compressor
  compressorEnabled: boolean;
  compressorThreshold: number; // -100 to 0 dB
  compressorRatio: number; // 1 to 20
  compressorAttack: number; // 0 to 1 seconds
  compressorRelease: number; // 0 to 1 seconds

  // Master
  masterGain: number; // 0-200 (100 = normal)
}

interface RecordingAudioEffectsProps {
  settings: RecordingEffectsSettings;
  onSettingsChange: (settings: RecordingEffectsSettings) => void;
  compact?: boolean;
}

export const DEFAULT_EFFECTS_SETTINGS: RecordingEffectsSettings = {
  reverbEnabled: false,
  reverbAmount: 30,
  reverbDecay: 40,
  eqEnabled: false,
  eqLow: 0,
  eqMid: 0,
  eqHigh: 0,
  compressorEnabled: false,
  compressorThreshold: -24,
  compressorRatio: 4,
  compressorAttack: 0.003,
  compressorRelease: 0.25,
  masterGain: 100
};

export default function RecordingAudioEffects({
  settings,
  onSettingsChange,
  compact = false
}: RecordingAudioEffectsProps) {
  const [showAdvanced, setShowAdvanced] = useState(!compact);

  const updateSetting = <K extends keyof RecordingEffectsSettings>(
    key: K,
    value: RecordingEffectsSettings[K]
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all audio effects to default values?')) {
      onSettingsChange(DEFAULT_EFFECTS_SETTINGS);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-bold flex items-center">
          <Sliders className="w-5 h-5 mr-2" />
          Audio Effects
        </h4>
        <button
          onClick={resetToDefaults}
          className="text-blue-300 hover:text-blue-200 text-sm flex items-center space-x-1"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Master Gain */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <label className="text-blue-300 text-sm font-medium flex items-center">
            <Volume2 className="w-4 h-4 mr-1" />
            Master Gain
          </label>
          <span className="text-white font-bold text-sm">{settings.masterGain}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          value={settings.masterGain}
          onChange={(e) => updateSetting('masterGain', Number(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
        />
      </div>

      {/* Reverb */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <label className="text-white font-medium flex items-center">
            <input
              type="checkbox"
              checked={settings.reverbEnabled}
              onChange={(e) => updateSetting('reverbEnabled', e.target.checked)}
              className="mr-2 w-4 h-4"
            />
            Reverb
          </label>
        </div>

        {settings.reverbEnabled && (
          <div className="space-y-3 ml-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-300 text-sm">Amount</span>
                <span className="text-white text-sm">{settings.reverbAmount}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.reverbAmount}
                onChange={(e) => updateSetting('reverbAmount', Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-300 text-sm">Decay</span>
                <span className="text-white text-sm">{settings.reverbDecay}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.reverbDecay}
                onChange={(e) => updateSetting('reverbDecay', Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
              />
            </div>
          </div>
        )}
      </div>

      {/* EQ */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <label className="text-white font-medium flex items-center">
            <input
              type="checkbox"
              checked={settings.eqEnabled}
              onChange={(e) => updateSetting('eqEnabled', e.target.checked)}
              className="mr-2 w-4 h-4"
            />
            3-Band EQ
          </label>
        </div>

        {settings.eqEnabled && (
          <div className="space-y-3 ml-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-300 text-sm">Low (Bass)</span>
                <span className="text-white text-sm">{settings.eqLow > 0 ? '+' : ''}{settings.eqLow} dB</span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={settings.eqLow}
                onChange={(e) => updateSetting('eqLow', Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-300 text-sm">Mid</span>
                <span className="text-white text-sm">{settings.eqMid > 0 ? '+' : ''}{settings.eqMid} dB</span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={settings.eqMid}
                onChange={(e) => updateSetting('eqMid', Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-300 text-sm">High (Treble)</span>
                <span className="text-white text-sm">{settings.eqHigh > 0 ? '+' : ''}{settings.eqHigh} dB</span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={settings.eqHigh}
                onChange={(e) => updateSetting('eqHigh', Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
              />
            </div>
          </div>
        )}
      </div>

      {/* Compressor */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-white font-medium flex items-center">
            <input
              type="checkbox"
              checked={settings.compressorEnabled}
              onChange={(e) => updateSetting('compressorEnabled', e.target.checked)}
              className="mr-2 w-4 h-4"
            />
            Compressor
          </label>
          {compact && (
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-blue-300 hover:text-blue-200 text-xs"
            >
              {showAdvanced ? 'Simple' : 'Advanced'}
            </button>
          )}
        </div>

        {settings.compressorEnabled && showAdvanced && (
          <div className="space-y-3 ml-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-300 text-sm">Threshold</span>
                <span className="text-white text-sm">{settings.compressorThreshold} dB</span>
              </div>
              <input
                type="range"
                min="-100"
                max="0"
                step="1"
                value={settings.compressorThreshold}
                onChange={(e) => updateSetting('compressorThreshold', Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-300 text-sm">Ratio</span>
                <span className="text-white text-sm">{settings.compressorRatio}:1</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={settings.compressorRatio}
                onChange={(e) => updateSetting('compressorRatio', Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-300 text-sm">Attack</span>
                <span className="text-white text-sm">{(settings.compressorAttack * 1000).toFixed(1)} ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={settings.compressorAttack}
                onChange={(e) => updateSetting('compressorAttack', Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-300 text-sm">Release</span>
                <span className="text-white text-sm">{(settings.compressorRelease * 1000).toFixed(0)} ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.compressorRelease}
                onChange={(e) => updateSetting('compressorRelease', Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
              />
            </div>
          </div>
        )}

        {settings.compressorEnabled && !showAdvanced && (
          <div className="ml-6 text-blue-200 text-xs">
            Using preset: Standard Voice Compression
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 text-xs text-blue-300 bg-blue-900/20 rounded p-2 border border-blue-500/30">
        💡 Effects are applied during playback and export. They don't affect the original recording.
      </div>
    </div>
  );
}

// Utility function to apply effects to an AudioContext
export const applyEffectsToAudioContext = (
  audioContext: AudioContext,
  sourceNode: AudioNode,
  settings: RecordingEffectsSettings
): AudioNode => {
  let currentNode = sourceNode;

  // Apply EQ
  if (settings.eqEnabled) {
    const lowFilter = audioContext.createBiquadFilter();
    lowFilter.type = 'lowshelf';
    lowFilter.frequency.value = 200;
    lowFilter.gain.value = settings.eqLow;

    const midFilter = audioContext.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 1;
    midFilter.gain.value = settings.eqMid;

    const highFilter = audioContext.createBiquadFilter();
    highFilter.type = 'highshelf';
    highFilter.frequency.value = 4000;
    highFilter.gain.value = settings.eqHigh;

    currentNode.connect(lowFilter);
    lowFilter.connect(midFilter);
    midFilter.connect(highFilter);
    currentNode = highFilter;
  }

  // Apply Compressor
  if (settings.compressorEnabled) {
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = settings.compressorThreshold;
    compressor.ratio.value = settings.compressorRatio;
    compressor.attack.value = settings.compressorAttack;
    compressor.release.value = settings.compressorRelease;
    compressor.knee.value = 30;

    currentNode.connect(compressor);
    currentNode = compressor;
  }

  // Apply Reverb (using ConvolverNode with impulse response)
  if (settings.reverbEnabled) {
    const convolver = audioContext.createConvolver();
    const impulseLength = audioContext.sampleRate * (settings.reverbDecay / 100) * 2;
    const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);

    for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < impulseLength; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2);
      }
    }

    convolver.buffer = impulse;

    const dryGain = audioContext.createGain();
    const wetGain = audioContext.createGain();
    const mix = settings.reverbAmount / 100;
    dryGain.gain.value = 1 - mix;
    wetGain.gain.value = mix;

    currentNode.connect(dryGain);
    currentNode.connect(convolver);
    convolver.connect(wetGain);

    const merger = audioContext.createChannelMerger(2);
    dryGain.connect(merger, 0, 0);
    wetGain.connect(merger, 0, 1);
    currentNode = merger;
  }

  // Apply Master Gain
  const masterGain = audioContext.createGain();
  masterGain.gain.value = settings.masterGain / 100;
  currentNode.connect(masterGain);

  return masterGain;
};
