import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Power,
  Save,
  FolderOpen,
  X,
  Check,
  AlertCircle,
  Sparkles,
  Volume2,
  Waves,
  Radio,
} from 'lucide-react';
import { useAudioEffects } from '../hooks/useAudioEffects';
import { SpatialEffectsModule } from './effects/SpatialEffectsModule';
import { DynamicsEffectsModule } from './effects/DynamicsEffectsModule';
import { ModulationEffectsModule } from './effects/ModulationEffectsModule';
import { ConfirmationDialog } from './effects/ConfirmationDialog';

interface AudioEffectsSuiteProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export function AudioEffectsSuite({ isVisible = true, onClose }: AudioEffectsSuiteProps) {
  const {
    engine,
    isInitialized,
    isLoading,
    error,
    effectState,
    presets,
    chains,
    initializeEngine,
    updateEffect,
    toggleEffect,
    savePreset,
    saveChain,
    applyPreset,
    loadPresets,
    getEnabledEffects,
  } = useAudioEffects();

  const [activeModule, setActiveModule] = useState<'spatial' | 'dynamics' | 'modulation'>('spatial');
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [presetName, setPresetName] = useState('');
  const [chainName, setChainName] = useState('');
  const [saveAsPublic, setSaveAsPublic] = useState(false);

  useEffect(() => {
    if (isVisible && !isInitialized) {
      initializeEngine();
    }
  }, [isVisible, isInitialized, initializeEngine]);

  // ADDITIVE: Esc key to close modal
  useEffect(() => {
    if (!isVisible) return;

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        // Close preset manager first if open, otherwise close main modal
        if (showPresetManager) {
          setShowPresetManager(false);
        } else if (showConfirmation) {
          handleCancel();
        } else if (onClose) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isVisible, showPresetManager, showConfirmation, onClose]);

