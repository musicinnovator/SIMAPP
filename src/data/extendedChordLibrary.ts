/**
 * Extended Chord Library - Phase 1 Enhancement
 *
 * This file adds advanced chord vocabulary options without modifying
 * the existing chord progression system.
 *
 * All existing functionality remains intact.
 */

export interface ChordCategory {
  name: string;
  description: string;
  chords: string[];
  color: string;
}

export const extendedChordLibrary: Record<string, ChordCategory[]> = {
  // Major key extended chords
  major: [
    {
      name: 'Diatonic',
      description: 'Standard scale degrees',
      chords: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
      color: 'blue'
    },
    {
      name: 'Borrowed (Minor)',
      description: 'Chords borrowed from parallel minor',
      chords: ['bIII', 'bVI', 'bVII', 'iv'],
      color: 'purple'
    },
    {
      name: 'Secondary Dominants',
      description: 'Dominant chords targeting other scale degrees',
      chords: ['V/ii', 'V/iii', 'V/IV', 'V/V', 'V/vi'],
      color: 'orange'
    },
    {
      name: 'Chromatic',
      description: 'Chromatic passing and neighbor chords',
      chords: ['#IV°', 'bII', '#I°', 'N6'],
      color: 'red'
    },
    {
      name: 'Extended (7ths)',
      description: 'Seventh chords',
      chords: ['Imaj7', 'ii7', 'iii7', 'IVmaj7', 'V7', 'vi7', 'vii°7'],
      color: 'green'
    },
    {
      name: 'Extended (9ths)',
      description: 'Ninth chords',
      chords: ['Imaj9', 'ii9', 'V9', 'vi9'],
      color: 'teal'
    }
  ],
  // Minor key extended chords
  minor: [
    {
      name: 'Diatonic',
      description: 'Natural minor scale degrees',
      chords: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
      color: 'blue'
    },
    {
      name: 'Harmonic Minor',
      description: 'Raised 7th scale degree',
      chords: ['V', 'vii°'],
      color: 'indigo'
    },
    {
      name: 'Borrowed (Major)',
      description: 'Chords borrowed from parallel major',
      chords: ['I', 'IV', 'V', 'ii'],
      color: 'purple'
    },
    {
      name: 'Secondary Dominants',
      description: 'Dominant chords targeting other scale degrees',
      chords: ['V/III', 'V/iv', 'V/V', 'V/VI', 'V/VII'],
      color: 'orange'
    },
    {
      name: 'Chromatic',
      description: 'Chromatic alterations',
      chords: ['#ii°', 'bII', 'N6'],
      color: 'red'
    },
    {
      name: 'Extended (7ths)',
      description: 'Seventh chords',
      chords: ['i7', 'ii°7', 'IIImaj7', 'iv7', 'V7', 'VImaj7', 'VII7'],
      color: 'green'
    }
  ]
};

/**
 * Progression Templates - Pre-built common progressions
 */
export interface ProgressionTemplate {
  name: string;
  chords: string[];
  style: string;
  description: string;
  tags: string[];
}

