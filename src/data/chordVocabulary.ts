export interface ChordType {
  symbol: string;
  name: string;
  formula: string;
  intervals: number[];
  description: string;
  category: string;
}

export const chordVocabulary: Record<string, ChordType> = {
  // Basic Triads
  major: {
    symbol: '',
    name: 'Major Triad',
    formula: '1-3-5',
    intervals: [0, 4, 7],
    description: 'Bright, stable, consonant',
    category: 'Triad'
  },

  minor: {
    symbol: 'm',
    name: 'Minor Triad',
    formula: '1-♭3-5',
    intervals: [0, 3, 7],
    description: 'Darker, somber tone',
    category: 'Triad'
  },

  diminished: {
    symbol: 'dim',
    name: 'Diminished Triad',
    formula: '1-♭3-♭5',
    intervals: [0, 3, 6],
    description: 'Tense, unstable, leading',
    category: 'Triad'
  },

  augmented: {
    symbol: 'aug',
    name: 'Augmented Triad',
    formula: '1-3-♯5',
    intervals: [0, 4, 8],
    description: 'Dreamy, unresolved, modern',
    category: 'Triad'
  },

  sus2: {
    symbol: 'sus2',
    name: 'Suspended 2nd',
    formula: '1-2-5',
    intervals: [0, 2, 7],
    description: 'Open, airy, unresolved',
    category: 'Suspended'
  },

  sus4: {
    symbol: 'sus4',
    name: 'Suspended 4th',
    formula: '1-4-5',
    intervals: [0, 5, 7],
    description: 'Expectant, resolves to major',
    category: 'Suspended'
  },

  // Seventh Chords
  maj7: {
    symbol: 'maj7',
    name: 'Major 7th',
    formula: '1-3-5-7',
    intervals: [0, 4, 7, 11],
    description: 'Smooth, jazzy, restful',
    category: 'Seventh'
  },

  dom7: {
    symbol: '7',
    name: 'Dominant 7th',
    formula: '1-3-5-♭7',
    intervals: [0, 4, 7, 10],
    description: 'Tense, bluesy, resolves down',
    category: 'Seventh'
  },

  min7: {
    symbol: 'm7',
    name: 'Minor 7th',
    formula: '1-♭3-5-♭7',
    intervals: [0, 3, 7, 10],
    description: 'Soulful, mellow, introspective',
    category: 'Seventh'
  },

  halfDim7: {
    symbol: 'm7♭5',
    name: 'Half-Diminished 7th',
    formula: '1-♭3-♭5-♭7',
    intervals: [0, 3, 6, 10],
    description: 'Fragile, haunting, resolves smoothly',
    category: 'Seventh'
  },

  dim7: {
    symbol: 'dim7',
    name: 'Fully Diminished 7th',
    formula: '1-♭3-♭5-𝄫7',
    intervals: [0, 3, 6, 9],
    description: 'Dramatic, leading-tone chord',
    category: 'Seventh'
  },

  minMaj7: {
    symbol: 'm(maj7)',
    name: 'Minor Major 7th',
    formula: '1-♭3-5-7',
    intervals: [0, 3, 7, 11],
    description: 'Film noir, bittersweet tension',
    category: 'Seventh'
  },

  augMaj7: {
    symbol: 'maj7♯5',
    name: 'Augmented Major 7th',
    formula: '1-3-♯5-7',
    intervals: [0, 4, 8, 11],
    description: 'Lush, unresolved, dreamy',
    category: 'Seventh'
  },

  // Extended Chords
  dom9: {
    symbol: '9',
    name: 'Dominant 9th',
    formula: '1-3-5-♭7-9',
    intervals: [0, 4, 7, 10, 14],
    description: 'Bright, colorful, funk & jazz',
    category: 'Extended'
  },

  maj9: {
    symbol: 'maj9',
    name: 'Major 9th',
    formula: '1-3-5-7-9',
    intervals: [0, 4, 7, 11, 14],
    description: 'Airy, ethereal, cinematic',
    category: 'Extended'
  },

  min9: {
    symbol: 'm9',
    name: 'Minor 9th',
    formula: '1-♭3-5-♭7-9',
    intervals: [0, 3, 7, 10, 14],
    description: 'Warm, melancholic, rich',
    category: 'Extended'
  },

  dom11: {
    symbol: '11',
    name: 'Dominant 11th',
    formula: '1-3-5-♭7-9-11',
    intervals: [0, 4, 7, 10, 14, 17],
    description: 'Lush and thick, orchestral pads',
    category: 'Extended'
  },

  dom13: {
    symbol: '13',
    name: 'Dominant 13th',
    formula: '1-3-5-♭7-9-13',
    intervals: [0, 4, 7, 10, 14, 21],
    description: 'Jazz standard, warmth and movement',
    category: 'Extended'
  },

  // Altered Chords
  dom7sharp9: {
    symbol: '7♯9',
    name: 'Dominant 7♯9 (Hendrix)',
    formula: '1-3-5-♭7-♯9',
    intervals: [0, 4, 7, 10, 15],
    description: 'Aggressive, funky, blues-rock',
    category: 'Altered'
  },

  dom7flat9: {
    symbol: '7♭9',
    name: 'Dominant 7♭9',
    formula: '1-3-5-♭7-♭9',
    intervals: [0, 4, 7, 10, 13],
    description: 'Tense, exotic, resolves downward',
    category: 'Altered'
  },

  dom7flat5: {
    symbol: '7♭5',
    name: 'Dominant 7♭5',
    formula: '1-3-♭5-♭7',
    intervals: [0, 4, 6, 10],
    description: 'Unstable, transitional chord',
    category: 'Altered'
  },

  dom7sharp5: {
    symbol: '7♯5',
    name: 'Dominant 7♯5',
    formula: '1-3-♯5-♭7',
    intervals: [0, 4, 8, 10],
    description: 'Dreamy dissonance, modulations',
    category: 'Altered'
  },

  dom13flat9: {
    symbol: '13♭9',
    name: 'Dominant 13♭9',
    formula: '1-3-5-♭7-♭9-13',
    intervals: [0, 4, 7, 10, 13, 21],
    description: 'Complex jazz tension chord',
    category: 'Altered'
  },

  altered: {
    symbol: '7alt',
    name: 'Altered Dominant',
    formula: '1-3-♯5-♭7-♭9-♯9',
    intervals: [0, 4, 8, 10, 13, 15],
    description: 'Maximal tension, resolves to minor',
    category: 'Altered'
  },

  // Add Chords
  add9: {
    symbol: 'add9',
    name: 'Add 9th',
    formula: '1-3-5-9',
    intervals: [0, 4, 7, 14],
    description: 'Bright, pop-friendly',
    category: 'Add'
  },

  add11: {
    symbol: 'add11',
    name: 'Add 11th',
    formula: '1-3-5-11',
    intervals: [0, 4, 7, 17],
    description: 'Expansive, open voicing',
    category: 'Add'
  },

  add13: {
    symbol: 'add13',
    name: 'Add 13th',
    formula: '1-3-5-13',
    intervals: [0, 4, 7, 21],
    description: 'Gentle, extended warmth',
    category: 'Add'
  },

  maj7sus4: {
    symbol: 'maj7sus4',
    name: 'Major 7 Sus 4',
    formula: '1-4-5-7',
    intervals: [0, 5, 7, 11],
    description: 'Dreamy and floating',
    category: 'Suspended'
  },

  // Power Chords and Special
  power5: {
    symbol: '5',
    name: 'Power Chord',
    formula: '1-5',
    intervals: [0, 7],
    description: 'Rock and metal, strong and direct',
    category: 'Special'
  },

  add6: {
    symbol: '6',
    name: 'Sixth',
    formula: '1-3-5-6',
    intervals: [0, 4, 7, 9],
    description: 'Bright, jazzy, nostalgic',
    category: 'Add'
  },

  min6: {
    symbol: 'm6',
    name: 'Minor Sixth',
    formula: '1-♭3-5-6',
    intervals: [0, 3, 7, 9],
    description: 'Mysterious, jazzy minor color',
    category: 'Add'
  }
};

