import { RhythmPattern } from '../types/arpeggioSystem';

export const RHYTHM_PATTERNS: RhythmPattern[] = [
  {
    id: 'rhythm-quarter',
    name: '♩ Quarter Notes',
    description: 'Four notes per measure',
    type: 'even',
    subdivision: 'quarter',
    durations: [0.25, 0.25, 0.25, 0.25]
  },
  {
    id: 'rhythm-eighth',
    name: '♪ Eighth Notes',
    description: 'Eight notes per measure',
    type: 'even',
    subdivision: 'eighth',
    durations: [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125]
  },
  {
    id: 'rhythm-swing-eighth',
    name: '♪♪ Swing Eighths',
    description: 'Swung eighth notes',
    type: 'swing',
    subdivision: 'eighth',
    durations: [0.125, 0.125, 0.125, 0.125],
    swingAmount: 0.66
  },
  {
    id: 'rhythm-dotted-long-short',
    name: '♩. ♬ Dotted Long-Short',
    description: 'Dotted eighth + sixteenth',
    type: 'dotted',
    subdivision: 'sixteenth',
    durations: [0.1875, 0.0625]
  }
];

export function getRhythmsByType(type: string): RhythmPattern[] {
  return RHYTHM_PATTERNS.filter(rhythm => rhythm.type === type);
}
