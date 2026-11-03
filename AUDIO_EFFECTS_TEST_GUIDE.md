# Audio Effects Testing Guide

## How to Test the Audio Effects Suite

### Step 1: Open the Music Machine
1. Navigate to any scripture passage (e.g., John 3:16)
2. The Music Machine panel should appear

### Step 2: Ensure SoundFont is Enabled
1. In the Music Machine panel, verify "Use SoundFont" toggle is **ON**
2. Select an instrument (Piano, Organ, Strings, etc.)
3. Wait for SoundFont to load (loading indicator will appear)

### Step 3: Start Playback
1. Click the **Play** button
2. You should hear SoundFont chord progressions playing
3. Verify audio is working without effects first

### Step 4: Open Audio Effects
1. Scroll down in the Music Machine panel
2. Look for the **"Open Audio Effects Suite"** button (gradient purple/pink)
3. Click the button
4. A full-screen effects panel should appear

### Step 5: Test Individual Effects

**IMPORTANT**: Effects will process the SoundFont audio in real-time. Make sure SoundFont playback is working first!

#### Test Reverb
1. Click the **Power** button for Reverb (should turn cyan when on)
2. Adjust the **Wet** slider (0-100%)
3. Adjust the **Decay** slider (0.1-10 seconds)
4. **Expected**: You should hear added space/depth to the sound

#### Test Delay
1. Click the **Power** button for Delay (should turn blue when on)
2. Adjust the **Wet** slider
3. Adjust the **Time** slider (0.01-2 seconds)
4. Adjust the **Feedback** slider (0-90%)
5. **Expected**: You should hear echo/repeating notes

#### Test Compressor
1. Click the **Power** button for Compressor (should turn amber when on)
2. Adjust the **Threshold** slider (-60 to 0 dB)
3. Adjust the **Ratio** slider (1:1 to 20:1)
4. **Expected**: Volume should be more consistent

#### Test Chorus
1. Click the **Power** button for Chorus (should turn emerald when on)
2. Adjust the **Wet** slider
3. Adjust the **Rate** slider (0.1-10 Hz)
4. **Expected**: Sound should become warmer/thicker

#### Test Phaser
1. Click the **Power** button for Phaser (should turn teal when on)
2. Adjust the **Wet** slider
3. Adjust the **Rate** slider (0.1-10 Hz)
4. **Expected**: Sweeping/filtered sound effect

#### Test Tremolo
1. Click the **Power** button for Tremolo (should turn green when on)
2. Adjust the **Wet** slider
3. Adjust the **Rate** slider (0.1-20 Hz)
4. **Expected**: Rhythmic volume pulsing

### Step 6: Combine Effects
- Try enabling multiple effects at once
- Adjust parameters while playback is running
- Effects should apply in real-time with no audio dropouts

### Troubleshooting

#### No Sound at All
- Check browser console for errors (F12)
- Verify audio is not muted in browser
- Try refreshing the page
- Click anywhere on page to ensure audio context started

#### Effects Not Working
- Check console for "Audio effects initialized successfully" message
- Check console for "Synth connected to effects chain" message
- Verify effects panel shows "Effects are active and processing audio"
- Try toggling effects on/off

#### Console Messages to Look For
```
✅ "Audio effects initialized successfully"
✅ "SoundFont connected to effects chain"
✅ "Synth connected to effects chain"
✅ No error messages
```

### Expected Audio Signal Flow (with SoundFont)
```
Music Machine Play Button
    ↓
SoundFont Player (generates audio from .mp3 samples)
    ↓
SoundFont Effects Input Node
    ↓
Tone.js Effects Chain:
  - Reverb (spatial depth)
  - Delay (echo)
  - Compressor (dynamics)
  - Limiter (prevent clipping)
  - Chorus (warmth)
  - Phaser (sweep)
  - Tremolo (volume modulation)
    ↓
Audio Output (speakers/headphones)
```

### Expected Audio Signal Flow (without SoundFont - fallback)
```
Music Machine Play Button
    ↓
Tone.js PolySynth (generates audio)
    ↓
Volume Node (music volume control)
    ↓
[Same effects chain as above]
    ↓
Audio Output (speakers/headphones)
```

### Browser Console Testing
Open the console (F12) and verify:
1. No red error messages
2. See initialization logs
3. See connection logs when playing

### Performance Check
- Audio should play smoothly with no clicks or pops
- Effects should respond immediately to slider changes
- Multiple effects can be enabled simultaneously
- CPU usage should remain reasonable (check browser task manager)

## Implementation Details

### Files Created
- `/src/utils/globalAudioEffects.ts` - Tone.js effects engine
- `/src/components/SimpleAudioEffects.tsx` - Effects UI

### Files Modified
- `/src/components/MusicMachine.tsx` - Audio routing and integration

### Key Changes
1. Synth now routes through effects chain instead of directly to output
2. Effects initialize automatically when Music Machine loads
3. Effects panel provides real-time control over Tone.js parameters
4. All effects use proper wet/dry mixing for smooth transitions
