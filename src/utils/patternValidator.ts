import {
  BlockPattern,
  ArpeggiatedPattern,
  BrokenPattern,
  PatternValidationResult,
  MeasureConstraints,
  NoteDuration,
  Subdivision,
  TimeSignatureType
} from '../types/voicingPatterns';

const SUBDIVISION_BEATS: Record<Subdivision, number> = {
  'whole': 4,
  'half': 2,
  'quarter': 1,
  'eighth': 0.5,
  'sixteenth': 0.25,
  'triplet-quarter': 0.666,
  'triplet-eighth': 0.333,
  'dotted-half': 3,
  'dotted-quarter': 1.5,
  'dotted-eighth': 0.75
};

export function getMeasureConstraints(timeSignature: TimeSignatureType): MeasureConstraints {
  const parts = timeSignature.split('/');
  const beatsPerMeasure = parseInt(parts[0]);
  const beatUnit = parseInt(parts[1]);

  const measureDurationBeats = timeSignature === '6/8' || timeSignature === '9/8' || timeSignature === '12/8'
    ? beatsPerMeasure / 3
    : beatsPerMeasure;

  return {
    timeSignature,
    beatsPerMeasure,
    beatUnit,
    measureDurationSeconds: measureDurationBeats
  };
}

export function validateBlockPattern(pattern: BlockPattern): PatternValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!pattern.id || pattern.id.trim() === '') {
    errors.push('Pattern ID is required');
  }

  if (!pattern.name || pattern.name.trim() === '') {
    errors.push('Pattern name is required');
  }

  if (!pattern.durations || pattern.durations.length === 0) {
    errors.push('Pattern must have at least one duration');
    return { isValid: false, errors, warnings };
  }

  const constraints = getMeasureConstraints(pattern.timeSignature);
  let totalBeats = 0;

  pattern.durations.forEach((duration, index) => {
    if (!duration.subdivision) {
      errors.push(`Duration at index ${index} missing subdivision`);
      return;
    }

    if (duration.beats <= 0) {
      errors.push(`Duration at index ${index} has invalid beat count: ${duration.beats}`);
    }

    if (duration.relativePosition < 0 || duration.relativePosition >= 1) {
      errors.push(`Duration at index ${index} has invalid relative position: ${duration.relativePosition}`);
    }

    totalBeats += duration.beats;
  });

  const tolerance = 0.01;
  if (Math.abs(totalBeats - constraints.beatsPerMeasure) > tolerance) {
    errors.push(
      `Total beats (${totalBeats.toFixed(2)}) does not match time signature (${constraints.beatsPerMeasure} beats)`
    );
  }

  const sortedDurations = [...pattern.durations].sort((a, b) => a.relativePosition - b.relativePosition);
  for (let i = 0; i < sortedDurations.length - 1; i++) {
    const current = sortedDurations[i];
    const next = sortedDurations[i + 1];
    const currentEnd = current.relativePosition + (current.beats / constraints.beatsPerMeasure);

    if (currentEnd > next.relativePosition + tolerance) {
      warnings.push(`Potential overlap between durations at positions ${current.relativePosition} and ${next.relativePosition}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateArpeggiatedPattern(pattern: ArpeggiatedPattern): PatternValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!pattern.id || pattern.id.trim() === '') {
    errors.push('Pattern ID is required');
  }

  if (!pattern.name || pattern.name.trim() === '') {
    errors.push('Pattern name is required');
  }

  if (!pattern.sequence || pattern.sequence.trim() === '') {
    errors.push('Arpeggio sequence is required');
    return { isValid: false, errors, warnings };
  }

  const sequenceParts = pattern.sequence.split('-');
  const validValues = ['1', '3', '5', '7', '8', '9', '11', '13'];

  sequenceParts.forEach((part, index) => {
    if (!validValues.includes(part)) {
      errors.push(`Invalid sequence value at position ${index}: "${part}". Valid values: ${validValues.join(', ')}`);
    }
  });

  if (sequenceParts.length < 2) {
    warnings.push('Arpeggio pattern should have at least 2 notes for meaningful arpeggiation');
  }

  if (sequenceParts.length > 8) {
    warnings.push('Arpeggio pattern with more than 8 notes may be too dense');
  }

  if (!pattern.subdivision || !SUBDIVISION_BEATS[pattern.subdivision]) {
    errors.push(`Invalid subdivision: ${pattern.subdivision}`);
  }

  if (pattern.swingAmount !== undefined && (pattern.swingAmount < 0 || pattern.swingAmount > 1)) {
    errors.push(`Swing amount must be between 0 and 1, got ${pattern.swingAmount}`);
  }

  if (pattern.cycleLength !== undefined && pattern.cycleLength < 1) {
    errors.push(`Cycle length must be at least 1, got ${pattern.cycleLength}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateBrokenPattern(pattern: BrokenPattern): PatternValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!pattern.id || pattern.id.trim() === '') {
    errors.push('Pattern ID is required');
  }

  if (!pattern.name || pattern.name.trim() === '') {
    errors.push('Pattern name is required');
  }

  if (!pattern.rhythmTemplate || pattern.rhythmTemplate.length === 0) {
    errors.push('Broken pattern must have at least one rhythm element');
    return { isValid: false, errors, warnings };
  }

  if (!pattern.accentPlacement || pattern.accentPlacement.length === 0) {
    errors.push('Broken pattern must have accent placement');
    return { isValid: false, errors, warnings };
  }

  if (pattern.rhythmTemplate.length !== pattern.accentPlacement.length) {
    errors.push(
      `Rhythm template length (${pattern.rhythmTemplate.length}) must match accent placement length (${pattern.accentPlacement.length})`
    );
  }

  pattern.rhythmTemplate.forEach((rhythm, index) => {
    if (!rhythm.subdivision || !SUBDIVISION_BEATS[rhythm.subdivision]) {
      errors.push(`Invalid subdivision at index ${index}: ${rhythm.subdivision}`);
    }

    if (rhythm.beats <= 0) {
      errors.push(`Invalid beat count at index ${index}: ${rhythm.beats}`);
    }

    if (rhythm.relativePosition < 0 || rhythm.relativePosition > 1) {
      errors.push(`Invalid relative position at index ${index}: ${rhythm.relativePosition}`);
    }
  });

  pattern.accentPlacement.forEach((accent, index) => {
    if (accent < 0 || accent > 1) {
      errors.push(`Accent value at index ${index} must be between 0 and 1, got ${accent}`);
    }
  });

  if (pattern.microTimingOffset !== undefined && Math.abs(pattern.microTimingOffset) > 0.2) {
    warnings.push(`Large micro-timing offset (${pattern.microTimingOffset}s) may cause noticeable timing issues`);
  }

  if (pattern.dropProbability !== undefined) {
    if (pattern.dropProbability < 0 || pattern.dropProbability > 1) {
      errors.push(`Drop probability must be between 0 and 1, got ${pattern.dropProbability}`);
    }

    if (pattern.dropProbability > 0 && pattern.randomSeed === undefined) {
      warnings.push('Random note dropping enabled without a seed - behavior will be non-deterministic');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validatePattern(
  pattern: BlockPattern | ArpeggiatedPattern | BrokenPattern,
  type: 'block' | 'arpeggiated' | 'broken'
): PatternValidationResult {
  switch (type) {
    case 'block':
      return validateBlockPattern(pattern as BlockPattern);
    case 'arpeggiated':
      return validateArpeggiatedPattern(pattern as ArpeggiatedPattern);
    case 'broken':
      return validateBrokenPattern(pattern as BrokenPattern);
    default:
      return {
        isValid: false,
        errors: [`Unknown pattern type: ${type}`],
        warnings: []
      };
  }
}

export function calculateTotalDuration(durations: NoteDuration[], bpm: number, timeSignature: TimeSignatureType): number {
  const constraints = getMeasureConstraints(timeSignature);
  const secondsPerBeat = 60 / bpm;
  return constraints.beatsPerMeasure * secondsPerBeat;
}

export function getSubdivisionDuration(subdivision: Subdivision, bpm: number): number {
  const secondsPerBeat = 60 / bpm;
  const beats = SUBDIVISION_BEATS[subdivision] || 1;
  return beats * secondsPerBeat;
}

export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextBoolean(probability: number): boolean {
    return this.next() < probability;
  }
}

export function createSafeBlockPatternFallback(timeSignature: TimeSignatureType): BlockPattern {
  const constraints = getMeasureConstraints(timeSignature);

  if (timeSignature === '3/4') {
    return {
      id: 'fallback-3quarter',
      name: 'Fallback 3 Quarter',
      description: 'Safe fallback for 3/4',
      timeSignature: '3/4',
      durations: [
        { subdivision: 'quarter', beats: 1, relativePosition: 0 },
        { subdivision: 'quarter', beats: 1, relativePosition: 0.333 },
        { subdivision: 'quarter', beats: 1, relativePosition: 0.666 }
      ]
    };
  }

  if (timeSignature === '2/4') {
    return {
      id: 'fallback-2quarter',
      name: 'Fallback 2 Quarter',
      description: 'Safe fallback for 2/4',
      timeSignature: '2/4',
      durations: [
        { subdivision: 'quarter', beats: 1, relativePosition: 0 },
        { subdivision: 'quarter', beats: 1, relativePosition: 0.5 }
      ]
    };
  }

  if (timeSignature === '6/8') {
    return {
      id: 'fallback-2dotted',
      name: 'Fallback 2 Dotted Quarter',
      description: 'Safe fallback for 6/8',
      timeSignature: '6/8',
      durations: [
        { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
        { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.5 }
      ]
    };
  }

  return {
    id: 'fallback-4quarter',
    name: 'Fallback 4 Quarter',
    description: 'Safe fallback for 4/4',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ]
  };
}

export function createSafeArpeggiatedPatternFallback(): ArpeggiatedPattern {
  return {
    id: 'fallback-arp',
    name: 'Fallback Arpeggio',
    description: 'Safe fallback arpeggio pattern',
    sequence: '1-3-5-3',
    subdivision: 'sixteenth'
  };
}

export function createSafeBrokenPatternFallback(): BrokenPattern {
  return {
    id: 'fallback-broken',
    name: 'Fallback Broken',
    description: 'Safe fallback broken pattern',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 }
    ],
    accentPlacement: [1.0, 0.7]
  };
}