export const progressionTemplates: ProgressionTemplate[] = [
  // Pop & Contemporary
  {
    name: 'I-V-vi-IV (Pop Anthem)',
    chords: ['I', 'V', 'vi', 'IV'],
    style: 'pop',
    description: 'The most popular progression in modern pop music',
    tags: ['pop', 'modern', 'upbeat', 'singalong']
  },
  {
    name: 'vi-IV-I-V (Emotional Pop)',
    chords: ['vi', 'IV', 'I', 'V'],
    style: 'pop',
    description: 'Emotional and introspective, common in ballads',
    tags: ['pop', 'ballad', 'emotional', 'modern']
  },
  {
    name: 'I-IV-vi-V (Classic Pop)',
    chords: ['I', 'IV', 'vi', 'V'],
    style: 'pop',
    description: 'Classic pop progression, bright and uplifting',
    tags: ['pop', 'classic', 'upbeat', 'happy']
  },

  // Gospel & Worship
  {
    name: 'I-V-vi-IV (Gospel)',
    chords: ['Imaj7', 'V7', 'vi7', 'IVmaj7'],
    style: 'gospel',
    description: 'Gospel version with extended harmonies',
    tags: ['gospel', 'worship', 'praise', 'contemporary']
  },
  {
    name: 'I-IV-V (Traditional Gospel)',
    chords: ['I', 'IV', 'V', 'I'],
    style: 'gospel',
    description: 'Traditional three-chord gospel progression',
    tags: ['gospel', 'traditional', 'hymn', 'simple']
  },
  {
    name: 'I-vi-ii-V (Gospel Turnaround)',
    chords: ['I', 'vi', 'ii', 'V'],
    style: 'gospel',
    description: 'Classic gospel turnaround progression',
    tags: ['gospel', 'turnaround', 'traditional']
  },
  {
    name: 'I-bVII-IV-I (Praise)',
    chords: ['I', 'bVII', 'IV', 'I'],
    style: 'gospel',
    description: 'Modern worship with borrowed bVII',
    tags: ['gospel', 'worship', 'modern', 'anthemic']
  },

  // Jazz
  {
    name: 'ii-V-I (Jazz Standard)',
    chords: ['ii7', 'V7', 'Imaj7'],
    style: 'jazz',
    description: 'The fundamental jazz progression',
    tags: ['jazz', 'standard', 'bebop', 'classic']
  },
  {
    name: 'I-vi-ii-V (Jazz Turnaround)',
    chords: ['Imaj7', 'vi7', 'ii7', 'V7'],
    style: 'jazz',
    description: 'Classic jazz turnaround with 7th chords',
    tags: ['jazz', 'turnaround', 'standard']
  },
  {
    name: 'iii-vi-ii-V (Extended Turnaround)',
    chords: ['iii7', 'vi7', 'ii7', 'V7'],
    style: 'jazz',
    description: 'Extended jazz turnaround',
    tags: ['jazz', 'turnaround', 'extended']
  },
  {
    name: 'Rhythm Changes (A)',
    chords: ['Imaj7', 'vi7', 'ii7', 'V7', 'Imaj7', 'vi7', 'ii7', 'V7'],
    style: 'jazz',
    description: 'Classic "Rhythm Changes" A section',
    tags: ['jazz', 'bebop', 'standard', 'swing']
  },

  // Blues
  {
    name: '12-Bar Blues',
    chords: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
    style: 'blues',
    description: 'Traditional 12-bar blues progression',
    tags: ['blues', 'traditional', '12-bar', 'shuffle']
  },
  {
    name: '8-Bar Blues',
    chords: ['I7', 'IV7', 'I7', 'V7', 'IV7', 'I7', 'V7', 'I7'],
    style: 'blues',
    description: 'Shorter 8-bar blues form',
    tags: ['blues', 'traditional', '8-bar']
  },
  {
    name: 'Minor Blues',
    chords: ['i7', 'i7', 'i7', 'i7', 'iv7', 'iv7', 'i7', 'i7', 'V7', 'iv7', 'i7', 'V7'],
    style: 'blues',
    description: 'Minor key blues progression',
    tags: ['blues', 'minor', 'moody', 'dark']
  },

  // Rock & Alternative
  {
    name: 'I-bVII-IV (Rock Anthem)',
    chords: ['I', 'bVII', 'IV'],
    style: 'rock',
    description: 'Power chord progression, anthemic',
    tags: ['rock', 'anthemic', 'power', 'stadium']
  },
  {
    name: 'i-bVII-bVI-bVII (Rock Minor)',
    chords: ['i', 'bVII', 'bVI', 'bVII'],
    style: 'rock',
    description: 'Minor key rock progression',
    tags: ['rock', 'minor', 'dark', 'heavy']
  },
  {
    name: 'I-V-IV (Three Chord Rock)',
    chords: ['I', 'V', 'IV'],
    style: 'rock',
    description: 'Simple three-chord rock',
    tags: ['rock', 'simple', 'punk', 'classic']
  },

  // Classical & Film
  {
    name: 'I-IV-I-V-I (Authentic Cadence)',
    chords: ['I', 'IV', 'I', 'V', 'I'],
    style: 'classical',
    description: 'Classical authentic cadence pattern',
    tags: ['classical', 'cadence', 'traditional', 'resolution']
  },
  {
    name: 'i-iv-V-i (Minor Classical)',
    chords: ['i', 'iv', 'V', 'i'],
    style: 'classical',
    description: 'Minor key classical progression',
    tags: ['classical', 'minor', 'dramatic', 'serious']
  },
  {
    name: 'Pachelbel Canon',
    chords: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'],
    style: 'classical',
    description: 'Famous Canon in D progression',
    tags: ['classical', 'baroque', 'famous', 'wedding']
  },

  // Latin & World
  {
    name: 'Bossa Nova',
    chords: ['Imaj7', 'II7', 'ii7', 'V7'],
    style: 'latin',
    description: 'Classic bossa nova progression',
    tags: ['latin', 'bossa', 'jazzy', 'smooth']
  },
  {
    name: 'Montuno Pattern',
    chords: ['I', 'IV', 'V', 'IV'],
    style: 'latin',
    description: 'Traditional Cuban montuno',
    tags: ['latin', 'salsa', 'afro-cuban', 'dance']
  },

  // Ambient & Atmospheric
  {
    name: 'Suspended Mystery',
    chords: ['i', 'bVI', 'bVII', 'i'],
    style: 'ambient',
    description: 'Dark and mysterious atmosphere',
    tags: ['ambient', 'atmospheric', 'dark', 'mystery']
  },
  {
    name: 'Floating Harmony',
    chords: ['Imaj7', 'IVmaj7', 'VImaj7', 'IIImaj7'],
    style: 'ambient',
    description: 'Ethereal and floating quality',
    tags: ['ambient', 'atmospheric', 'ethereal', 'calm']
  }
];

/**
 * Common tag suggestions for progressions
 */
export const suggestedTags = [
  'pop',
  'gospel',
  'worship',
  'praise',
  'jazz',
  'blues',
  'rock',
  'classical',
  'latin',
  'ambient',
  'upbeat',
  'slow',
  'emotional',
  'happy',
  'sad',
  'energetic',
  'calm',
  'modern',
  'traditional',
  'contemporary',
  'anthemic',
  'ballad',
  'dance',
  'contemplative',
  'celebratory'
];
