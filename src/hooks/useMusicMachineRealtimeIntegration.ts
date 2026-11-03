/**
 * Music Machine Real-Time Integration Hook
 *
 * This hook integrates the real-time parameter queue system with MusicMachine
 * WITHOUT modifying existing MusicMachine logic.
 *
 * ADDITIVE-ONLY: This hook wraps parameter changes and queues them when appropriate.
 * If real-time changes are disabled or timing is 'immediately' or 'manual',
 * the original setter functions are called directly (preserving existing behavior).
 */

import { useCallback, useEffect, useRef } from 'react';
import { useRealtimeParameterQueue } from './useRealtimeParameterQueue';
import { ParameterApplicators, applyQueuedParameters, getParameterDisplayName } from '../utils/realtimeChangeHandlers';
import { ParameterType } from '../types/realtimeChanges';

interface MusicMachineParameterSetters {
  setVoicingTechnique: (value: any) => void;
  setSelectedArpPatternId?: (value: string) => void;
  setSelectedBlockPatternId?: (value: string) => void;
  setSelectedStrumPatternId?: (value: string) => void;
  setSelectedBrokenChordPatternId?: (value: string) => void;
  setManualBPM?: (value: number) => void;
  setMusicVolume?: (value: number) => void;
  setVoiceVolume?: (value: number) => void;
  setSelectedSound?: (value: string) => void;
  setInversion?: (value: number) => void;
  setChordType?: (value: string) => void;
  setPartialMode?: (value: string) => void;
}

interface UseMusicMachineRealtimeIntegrationParams {
  isPlaying: boolean;
  currentSetters: MusicMachineParameterSetters;
  getCurrentValues: () => {
    voicingTechnique: string;
    selectedArpPatternId?: string;
    selectedBlockPatternId?: string;
    selectedStrumPatternId?: string;
    selectedBrokenChordPatternId?: string;
    manualBPM?: number;
    musicVolume?: number;
    voiceVolume?: number;
    selectedSound?: string;
    inversion?: number;
    chordType?: string;
    partialMode?: string;
  };
}

/**
 * Hook that provides wrapped parameter setters that respect real-time queue settings
 */