export const chordCategories = {
  'Triads': ['major', 'minor', 'diminished', 'augmented'],
  'Suspended': ['sus2', 'sus4', 'maj7sus4'],
  'Seventh': ['maj7', 'dom7', 'min7', 'halfDim7', 'dim7', 'minMaj7', 'augMaj7'],
  'Extended': ['dom9', 'maj9', 'min9', 'dom11', 'dom13'],
  'Altered': ['dom7sharp9', 'dom7flat9', 'dom7flat5', 'dom7sharp5', 'dom13flat9', 'altered'],
  'Add': ['add9', 'add11', 'add13', 'add6', 'min6'],
  'Special': ['power5']
};

export function getChordIntervals(chordSymbol: string, baseIntervals: number[]): number[] {
  if (chordSymbol.includes('maj7')) return [0, 4, 7, 11];
  if (chordSymbol.includes('m7♭5') || chordSymbol.includes('ø')) return [0, 3, 6, 10];
  if (chordSymbol.includes('dim7') || chordSymbol.includes('°7')) return [0, 3, 6, 9];
  if (chordSymbol.includes('m7')) return [0, 3, 7, 10];
  if (chordSymbol.includes('7')) return [0, 4, 7, 10];
  if (chordSymbol.includes('dim') || chordSymbol.includes('°')) return [0, 3, 6];
  if (chordSymbol.includes('aug') || chordSymbol.includes('+')) return [0, 4, 8];
  if (chordSymbol.includes('sus4')) return [0, 5, 7];
  if (chordSymbol.includes('sus2')) return [0, 2, 7];
  if (chordSymbol.toLowerCase().includes('m') || chordSymbol.includes('i')) return [0, 3, 7];
  return baseIntervals;
}
