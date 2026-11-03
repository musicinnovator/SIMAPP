export type ArpeggioSequence = {
  id: string;
  name: string;
  description: string;
  notes: string;
  isLong: boolean;
  length: number;
  category: 'short' | 'medium' | 'long' | 'continuous';
};

export type RhythmType =
  | 'even'
  | 'dotted'
  | 'swing'
  | 'shuffle'
  | 'syncopated'
  | 'triplet'
  | 'combination'
  | 'custom';

export type RhythmPattern = {
  id: string;
  name: string;
  description: string;
  type: RhythmType;
  subdivision: 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth' | 'triplet-eighth' | 'triplet-quarter';
  durations: number[];
  swingAmount?: number;
  accentPattern?: number[];
  isCustom?: boolean;
};

export type DistributionMode =
  | 'continuous'
  | 'even-split'
  | 'grouped'
  | 'cascade'
  | 'progressive'
  | 'custom';

export type DistributionConfig = {
  mode: DistributionMode;
  enabled: boolean;
  customSplitPoints?: number[];
  groupSize?: number;
  windowSize?: number;
  buildSteps?: number;
};

export type ArpeggioSystemConfig = {
  sequence: ArpeggioSequence;
  rhythm: RhythmPattern;
  distribution: DistributionConfig;
  restrictIncompatible: boolean;
};

export type CompatibilityCheck = {
  isCompatible: boolean;
  warnings: string[];
  suggestions: string[];
};

export type ChordProgressionSegment = {
  chordIndex: number;
  notes: string;
  startOffset: number;
  endOffset: number;
};

export type ToastNotification = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration: number;
  autoClose: boolean;
};
