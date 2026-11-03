/**
 * Real-Time Change Handler Utilities
 *
 * Provides error-checked handler functions for applying queued parameter changes.
 * These handlers act as a safe layer between the queue system and the actual
 * parameter application logic.
 *
 * ADDITIVE-ONLY: These handlers do NOT modify existing parameter change logic.
 * They wrap it with additional safety checks and logging.
 */

import { QueuedParameter, ParameterType } from '../types/realtimeChanges';

export interface ParameterApplicators {
  voicingTechnique?: (value: string) => void;
  voicingPattern?: (value: string) => void;
  tempo?: (value: number) => void;
  musicVolume?: (value: number) => void;
  voiceVolume?: (value: number) => void;
  instrument?: (value: string) => void;
  octaveRange?: (value: number) => void;
  voicingStyle?: (value: string) => void;
  dynamics?: (value: any) => void;
}

/**
 * Safely apply a queued parameter with error handling
 */
export function applyQueuedParameter(
  param: QueuedParameter,
  applicators: ParameterApplicators
): { success: boolean; error?: string } {
  try {
    console.log(`[RealtimeChange] Applying ${param.type}:`, param.value);

    switch (param.type) {
      case 'voicing-technique':
        if (applicators.voicingTechnique) {
          applicators.voicingTechnique(param.value);
        } else {
          return { success: false, error: 'No voicing technique applicator registered' };
        }
        break;

      case 'voicing-pattern':
        if (applicators.voicingPattern) {
          applicators.voicingPattern(param.value);
        } else {
          return { success: false, error: 'No voicing pattern applicator registered' };
        }
        break;

      case 'tempo':
        if (applicators.tempo) {
          const validatedTempo = validateTempo(param.value);
          if (validatedTempo !== null) {
            applicators.tempo(validatedTempo);
          } else {
            return { success: false, error: `Invalid tempo value: ${param.value}` };
          }
        } else {
          return { success: false, error: 'No tempo applicator registered' };
        }
        break;

      case 'volume':
        // Determine if music or voice volume based on value structure
        if (typeof param.value === 'object' && 'music' in param.value) {
          if (applicators.musicVolume) {
            applicators.musicVolume(param.value.music);
          }
          if (applicators.voiceVolume && 'voice' in param.value) {
            applicators.voiceVolume(param.value.voice);
          }
        } else {
          // Single volume value (assume music)
          if (applicators.musicVolume) {
            applicators.musicVolume(param.value);
          }
        }
        break;

      case 'instrument':
        if (applicators.instrument) {
          applicators.instrument(param.value);
        } else {
          return { success: false, error: 'No instrument applicator registered' };
        }
        break;

      case 'octave-range':
        if (applicators.octaveRange) {
          applicators.octaveRange(param.value);
        } else {
          return { success: false, error: 'No octave range applicator registered' };
        }
        break;

      case 'voicing-style':
        if (applicators.voicingStyle) {
          applicators.voicingStyle(param.value);
        } else {
          return { success: false, error: 'No voicing style applicator registered' };
        }
        break;

      case 'dynamics':
        if (applicators.dynamics) {
          applicators.dynamics(param.value);
        } else {
          return { success: false, error: 'No dynamics applicator registered' };
        }
        break;

      case 'audio-effects':
        // Audio effects are handled separately by the audio effects system
        console.log('[RealtimeChange] Audio effects changes are handled by effects system');
        break;

      default:
        return { success: false, error: `Unknown parameter type: ${param.type}` };
    }

    console.log(`[RealtimeChange] ✅ Successfully applied ${param.type}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[RealtimeChange] ❌ Error applying ${param.type}:`, error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Apply multiple queued parameters with error handling
 */
export function applyQueuedParameters(
  params: QueuedParameter[],
  applicators: ParameterApplicators
): { total: number; succeeded: number; failed: number; errors: string[] } {
  const results = {
    total: params.length,
    succeeded: 0,
    failed: 0,
    errors: [] as string[]
  };

  // Sort by priority (high first)
  const sorted = [...params].sort((a, b) =>
    a.priority === 'high' && b.priority !== 'high' ? -1 : 1
  );

  for (const param of sorted) {
    const result = applyQueuedParameter(param, applicators);
    if (result.success) {
      results.succeeded++;
    } else {
      results.failed++;
      if (result.error) {
        results.errors.push(`${param.displayName}: ${result.error}`);
      }
    }
  }

  return results;
}

/**
 * Validate tempo value
 */
function validateTempo(value: any): number | null {
  if (typeof value !== 'number') {
    return null;
  }
  if (value < 20 || value > 300) {
    return null;
  }
  return value;
}

/**
 * Validate volume value (0-100)
 */
export function validateVolume(value: any): number | null {
  if (typeof value !== 'number') {
    return null;
  }
  if (value < 0 || value > 100) {
    return null;
  }
  return value;
}

/**
 * Validate voicing technique value
 */
export function validateVoicingTechnique(value: any): boolean {
  const validTechniques = ['block', 'arpeggiated', 'strum', 'broken', 'partial'];
  return typeof value === 'string' && validTechniques.includes(value);
}

/**
 * Create display name for parameter type
 */
export function getParameterDisplayName(type: ParameterType, value: any): string {
  switch (type) {
    case 'voicing-technique':
      return `Voicing: ${value}`;
    case 'voicing-pattern':
      return `Pattern: ${value}`;
    case 'tempo':
      return `Tempo: ${value} BPM`;
    case 'volume':
      if (typeof value === 'object' && 'music' in value) {
        return `Volume: Music ${value.music}%, Voice ${value.voice || 0}%`;
      }
      return `Volume: ${value}%`;
    case 'instrument':
      return `Instrument: ${value}`;
    case 'octave-range':
      return `Octave: ${value > 0 ? '+' : ''}${value}`;
    case 'voicing-style':
      return `Style: ${value}`;
    case 'dynamics':
      return 'Dynamics';
    case 'audio-effects':
      return 'Audio Effects';
    default:
      return String(type);
  }
}
