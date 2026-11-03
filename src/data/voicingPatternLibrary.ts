import { BlockPattern, ArpeggiatedPattern, BrokenPattern, StrumPattern, BrokenChordPattern } from '../types/voicingPatterns';

export const BLOCK_PATTERNS: BlockPattern[] = [
  {
    id: 'block-4quarter',
    name: '4 Quarter Notes',
    description: 'Standard 4 quarter note chords per measure (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ]
  },
  {
    id: 'block-2half',
    name: '2 Half Notes',
    description: 'Two half-note chords per measure (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'half', beats: 2, relativePosition: 0 },
      { subdivision: 'half', beats: 2, relativePosition: 0.5 }
    ]
  },
  {
    id: 'block-whole',
    name: 'Whole Note',
    description: 'Single whole-note chord per measure (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'whole', beats: 4, relativePosition: 0 }
    ]
  },
  {
    id: 'block-dotted-half-quarter',
    name: 'Dotted Half + Quarter',
    description: 'One dotted half note followed by quarter note (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'dotted-half', beats: 3, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ]
  },
  {
    id: 'block-half-2quarter',
    name: 'Half + 2 Quarters',
    description: 'One half note followed by two quarter notes (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'half', beats: 2, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ]
  },
  {
    id: 'block-quarter-half-quarter',
    name: 'Quarter + Half + Quarter',
    description: 'Quarter, half, quarter pattern (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'half', beats: 2, relativePosition: 0.25 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ]
  },
  {
    id: 'block-2quarter-half',
    name: '2 Quarters + Half',
    description: 'Two quarter notes followed by half note (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 },
      { subdivision: 'half', beats: 2, relativePosition: 0.5 }
    ]
  },
  {
    id: 'block-8eighth',
    name: '8 Eighth Notes',
    description: 'Eight eighth-note chords per measure (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.625 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.75 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.875 }
    ]
  },
  {
    id: 'block-syncopated',
    name: 'Syncopated (Off-beat)',
    description: 'Quarter notes on off-beats (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0.125 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.375 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.625 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.875 }
    ]
  },
  {
    id: 'block-3quarter-waltz',
    name: '3 Quarter Notes (Waltz)',
    description: 'Three quarter note chords per measure (3/4)',
    timeSignature: '3/4',
    durations: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.333 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.666 }
    ]
  },
  {
    id: 'block-dotted-half-waltz',
    name: 'Dotted Half (Waltz)',
    description: 'Single dotted half note per measure (3/4)',
    timeSignature: '3/4',
    durations: [
      { subdivision: 'dotted-half', beats: 3, relativePosition: 0 }
    ]
  },
  {
    id: 'block-half-quarter-waltz',
    name: 'Half + Quarter (Waltz)',
    description: 'Half note followed by quarter note (3/4)',
    timeSignature: '3/4',
    durations: [
      { subdivision: 'half', beats: 2, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.666 }
    ]
  },
  {
    id: 'block-2quarter-march',
    name: '2 Quarter Notes (March)',
    description: 'Two quarter note chords per measure (2/4)',
    timeSignature: '2/4',
    durations: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 }
    ]
  },
  {
    id: 'block-half-march',
    name: 'Half Note (March)',
    description: 'Single half note chord per measure (2/4)',
    timeSignature: '2/4',
    durations: [
      { subdivision: 'half', beats: 2, relativePosition: 0 }
    ]
  },
  {
    id: 'block-6eighth-68',
    name: '6 Eighth Notes (6/8)',
    description: 'Six eighth-note chords per measure (6/8)',
    timeSignature: '6/8',
    durations: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.166 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.333 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.666 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.833 }
    ]
  },
  {
    id: 'block-2dotted-quarter-68',
    name: '2 Dotted Quarters (6/8)',
    description: 'Two dotted quarter notes per measure (6/8)',
    timeSignature: '6/8',
    durations: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.5 }
    ]
  },

  // NEW: 4/4 Dotted Rhythm Patterns
  {
    id: 'block-dotted-quarter-eighth-44',
    name: 'Dotted Quarter + Eighth (4/4)',
    description: 'Dotted quarter followed by eighth note pattern (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.875 }
    ]
  },
  {
    id: 'block-eighth-dotted-quarter-44',
    name: 'Eighth + Dotted Quarter (4/4)',
    description: 'Eighth note followed by dotted quarter pattern (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.625 }
    ]
  },
  {
    id: 'block-dotted-half-44',
    name: 'Dotted Half + Eighth Rest (4/4)',
    description: 'Dotted half note with implied eighth rest (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'dotted-half', beats: 3, relativePosition: 0 }
    ]
  },
  {
    id: 'block-16th-dotted-eighth-44',
    name: 'Sixteenth + Dotted Eighth (4/4)',
    description: 'Quick sixteenth followed by dotted eighth (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0.0625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0.3125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.5 },
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0.5625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.75 },
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0.8125 }
    ]
  },

  // NEW: 3/4 Dotted Rhythm Patterns
  {
    id: 'block-dotted-quarter-eighth-34',
    name: 'Dotted Quarter + Eighth (3/4)',
    description: 'Dotted quarter + eighth pattern in waltz time (3/4)',
    timeSignature: '3/4',
    durations: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.666 }
    ]
  },
  {
    id: 'block-quarter-dotted-quarter-34',
    name: 'Quarter + Dotted Quarter (3/4)',
    description: 'Quarter note followed by dotted quarter (3/4)',
    timeSignature: '3/4',
    durations: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.333 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.833 }
    ]
  },
  {
    id: 'block-6eighth-34',
    name: '6 Eighth Notes (3/4)',
    description: 'Six eighth notes in waltz time (3/4)',
    timeSignature: '3/4',
    durations: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.166 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.333 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.666 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.833 }
    ]
  },
  {
    id: 'block-dotted-eighth-16th-34',
    name: 'Dotted Eighth + 16th (3/4)',
    description: 'Dotted eighth + sixteenth combinations (3/4)',
    timeSignature: '3/4',
    durations: [
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0.25 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.4375 },
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0.5 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.6875 }
    ]
  },

  // NEW: 5/4 Time Signature Patterns
  {
    id: 'block-5quarter-54',
    name: '5 Quarter Notes (5/4)',
    description: 'Five quarter note chords per measure (5/4)',
    timeSignature: '5/4',
    durations: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.2 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.4 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.6 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.8 }
    ]
  },
  {
    id: 'block-3-2-54',
    name: '3+2 Pattern (5/4)',
    description: 'Three quarters + two quarters grouping (5/4)',
    timeSignature: '5/4',
    durations: [
      { subdivision: 'dotted-half', beats: 3, relativePosition: 0 },
      { subdivision: 'half', beats: 2, relativePosition: 0.6 }
    ]
  },
  {
    id: 'block-2-3-54',
    name: '2+3 Pattern (5/4)',
    description: 'Two quarters + three quarters grouping (5/4)',
    timeSignature: '5/4',
    durations: [
      { subdivision: 'half', beats: 2, relativePosition: 0 },
      { subdivision: 'dotted-half', beats: 3, relativePosition: 0.4 }
    ]
  },

  // NEW: 7/8 Time Signature Patterns
  {
    id: 'block-7eighth-78',
    name: '7 Eighth Notes (7/8)',
    description: 'Seven eighth note chords per measure (7/8)',
    timeSignature: '7/8',
    durations: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.142 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.285 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.428 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.571 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.714 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.857 }
    ]
  },
  {
    id: 'block-3-2-2-78',
    name: '3+2+2 Pattern (7/8)',
    description: 'Three eighth + two eighth + two eighth grouping (7/8)',
    timeSignature: '7/8',
    durations: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.428 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.714 }
    ]
  },
  {
    id: 'block-2-2-3-78',
    name: '2+2+3 Pattern (7/8)',
    description: 'Two eighth + two eighth + three eighth grouping (7/8)',
    timeSignature: '7/8',
    durations: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.285 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.571 }
    ]
  },

  // NEW: 3/8 Time Signature Patterns
  {
    id: 'block-3eighth-38',
    name: '3 Eighth Notes (3/8)',
    description: 'Three eighth note chords per measure (3/8)',
    timeSignature: '3/8',
    durations: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.333 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.666 }
    ]
  },
  {
    id: 'block-dotted-quarter-38',
    name: 'Dotted Quarter (3/8)',
    description: 'Single dotted quarter note per measure (3/8)',
    timeSignature: '3/8',
    durations: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 }
    ]
  },

  // NEW: 12/8 Time Signature Patterns
  {
    id: 'block-12eighth-128',
    name: '12 Eighth Notes (12/8)',
    description: 'Twelve eighth note chords per measure (12/8)',
    timeSignature: '12/8',
    durations: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.083 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.166 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.333 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.416 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.583 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.666 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.75 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.833 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.916 }
    ]
  },
  {
    id: 'block-4dotted-quarter-128',
    name: '4 Dotted Quarters (12/8)',
    description: 'Four dotted quarter notes per measure (12/8)',
    timeSignature: '12/8',
    durations: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.25 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.5 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.75 }
    ]
  },
  {
    id: 'block-dotted-half-128',
    name: 'Dotted Half (12/8)',
    description: 'Two dotted half notes per measure (12/8)',
    timeSignature: '12/8',
    durations: [
      { subdivision: 'dotted-half', beats: 3, relativePosition: 0 },
      { subdivision: 'dotted-half', beats: 3, relativePosition: 0.5 }
    ]
  },

  // NEW: Triplet Block Patterns (4/4)
  {
    id: 'block-triplet-quarter-44',
    name: 'Quarter Note Triplets (4/4)',
    description: 'Four triplet quarter note groups per measure (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.166 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.333 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.5 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.666 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.833 }
    ]
  },
  {
    id: 'block-triplet-eighth-44',
    name: 'Eighth Note Triplets (4/4)',
    description: 'Eighth note triplet pattern per measure (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.083 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.166 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.25 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.333 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.416 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.5 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.583 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.666 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.75 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.833 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.916 }
    ]
  },
  {
    id: 'block-mixed-duple-triple-44',
    name: 'Mixed Duple/Triple (4/4)',
    description: 'Alternates between duplet and triplet feel (4/4)',
    timeSignature: '4/4',
    durations: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.25 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.416 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.583 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ]
  },

  // NEW: Triplet Block Patterns (3/4)
  {
    id: 'block-triplet-quarter-34',
    name: 'Quarter Triplets (3/4)',
    description: 'Quarter note triplets in waltz time (3/4)',
    timeSignature: '3/4',
    durations: [
      { subdivision: 'triplet-quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'triplet-quarter', beats: 1, relativePosition: 0.333 },
      { subdivision: 'triplet-quarter', beats: 1, relativePosition: 0.666 }
    ]
  },
  {
    id: 'block-triplet-eighth-34',
    name: 'Eighth Triplets (3/4)',
    description: 'Eighth note triplets in waltz time (3/4)',
    timeSignature: '3/4',
    durations: [
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.111 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.222 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.333 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.444 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.555 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.666 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.777 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.888 }
    ]
  }
];

