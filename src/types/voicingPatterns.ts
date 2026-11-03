export type VoicingTechnique = 'block' | 'arpeggiated' | 'strum' | 'broken' | 'partial';

export type Subdivision = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth' | 'triplet-quarter' | 'triplet-eighth' | 'dotted-half' | 'dotted-quarter' | 'dotted-eighth';

export type TimeSignatureType = '2/4' | '3/4' | '4/4' | '5/4' | '6/8' | '7/8' | '9/8' | '12/8';

export interface NoteDuration {
  subdivision: Subdivision;
  beats: number;
  relativePosition: number;
}

export interface BlockPattern {
  id: string;
  name: string;
  description: string;
  timeSignature: TimeSignatureType;
  durations: NoteDuration[];
  isCustom?: boolean;
}

export interface ArpeggiatedPattern {
  id: string;
  name: string;
  description: string;
  sequence: string;
  subdivision: Subdivision;
  swingAmount?: number;
  velocityVariation?: boolean;
  cycleLength?: number;
  isCustom?: boolean;
}

export interface StrumPattern {
  id: string;
  name: string;
  description: string;
  direction: 'up' | 'down' | 'alternating' | 'mixed';
  rhythmTemplate: NoteDuration[];
  velocityCurve: number[];
  articulation: 'normal' | 'staccato' | 'muted' | 'legato';
  isCustom?: boolean;
}

export type ChordVoicePosition = 'root' | 'third' | 'fifth' | 'seventh' | 'ninth' | 'eleventh' | 'thirteenth';

export interface BrokenChordPattern {
  id: string;
  name: string;
  description: string;
  firstNote: ChordVoicePosition;
  secondNotePair: [ChordVoicePosition, ChordVoicePosition];
  rhythmTemplate: NoteDuration[];
  accentPattern: number[];
  isCustom?: boolean;
}

export interface BrokenPattern {
  id: string;
  name: string;
  description: string;
  rhythmTemplate: NoteDuration[];
  accentPlacement: number[];
  microTimingOffset?: number;
  dropProbability?: number;
  randomSeed?: number;
  isCustom?: boolean;
}

export interface PartialVoicingOptions {
  mode: 'root-third' | 'root-fifth' | 'third-fifth' | 'root-only' | 'shell' | 'upper-structure' | 'rootless';
  splitVoicing?: boolean;
  voiceLeadingPreference?: 'smooth' | 'contrary' | 'oblique';
}

export interface VoicingPatternLibrary {
  blockPatterns: BlockPattern[];
  arpeggiatedPatterns: ArpeggiatedPattern[];
  strumPatterns: StrumPattern[];
  brokenPatterns: BrokenPattern[];
  brokenChordPatterns: BrokenChordPattern[];
}

export interface ScheduledNote {
  note: string;
  startTime: number;
  duration: number;
  velocity: number;
}

export interface PatternValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface VoicingEngineConfig {
  deterministic: boolean;
  randomSeed?: number;
  enableLogging: boolean;
  enableTelemetry: boolean;
}

export interface MeasureConstraints {
  timeSignature: TimeSignatureType;
  beatsPerMeasure: number;
  beatUnit: number;
  measureDurationSeconds: number;
}

export interface TimingTelemetry {
  scheduledNotes: number;
  totalDuration: number;
  expectedDuration: number;
  drift: number;
  timestamp: number;
}

export interface UserVoicingPattern {
  id?: string;
  user_id: string;
  pattern_type: VoicingTechnique;
  pattern_name: string;
  pattern_data: BlockPattern | ArpeggiatedPattern | StrumPattern | BrokenPattern | BrokenChordPattern;
  created_at?: string;
  updated_at?: string;
}

export interface AdvancedStrumControls {
  densityMultiplier: number;
  swingAmount: number;
  syncopationShift: number;
  ghostNoteIntensity: number;
  accentPattern: 'none' | 'downbeats' | 'offbeats' | 'alternating' | 'custom';
  customAccents?: number[];
}