  const handleEnhancementRequest = (action: () => void, message: string) => {
    setConfirmationMessage(message);
    setPendingAction(() => action);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setPendingAction(null);
    setShowConfirmation(false);
  };

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      alert('Please enter a preset name');
      return;
    }

    const params = effectState[activeModule];
    const success = await savePreset(presetName, activeModule, params, saveAsPublic);

    if (success) {
      setPresetName('');
      setSaveAsPublic(false);
      alert('Preset saved successfully!');
    } else {
      alert('Failed to save preset');
    }
  };

  const handleSaveChain = async () => {
    if (!chainName.trim()) {
      alert('Please enter a chain name');
      return;
    }

    const enabledEffects = getEnabledEffects();
    const effectsOrder = enabledEffects.map(effect => ({
      effect,
      enabled: true,
      parameters: {},
    }));

    const success = await saveChain(chainName, effectsOrder);

    if (success) {
      setChainName('');
      alert('Effect chain saved successfully!');
    } else {
      alert('Failed to save chain');
    }
  };

  const getModuleIcon = (module: 'spatial' | 'dynamics' | 'modulation') => {
    switch (module) {
      case 'spatial':
        return <Waves className="w-5 h-5" />;
      case 'dynamics':
        return <Volume2 className="w-5 h-5" />;
      case 'modulation':
        return <Radio className="w-5 h-5" />;
    }
  };

  const getModuleColor = (module: 'spatial' | 'dynamics' | 'modulation') => {
    switch (module) {
      case 'spatial':
        return 'from-cyan-500 to-violet-500';
      case 'dynamics':
        return 'from-amber-500 to-red-500';
      case 'modulation':
        return 'from-emerald-500 to-teal-500';
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* ADDITIVE: Clickable overlay to close modal */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 overflow-y-auto"
        onClick={(e) => {
          // Close modal if clicking on the backdrop (not on the content)
          if (e.target === e.currentTarget && onClose) {
            onClose();
          }
        }}
      >
        <div className="min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900 rounded-lg p-6 mb-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Audio Effects Suite</h1>
                    <p className="text-gray-300 text-sm">Studio-grade processing for SoundFont instruments and recordings</p>
                  </div>
                </div>

                {onClose && (
                  <button
                    onClick={() => handleEnhancementRequest(onClose, 'Close the Audio Effects Suite?')}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Status Bar */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {isLoading ? (
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                      <span className="text-sm font-medium">Initializing effects...</span>
                    </div>
                  ) : isInitialized ? (
                    <div className="flex items-center space-x-2 text-green-400">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Effects engine ready</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnhancementRequest(initializeEngine, 'Initialize the audio effects engine?')}
                      className="flex items-center space-x-2 bg-success-50 text-white px-4 py-2 rounded-lg font-medium hover:from-green-400 hover:to-green-500 transition-all duration-200 shadow-lg"
                    >
                      <Power className="w-4 h-4" />
                      <span>Initialize Engine</span>
                    </button>
                  )}

                  {error && (
                    <div className="flex items-center space-x-2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPresetManager(true)}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>Presets</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Module Selector */}
            <div className="bg-gradient-to-r from-gray-900 via-purple-900/10 to-gray-900 rounded-lg p-4 mb-6 border border-white/10 shadow-xl">
              <div className="grid grid-cols-3 gap-4">
                {(['spatial', 'dynamics', 'modulation'] as const).map((module) => (
                  <button
                    key={module}
                    onClick={() => setActiveModule(module)}
                    className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                      activeModule === module
                        ? `border-transparent bg-gradient-to-r ${getModuleColor(module)} shadow-2xl scale-105`
                        : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div
                        className={`p-4 rounded-xl transition-all duration-300 ${
                          activeModule === module
                            ? 'bg-white/20 shadow-lg'
                            : 'bg-white/10 group-hover:bg-white/15'
                        }`}
                      >
                        {getModuleIcon(module)}
                      </div>
                      <div className="text-center">
                        <h3 className="text-white font-bold capitalize">{module}</h3>
                        <p className="text-white/70 text-xs mt-1">
                          {module === 'spatial' && 'Reverb, Delay, Panning'}
                          {module === 'dynamics' && 'Compression, Limiting, Gating'}
                          {module === 'modulation' && 'Chorus, Phaser, Tremolo'}
                        </p>
                      </div>
                    </div>

                    {activeModule === module && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Module Display */}
            <div className="mb-6">
              {activeModule === 'spatial' && (
                <SpatialEffectsModule
                  effectState={effectState.spatial}
                  isInitialized={isInitialized}
                  onUpdateEffect={(effectName, params) => updateEffect('spatial', effectName, params)}
                  onToggleEffect={(effectName) => toggleEffect('spatial', effectName)}
                />
              )}

              {activeModule === 'dynamics' && (
                <DynamicsEffectsModule
                  effectState={effectState.dynamics}
                  isInitialized={isInitialized}
                  onUpdateEffect={(effectName, params) => updateEffect('dynamics', effectName, params)}
                  onToggleEffect={(effectName) => toggleEffect('dynamics', effectName)}
                />
              )}

              {activeModule === 'modulation' && (
                <ModulationEffectsModule
                  effectState={effectState.modulation}
                  isInitialized={isInitialized}
                  onUpdateEffect={(effectName, params) => updateEffect('modulation', effectName, params)}
                  onToggleEffect={(effectName) => toggleEffect('modulation', effectName)}
                />
              )}
            </div>

            {/* Save Controls */}
            <div className="bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900 rounded-lg p-6 border border-white/20 shadow-xl">
              <h3 className="text-white font-bold mb-4 flex items-center space-x-2">
                <Save className="w-5 h-5" />
                <span>Save Configuration</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Save Preset */}
                <div className="space-y-3">
                  <label className="text-gray-300 text-sm font-medium">Save Current Module as Preset</label>
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Preset name..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={saveAsPublic}
                      onChange={(e) => setSaveAsPublic(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <label className="text-gray-300 text-sm">Make public (share with others)</label>
                  </div>
                  <button
                    onClick={handleSavePreset}
                    disabled={!isInitialized || !presetName.trim()}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-400 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Preset</span>
                  </button>
                </div>

                {/* Save Chain */}
                <div className="space-y-3">
                  <label className="text-gray-300 text-sm font-medium">Save Full Effect Chain</label>
                  <input
                    type="text"
                    value={chainName}
                    onChange={(e) => setChainName(e.target.value)}
                    placeholder="Chain name..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-gray-400 text-xs">Saves all enabled effects across all modules</p>
                  <button
                    onClick={handleSaveChain}
                    disabled={!isInitialized || !chainName.trim()}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-400 hover:to-pink-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Save Chain</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Manager Modal */}
      {showPresetManager && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            // Close modal if clicking on the backdrop
            if (e.target === e.currentTarget) {
              setShowPresetManager(false);
            }
          }}
        >
          <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border border-white/20 rounded-lg w-full max-w-4xl my-8 flex flex-col shadow-2xl max-h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Preset Manager</h3>
              <button
                onClick={() => setShowPresetManager(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {presets.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No presets saved yet</p>
              ) : (
                presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-bold">{preset.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {preset.effect_type} • {preset.is_public ? 'Public' : 'Private'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          applyPreset(preset);
                          setShowPresetManager(false);
                        }}
                        className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-all"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        message={confirmationMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
