import {
  ArpeggioSequence,
  RhythmPattern,
  CompatibilityCheck,
  DistributionConfig
} from '../types/arpeggioSystem';

export class CompatibilityChecker {
  public checkCompatibility(
    sequence: ArpeggioSequence,
    rhythm: RhythmPattern,
    distribution?: DistributionConfig
  ): CompatibilityCheck {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (sequence.isLong && !distribution?.enabled) {
      suggestions.push('Long sequences work best with distribution enabled');
    }

    if (sequence.length > rhythm.durations.length * 2) {
      warnings.push('Sequence has more notes than rhythm positions');
      suggestions.push('Consider a faster rhythm or enable distribution');
    }

    return {
      isCompatible: warnings.length === 0,
      warnings,
      suggestions
    };
  }

  public shouldRestrictCombination(
    sequence: ArpeggioSequence,
    rhythm: RhythmPattern
  ): boolean {
    if (sequence.isLong && rhythm.subdivision === 'whole') {
      return true;
    }
    if (sequence.length === 2 && rhythm.subdivision === 'sixteenth') {
      return true;
    }
    return false;
  }
}

export const globalCompatibilityChecker = new CompatibilityChecker();