export const ARPEGGIATED_PATTERNS: ArpeggiatedPattern[] = [
  {
    id: 'arp-1353',
    name: 'Up and Back (1-3-5-3)',
    description: 'Root up to fifth and back to third',
    sequence: '1-3-5-3',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-1535',
    name: 'Root Fifth Third Fifth (1-5-3-5)',
    description: 'Alternating root-fifth-third pattern',
    sequence: '1-5-3-5',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-1351',
    name: 'Up and Down (1-3-5-1)',
    description: 'Ascending then back to root',
    sequence: '1-3-5-1',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-1531',
    name: 'Root Fifth Third Root (1-5-3-1)',
    description: 'Wide intervals returning to root',
    sequence: '1-5-3-1',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-3153',
    name: 'Third Root Fifth Third (3-1-5-3)',
    description: 'Starting on third',
    sequence: '3-1-5-3',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-3515',
    name: 'Third Fifth Root Fifth (3-5-1-5)',
    description: 'Third up to root',
    sequence: '3-5-1-5',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-5313',
    name: 'Fifth Down (5-3-1-3)',
    description: 'Descending from fifth',
    sequence: '5-3-1-3',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-5135',
    name: 'Fifth Root Third Fifth (5-1-3-5)',
    description: 'Wide descending to ascending',
    sequence: '5-1-3-5',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-135',
    name: 'Simple Ascending (1-3-5)',
    description: 'Basic triad ascending',
    sequence: '1-3-5',
    subdivision: 'eighth'
  },
  {
    id: 'arp-153',
    name: 'Root Fifth Third (1-5-3)',
    description: 'Skip third, then down',
    sequence: '1-5-3',
    subdivision: 'eighth'
  },
  {
    id: 'arp-315',
    name: 'Third Root Fifth (3-1-5)',
    description: 'Down then up',
    sequence: '3-1-5',
    subdivision: 'eighth'
  },
  {
    id: 'arp-351',
    name: 'Third Fifth Root (3-5-1)',
    description: 'Ascending to octave root',
    sequence: '3-5-1',
    subdivision: 'eighth'
  },
  {
    id: 'arp-513',
    name: 'Simple Descending (5-1-3)',
    description: 'Fifth down to third',
    sequence: '5-1-3',
    subdivision: 'eighth'
  },
  {
    id: 'arp-531',
    name: 'Full Descending (5-3-1)',
    description: 'Fifth down to root',
    sequence: '5-3-1',
    subdivision: 'eighth'
  },
  {
    id: 'arp-1358',
    name: 'Octave Arpeggio (1-3-5-8)',
    description: 'Root to octave ascending',
    sequence: '1-3-5-8',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-1585',
    name: 'Wide Octave (1-5-8-5)',
    description: 'Root-fifth-octave pattern',
    sequence: '1-5-8-5',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-8531',
    name: 'Octave Descending (8-5-3-1)',
    description: 'Full descending from octave',
    sequence: '8-5-3-1',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-13531',
    name: 'Extended Up/Down (1-3-5-3-1)',
    description: 'Five-note ascending/descending',
    sequence: '1-3-5-3-1',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-15351',
    name: 'Alternating Extended (1-5-3-5-1)',
    description: 'Five-note alternating pattern',
    sequence: '1-5-3-5-1',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-13513',
    name: 'Continuous Ascending (1-3-5-1-3)',
    description: 'Continuous upward motion',
    sequence: '1-3-5-1-3',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-triplet-135',
    name: 'Triplet Ascending (1-3-5)',
    description: 'Ascending triad in triplets',
    sequence: '1-3-5',
    subdivision: 'triplet-eighth'
  },
  {
    id: 'arp-triplet-531',
    name: 'Triplet Descending (5-3-1)',
    description: 'Descending triad in triplets',
    sequence: '5-3-1',
    subdivision: 'triplet-eighth'
  },
  {
    id: 'arp-swing-1353',
    name: 'Swing Up/Back (1-3-5-3)',
    description: 'Swung sixteenth notes',
    sequence: '1-3-5-3',
    subdivision: 'sixteenth',
    swingAmount: 0.66
  },
  {
    id: 'arp-velocity-135',
    name: 'Dynamic Ascending (1-3-5)',
    description: 'Ascending with velocity variation',
    sequence: '1-3-5',
    subdivision: 'eighth',
    velocityVariation: true
  },
  // SLOW & SPARSE PATTERNS (Better for hearing differences)
  {
    id: 'arp-slow-13',
    name: 'Slow Root-Third (1-3)',
    description: 'Just two notes - very simple and clear',
    sequence: '1-3',
    subdivision: 'quarter'
  },
  {
    id: 'arp-slow-15',
    name: 'Slow Root-Fifth (1-5)',
    description: 'Just root and fifth - power chord arpeggio',
    sequence: '1-5',
    subdivision: 'quarter'
  },
  {
    id: 'arp-slow-135',
    name: 'Slow Ascending (1-3-5)',
    description: 'Basic triad - very slow and clear',
    sequence: '1-3-5',
    subdivision: 'quarter'
  },
  {
    id: 'arp-slow-531',
    name: 'Slow Descending (5-3-1)',
    description: 'Descending - very slow and clear',
    sequence: '5-3-1',
    subdivision: 'quarter'
  },
  {
    id: 'arp-whole-1',
    name: 'Single Root Note',
    description: 'Just play the root - simplest option',
    sequence: '1',
    subdivision: 'whole'
  },
  {
    id: 'arp-whole-15',
    name: 'Root + Fifth (Sustained)',
    description: 'Two notes held throughout measure',
    sequence: '1-5',
    subdivision: 'half'
  },
  // FULLER PATTERNS (More notes to fill space)
  {
    id: 'arp-full-1351351',
    name: 'Continuous Triad (1-3-5-1-3-5-1)',
    description: 'Seven notes - keeps playing throughout',
    sequence: '1-3-5-1-3-5-1',
    subdivision: 'eighth'
  },
  {
    id: 'arp-full-5315315',
    name: 'Continuous Descending (5-3-1-5-3-1-5)',
    description: 'Seven notes descending continuously',
    sequence: '5-3-1-5-3-1-5',
    subdivision: 'eighth'
  },
  {
    id: 'arp-rolling-13513513',
    name: 'Rolling Arpeggio (1-3-5-1-3-5-1-3)',
    description: 'Eight notes - never stops',
    sequence: '1-3-5-1-3-5-1-3',
    subdivision: 'eighth'
  },
  // RHYTHMIC PATTERNS
  {
    id: 'arp-rhythm-1-1-135',
    name: 'Rhythmic: Root Root Triad',
    description: 'Two roots, then ascending triad',
    sequence: '1-1-1-3-5',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-rhythm-135-1-1',
    name: 'Rhythmic: Triad Root Root',
    description: 'Ascending triad, then two roots',
    sequence: '1-3-5-1-1',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-alberti',
    name: 'Alberti Bass (1-5-3-5)',
    description: 'Classic piano pattern',
    sequence: '1-5-3-5',
    subdivision: 'sixteenth'
  },
  {
    id: 'arp-waltz',
    name: 'Waltz Pattern (1-3-5)',
    description: 'One note per beat in 3/4 feel',
    sequence: '1-3-5',
    subdivision: 'dotted-quarter'
  }
];

