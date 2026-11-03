import React, { useState, useEffect } from 'react';
import { X, Power, Waves, Volume2, Radio } from 'lucide-react';
import { globalAudioEffects } from '../utils/globalAudioEffects';

interface SimpleAudioEffectsProps {
  isVisible: boolean;
  onClose: () => void;
}

export function SimpleAudioEffects({ isVisible, onClose }: SimpleAudioEffectsProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Reverb
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const [reverbWet, setReverbWet] = useState(0.3);
  const [reverbDecay, setReverbDecay] = useState(2.5);

  // Delay
  const [delayEnabled, setDelayEnabled] = useState(false);
  const [delayWet, setDelayWet] = useState(0.2);
  const [delayTime, setDelayTime] = useState(0.25);
  const [delayFeedback, setDelayFeedback] = useState(0.3);

  // Compressor
  const [compressorEnabled, setCompressorEnabled] = useState(false);
  const [compressorThreshold, setCompressorThreshold] = useState(-24);
  const [compressorRatio, setCompressorRatio] = useState(4);

  // Chorus
  const [chorusEnabled, setChorusEnabled] = useState(false);
  const [chorusWet, setChorusWet] = useState(0.3);
  const [chorusFrequency, setChorusFrequency] = useState(4);

  // Phaser
  const [phaserEnabled, setPhaserEnabled] = useState(false);
  const [phaserWet, setPhaserWet] = useState(0.3);
  const [phaserFrequency, setPhaserFrequency] = useState(0.5);

  // Tremolo
  const [tremoloEnabled, setTremoloEnabled] = useState(false);
  const [tremoloWet, setTremoloWet] = useState(0.3);
  const [tremoloFrequency, setTremoloFrequency] = useState(5);

  useEffect(() => {
    if (isVisible && !isInitialized) {
      initializeEffects();
    }
  }, [isVisible, isInitialized]);

  // ADDITIVE: Esc key to close modal
  useEffect(() => {
    if (!isVisible) return;

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isVisible, onClose]);

  const initializeEffects = async () => {
    setIsInitializing(true);
    try {
      await globalAudioEffects.initialize();
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize effects:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  // Update effects when parameters change
  useEffect(() => {
    if (isInitialized) {
      globalAudioEffects.updateReverb(reverbEnabled ? reverbWet : 0, reverbDecay);
    }
  }, [isInitialized, reverbEnabled, reverbWet, reverbDecay]);

  useEffect(() => {
    if (isInitialized) {
      globalAudioEffects.updateDelay(delayEnabled ? delayWet : 0, delayTime, delayFeedback);
    }
  }, [isInitialized, delayEnabled, delayWet, delayTime, delayFeedback]);

  useEffect(() => {
    if (isInitialized) {
      globalAudioEffects.updateCompressor(compressorThreshold, compressorRatio);
    }
  }, [isInitialized, compressorThreshold, compressorRatio]);

  useEffect(() => {
    if (isInitialized) {
      globalAudioEffects.updateChorus(chorusEnabled ? chorusWet : 0, chorusFrequency);
    }
  }, [isInitialized, chorusEnabled, chorusWet, chorusFrequency]);

  useEffect(() => {
    if (isInitialized) {
      globalAudioEffects.updatePhaser(phaserEnabled ? phaserWet : 0, phaserFrequency);
    }
  }, [isInitialized, phaserEnabled, phaserWet, phaserFrequency]);

  useEffect(() => {
    if (isInitialized) {
      globalAudioEffects.updateTremolo(tremoloEnabled ? tremoloWet : 0, tremoloFrequency);
    }
  }, [isInitialized, tremoloEnabled, tremoloWet, tremoloFrequency]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto p-4"
      onClick={(e) => {
        // Close modal if clicking on the backdrop (not on the content)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900/20 to-gray-900 rounded-lg p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Audio Effects Suite</h1>
              <p className="text-gray-300 text-sm mt-1">
                {isInitializing ? 'Initializing effects...' : isInitialized ? 'Effects are active and processing audio' : 'Effects ready to initialize'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Spatial Effects */}
        <div className="mb-6 bg-gradient-to-br from-gray-900 via-cyan-900/10 to-gray-900 rounded-lg p-6 border-2 border-cyan-500/30">
          <div className="flex items-center space-x-3 mb-6">
            <Waves className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Spatial Effects</h2>
          </div>

          {/* Reverb */}
          <div className="mb-6 bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Reverb</h3>
              <button
                onClick={() => setReverbEnabled(!reverbEnabled)}
                className={`p-2 rounded-lg transition-all ${
                  reverbEnabled ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Wet</span>
                  <span className="text-cyan-400">{(reverbWet * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={reverbWet}
                  onChange={(e) => setReverbWet(Number(e.target.value))}
                  disabled={!reverbEnabled}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Decay</span>
                  <span className="text-cyan-400">{reverbDecay.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={reverbDecay}
                  onChange={(e) => setReverbDecay(Number(e.target.value))}
                  disabled={!reverbEnabled}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Delay */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Delay</h3>
              <button
                onClick={() => setDelayEnabled(!delayEnabled)}
                className={`p-2 rounded-lg transition-all ${
                  delayEnabled ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Wet</span>
                  <span className="text-blue-400">{(delayWet * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={delayWet}
                  onChange={(e) => setDelayWet(Number(e.target.value))}
                  disabled={!delayEnabled}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Time</span>
                  <span className="text-blue-400">{delayTime.toFixed(2)}s</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="2"
                  step="0.01"
                  value={delayTime}
                  onChange={(e) => setDelayTime(Number(e.target.value))}
                  disabled={!delayEnabled}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Feedback</span>
                  <span className="text-blue-400">{(delayFeedback * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.9"
                  step="0.01"
                  value={delayFeedback}
                  onChange={(e) => setDelayFeedback(Number(e.target.value))}
                  disabled={!delayEnabled}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamics */}
        <div className="mb-6 bg-gradient-to-br from-gray-900 via-amber-900/10 to-gray-900 rounded-lg p-6 border-2 border-amber-500/30">
          <div className="flex items-center space-x-3 mb-6">
            <Volume2 className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Dynamics</h2>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Compressor</h3>
              <button
                onClick={() => setCompressorEnabled(!compressorEnabled)}
                className={`p-2 rounded-lg transition-all ${
                  compressorEnabled ? 'bg-amber-500 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Threshold</span>
                  <span className="text-amber-400">{compressorThreshold} dB</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="0"
                  step="1"
                  value={compressorThreshold}
                  onChange={(e) => setCompressorThreshold(Number(e.target.value))}
                  disabled={!compressorEnabled}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Ratio</span>
                  <span className="text-amber-400">{compressorRatio}:1</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={compressorRatio}
                  onChange={(e) => setCompressorRatio(Number(e.target.value))}
                  disabled={!compressorEnabled}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modulation */}
        <div className="bg-gradient-to-br from-gray-900 via-emerald-900/10 to-gray-900 rounded-lg p-6 border-2 border-emerald-500/30">
          <div className="flex items-center space-x-3 mb-6">
            <Radio className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Modulation</h2>
          </div>

          {/* Chorus */}
          <div className="mb-6 bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Chorus</h3>
              <button
                onClick={() => setChorusEnabled(!chorusEnabled)}
                className={`p-2 rounded-lg transition-all ${
                  chorusEnabled ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Wet</span>
                  <span className="text-emerald-400">{(chorusWet * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={chorusWet}
                  onChange={(e) => setChorusWet(Number(e.target.value))}
                  disabled={!chorusEnabled}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Rate</span>
                  <span className="text-emerald-400">{chorusFrequency.toFixed(1)} Hz</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={chorusFrequency}
                  onChange={(e) => setChorusFrequency(Number(e.target.value))}
                  disabled={!chorusEnabled}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Phaser */}
          <div className="mb-6 bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Phaser</h3>
              <button
                onClick={() => setPhaserEnabled(!phaserEnabled)}
                className={`p-2 rounded-lg transition-all ${
                  phaserEnabled ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Wet</span>
                  <span className="text-teal-400">{(phaserWet * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={phaserWet}
                  onChange={(e) => setPhaserWet(Number(e.target.value))}
                  disabled={!phaserEnabled}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Rate</span>
                  <span className="text-teal-400">{phaserFrequency.toFixed(1)} Hz</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={phaserFrequency}
                  onChange={(e) => setPhaserFrequency(Number(e.target.value))}
                  disabled={!phaserEnabled}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Tremolo */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Tremolo</h3>
              <button
                onClick={() => setTremoloEnabled(!tremoloEnabled)}
                className={`p-2 rounded-lg transition-all ${
                  tremoloEnabled ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Wet</span>
                  <span className="text-green-400">{(tremoloWet * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={tremoloWet}
                  onChange={(e) => setTremoloWet(Number(e.target.value))}
                  disabled={!tremoloEnabled}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Rate</span>
                  <span className="text-green-400">{tremoloFrequency.toFixed(1)} Hz</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="20"
                  step="0.1"
                  value={tremoloFrequency}
                  onChange={(e) => setTremoloFrequency(Number(e.target.value))}
                  disabled={!tremoloEnabled}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