export function useMusicMachineRealtimeIntegration({
  isPlaying,
  currentSetters,
  getCurrentValues
}: UseMusicMachineRealtimeIntegrationParams) {
  const queueSystem = useRealtimeParameterQueue();
  const loopCallbackRef = useRef<(() => void) | null>(null);
  const chordCallbackRef = useRef<(() => void) | null>(null);

  // Create applicators that call the actual setters
  const applicators: ParameterApplicators = {
    voicingTechnique: currentSetters.setVoicingTechnique,
    voicingPattern: (value: string) => {
      // Determine which pattern setter to use based on current voicing technique
      const values = getCurrentValues();
      if (values.voicingTechnique === 'arpeggiated' && currentSetters.setSelectedArpPatternId) {
        currentSetters.setSelectedArpPatternId(value);
      } else if (values.voicingTechnique === 'block' && currentSetters.setSelectedBlockPatternId) {
        currentSetters.setSelectedBlockPatternId(value);
      } else if (values.voicingTechnique === 'strum' && currentSetters.setSelectedStrumPatternId) {
        currentSetters.setSelectedStrumPatternId(value);
      } else if (values.voicingTechnique === 'broken' && currentSetters.setSelectedBrokenChordPatternId) {
        currentSetters.setSelectedBrokenChordPatternId(value);
      } else if (values.voicingTechnique === 'partial' && currentSetters.setPartialMode) {
        currentSetters.setPartialMode(value);
      }
    },
    tempo: currentSetters.setManualBPM,
    musicVolume: currentSetters.setMusicVolume,
    voiceVolume: currentSetters.setVoiceVolume,
    instrument: currentSetters.setSelectedSound,
    voicingStyle: (value: string) => {
      if (currentSetters.setChordType) {
        currentSetters.setChordType(value);
      }
    },
    octaveRange: currentSetters.setInversion
  };

  // Register loop callback
  useEffect(() => {
    const unsubscribe = queueSystem.onNextLoop((params) => {
      console.log('[MusicMachine] Applying queued parameters on loop boundary:', params);
      const results = applyQueuedParameters(params, applicators);
      console.log('[MusicMachine] Application results:', results);

      if (results.failed > 0) {
        console.error('[MusicMachine] Failed to apply some parameters:', results.errors);
      }
    });

    return unsubscribe;
  }, [queueSystem]);

  // Register chord callback
  useEffect(() => {
    const unsubscribe = queueSystem.onNextChord((params) => {
      console.log('[MusicMachine] Applying queued parameters on chord change:', params);
      const results = applyQueuedParameters(params, applicators);
      console.log('[MusicMachine] Application results:', results);

      if (results.failed > 0) {
        console.error('[MusicMachine] Failed to apply some parameters:', results.errors);
      }
    });

    return unsubscribe;
  }, [queueSystem]);

  /**
   * Wrapped setter that queues changes when appropriate
   */
  const createWrappedSetter = useCallback(<T,>(
    paramType: ParameterType,
    originalSetter: (value: T) => void,
    getCurrentValue: () => T,
    priority: 'high' | 'medium' = 'high'
  ) => {
    return (newValue: T) => {
      // If not playing or queue system is disabled, just use original setter
      if (!isPlaying || !queueSystem.settings.enabled) {
        originalSetter(newValue);
        return;
      }

      const currentValue = getCurrentValue();
      const displayName = getParameterDisplayName(paramType, newValue);

      // Try to queue the change
      const wasQueued = queueSystem.queueChange(
        paramType,
        newValue,
        currentValue,
        displayName,
        priority
      );

      // If not queued (immediate/manual mode), apply immediately
      if (!wasQueued) {
        originalSetter(newValue);
      } else {
        console.log(`[MusicMachine] Queued ${paramType} change:`, newValue);
      }
    };
  }, [isPlaying, queueSystem]);

  /**
   * Trigger application of queued "next-loop" parameters
   * Call this when the chord progression loops back to the beginning
   */
  const triggerLoopBoundary = useCallback(() => {
    if (isPlaying && queueSystem.settings.enabled) {
      console.log('[MusicMachine] Loop boundary detected, applying queued changes');
      queueSystem.applyQueue('next-loop');
    }
  }, [isPlaying, queueSystem]);

  /**
   * Trigger application of queued "next-chord" parameters
   * Call this when moving to a new chord in the progression
   */
  const triggerChordChange = useCallback(() => {
    if (isPlaying && queueSystem.settings.enabled) {
      queueSystem.applyQueue('next-chord');
    }
  }, [isPlaying, queueSystem]);

  // Create wrapped setters for all parameters
  const wrappedSetters = {
    setVoicingTechnique: createWrappedSetter(
      'voicing-technique',
      currentSetters.setVoicingTechnique,
      () => getCurrentValues().voicingTechnique,
      'high'
    ),

    setSelectedArpPatternId: currentSetters.setSelectedArpPatternId
      ? createWrappedSetter(
          'voicing-pattern',
          currentSetters.setSelectedArpPatternId,
          () => getCurrentValues().selectedArpPatternId || '',
          'high'
        )
      : undefined,

    setSelectedBlockPatternId: currentSetters.setSelectedBlockPatternId
      ? createWrappedSetter(
          'voicing-pattern',
          currentSetters.setSelectedBlockPatternId,
          () => getCurrentValues().selectedBlockPatternId || '',
          'high'
        )
      : undefined,

    setSelectedStrumPatternId: currentSetters.setSelectedStrumPatternId
      ? createWrappedSetter(
          'voicing-pattern',
          currentSetters.setSelectedStrumPatternId,
          () => getCurrentValues().selectedStrumPatternId || '',
          'high'
        )
      : undefined,

    setSelectedBrokenChordPatternId: currentSetters.setSelectedBrokenChordPatternId
      ? createWrappedSetter(
          'voicing-pattern',
          currentSetters.setSelectedBrokenChordPatternId,
          () => getCurrentValues().selectedBrokenChordPatternId || '',
          'high'
        )
      : undefined,

    setManualBPM: currentSetters.setManualBPM
      ? createWrappedSetter(
          'tempo',
          currentSetters.setManualBPM,
          () => getCurrentValues().manualBPM || 80,
          'high'
        )
      : undefined,

    setMusicVolume: currentSetters.setMusicVolume
      ? createWrappedSetter(
          'volume',
          currentSetters.setMusicVolume,
          () => getCurrentValues().musicVolume || 75,
          'high'
        )
      : undefined,

    setVoiceVolume: currentSetters.setVoiceVolume
      ? createWrappedSetter(
          'volume',
          currentSetters.setVoiceVolume,
          () => getCurrentValues().voiceVolume || 75,
          'high'
        )
      : undefined,

    setSelectedSound: currentSetters.setSelectedSound
      ? createWrappedSetter(
          'instrument',
          currentSetters.setSelectedSound,
          () => getCurrentValues().selectedSound || 'piano',
          'medium'
        )
      : undefined,

    setInversion: currentSetters.setInversion
      ? createWrappedSetter(
          'octave-range',
          currentSetters.setInversion,
          () => getCurrentValues().inversion || 0,
          'medium'
        )
      : undefined,

    setChordType: currentSetters.setChordType
      ? createWrappedSetter(
          'voicing-style',
          currentSetters.setChordType,
          () => getCurrentValues().chordType || 'triad',
          'medium'
        )
      : undefined,

    setPartialMode: currentSetters.setPartialMode
      ? createWrappedSetter(
          'voicing-pattern',
          currentSetters.setPartialMode,
          () => getCurrentValues().partialMode || 'root-third',
          'high'
        )
      : undefined
  };

  return {
    // Queue system
    queueSystem,

    // Wrapped setters (use these instead of original setters)
    wrappedSetters,

    // Boundary triggers (call these at appropriate times)
    triggerLoopBoundary,
    triggerChordChange
  };
}