export const STRUM_PATTERNS: StrumPattern[] = [
  {
    id: 'strum-down-quarter',
    name: 'Downstroke Quarters',
    description: 'Basic downward strum on quarter notes',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ],
    velocityCurve: [0.95, 0.7, 0.85, 0.7],
    articulation: 'normal'
  },
  {
    id: 'strum-up-eighth',
    name: 'Upstroke Eighths',
    description: 'Upward strum on eighth notes',
    direction: 'up',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.625 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.75 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.875 }
    ],
    velocityCurve: [0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95],
    articulation: 'normal'
  },
  {
    id: 'strum-alternating',
    name: 'Alternating Down-Up',
    description: 'Classic alternating down-up strum pattern',
    direction: 'alternating',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.625 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.75 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.875 }
    ],
    velocityCurve: [0.95, 0.6, 0.85, 0.6, 0.9, 0.65, 0.85, 0.6],
    articulation: 'normal'
  },
  {
    id: 'strum-folk-pattern',
    name: 'Folk Strum (D-DU-UDU)',
    description: 'Classic folk down-down-up-up-down-up pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.625 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.75 }
    ],
    velocityCurve: [0.95, 0.85, 0.65, 0.7, 0.85, 0.7, 0.75],
    articulation: 'normal'
  },
  {
    id: 'strum-reggae-upstroke',
    name: 'Reggae Upstroke',
    description: 'Syncopated upstrokes on offbeats',
    direction: 'up',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.625 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.875 }
    ],
    velocityCurve: [0.7, 0.8, 0.7, 0.8],
    articulation: 'staccato'
  },
  {
    id: 'strum-brush',
    name: 'Fast Brush Strum',
    description: 'Quick sequential notes like brush stroke',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.0625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 }
    ],
    velocityCurve: [0.8, 0.85, 0.9, 0.95],
    articulation: 'normal'
  },
  {
    id: 'strum-muted-funk',
    name: 'Muted Funk Strum',
    description: 'Percussive muted strum pattern',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.375 }
    ],
    velocityCurve: [0.6, 0.4, 0.7, 0.4],
    articulation: 'muted'
  },
  {
    id: 'strum-travis-picking',
    name: 'Travis Picking Pattern',
    description: 'Alternating bass with treble notes',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.75 }
    ],
    velocityCurve: [0.9, 0.6, 0.8, 0.6],
    articulation: 'normal'
  },
  {
    id: 'strum-fingerpick-arpegio',
    name: 'Fingerpicking Arpeggio',
    description: 'Classical fingerpicking pattern',
    direction: 'up',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.375 }
    ],
    velocityCurve: [0.7, 0.75, 0.8, 0.85],
    articulation: 'legato'
  },
  {
    id: 'strum-bossa-nova',
    name: 'Bossa Nova Strum',
    description: 'Syncopated Latin strum pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.1875 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.625 }
    ],
    velocityCurve: [0.8, 0.6, 0.7, 0.6],
    articulation: 'normal'
  },
  {
    id: 'strum-triplet-roll',
    name: 'Triplet Roll Strum',
    description: 'Rolling triplet strum pattern',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.111 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.222 }
    ],
    velocityCurve: [0.8, 0.85, 0.9],
    articulation: 'normal'
  },
  {
    id: 'strum-ska-upbeat',
    name: 'Ska Upbeat Chops',
    description: 'Staccato upstrokes on 2 and 4',
    direction: 'up',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ],
    velocityCurve: [0.9, 0.9],
    articulation: 'staccato'
  },
  {
    id: 'strum-country-boom-chick',
    name: 'Country Boom-Chick',
    description: 'Bass note followed by chord chop',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.875 }
    ],
    velocityCurve: [0.9, 0.6, 0.9, 0.6],
    articulation: 'normal'
  },
  {
    id: 'strum-flamenco-rasgueado',
    name: 'Flamenco Rasgueado',
    description: 'Rapid outward finger roll',
    direction: 'up',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.05 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.15 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.2 }
    ],
    velocityCurve: [0.7, 0.75, 0.8, 0.85, 0.9],
    articulation: 'normal'
  },
  {
    id: 'strum-palm-muted-drive',
    name: 'Palm Muted Drive',
    description: 'Aggressive muted downstrokes',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 }
    ],
    velocityCurve: [0.9, 0.9, 0.9, 0.9],
    articulation: 'muted'
  },
  {
    id: 'strum-ballad-slow',
    name: 'Slow Ballad Strum',
    description: 'Gentle whole note strums',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'half', beats: 2, relativePosition: 0 },
      { subdivision: 'half', beats: 2, relativePosition: 0.5 }
    ],
    velocityCurve: [0.7, 0.7],
    articulation: 'legato'
  },
  {
    id: 'strum-16th-metal-chug',
    name: '16th Note Metal Chug',
    description: 'Fast 16th note palm-muted pattern',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.0625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.3125 }
    ],
    velocityCurve: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
    articulation: 'muted'
  },
  {
    id: 'strum-waltz-34',
    name: 'Waltz 3/4 Strum',
    description: 'Classic waltz bass-chord-chord pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.333 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.666 }
    ],
    velocityCurve: [0.9, 0.6, 0.6],
    articulation: 'normal'
  },
  {
    id: 'strum-shuffle-swing',
    name: 'Shuffle Swing Strum',
    description: 'Swung eighth note strum',
    direction: 'alternating',
    rhythmTemplate: [
      { subdivision: 'triplet-eighth', beats: 0.666, relativePosition: 0 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.166 },
      { subdivision: 'triplet-eighth', beats: 0.666, relativePosition: 0.333 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.5 }
    ],
    velocityCurve: [0.9, 0.6, 0.8, 0.6],
    articulation: 'normal'
  },
  {
    id: 'strum-dotted-syncopated',
    name: 'Dotted Syncopated Strum',
    description: 'Dotted rhythm with syncopation',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0.25 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.4375 }
    ],
    velocityCurve: [0.9, 0.6, 0.8, 0.6],
    articulation: 'normal'
  },
  {
    id: 'strum-clawhammer',
    name: 'Clawhammer Banjo Style',
    description: 'Down-thumb-up banjo pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 }
    ],
    velocityCurve: [0.8, 0.9, 0.7],
    articulation: 'normal'
  },
  {
    id: 'strum-arpeggiated-cascade',
    name: 'Arpeggiated Cascade',
    description: 'Cascading notes from low to high',
    direction: 'up',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.0625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 }
    ],
    velocityCurve: [0.6, 0.7, 0.75, 0.8, 0.85],
    articulation: 'legato'
  },
  {
    id: 'strum-power-chord-eighth',
    name: 'Power Chord Eighth Notes',
    description: 'Driving eighth note power chords',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.625 }
    ],
    velocityCurve: [0.95, 0.95, 0.95, 0.95, 0.95, 0.95],
    articulation: 'staccato'
  },
  {
    id: 'strum-fingerstyle-folk',
    name: 'Fingerstyle Folk Pattern',
    description: 'Thumb bass with finger melody',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 }
    ],
    velocityCurve: [0.9, 0.6, 0.7, 0.8],
    articulation: 'normal'
  },
  {
    id: 'strum-latin-montuno',
    name: 'Latin Montuno Pattern',
    description: 'Syncopated Latin rhythm',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.1875 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.3125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 }
    ],
    velocityCurve: [0.9, 0.7, 0.8, 0.7],
    articulation: 'staccato'
  },
  {
    id: 'strum-acoustic-ballad-pattern',
    name: 'Acoustic Ballad Pattern',
    description: 'Gentle fingerpicked pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.166 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.333 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.666 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.833 }
    ],
    velocityCurve: [0.7, 0.5, 0.6, 0.7, 0.5, 0.6],
    articulation: 'legato'
  },
  {
    id: 'strum-gypsy-jazz-la-pompe',
    name: 'Gypsy Jazz La Pompe',
    description: 'Django-style rhythm accompaniment',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 }
    ],
    velocityCurve: [0.9, 0.6, 0.6],
    articulation: 'staccato'
  },
  {
    id: 'strum-blues-shuffle-pattern',
    name: 'Blues Shuffle Pattern',
    description: 'Swung blues rhythm',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'triplet-eighth', beats: 0.666, relativePosition: 0 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.166 },
      { subdivision: 'triplet-eighth', beats: 0.666, relativePosition: 0.333 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.5 },
      { subdivision: 'triplet-eighth', beats: 0.666, relativePosition: 0.666 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.833 }
    ],
    velocityCurve: [0.9, 0.5, 0.8, 0.5, 0.9, 0.5],
    articulation: 'normal'
  },
  {
    id: 'strum-rapid-tremolo',
    name: 'Rapid Tremolo Strum',
    description: 'Very fast alternating strums',
    direction: 'alternating',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.0625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.3125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.375 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.4375 }
    ],
    velocityCurve: [0.8, 0.6, 0.8, 0.6, 0.8, 0.6, 0.8, 0.6],
    articulation: 'normal'
  },
  {
    id: 'strum-percussive-slap',
    name: 'Percussive Slap Strum',
    description: 'Percussive slapping technique',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 }
    ],
    velocityCurve: [0.95, 0.95, 0.7],
    articulation: 'staccato'
  },
  {
    id: 'strum-alternating-bass',
    name: 'Alternating Bass Strum',
    description: 'Bass alternation with chord hits',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.375 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.625 }
    ],
    velocityCurve: [0.9, 0.6, 0.9, 0.6],
    articulation: 'normal'
  },
  // NEW BASIC STRUMS (10+ additions)
  {
    id: 'strum-down-whole',
    name: 'Single Downstroke Whole',
    description: 'Single downward strum held for whole measure',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'whole', beats: 4, relativePosition: 0 }
    ],
    velocityCurve: [0.9],
    articulation: 'normal'
  },
  {
    id: 'strum-down-half',
    name: 'Double Downstroke Halves',
    description: 'Two downward strums on half notes',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'half', beats: 2, relativePosition: 0 },
      { subdivision: 'half', beats: 2, relativePosition: 0.5 }
    ],
    velocityCurve: [0.95, 0.85],
    articulation: 'normal'
  },
  {
    id: 'strum-alternating-quarters',
    name: 'Alternating Quarter Notes',
    description: 'Down-Up-Down-Up quarter note pattern',
    direction: 'alternating',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ],
    velocityCurve: [0.95, 0.65, 0.9, 0.65],
    articulation: 'normal'
  },
  {
    id: 'strum-down-eighth-continuous',
    name: 'Continuous Eighth Downstrokes',
    description: 'All downward strums on eighth notes',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.625 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.75 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.875 }
    ],
    velocityCurve: [0.9, 0.85, 0.9, 0.85, 0.9, 0.85, 0.9, 0.85],
    articulation: 'normal'
  },
  {
    id: 'strum-up-continuous',
    name: 'Continuous Eighth Upstrokes',
    description: 'All upward strums on eighth notes',
    direction: 'up',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.625 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.75 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.875 }
    ],
    velocityCurve: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95],
    articulation: 'normal'
  },
  {
    id: 'strum-down-down-up-syncopated',
    name: 'Syncopated Down-Down-Up',
    description: 'Two downstrokes followed by upstroke pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 }
    ],
    velocityCurve: [0.95, 0.85, 0.65, 0.9],
    articulation: 'normal'
  },
  {
    id: 'strum-down-up-up-down',
    name: 'Down-Up-Up-Down Pattern',
    description: 'Alternating with double upstrokes',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 }
    ],
    velocityCurve: [0.95, 0.6, 0.65, 0.85],
    articulation: 'normal'
  },
  {
    id: 'strum-down-rest-down-rest',
    name: 'Steady Down-Rest Pattern',
    description: 'Downstrokes with rests in between',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 }
    ],
    velocityCurve: [0.95, 0.9],
    articulation: 'staccato'
  },
  {
    id: 'strum-accented-down',
    name: 'Accented Downstroke Pattern',
    description: 'Strong-Weak-Medium-Weak accent pattern',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ],
    velocityCurve: [0.95, 0.6, 0.8, 0.6],
    articulation: 'normal'
  },
  {
    id: 'strum-down-triplet',
    name: 'Simple Triplet Downstrokes',
    description: 'Downward strums in triplet feel',
    direction: 'down',
    rhythmTemplate: [
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.166 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.333 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.5 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.666 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.833 }
    ],
    velocityCurve: [0.9, 0.85, 0.8, 0.9, 0.85, 0.8],
    articulation: 'normal'
  },
  {
    id: 'strum-alternating-sixteenth',
    name: 'Sixteenth Note Alternating',
    description: 'Fast alternating down-up sixteenth notes',
    direction: 'alternating',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.0625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.3125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.375 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.4375 }
    ],
    velocityCurve: [0.9, 0.6, 0.85, 0.6, 0.9, 0.6, 0.85, 0.6],
    articulation: 'normal'
  },
  {
    id: 'strum-up-quarter',
    name: 'Quarter Note Upstrokes',
    description: 'Upward strums on quarter notes',
    direction: 'up',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ],
    velocityCurve: [0.7, 0.75, 0.8, 0.85],
    articulation: 'normal'
  },
  // NEW FOLK/ACOUSTIC STRUMS (10+ additions)
  {
    id: 'strum-folk-pima-fingerpick',
    name: 'Basic PIMA Fingerpick',
    description: 'Classical PIMA (thumb-index-middle-ring) pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.0625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.3125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.375 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.4375 }
    ],
    velocityCurve: [0.9, 0.6, 0.65, 0.7, 0.9, 0.6, 0.65, 0.7],
    articulation: 'normal'
  },
  {
    id: 'strum-folk-alternating-bass',
    name: 'Alternating Bass Fingerstyle',
    description: 'Bass notes alternating with chord',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.6875 }
    ],
    velocityCurve: [0.9, 0.6, 0.65, 0.7, 0.85, 0.6, 0.65],
    articulation: 'normal'
  },
  {
    id: 'strum-folk-carter-family',
    name: 'Carter Family Strum',
    description: 'Classic Carter Family bass-strum pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
    ],
    velocityCurve: [0.9, 0.7, 0.65, 0.85, 0.8],
    articulation: 'normal'
  },
  {
    id: 'strum-folk-boom-chuck',
    name: 'Boom-Chuck Country',
    description: 'Classic country boom-chuck pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.75 }
    ],
    velocityCurve: [0.95, 0.65, 0.9, 0.65],
    articulation: 'normal'
  },
  {
    id: 'strum-folk-flatpick-run',
    name: 'Flatpicking G-Run Style',
    description: 'Bluegrass flatpicking pattern',
    direction: 'alternating',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.3125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 }
    ],
    velocityCurve: [0.9, 0.7, 0.85, 0.65, 0.8, 0.75],
    articulation: 'normal'
  },
  {
    id: 'strum-folk-clawhammer-variant',
    name: 'Clawhammer Banjo Style',
    description: 'Old-time clawhammer pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 }
    ],
    velocityCurve: [0.85, 0.9, 0.7, 0.75],
    articulation: 'normal'
  },
  {
    id: 'strum-folk-drone',
    name: 'Open String Drone Folk',
    description: 'Sustained drone with melody notes',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'half', beats: 2, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.625 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.75 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.875 }
    ],
    velocityCurve: [0.8, 0.6, 0.65, 0.7, 0.75],
    articulation: 'legato'
  },
  {
    id: 'strum-folk-celtic-jig',
    name: 'Celtic Jig Strum',
    description: 'Traditional Irish jig pattern (6/8 feel)',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.875 }
    ],
    velocityCurve: [0.9, 0.7, 0.85, 0.7],
    articulation: 'normal'
  },
  {
    id: 'strum-folk-appalachian',
    name: 'Appalachian Old-Time',
    description: 'Traditional Appalachian strum pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.4375 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.625 }
    ],
    velocityCurve: [0.9, 0.65, 0.7, 0.85],
    articulation: 'normal'
  },
  {
    id: 'strum-folk-waltz-bass-chord',
    name: 'Fingerstyle Waltz (3/4)',
    description: 'Classic waltz bass-chord-chord in 3/4',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.333 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.666 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.833 }
    ],
    velocityCurve: [0.9, 0.6, 0.65, 0.6, 0.65],
    articulation: 'normal'
  },
  {
    id: 'strum-folk-travis-alt',
    name: 'Travis Picking Variation 2',
    description: 'Alternative Travis picking pattern',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.6875 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.75 }
    ],
    velocityCurve: [0.9, 0.6, 0.65, 0.7, 0.85, 0.6, 0.65, 0.7],
    articulation: 'normal'
  },
  {
    id: 'strum-folk-thumb-melody',
    name: 'Thumb-Melody Fingerpick',
    description: 'Thumb plays melody with finger accompaniment',
    direction: 'mixed',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.0625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.5625 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.625 }
    ],
    velocityCurve: [0.9, 0.6, 0.65, 0.8, 0.85, 0.6, 0.65],
    articulation: 'normal'
  }
];

