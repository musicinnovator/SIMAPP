import React, { useState, useEffect } from 'react';
import { Music, Gauge, Settings, Info } from 'lucide-react';
import {
  ArpeggioSequence,
  RhythmPattern,
  DistributionConfig,
  DistributionMode,
  ArpeggioSystemConfig
} from '../types/arpeggioSystem';
import { ARPEGGIO_SEQUENCES, getSequencesByCategory } from '../data/arpeggioSequences';
import { RHYTHM_PATTERNS, getRhythmsByType } from '../data/rhythmPatterns';
import { globalCompatibilityChecker } from '../utils/compatibilityChecker';
import { globalSequenceDistributor } from '../utils/sequenceDistributor';
import { useToast, ToastContainer } from './ToastNotification';

interface TieredArpeggioSelectorProps {
  onConfigChange: (config: ArpeggioSystemConfig) => void;
  progressionLength: number;
}

export const TieredArpeggioSelector: React.FC<TieredArpeggioSelectorProps> = ({
  onConfigChange,
  progressionLength
}) => {
  const { toasts, showInfo, showWarning, showSuccess, removeToast } = useToast();

  const [selectedSequence, setSelectedSequence] = useState<ArpeggioSequence>(ARPEGGIO_SEQUENCES[0]);
  const [selectedRhythm, setSelectedRhythm] = useState<RhythmPattern>(RHYTHM_PATTERNS[3]);
  const [distributionConfig, setDistributionConfig] = useState<DistributionConfig>({
    mode: 'continuous',
    enabled: false
  });
  const [restrictIncompatible, setRestrictIncompatible] = useState(true);

  useEffect(() => {
    const compatibility = globalCompatibilityChecker.checkCompatibility(
      selectedSequence,
      selectedRhythm,
      distributionConfig
    );

    if (!compatibility.isCompatible) {
      showWarning(compatibility.warnings[0]);
    }

    if (compatibility.suggestions.length > 0 && !distributionConfig.enabled) {
      showInfo(compatibility.suggestions[0], 6000);
    }

    const config: ArpeggioSystemConfig = {
      sequence: selectedSequence,
      rhythm: selectedRhythm,
      distribution: distributionConfig,
      restrictIncompatible
    };

    onConfigChange(config);
  }, [selectedSequence, selectedRhythm, distributionConfig, restrictIncompatible]);

  const handleSequenceChange = (sequenceId: string) => {
    const sequence = ARPEGGIO_SEQUENCES.find(s => s.id === sequenceId);
    if (!sequence) return;

    if (restrictIncompatible) {
      const shouldRestrict = globalCompatibilityChecker.shouldRestrictCombination(
        sequence,
        selectedRhythm
      );
      if (shouldRestrict) {
        showWarning('This combination is not recommended. Disable restrictions to proceed.');
        return;
      }
    }

    setSelectedSequence(sequence);
    showSuccess(`Sequence: ${sequence.name}`);

    if (sequence.isLong && !distributionConfig.enabled) {
      const suggestedMode = globalSequenceDistributor.getSuggestedDistributionMode(
        sequence,
        progressionLength
      );
      showInfo(`Long sequence detected! Consider enabling "${suggestedMode}" distribution`, 5000);
    }
  };

  const handleRhythmChange = (rhythmId: string) => {
    const rhythm = RHYTHM_PATTERNS.find(r => r.id === rhythmId);
    if (!rhythm) return;

    if (restrictIncompatible) {
      const shouldRestrict = globalCompatibilityChecker.shouldRestrictCombination(
        selectedSequence,
        rhythm
      );
      if (shouldRestrict) {
        showWarning('This combination is not recommended. Disable restrictions to proceed.');
        return;
      }
    }

    setSelectedRhythm(rhythm);
    showSuccess(`Rhythm: ${rhythm.name}`);
  };

  const handleDistributionToggle = () => {
    const newEnabled = !distributionConfig.enabled;

    if (newEnabled && !selectedSequence.isLong) {
      showInfo('Distribution works best with long sequences (6+ notes)');
    }

    setDistributionConfig({
      ...distributionConfig,
      enabled: newEnabled,
      mode: newEnabled ? 'even-split' : 'continuous'
    });

    if (newEnabled) {
      showSuccess('Distribution enabled');
    }
  };

  const handleDistributionModeChange = (mode: DistributionMode) => {
    setDistributionConfig({
      ...distributionConfig,
      mode
    });

    const preview = globalSequenceDistributor.previewDistribution(
      selectedSequence,
      progressionLength,
      { ...distributionConfig, mode }
    );

    showInfo(`${mode} mode: ${preview[0]}`, 5000);
  };

  const showPreview = () => {
    const preview = globalSequenceDistributor.previewDistribution(
      selectedSequence,
      progressionLength,
      distributionConfig
    );

    showInfo(preview.slice(0, 4).join(' | '), 7000);
  };

  const sequenceCategories = [
    { key: 'short', label: 'Short (2-3)' },
    { key: 'medium', label: 'Medium (4-5)' },
    { key: 'long', label: 'Long (6-8)' },
    { key: 'continuous', label: 'Continuous' }
  ];

  const rhythmTypes = [
    { key: 'even', label: 'Even', icon: '♩' },
    { key: 'combination', label: 'Mixed', icon: '♪♩' },
    { key: 'dotted', label: 'Dotted', icon: '♩.' },
    { key: 'swing', label: 'Swing', icon: '♪♪' },
    { key: 'shuffle', label: 'Shuffle', icon: '𝄞' },
    { key: 'triplet', label: 'Triplet', icon: '♪³' },
    { key: 'syncopated', label: 'Syncopated', icon: '⌐' }
  ];

  const distributionModes: { key: DistributionMode; label: string; desc: string }[] = [
    { key: 'continuous', label: 'Continuous', desc: 'Full sequence every chord' },
    { key: 'even-split', label: 'Even Split', desc: 'Divide equally' },
    { key: 'grouped', label: 'Grouped', desc: 'Split & alternate' },
    { key: 'cascade', label: 'Cascade', desc: 'Sliding window' },
    { key: 'progressive', label: 'Progressive', desc: 'Build up gradually' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Music className="w-6 h-6 text-purple-600" />
          Tiered Arpeggio System
        </h2>
        <button
          onClick={() => setRestrictIncompatible(!restrictIncompatible)}
          className={`px-3 py-1 rounded text-sm ${
            restrictIncompatible
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {restrictIncompatible ? 'Restrictions On' : 'Restrictions Off'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SEQUENCE SELECTOR */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Music className="w-4 h-4 text-blue-600" />
            Arpeggio Sequence (Which Notes)
          </label>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sequenceCategories.map(category => (
              <div key={category.key}>
                <p className="text-xs font-medium text-gray-500 mb-1">{category.label}</p>
                <div className="space-y-1">
                  {getSequencesByCategory(category.key as any).slice(0, 6).map(sequence => (
                    <button
                      key={sequence.id}
                      onClick={() => handleSequenceChange(sequence.id)}
                      className={`w-full text-left px-3 py-2 rounded border transition-all ${
                        selectedSequence.id === sequence.id
                          ? 'bg-blue-50 border-blue-400 text-blue-900'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{sequence.name}</span>
                        <span className="text-xs text-gray-500">{sequence.notes}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RHYTHM SELECTOR */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-green-600" />
            Rhythm Pattern (When/How)
          </label>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rhythmTypes.map(type => (
              <div key={type.key}>
                <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <span className="text-lg">{type.icon}</span>
                  {type.label}
                </p>
                <div className="space-y-1">
                  {getRhythmsByType(type.key).slice(0, 4).map(rhythm => (
                    <button
                      key={rhythm.id}
                      onClick={() => handleRhythmChange(rhythm.id)}
                      className={`w-full text-left px-3 py-2 rounded border transition-all ${
                        selectedRhythm.id === rhythm.id
                          ? 'bg-green-50 border-green-400 text-green-900'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{rhythm.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DISTRIBUTION SETTINGS */}
      {selectedSequence.isLong && (
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Settings className="w-4 h-4 text-purple-600" />
              Sequence Distribution (Long Sequences)
            </label>
            <button
              onClick={handleDistributionToggle}
              className={`px-4 py-2 rounded font-medium transition-all ${
                distributionConfig.enabled
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {distributionConfig.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {distributionConfig.enabled && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {distributionModes.map(mode => (
                  <button
                    key={mode.key}
                    onClick={() => handleDistributionModeChange(mode.key)}
                    className={`px-3 py-2 rounded border text-left transition-all ${
                      distributionConfig.mode === mode.key
                        ? 'bg-purple-50 border-purple-400 text-purple-900'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <p className="text-sm font-medium">{mode.label}</p>
                    <p className="text-xs text-gray-500">{mode.desc}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={showPreview}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                <Info className="w-4 h-4" />
                Preview Distribution
              </button>
            </>
          )}
        </div>
      )}

      {/* CURRENT SELECTION SUMMARY */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Sequence:</p>
            <p className="font-medium text-gray-900">{selectedSequence.name}</p>
            <p className="text-xs text-gray-500">{selectedSequence.notes}</p>
          </div>
          <div>
            <p className="text-gray-600">Rhythm:</p>
            <p className="font-medium text-gray-900">{selectedRhythm.name}</p>
            <p className="text-xs text-gray-500">{selectedRhythm.subdivision}</p>
          </div>
          <div>
            <p className="text-gray-600">Distribution:</p>
            <p className="font-medium text-gray-900">
              {distributionConfig.enabled ? distributionConfig.mode : 'Disabled'}
            </p>
            <p className="text-xs text-gray-500">
              {distributionConfig.enabled ? 'Across progression' : 'Continuous'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
