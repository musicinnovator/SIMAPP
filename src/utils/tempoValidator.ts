/**
 * Tempo Validation Utility
 *
 * Provides validation, clamping, and error handling for tempo/BPM values
 */

export const TEMPO_CONSTANTS = {
  MIN_BPM: 20,
  MAX_BPM: 240,
  DEFAULT_BPM: 80,
  SAFE_MIN_BPM: 40,  // Recommended minimum for musical contexts
  SAFE_MAX_BPM: 180, // Recommended maximum for musical contexts
} as const;

export interface TempoValidationResult {
  isValid: boolean;
  value: number;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a BPM value and returns detailed validation result
 */
export function validateTempo(value: any): TempoValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if value is provided
  if (value === null || value === undefined || value === '') {
    errors.push('Tempo value is required');
    return {
      isValid: false,
      value: TEMPO_CONSTANTS.DEFAULT_BPM,
      errors,
      warnings,
    };
  }

  // Convert to number
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);

  // Check if it's a valid number
  if (isNaN(numValue)) {
    errors.push('Tempo must be a valid number');
    return {
      isValid: false,
      value: TEMPO_CONSTANTS.DEFAULT_BPM,
      errors,
      warnings,
    };
  }

  // Check if it's finite
  if (!isFinite(numValue)) {
    errors.push('Tempo must be a finite number');
    return {
      isValid: false,
      value: TEMPO_CONSTANTS.DEFAULT_BPM,
      errors,
      warnings,
    };
  }

  // Check absolute bounds (hard limits)
  if (numValue < TEMPO_CONSTANTS.MIN_BPM) {
    errors.push(`Tempo must be at least ${TEMPO_CONSTANTS.MIN_BPM} BPM`);
    return {
      isValid: false,
      value: TEMPO_CONSTANTS.MIN_BPM,
      errors,
      warnings,
    };
  }

  if (numValue > TEMPO_CONSTANTS.MAX_BPM) {
    errors.push(`Tempo must not exceed ${TEMPO_CONSTANTS.MAX_BPM} BPM`);
    return {
      isValid: false,
      value: TEMPO_CONSTANTS.MAX_BPM,
      errors,
      warnings,
    };
  }

  // Check recommended bounds (soft warnings)
  if (numValue < TEMPO_CONSTANTS.SAFE_MIN_BPM) {
    warnings.push(`Tempo ${numValue} BPM is very slow. Consider ${TEMPO_CONSTANTS.SAFE_MIN_BPM}+ BPM for better musical flow.`);
  }

  if (numValue > TEMPO_CONSTANTS.SAFE_MAX_BPM) {
    warnings.push(`Tempo ${numValue} BPM is very fast. Consider ${TEMPO_CONSTANTS.SAFE_MAX_BPM} BPM or lower for better clarity.`);
  }

  return {
    isValid: true,
    value: numValue,
    errors,
    warnings,
  };
}

/**
 * Clamps a tempo value to valid range
 */
export function clampTempo(value: any): number {
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);

  if (isNaN(numValue) || !isFinite(numValue)) {
    return TEMPO_CONSTANTS.DEFAULT_BPM;
  }

  return Math.max(
    TEMPO_CONSTANTS.MIN_BPM,
    Math.min(TEMPO_CONSTANTS.MAX_BPM, numValue)
  );
}

/**
 * Gets a human-readable tempo description
 */
export function getTempoDescription(bpm: number): string {
  if (bpm < 40) return 'Grave (Very Slow)';
  if (bpm < 60) return 'Largo (Slow)';
  if (bpm < 76) return 'Adagio (Slow)';
  if (bpm < 92) return 'Andante (Walking Pace)';
  if (bpm < 108) return 'Moderato (Moderate)';
  if (bpm < 120) return 'Allegro (Fast)';
  if (bpm < 156) return 'Vivace (Lively)';
  if (bpm < 176) return 'Presto (Very Fast)';
  return 'Prestissimo (Extremely Fast)';
}

/**
 * Converts tempo name to BPM value
 */
export const TEMPO_PRESETS: Record<string, number> = {
  'Grave': 35,
  'Largo': 50,
  'Lento': 55,
  'Adagio': 68,
  'Andante': 84,
  'Andante con moto': 92,
  'Moderato': 108,
  'Allegro': 132,
  'Vivace': 156,
  'Presto': 180,
  'Prestissimo': 208,
  'Maestoso': 88,
} as const;

/**
 * Error boundary handler for tempo-related operations
 */
export function safeTempoOperation<T>(
  operation: () => T,
  fallbackValue: T,
  errorCallback?: (error: Error) => void
): T {
  try {
    return operation();
  } catch (error) {
    console.error('[Tempo] Operation failed:', error);
    if (errorCallback && error instanceof Error) {
      errorCallback(error);
    }
    return fallbackValue;
  }
}

/**
 * Validates tempo change doesn't cause jarring transitions
 */
export function validateTempoTransition(
  currentBPM: number,
  newBPM: number,
  maxChangePercent: number = 30
): { isValid: boolean; warning?: string } {
  const percentChange = Math.abs(((newBPM - currentBPM) / currentBPM) * 100);

  if (percentChange > maxChangePercent) {
    return {
      isValid: false,
      warning: `Tempo change of ${percentChange.toFixed(1)}% is very abrupt. Consider a more gradual transition.`,
    };
  }

  return { isValid: true };
}
