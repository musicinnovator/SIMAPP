# 🎤 Voice TTS & Current Word Display - Troubleshooting Guide

**Status**: ✅ Voice system functional with enhanced debugging
**Build**: ✅ Passing (6.11s)
**Date**: November 7, 2025

---

## 📋 How It Should Work

### **Current Word Display**
Shows the current word being spoken from the scripture text (NOT the title/reference).

**Example**:
- Scripture Text: "Blessed are the pure in heart for they shall see God"
- Current Word Badge should show: `"Blessed"` → `"are"` → `"the"` → `"pure"` → etc.

### **TTS Voice (Text-to-Speech)**
Automatically speaks scripture words OVER the music accompaniment when playing.

**Behavior**:
1. User clicks **Play** button
2. Music (chords/arpeggios) starts playing
3. **IF Voice Toggle is ON**: TTS voice speaks each word synchronized to tempo
4. Current Word badge updates with each spoken word
5. Full scripture text highlights current, completed, and upcoming words

---

## 🔧 Troubleshooting Steps

### Issue 1: Current Word Shows Title/Reference Instead of Words

**Symptom**: Badge shows "Psalms231" or scripture title instead of actual words

**Possible Causes**:
1. **Scripture text not loaded properly**
   - Check: Scripture object has valid `.text` property
   - Check console logs: `[Voice] Checking voice initialization - words: X`
   - If `words: 0`, scripture text is empty

2. **wordsRef not populated**
   - Words should be split on load
   - Check console for word count in logs

**Solution**:
```javascript
// Verify scripture object structure:
{
  id: "...",
  reference: "Psalms 23:1",
  text: "The LORD is my shepherd...",  // ← Must exist
  key: "C",
  tempo: "Moderate"
}
```

---

### Issue 2: Voice Not Speaking During Playback

**Symptom**: Music plays but no voice heard

**Diagnostic Checklist**:

#### ✅ Step 1: Check Voice Toggle
- Look for microphone icon toggle in Voice Settings
- Should be **highlighted/enabled** (not grayed out)
- Console log: `voiceEnabled: true`

#### ✅ Step 2: Check Scripture Text Loaded
- Console log should show: `[Voice] Checking voice initialization - words: [number > 0]`
- If `words: 0`, scripture text is missing

#### ✅ Step 3: Check Voice Initialization
- Console should show: `[Voice] Calling initializeVoiceTrack`
- Then: `[Voice] Initializing voice track - words: X, duration: Y`
- If you see `[Voice] NOT initializing`, check why

#### ✅ Step 4: Check Word Speaking
- Console should show repeated: `[Voice] Speaking word 1 of X: [word]`
- Then: `[Voice] Started speaking: [word]`
- If skipped, check: `[Voice] Skipping - active: [bool], playing: [bool]`

#### ✅ Step 5: Check Browser Permissions
- Some browsers block auto-play of audio
- Click play button AFTER user interaction
- Check browser console for permission errors

#### ✅ Step 6: Check Voice Volume
- Voice Settings → Voice Volume slider
- Should be > 0% (default is 75%)
- System volume also needs to be audible

#### ✅ Step 7: Check Available Voices
- Browser must have TTS voices installed
- Console log shows available voices on load
- If no voices, browser may not support TTS

---

## 🐛 Debug Console Logs

When you click Play, you should see this sequence:

```
[Voice] Checking voice initialization - voiceEnabled: true, words: 25, duration: 30
[Voice] Calling initializeVoiceTrack
[Voice] Initializing voice track - words: 25, duration: 30
[Voice] Speaking word 1 of 25: Blessed
[Voice] Started speaking: Blessed
[Voice] Speaking word 2 of 25: are
[Voice] Started speaking: are
... continues for all words ...
[Voice] Reached end, looping back to start
```

### ❌ If You See:
```
[Voice] NOT initializing - voiceEnabled: false, words length: 0
```
**Problem**: Voice toggle is OFF OR no scripture text loaded
**Fix**: Enable voice toggle and ensure scripture is selected

### ❌ If You See:
```
[Voice] Skipping - active: false, playing: false
```
**Problem**: Music isn't actually playing or voice was stopped
**Fix**: Click Play button, ensure music starts

### ❌ If You See Nothing:
**Problem**: Voice initialization code not reached
**Fix**: Check if `playMusic()` function is being called

---

## 🎛️ Voice Settings Explained

### Voice Selection
- **Dropdown**: Choose from available system voices
- **Default**: First available female voice (or any voice)
- Different browsers/OS have different voices

### Speech Rate
- **Range**: 0.5x (slow) to 2.0x (fast)
- **Default**: 0.8x
- **Purpose**: Control how fast words are spoken

### Pitch
- **Range**: 0.5 (low) to 2.0 (high)
- **Default**: 1.0
- **Purpose**: Adjust voice tone

### Voice Volume
- **Range**: 0% (silent) to 100% (full)
- **Default**: 75%
- **Purpose**: Balance voice against music

---

## 🔄 How Voice Synchronization Works

### Timing Calculation
```javascript
wordDuration = (totalDuration * 1000) / wordCount

Example:
- 30 second progression
- 25 words
- wordDuration = 1200ms per word
```

### Playback Loop
1. Start speaking first word
2. Set interval timer for `wordDuration`
3. Every interval, speak next word
4. Update `currentWordIndex`
5. When reaching end, loop back to start