export const BROKEN_PATTERNS: BrokenPattern[] = [
  {
    id: 'broken-standard',
    name: 'Standard Broken (16-16-8)',
    description: 'Two sixteenths followed by eighth',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 }
    ],
    accentPlacement: [1.0, 0.6, 0.8]
  },
  {
    id: 'broken-reverse',
    name: 'Reverse Broken (8-16-16)',
    description: 'Eighth followed by two sixteenths',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.5 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.75 }
    ],
    accentPlacement: [1.0, 0.5, 0.7]
  },
  {
    id: 'broken-alternating',
    name: 'Alternating (16-8-16-8)',
    description: 'Alternating sixteenths and eighths',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.75 }
    ],
    accentPlacement: [1.0, 0.6, 0.8]
  },
  {
    id: 'broken-even-eighths',
    name: 'Even Eighths (8-8-8-8)',
    description: 'Four even eighth notes',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 }
    ],
    accentPlacement: [1.0, 0.6]
  },
  {
    id: 'broken-scotch-snap',
    name: 'Scotch Snap (16-dotted-8)',
    description: 'Short-long rhythm (Scotch snap)',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0.25 }
    ],
    accentPlacement: [1.0, 0.7]
  },
  {
    id: 'broken-dotted',
    name: 'Dotted Rhythm (dotted-8-16)',
    description: 'Long-short rhythm (dotted)',
    rhythmTemplate: [
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.75 }
    ],
    accentPlacement: [1.0, 0.5]
  },
  {
    id: 'broken-triplet',
    name: 'Triplet Broken',
    description: 'Broken rhythm in triplets',
    rhythmTemplate: [
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.333 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.666 }
    ],
    accentPlacement: [1.0, 0.5, 0.6]
  },
  {
    id: 'broken-stutter',
    name: 'Stuttering (16-16-16-16)',
    description: 'Four rapid sixteenth notes',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.5 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.75 }
    ],
    accentPlacement: [1.0, 0.5, 0.7, 0.5]
  },
  {
    id: 'broken-gallop',
    name: 'Galloping (8-16-16-8)',
    description: 'Galloping rhythm pattern',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.5 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.75 }
    ],
    accentPlacement: [1.0, 0.5, 0.6]
  },
  {
    id: 'broken-syncopated',
    name: 'Syncopated Broken',
    description: 'Off-beat broken pattern',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.125 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.875 }
    ],
    accentPlacement: [0.7, 1.0, 0.6]
  },
  {
    id: 'broken-stumble-light',
    name: 'Light Stumble',
    description: 'Subtle rhythmic stumbling effect',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.3 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.6 }
    ],
    accentPlacement: [1.0, 0.5, 0.7],
    microTimingOffset: 0.02
  },
  {
    id: 'broken-stumble-heavy',
    name: 'Heavy Stumble',
    description: 'Strong rhythmic stumbling effect',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.35 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.7 }
    ],
    accentPlacement: [1.0, 0.4, 0.8],
    microTimingOffset: 0.05
  },
  {
    id: 'broken-random-light',
    name: 'Random Light',
    description: 'Subtle random note dropping',
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 }
    ],
    accentPlacement: [1.0, 0.7],
    dropProbability: 0.15,
    randomSeed: 12345
  },
  {
    id: 'broken-random-medium',
    name: 'Random Medium',
    description: 'Moderate random note dropping',
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.25 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 }
    ],
    accentPlacement: [1.0, 0.6, 0.8],
    dropProbability: 0.25,
    randomSeed: 54321
  },
  {
    id: 'broken-waltz',
    name: 'Waltz Broken',
    description: 'Broken pattern for 3/4 time',
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.666 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.833 }
    ],
    accentPlacement: [1.0, 0.5, 0.6]
  }
];

