# New Features Guide

## 1. Expanded Chord Progressions Library

### Overview
The Music Machine now includes **30+ chord progressions** organized into 6 categories, providing a rich palette for musical expression.

### Categories & Progressions

#### Hymn & Sacred (5 progressions)
- **Hymn Classic**: Foundation of Western church harmony (I-IV-V-I)
- **Gospel Lift**: Emotional IV→iv lift progression
- **Processional Cadence**: Majestic hymn intro/ending
- **Amen Ending**: Traditional church cadence (IV-I)
- **Gospel Standard**: Extended gospel with repeated patterns

#### Folk & Traditional (4 progressions)
- **Folk Loop**: Simple circular pattern (I-V-vi-IV)
- **Celtic Motion**: Mixolydian modal brightness
- **Ballad Flow**: Gentle narrative progression
- **Minor Story**: Somber introspective folk minor

#### Classical (5 progressions)
- **Circle of Fifths**: Full diatonic motion with voice-leading
- **Mozart Cadence**: Classical with secondary dominant
- **Pachelbel Sequence**: Canon-like stepwise bass
- **Romantic Minor**: Emotional 19th-century flow
- **Descending Bass**: Chromatic bass descent

#### Contemporary (5 progressions)
- **Pop Standard**: Modern I-V-vi-IV backbone
- **Lofi Chill**: Dreamy suspended 7th chords
- **Modern Worship**: Contemporary worship movement
- **Contemporary Mix**: Varied harmonic progression
- **Classic**: Timeless I-vi-IV-V

#### Jazz (4 progressions)
- **Jazz Turnaround**: ii-V-I with extended harmonies
- **Circle Progression**: Moving through fifths
- **Chromatic Walk**: Sophisticated chromatic movement
- **Jazz Standard**: Classic 7th chord progression

#### Modal (5 progressions)
- **Dorian Mode**: Minor with bright sixth
- **Mixolydian Mode**: Major with lowered seventh
- **Phrygian Mode**: Exotic Spanish/dramatic
- **Lydian Mode**: Bright dreamy raised fourth
- **Modal Mix**: Combined atmospheric colors

### How to Use
1. Open the Music Machine in the player view
2. Scroll to "Chord Progression" section
3. Select a **Category** (e.g., "Hymn & Sacred")
4. Choose a specific **Progression** from that category
5. View the progression's description on hover
6. Play to hear the progression with your selected instrument

---

## 2. Expanded Chord Vocabulary

### Overview
Comprehensive chord library with **35+ chord types** covering triads, extended, altered, and jazz voicings.

### Chord Categories

#### Triads (4 types)
- Major, Minor, Diminished, Augmented

#### Suspended (3 types)
- Sus2, Sus4, Maj7sus4

#### Seventh Chords (7 types)
- Major 7th, Dominant 7th, Minor 7th
- Half-Diminished 7th, Fully Diminished 7th
- Minor Major 7th, Augmented Major 7th

#### Extended (5 types)
- Dominant 9th, Major 9th, Minor 9th
- Dominant 11th, Dominant 13th

#### Altered (6 types)
- Dom 7♯9 (Hendrix), Dom 7♭9
- Dom 7♭5, Dom 7♯5, Dom 13♭9
- Altered Dominant (7alt)

#### Add Chords (5 types)
- Add9, Add11, Add13, 6th, Minor 6th

#### Special (1 type)
- Power Chord (5th)

### Chord Voicing Controls
- **Chord Type**: Select from triad, 7th, 9th, 11th, sus2, sus4
- **Inversion**: Choose root, 1st, 2nd, or 3rd inversion
- All progressions automatically adapt to selected voicing

---

## 3. Voice + Music Integration

### Overview
Record your voice and mix it with instrumental tracks to create complete musical performances.

### Features

#### Voice Recording
- High-quality microphone recording
- Real-time level monitoring
- Optimized file compression (mono, 32kbps)
- Session-based (auto-deleted on close)

#### Music Recording
- Captures instrumental playback from Music Machine
- Records selected progression with chosen instrument
- Synced with voice for perfect alignment

#### Mixing Controls
- **Music Volume**: 0-100% (default 70%)
- **Voice Volume**: 0-100% (default 100%)
- Real-time preview before mixing
- Professional audio mixing engine

### How to Use

#### Step 1: Record Instrumental Track
1. Open Music Machine
2. Select your key, tempo, progression, and instrument
3. Click **Play** to start the music
4. The music is automatically recorded while playing
5. Click **Stop** when finished

#### Step 2: Record Your Voice
1. Scroll to Voice Recorder section below Music Machine
2. Click **Start Recording**
3. Allow microphone access when prompted
4. Sing or speak along with the scripture
5. Click **Stop Recording** when finished

#### Step 3: Mix Tracks
1. In the Voice Recorder, locate "Mix Voice + Music" section
2. Click **Show Controls** to adjust volumes
3. Set Music Volume (balance between voice and instruments)
4. Set Voice Volume (your recording level)
5. Click **Mix Tracks** button
6. Wait for processing (typically 5-10 seconds)

#### Step 4: Download & Share
- **Play Mixed**: Preview the combined recording
- **Save Mixed**: Download as high-quality WAV file
- **Share**: Share on social media platforms

### Audio Export Formats
- **Voice Only**: Compressed WebM (small file size)
- **Mixed Track**: Uncompressed WAV (high quality)
- Sample rate: 44.1kHz (CD quality)
- Bit depth: 16-bit

### Tips for Best Results
- Use headphones to avoid feedback
- Position microphone 6-12 inches from mouth
- Record in a quiet environment
- Adjust mix volumes based on your voice strength
- The music volume default (70%) leaves room for voice prominence

---

## Technical Implementation

### New Files Created
1. **src/data/chordProgressions.ts**: 30+ progressions with metadata
2. **src/data/chordVocabulary.ts**: 35+ chord types with intervals
3. **src/utils/audioMixer.ts**: Professional audio mixing engine

### Updated Components
1. **MusicMachine.tsx**: Integrated new progressions, chord vocabulary, and recording
2. **VoiceRecorder.tsx**: Added mixing controls and export functionality
3. **App.tsx**: Fixed progress hook integration

### Key Technologies
- **Tone.js**: Music synthesis and playback
- **Web Audio API**: Audio recording and mixing
- **OfflineAudioContext**: High-quality audio rendering
- **MediaRecorder API**: Voice capture
- **WAV encoding**: Professional audio export

---

## Browser Compatibility
- ✅ Chrome 60+ (recommended)
- ✅ Firefox 55+
- ✅ Safari 14+
- ✅ Edge 79+

### Required Permissions
- **Microphone**: For voice recording
- **Storage**: For temporary audio files (auto-cleaned)

---

## Troubleshooting

### No Audio Output
- Check browser audio permissions
- Ensure volume sliders are above 0%
- Click Play button (required for browser autoplay policy)

### Voice Recording Fails
- Grant microphone permission when prompted
- Check system microphone is enabled
- Try refreshing the page and re-allowing permissions

### Mixing Takes Too Long
- Normal processing time: 5-10 seconds
- Longer recordings (>2 min) may take up to 30 seconds
- Do not close page during mixing

### File Too Large
- Voice recordings are compressed (mono, 32kbps)
- Typical file size: ~4KB per second of recording
- Mixed WAV files are larger but maintain quality

---

## Future Enhancements (Roadmap)
- Multi-track layering (vocals + harmonies)
- Real-time effects (reverb, EQ, compression)
- Cloud storage for saving projects
- Collaborative recording features
- Additional modal progressions (Aeolian, Locrian)
- Chord substitution suggestions
- MIDI export functionality