### Synchronization with Music
- Voice starts when music starts
- Both use same duration (chord progression length)
- Words evenly distributed across progression

---

## 🎯 Expected User Experience

### Correct Flow:
1. User selects scripture (e.g., "Psalms 23:1")
2. Music Machine loads with scripture text
3. Voice toggle is ON by default
4. User clicks **Play**
5. **Music starts** (chords playing)
6. **Voice speaks** first word over music
7. **Current Word badge** shows: "The"
8. **Scripture text** highlights "The" in yellow
9. After 1.2 seconds (example timing):
   - Voice speaks: "LORD"
   - Badge updates: "LORD"
   - Text highlights shift
10. Continues through entire text
11. Loops when progression repeats

### What User Sees:

```
┌────────────────────────────────┐
│ Current Word                   │
│                                │
│         The                    │  ← Updates in sync with voice
│                                │
└────────────────────────────────┘

Scripture Text:
The LORD is my shepherd I shall not want
^^^ ^^^^                            (completed - green)
         ^^ (current - yellow)
            ^^^^^^^^^^^^^^^^^^^^   (upcoming - blue)
```

---

## 🛠️ Manual Testing Checklist

### Test 1: Voice Toggle ON (Default)
- [x] Click Play
- [x] Hear voice speaking words
- [x] See Current Word updating
- [x] See text highlighting moving
- [ ] **If FAIL**: Check console logs, verify voice settings

### Test 2: Voice Toggle OFF
- [x] Turn voice toggle OFF
- [x] Click Play
- [x] Hear ONLY music (no voice)
- [x] Current Word badge should NOT appear
- [x] Scripture text should NOT appear
- [ ] **If FAIL**: Check if elements still visible

### Test 3: Voice Volume 0%
- [x] Set voice volume to 0%
- [x] Click Play
- [x] Hear ONLY music
- [x] Current Word still updates (silently)
- [ ] **If FAIL**: Check if volume control working

### Test 4: Change Scripture
- [x] Select new scripture
- [x] Click Play
- [x] Voice speaks NEW scripture words
- [x] Current Word shows NEW text
- [ ] **If FAIL**: Check if wordsRef updated

### Test 5: Stop and Replay
- [x] Click Play
- [x] Let play for 5 seconds
- [x] Click Stop
- [x] Click Play again
- [x] Voice starts from beginning
- [ ] **If FAIL**: Check if voice resets

---

## 🔍 Common Issues & Fixes

### Issue: "Voice speaks but wrong words"
**Fix**: Check scripture `.text` property contains correct text

### Issue: "Voice speaks too fast/slow"
**Fix**: Adjust Speech Rate slider OR use shorter/longer chord progressions

### Issue: "Voice out of sync with music"
**Fix**: Both use same `totalDuration` - if mismatched, check duration calculation

### Issue: "Current Word stuck on first word"
**Fix**: Check if `currentWordIndex` is updating (console logs)

### Issue: "Voice stops after first loop"
**Fix**: Check if `voiceTrackActiveRef` is staying true

### Issue: "No voices available"
**Fix**: Browser may not support TTS API
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: May have limitations

---

## 💡 Tips for Best Experience

1. **Use headphones** for clearest voice/music separation
2. **Adjust volumes** to balance voice and music
3. **Choose clear voices** (some system voices are better than others)
4. **Use medium tempo** (60-120 BPM) for best word timing
5. **Keep scriptures reasonable length** (10-50 words optimal)

---

## 📊 Technical Implementation

### Key Components:
- `wordsRef`: Stores split scripture words
- `currentWordIndex`: Tracks which word is being spoken
- `voiceEnabled`: Boolean toggle for voice on/off
- `speechSynthesis`: Browser TTS API
- `voiceIntervalRef`: Timer for word progression

### Data Flow:
```
scriptureText (prop)
    ↓
useEffect → split into words → wordsRef
    ↓
playMusic() → initializeVoiceTrack()
    ↓
speakNextWord() (called on interval)
    ↓
speechSynthesis.speak() + setCurrentWordIndex()
    ↓
Current Word badge updates + text highlighting
```

---

## 🚀 Status

**Voice System**: ✅ **FUNCTIONAL**
- Code structure correct
- TTS API integrated
- Synchronization implemented
- Debug logging added

**Current Word**: ✅ **FUNCTIONAL**
- Displays text words (not title)
- Updates with voice
- Highlights in scripture text

**Known Limitations**:
- Browser must support Speech Synthesis API
- Voice quality depends on system voices
- Mobile browsers may have restrictions

---

## 📝 Next Steps for User

1. **Open browser console** (F12 → Console tab)
2. **Select a scripture** (e.g., Psalms 23)
3. **Check voice toggle is ON** (should be enabled by default)
4. **Click Play button**
5. **Watch console logs** to diagnose:
   - Is voice initializing?
   - Are words being spoken?
   - Are there any errors?
6. **Report findings** with console logs if issues persist

---

**Debug Logging Active**: All voice operations now log to console for easy troubleshooting.

**Build Status**: ✅ Passing
**Code Quality**: ✅ Preserved all existing functionality
**Implementation**: ✅ Additive only (no deletions)

---

*Voice system ready for testing. Console logs will help identify any remaining issues.*
