export interface ChordProgression {
  name: string;
  genre: string;
  description: string;
  major: string[];
  minor: string[];
}

export const chordProgressions: Record<string, ChordProgression> = {
  // Classic Progressions
  classic: {
    name: 'Classic Pop',
    genre: 'Pop',
    description: 'The timeless I-vi-IV-V progression used in countless songs',
    major: ['I', 'vi', 'IV', 'V'],
    minor: ['i', 'VI', 'III', 'VII']
  },

  // Hymn & Sacred Styles
  hymnClassic: {
    name: 'Hymn Classic',
    genre: 'Hymn',
    description: 'Foundation of Western church harmony with strong cadence',
    major: ['I', 'IV', 'V', 'I'],
    minor: ['i', 'iv', 'v', 'i']
  },

  gospelLift: {
    name: 'Gospel Lift',
    genre: 'Gospel',
    description: 'Adds IV→iv for emotional color and uplift',
    major: ['I', 'IV', 'iv', 'I', 'V', 'I'],
    minor: ['i', 'iv', 'iidim', 'i', 'v', 'i']
  },

  processional: {
    name: 'Processional Cadence',
    genre: 'Hymn',
    description: 'Majestic, suitable for hymn intros or endings',
    major: ['I', 'V', 'vi', 'IV', 'I', 'V', 'I'],
    minor: ['i', 'v', 'VI', 'iv', 'i', 'v', 'i']
  },

  amen: {
    name: 'Amen Ending',
    genre: 'Hymn',
    description: 'Traditional church cadence used to close hymns',
    major: ['IV', 'I'],
    minor: ['iv', 'i']
  },

  gospel: {
    name: 'Gospel Standard',
    genre: 'Gospel',
    description: 'Traditional gospel progression with extended resolution',
    major: ['I', 'V', 'vi', 'IV', 'I', 'V', 'vi', 'IV'],
    minor: ['i', 'v', 'VI', 'iv', 'i', 'v', 'VI', 'iv']
  },

  // Folk & Traditional Styles
  folkLoop: {
    name: 'Folk Loop',
    genre: 'Folk',
    description: 'Simple, circular pattern common in folk songs',
    major: ['I', 'V', 'vi', 'IV'],
    minor: ['i', 'v', 'VI', 'iv']
  },

  celticMotion: {
    name: 'Celtic Motion',
    genre: 'Folk',
    description: 'Mixolydian-flavored with modal brightness',
    major: ['I', 'bVII', 'IV', 'I'],
    minor: ['i', 'bVII', 'iv', 'i']
  },

  balladFlow: {
    name: 'Ballad Flow',
    genre: 'Folk',
    description: 'Gentle progression for narrative or lyrical tunes',
    major: ['I', 'vi', 'IV', 'V'],
    minor: ['i', 'VI', 'iv', 'v']
  },

  minorStory: {
    name: 'Minor Story',
    genre: 'Folk',
    description: 'Folk minor pattern, somber and introspective',
    major: ['vi', 'V', 'IV', 'III'],
    minor: ['i', 'v', 'iv', 'III']
  },

  // Classical & Orchestral Styles
  circleOfFifths: {
    name: 'Circle of Fifths',
    genre: 'Classical',
    description: 'Full diatonic circle motion with strong voice-leading',
    major: ['I', 'IV', 'vii°', 'iii', 'vi', 'ii', 'V', 'I'],
    minor: ['i', 'iv', 'VII', 'III', 'VI', 'ii°', 'V', 'i']
  },

  mozartCadence: {
    name: 'Mozart Cadence',
    genre: 'Classical',
    description: 'Classical cadence with secondary dominant tension',
    major: ['I', 'V7/V', 'V', 'I'],
    minor: ['i', 'V7/v', 'v', 'i']
  },

  pachelbel: {
    name: 'Pachelbel Sequence',
    genre: 'Classical',
    description: 'Canon-like progression with stepwise bass',
    major: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'],
    minor: ['i', 'v', 'VI', 'III', 'iv', 'i', 'iv', 'v']
  },

  romanticMinor: {
    name: 'Romantic Minor',
    genre: 'Classical',
    description: 'Emotional minor-key flow used in 19th-century works',
    major: ['vi', 'ii', 'V', 'I', 'IV', 'vii°', 'III', 'vi'],
    minor: ['i', 'iv', 'v', 'i', 'iv', 'vii°', 'III', 'i']
  },

  // Contemporary & Popular Styles
  popStandard: {
    name: 'Pop Standard',
    genre: 'Contemporary',
    description: 'Modern pop backbone, used in thousands of songs',
    major: ['I', 'V', 'vi', 'IV'],
    minor: ['i', 'v', 'VI', 'iv']
  },

  lofiChill: {
    name: 'Lofi Chill',
    genre: 'Contemporary',
    description: 'Dreamy, suspended feel with gentle resolution',
    major: ['Imaj7', 'vi7', 'ii7', 'V7'],
    minor: ['i7', 'VI7', 'ii7', 'v7']
  },

  jazzTurnaround: {
    name: 'Jazz Turnaround',
    genre: 'Jazz',
    description: 'ii–V–I with extended harmonies',
    major: ['ii7', 'V7', 'Imaj7', 'VI7'],
    minor: ['ii°7', 'V7', 'i7', 'VI7']
  },

  gospelModulation: {
    name: 'Gospel Modulation',
    genre: 'Gospel',
    description: 'Key lift halfway for emotional intensity',
    major: ['I', 'IV', 'V', 'I', 'II', 'V/II', 'VI/II', 'II'],
    minor: ['i', 'iv', 'v', 'i', 'ii', 'v/ii', 'VI/ii', 'ii']
  },

  worship: {
    name: 'Modern Worship',
    genre: 'Contemporary',
    description: 'Contemporary worship progression with emotive movement',
    major: ['vi', 'IV', 'I', 'V', 'vi', 'IV', 'I', 'V'],
    minor: ['i', 'VII', 'VI', 'VII', 'i', 'VII', 'VI', 'VII']
  },

  contemporary: {
    name: 'Contemporary Mix',
    genre: 'Contemporary',
    description: 'Modern progression with varied harmonic movement',
    major: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'],
    minor: ['i', 'VII', 'VI', 'VII', 'i', 'iv', 'VII', 'i']
  },

  // Modal Variations
  dorian: {
    name: 'Dorian Mode',
    genre: 'Modal',
    description: 'Minor with a bright sixth',
    major: ['ii', 'V', 'I', 'IV'],
    minor: ['i', 'iv', 'bVII', 'iv']
  },

  mixolydian: {
    name: 'Mixolydian Mode',
    genre: 'Modal',
    description: 'Major with lowered seventh (folk/rock feel)',
    major: ['I', 'bVII', 'IV', 'I'],
    minor: ['i', 'bVII', 'iv', 'i']
  },

  phrygian: {
    name: 'Phrygian Mode',
    genre: 'Modal',
    description: 'Exotic, tense, used in Spanish or dramatic pieces',
    major: ['iii', 'IV', 'V', 'IV'],
    minor: ['i', 'bII', 'bVII', 'i']
  },

  lydian: {
    name: 'Lydian Mode',
    genre: 'Modal',
    description: 'Bright, dreamy, raised fourth',
    major: ['I', 'II', 'V', 'I'],
    minor: ['i', 'II', 'v', 'i']
  },

  modal: {
    name: 'Modal Mix',
    genre: 'Modal',
    description: 'Combined modal colors for atmospheric effect',
    major: ['I', 'bVII', 'IV', 'I', 'bVII', 'bVI', 'bVII', 'I'],
    minor: ['i', 'bVII', 'bVI', 'bVII', 'i', 'iv', 'v', 'i']
  },

  // Extended Modal Progressions
  dorianVamp: {
    name: 'Dorian Vamp',
    genre: 'Modal',
    description: 'Emphasizes Dorian bright 6th, common in funk and jazz',
    major: ['ii7', 'IV', 'ii7', 'I'],
    minor: ['i7', 'IV', 'i7', 'bVII']
  },

  dorianGroove: {
    name: 'Dorian Groove',
    genre: 'Modal',
    description: 'Two-chord Dorian vamp highlighting natural 6th',
    major: ['ii7', 'V7'],
    minor: ['i7', 'IV']
  },

  phrygianDominant: {
    name: 'Phrygian Dominant',
    genre: 'Modal',
    description: 'Spanish/Middle Eastern feel with bII major chord',
    major: ['iii', 'IV', 'iii', 'bII'],
    minor: ['I', 'bII', 'bVII', 'I']
  },

  phrygianTension: {
    name: 'Phrygian Tension',
    genre: 'Modal',
    description: 'Dark, exotic progression emphasizing flat 2nd',
    major: ['iii', 'bII', 'I', 'bII'],
    minor: ['i', 'bII', 'i', 'bVII']
  },

  lydianDream: {
    name: 'Lydian Dream',
    genre: 'Modal',
    description: 'Bright, ethereal sound with raised 4th',
    major: ['Imaj7', 'II', 'Imaj7', 'V'],
    minor: ['imaj7', 'II', 'imaj7', 'v']
  },

  lydianFloat: {
    name: 'Lydian Float',
    genre: 'Modal',
    description: 'Dreamy progression emphasizing #4',
    major: ['I', 'II', 'iii', 'II'],
    minor: ['i', 'II', 'III', 'II']
  },

  mixolydianRock: {
    name: 'Mixolydian Rock',
    genre: 'Modal',
    description: 'Classic rock sound with bVII',
    major: ['I', 'bVII', 'IV', 'bVII'],
    minor: ['i', 'bVII', 'iv', 'bVII']
  },

  mixolydianPower: {
    name: 'Mixolydian Power',
    genre: 'Modal',
    description: 'Strong progression for rock/folk, emphasizes bVII',
    major: ['I', 'bVII', 'bVI', 'bVII', 'I'],
    minor: ['i', 'bVII', 'bVI', 'bVII', 'i']
  },

  aeolianNatural: {
    name: 'Aeolian Natural',
    genre: 'Modal',
    description: 'Pure natural minor progression',
    major: ['vi', 'VII', 'i', 'iv'],
    minor: ['i', 'bVII', 'bVI', 'v']
  },

  aeolianDescent: {
    name: 'Aeolian Descent',
    genre: 'Modal',
    description: 'Descending Aeolian with natural 7th',
    major: ['vi', 'V', 'IV', 'III'],
    minor: ['i', 'bVII', 'bVI', 'v', 'iv']
  },

  locrianRare: {
    name: 'Locrian Diminished',
    genre: 'Modal',
    description: 'Rare, unstable Locrian sound with dim tonic',
    major: ['vii°', 'IV', 'V', 'I'],
    minor: ['i°', 'bII', 'bIII', 'iv']
  },

  ionianBright: {
    name: 'Ionian Bright',
    genre: 'Modal',
    description: 'Pure major scale progression (Ionian)',
    major: ['Imaj7', 'IVmaj7', 'V7', 'Imaj7'],
    minor: ['imaj7', 'ivmaj7', 'v7', 'imaj7']
  },

  modalInterchange: {
    name: 'Modal Interchange',
    genre: 'Modal',
    description: 'Borrows chords from parallel modes',
    major: ['I', 'bVII', 'bVI', 'IV', 'I'],
    minor: ['i', 'iv', 'bVII', 'III', 'i']
  },

  modalAmbient: {
    name: 'Modal Ambient',
    genre: 'Modal',
    description: 'Floating, atmospheric modal progression',
    major: ['I', 'bVII', 'bVI', 'II', 'I'],
    minor: ['i', 'bVII', 'bVI', 'iv', 'i']
  },

  // Advanced Progressions
  descending: {
    name: 'Descending Bass',
    genre: 'Classical',
    description: 'Chromatic bass descent with harmonic richness',
    major: ['I', 'VII', 'vi', 'V', 'IV', 'iii', 'ii', 'I'],
    minor: ['i', 'VII', 'VI', 'V', 'iv', 'III', 'ii°', 'i']
  },

  circle: {
    name: 'Circle Progression',
    genre: 'Jazz',
    description: 'Moving through the circle of fifths',
    major: ['I', 'IV', 'vii°', 'iii', 'vi', 'ii', 'V', 'I'],
    minor: ['i', 'iv', 'VII', 'III', 'VI', 'ii°', 'V', 'i']
  },

  chromatic: {
    name: 'Chromatic Walk',
    genre: 'Jazz',
    description: 'Chromatic movement for sophisticated harmony',
    major: ['I', 'bII', 'II', 'bIII', 'III', 'IV', '#IV', 'V'],
    minor: ['i', 'bII', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
  },

  jazz: {
    name: 'Jazz Standard',
    genre: 'Jazz',
    description: 'Classic jazz progression with seventh chords',
    major: ['Imaj7', 'vi7', 'ii7', 'V7', 'Imaj7', 'IV7', 'vii°7', 'iii7'],
    minor: ['i7', 'iv7', 'VII7', 'III', 'VI', 'ii°7', 'V7']
  }
};

export const progressionCategories = {
  'Hymn & Sacred': ['hymnClassic', 'gospelLift', 'processional', 'amen', 'gospel'],
  'Folk & Traditional': ['folkLoop', 'celticMotion', 'balladFlow', 'minorStory'],
  'Classical': ['circleOfFifths', 'mozartCadence', 'pachelbel', 'romanticMinor', 'descending'],
  'Contemporary': ['popStandard', 'lofiChill', 'worship', 'contemporary', 'classic'],
  'Jazz': ['jazzTurnaround', 'circle', 'chromatic', 'jazz'],
  'Modal': [
    'dorian', 'dorianVamp', 'dorianGroove',
    'mixolydian', 'mixolydianRock', 'mixolydianPower',
    'phrygian', 'phrygianDominant', 'phrygianTension',
    'lydian', 'lydianDream', 'lydianFloat',
    'aeolianNatural', 'aeolianDescent',
    'locrianRare', 'ionianBright',
    'modalInterchange', 'modalAmbient', 'modal'
  ]
};