export const BROKEN_CHORD_PATTERNS: BrokenChordPattern[] = [
  // Root + Two-note combinations
  {
    id: 'broken-root-third-fifth',
    name: 'Root → (3rd+5th)',
    description: 'Root followed by third and fifth together',
    firstNote: 'root',
    secondNotePair: ['third', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'half', beats: 2, relativePosition: 0.25 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-root-fifth-third',
    name: 'Root → (5th+3rd)',
    description: 'Root followed by fifth and third together',
    firstNote: 'root',
    secondNotePair: ['fifth', 'third'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.125 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-root-third-seventh',
    name: 'Root → (3rd+7th)',
    description: 'Root followed by third and seventh (jazz voicing)',
    firstNote: 'root',
    secondNotePair: ['third', 'seventh'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-root-fifth-seventh',
    name: 'Root → (5th+7th)',
    description: 'Root followed by fifth and seventh',
    firstNote: 'root',
    secondNotePair: ['fifth', 'seventh'],
    rhythmTemplate: [
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 }
    ],
    accentPattern: [0.9, 0.6]
  },
  // Third + Two-note combinations
  {
    id: 'broken-third-root-fifth',
    name: 'Third → (Root+5th)',
    description: 'Third followed by root and fifth',
    firstNote: 'third',
    secondNotePair: ['root', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.125 }
    ],
    accentPattern: [0.8, 0.9]
  },
  {
    id: 'broken-third-fifth-root',
    name: 'Third → (5th+Root)',
    description: 'Third followed by fifth and root',
    firstNote: 'third',
    secondNotePair: ['fifth', 'root'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 }
    ],
    accentPattern: [0.8, 0.7]
  },
  {
    id: 'broken-third-fifth-seventh',
    name: 'Third → (5th+7th)',
    description: 'Third followed by fifth and seventh',
    firstNote: 'third',
    secondNotePair: ['fifth', 'seventh'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 }
    ],
    accentPattern: [0.8, 0.7]
  },
  {
    id: 'broken-third-seventh-fifth',
    name: 'Third → (7th+5th)',
    description: 'Third followed by seventh and fifth',
    firstNote: 'third',
    secondNotePair: ['seventh', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0.0625 }
    ],
    accentPattern: [0.8, 0.7]
  },
  // Fifth + Two-note combinations
  {
    id: 'broken-fifth-root-third',
    name: 'Fifth → (Root+3rd)',
    description: 'Fifth followed by root and third',
    firstNote: 'fifth',
    secondNotePair: ['root', 'third'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 }
    ],
    accentPattern: [0.9, 0.8]
  },
  {
    id: 'broken-fifth-third-root',
    name: 'Fifth → (3rd+Root)',
    description: 'Fifth followed by third and root',
    firstNote: 'fifth',
    secondNotePair: ['third', 'root'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.125 }
    ],
    accentPattern: [0.8, 0.9]
  },
  {
    id: 'broken-fifth-third-seventh',
    name: 'Fifth → (3rd+7th)',
    description: 'Fifth followed by third and seventh',
    firstNote: 'fifth',
    secondNotePair: ['third', 'seventh'],
    rhythmTemplate: [
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.111 }
    ],
    accentPattern: [0.8, 0.7]
  },
  {
    id: 'broken-fifth-seventh-third',
    name: 'Fifth → (7th+3rd)',
    description: 'Fifth followed by seventh and third',
    firstNote: 'fifth',
    secondNotePair: ['seventh', 'third'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 }
    ],
    accentPattern: [0.8, 0.7]
  },
  // Seventh + Two-note combinations (for 7th+ chords)
  {
    id: 'broken-seventh-root-third',
    name: 'Seventh → (Root+3rd)',
    description: 'Seventh followed by root and third',
    firstNote: 'seventh',
    secondNotePair: ['root', 'third'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 }
    ],
    accentPattern: [0.8, 0.9]
  },
  {
    id: 'broken-seventh-third-fifth',
    name: 'Seventh → (3rd+5th)',
    description: 'Seventh followed by third and fifth',
    firstNote: 'seventh',
    secondNotePair: ['third', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 }
    ],
    accentPattern: [0.8, 0.7]
  },
  {
    id: 'broken-seventh-fifth-root',
    name: 'Seventh → (5th+Root)',
    description: 'Seventh followed by fifth and root',
    firstNote: 'seventh',
    secondNotePair: ['fifth', 'root'],
    rhythmTemplate: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 }
    ],
    accentPattern: [0.8, 0.9]
  },
  // Syncopated and rhythmic variations
  {
    id: 'broken-root-third-fifth-syncopated',
    name: 'Root → (3rd+5th) Syncopated',
    description: 'Syncopated broken pattern with root',
    firstNote: 'root',
    secondNotePair: ['third', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0.0625 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-third-root-fifth-dotted',
    name: 'Third → (Root+5th) Dotted',
    description: 'Dotted rhythm broken pattern',
    firstNote: 'third',
    secondNotePair: ['root', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'dotted-eighth', beats: 0.75, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.1875 }
    ],
    accentPattern: [0.8, 0.9]
  },
  {
    id: 'broken-fifth-third-root-triplet',
    name: 'Fifth → (3rd+Root) Triplet',
    description: 'Triplet feel broken pattern',
    firstNote: 'fifth',
    secondNotePair: ['third', 'root'],
    rhythmTemplate: [
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0 },
      { subdivision: 'triplet-quarter', beats: 0.666, relativePosition: 0.111 }
    ],
    accentPattern: [0.8, 0.9]
  },
  // Extended chord voicings (9th, 11th, 13th)
  {
    id: 'broken-root-third-ninth',
    name: 'Root → (3rd+9th)',
    description: 'Root with upper extension third and ninth',
    firstNote: 'root',
    secondNotePair: ['third', 'ninth'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 }
    ],
    accentPattern: [0.9, 0.6]
  },
  {
    id: 'broken-root-seventh-ninth',
    name: 'Root → (7th+9th)',
    description: 'Root with seventh and ninth extension',
    firstNote: 'root',
    secondNotePair: ['seventh', 'ninth'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-third-fifth-ninth',
    name: 'Third → (5th+9th)',
    description: 'Third with fifth and ninth',
    firstNote: 'third',
    secondNotePair: ['fifth', 'ninth'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.25 }
    ],
    accentPattern: [0.8, 0.7]
  },
  {
    id: 'broken-fifth-seventh-ninth',
    name: 'Fifth → (7th+9th)',
    description: 'Fifth with seventh and ninth',
    firstNote: 'fifth',
    secondNotePair: ['seventh', 'ninth'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.125 }
    ],
    accentPattern: [0.8, 0.7]
  },
  {
    id: 'broken-root-fifth-ninth',
    name: 'Root → (5th+9th)',
    description: 'Root with fifth and ninth',
    firstNote: 'root',
    secondNotePair: ['fifth', 'ninth'],
    rhythmTemplate: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.375 }
    ],
    accentPattern: [0.9, 0.6]
  },
  // Additional jazzy voicings
  {
    id: 'broken-third-seventh-root',
    name: 'Third → (7th+Root)',
    description: 'Third with seventh and root (shell voicing)',
    firstNote: 'third',
    secondNotePair: ['seventh', 'root'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 }
    ],
    accentPattern: [0.8, 0.9]
  },
  {
    id: 'broken-seventh-root-fifth',
    name: 'Seventh → (Root+5th)',
    description: 'Seventh with root and fifth',
    firstNote: 'seventh',
    secondNotePair: ['root', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 }
    ],
    accentPattern: [0.8, 0.9]
  },
  // Fast patterns
  {
    id: 'broken-root-third-fifth-sixteenth',
    name: 'Root → (3rd+5th) 16th Notes',
    description: 'Fast sixteenth note broken pattern',
    firstNote: 'root',
    secondNotePair: ['third', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.0625 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-third-root-fifth-sixteenth',
    name: 'Third → (Root+5th) 16th Notes',
    description: 'Fast sixteenth note from third',
    firstNote: 'third',
    secondNotePair: ['root', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.0625 }
    ],
    accentPattern: [0.8, 0.9]
  },
  // Slow/ballad patterns
  {
    id: 'broken-root-third-fifth-half',
    name: 'Root → (3rd+5th) Slow',
    description: 'Slow ballad broken pattern',
    firstNote: 'root',
    secondNotePair: ['third', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'half', beats: 2, relativePosition: 0 },
      { subdivision: 'half', beats: 2, relativePosition: 0.5 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-fifth-third-root-whole',
    name: 'Fifth → (3rd+Root) Very Slow',
    description: 'Very slow descending broken pattern',
    firstNote: 'fifth',
    secondNotePair: ['third', 'root'],
    rhythmTemplate: [
      { subdivision: 'whole', beats: 4, relativePosition: 0 }
    ],
    accentPattern: [0.8]
  },
  // Waltz patterns (3/4)
  {
    id: 'broken-root-third-fifth-waltz',
    name: 'Root → (3rd+5th) Waltz',
    description: 'Waltz time broken pattern',
    firstNote: 'root',
    secondNotePair: ['third', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'half', beats: 2, relativePosition: 0.333 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-third-fifth-root-waltz',
    name: 'Third → (5th+Root) Waltz',
    description: 'Waltz ascending broken pattern',
    firstNote: 'third',
    secondNotePair: ['fifth', 'root'],
    rhythmTemplate: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.5 }
    ],
    accentPattern: [0.8, 0.7]
  },
  // Compound meter patterns (6/8, 12/8)
  {
    id: 'broken-root-third-fifth-68',
    name: 'Root → (3rd+5th) 6/8',
    description: 'Compound meter broken pattern',
    firstNote: 'root',
    secondNotePair: ['third', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0.5 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-fifth-third-root-68',
    name: 'Fifth → (3rd+Root) 6/8',
    description: 'Descending compound meter pattern',
    firstNote: 'fifth',
    secondNotePair: ['third', 'root'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.166 }
    ],
    accentPattern: [0.8, 0.9]
  },
  // Odd meter patterns (5/4, 7/8)
  {
    id: 'broken-root-third-fifth-54',
    name: 'Root → (3rd+5th) 5/4',
    description: 'Five-four time broken pattern',
    firstNote: 'root',
    secondNotePair: ['third', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'half', beats: 2, relativePosition: 0 },
      { subdivision: 'dotted-half', beats: 3, relativePosition: 0.4 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-third-fifth-root-78',
    name: 'Third → (5th+Root) 7/8',
    description: 'Seven-eight time broken pattern',
    firstNote: 'third',
    secondNotePair: ['fifth', 'root'],
    rhythmTemplate: [
      { subdivision: 'dotted-quarter', beats: 1.5, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.428 }
    ],
    accentPattern: [0.8, 0.7]
  },
  // Swing patterns
  {
    id: 'broken-root-third-fifth-swing',
    name: 'Root → (3rd+5th) Swing',
    description: 'Swung broken pattern',
    firstNote: 'root',
    secondNotePair: ['third', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'triplet-eighth', beats: 0.666, relativePosition: 0 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.166 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-fifth-third-root-swing',
    name: 'Fifth → (3rd+Root) Swing',
    description: 'Swung descending broken pattern',
    firstNote: 'fifth',
    secondNotePair: ['third', 'root'],
    rhythmTemplate: [
      { subdivision: 'triplet-eighth', beats: 0.666, relativePosition: 0 },
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0.166 }
    ],
    accentPattern: [0.8, 0.9]
  },
  // Latin/Bossa patterns
  {
    id: 'broken-root-fifth-third-bossa',
    name: 'Root → (5th+3rd) Bossa',
    description: 'Bossa nova syncopated broken pattern',
    firstNote: 'root',
    secondNotePair: ['fifth', 'third'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.1875 }
    ],
    accentPattern: [0.9, 0.7]
  },
  {
    id: 'broken-third-root-seventh-latin',
    name: 'Third → (Root+7th) Latin',
    description: 'Latin syncopated broken pattern',
    firstNote: 'third',
    secondNotePair: ['root', 'seventh'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.1875 }
    ],
    accentPattern: [0.8, 0.9]
  },
  // Modern/contemporary patterns
  {
    id: 'broken-root-ninth-thirteenth',
    name: 'Root → (9th+13th)',
    description: 'Modern upper structure voicing',
    firstNote: 'root',
    secondNotePair: ['ninth', 'thirteenth'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 }
    ],
    accentPattern: [0.9, 0.6]
  },
  {
    id: 'broken-third-ninth-eleventh',
    name: 'Third → (9th+11th)',
    description: 'Upper structure from third',
    firstNote: 'third',
    secondNotePair: ['ninth', 'eleventh'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0.125 }
    ],
    accentPattern: [0.8, 0.6]
  },
  // Polyrhythmic patterns
  {
    id: 'broken-root-third-fifth-polyrhythm',
    name: 'Root → (3rd+5th) Polyrhythmic',
    description: 'Complex polyrhythmic broken pattern',
    firstNote: 'root',
    secondNotePair: ['third', 'fifth'],
    rhythmTemplate: [
      { subdivision: 'triplet-eighth', beats: 0.333, relativePosition: 0 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.111 },
      { subdivision: 'sixteenth', beats: 0.25, relativePosition: 0.173 }
    ],
    accentPattern: [0.9, 0.7, 0.7]
  },
  // Additional practical patterns
  {
    id: 'broken-fifth-root-seventh',
    name: 'Fifth → (Root+7th)',
    description: 'Fifth with root and seventh',
    firstNote: 'fifth',
    secondNotePair: ['root', 'seventh'],
    rhythmTemplate: [
      { subdivision: 'quarter', beats: 1, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.25 }
    ],
    accentPattern: [0.8, 0.9]
  },
  {
    id: 'broken-seventh-third-ninth',
    name: 'Seventh → (3rd+9th)',
    description: 'Seventh with third and ninth extension',
    firstNote: 'seventh',
    secondNotePair: ['third', 'ninth'],
    rhythmTemplate: [
      { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
      { subdivision: 'quarter', beats: 1, relativePosition: 0.125 }
    ],
    accentPattern: [0.8, 0.7]
  }
];

export function getPatternById(patternId: string, type: 'block' | 'arpeggiated' | 'strum' | 'broken' | 'broken-chord'): BlockPattern | ArpeggiatedPattern | StrumPattern | BrokenPattern | BrokenChordPattern | undefined {
  switch (type) {
    case 'block':
      return BLOCK_PATTERNS.find(p => p.id === patternId);
    case 'arpeggiated':
      return ARPEGGIATED_PATTERNS.find(p => p.id === patternId);
    case 'strum':
      return STRUM_PATTERNS.find(p => p.id === patternId);
    case 'broken':
      return BROKEN_PATTERNS.find(p => p.id === patternId);
    case 'broken-chord':
      return BROKEN_CHORD_PATTERNS.find(p => p.id === patternId);
    default:
      return undefined;
  }
}

export function getPatternsForTimeSignature(timeSignature: string): BlockPattern[] {
  return BLOCK_PATTERNS.filter(p => p.timeSignature === timeSignature);
}

export function getDefaultPattern(type: 'block' | 'arpeggiated' | 'broken'): string {
  switch (type) {
    case 'block':
      return 'block-4quarter';
    case 'arpeggiated':
      return 'arp-1353';
    case 'broken':
      return 'broken-standard';
    default:
      return '';
  }
}
