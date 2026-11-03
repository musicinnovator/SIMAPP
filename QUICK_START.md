# Quick Start Guide - New Features

## 🎵 Using Expanded Chord Progressions

### Step 1: Access the Music Machine
1. Navigate to Scripture Library
2. Select any scripture passage
3. The Music Machine appears below the scripture player

### Step 2: Choose a Progression
1. Scroll to the "Chord Progression" section
2. Click the **"Category"** dropdown
3. Select from: Hymn & Sacred, Folk, Classical, Contemporary, Jazz, or Modal
4. Choose a specific progression from the list
5. Hover over any progression to see its description

### Step 3: Play
- Click the **Play** button to hear your selected progression
- The chords will display in real-time as they play
- All existing controls (tempo, key, instrument) still work!

---

## 🎹 Using Extended Chord Types

### Available Now in Music Machine:
The chord voicing controls already exist in the Music Machine:

1. **Chord Type** dropdown:
   - Triad (3 notes) - basic chords
   - 7th Chords (4 notes) - adds depth
   - 9th Chords (5 notes) - jazz color
   - 11th Chords (6 notes) - lush sound
   - Sus2 / Sus4 - suspended chords

2. **Inversion** dropdown:
   - Root Position
   - 1st Inversion
   - 2nd Inversion
   - 3rd Inversion

All 30+ progressions automatically adapt to your selected voicing!

---

## 🎤 Recording Voice + Music

### Complete Workflow

#### Part 1: Record the Music
1. Open a scripture in the player view
2. Set up your Music Machine:
   - Choose key signature
   - Select tempo
   - Pick chord progression
   - Select instrument sound
3. Click **Play** to start
4. Music is automatically recorded while playing
5. Click **Stop** when finished

#### Part 2: Record Your Voice
1. Scroll down to the **Voice Recorder** section
2. Click **Start Recording**
3. Allow microphone access (browser will ask)
4. Sing or speak the scripture text
5. Watch the level meter to ensure good audio
6. Click **Stop Recording** when done

#### Part 3: Mix the Tracks
1. Find the **"Mix Voice + Music"** section in Voice Recorder
2. Click **Show Controls**
3. Adjust sliders:
   - **Music Volume**: 70% is a good starting point
   - **Voice Volume**: 100% keeps your voice prominent
4. Click **Mix Tracks** button
5. Wait 5-10 seconds for processing
6. The "Mixed Track Ready" indicator will appear

#### Part 4: Listen & Download
1. Click **Play Mixed** to preview
2. If satisfied, click **Save Mixed** to download
3. File downloads as high-quality WAV
4. Share your recording!

---

## 💡 Pro Tips

### For Best Audio Quality
- Use headphones while recording to avoid feedback
- Record in a quiet room
- Position yourself 6-12 inches from microphone
- Speak/sing clearly and at consistent volume

### For Best Mix Results
- Start with Music: 70%, Voice: 100%
- If music is too loud, lower Music volume to 50-60%
- If voice is too quiet, keep Voice at 100% and lower Music
- You can remix as many times as you want

### Progression Selection
- **Beginners**: Try "Classic" or "Folk Loop" (simple 4-chord patterns)
- **Hymns**: Use "Hymn Classic" or "Gospel Lift"
- **Contemporary Worship**: Try "Modern Worship" or "Lofi Chill"
- **Advanced**: Explore "Circle of Fifths" or "Jazz Turnaround"

### Custom Mode
- Click "Custom" mode in Chord Progression section
- Build your own progression chord by chord
- Set custom key signature and tempo
- Up to 8 chords per progression

---

## ⚡ Keyboard Shortcuts

Currently controlled by buttons, but here's the workflow:

1. **Music Machine**:
   - Play/Stop: Large button
   - Skip: Arrow buttons (±4 seconds)
   - Rewind: Circular arrow button

2. **Voice Recorder**:
   - Start/Stop: Main record button
   - Play/Pause: Playback controls

---

## 🔧 Troubleshooting

### "No sound when I click Play"
- Check your device volume
- Check Music Volume slider (should be > 0%)
- Some browsers block audio until user interaction - try clicking again

### "Microphone not working"
- Check browser permissions (click lock icon in address bar)
- Check system microphone settings
- Try refreshing page and allowing access again

### "Mix button is disabled"
- You need BOTH a voice recording AND music recording
- Make sure you played music (recording happens automatically)
- Make sure you recorded your voice

### "Mixed file is too large"
- This is normal - WAV files are uncompressed for quality
- A 2-minute recording will be about 20MB
- This ensures professional audio quality

---

## 📱 Browser Support

### Fully Supported
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 14+
- ✅ Edge 79+

### Required Browser Features
- Web Audio API (for music)
- MediaRecorder API (for voice)
- getUserMedia (for microphone)
- OfflineAudioContext (for mixing)

All modern browsers support these features.

---

## 🎓 Learning Resources

### Understanding Chord Progressions
Each progression category serves different purposes:
- **Hymn & Sacred**: Traditional, stable, uplifting
- **Folk**: Simple, memorable, storytelling
- **Classical**: Complex, voice-led, sophisticated
- **Contemporary**: Modern, popular, accessible
- **Jazz**: Extended harmonies, colorful
- **Modal**: Unique flavors, atmospheric

### Understanding Chord Types
- **Triads**: Foundation (3 notes)
- **7th**: Adds depth (4 notes)
- **9th/11th/13th**: Extended color (5-6 notes)
- **Suspended**: Tension and release
- **Altered**: Jazz sophistication

### Inversions
- **Root**: Bass note is the chord root (strongest)
- **1st**: Third in bass (smoother transitions)
- **2nd**: Fifth in bass (middle ground)
- **3rd**: Seventh in bass (jazz sound)

---

## ✨ What's New (Technical)

For developers and advanced users:

### New Data Files
- `src/data/chordProgressions.ts` - 30 progressions
- `src/data/chordVocabulary.ts` - 35 chord types
- `src/utils/audioMixer.ts` - Audio mixing engine

### Enhanced Components
- `MusicMachine.tsx` - Category-based progression UI
- `VoiceRecorder.tsx` - Full mixing integration
- Professional WAV export at 44.1kHz, 16-bit

### Audio Pipeline
- Voice: MediaRecorder → WebM Blob
- Music: Tone.js → MediaRecorder → WebM Blob
- Mixed: OfflineAudioContext → WAV Blob

---

## 🚀 Start Creating!

You now have everything you need to:
1. ✅ Explore 30+ chord progressions across 6 genres
2. ✅ Use 35+ chord types with inversions
3. ✅ Record your voice over instrumental tracks
4. ✅ Mix and export professional audio
5. ✅ Share your scripture music with others

**Dive in and start creating beautiful scripture music!**
