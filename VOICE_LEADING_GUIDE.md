# Voice-Leading Feature Guide

## Overview
The Voice-Leading feature automatically optimizes chord voicings in progressions to create smooth, professional-sounding transitions between chords. Instead of all chords playing in root position with large jumps, the system intelligently selects inversions to minimize voice motion and preserve common tones.

## What is Voice-Leading?

Voice-leading is a fundamental principle in music composition where individual voices (notes) in a chord move smoothly to the nearest notes in the next chord. This creates:

- **Smoother transitions** - Minimal movement between chords
- **Common tone preservation** - Notes that exist in both chords stay in place
- **Professional sound** - More natural and musical chord progressions
- **Reduced register jumps** - Voices don't leap unnecessarily

## How It Works

### Algorithm Features

1. **Common Tone Preservation**
   - Identifies notes that appear in consecutive chords
   - Keeps those notes in the same register (top voice priority)
   - Minimizes disruption between chord changes

2. **Minimal Voice Motion**
   - Calculates total semitone movement across all voices
   - Selects the inversion that requires the least total motion
   - Prevents unnecessary octave jumps

3. **Top Voice Continuity**
   - Prioritizes keeping the top voice (melody) smooth
   - Searches for inversions that maintain the melodic line
   - Falls back to minimal motion when exact matches aren't possible

### Example

**Without Voice-Leading** (all root position):
```
C Major: C4-E4-G4
F Major: F4-A4-C5 (large jump)
G Major: G4-B4-D5
C Major: C5-E5-G5 (another jump)
```

**With Voice-Leading** (optimized):
```
C Major: C4-E4-G4
F Major: C4-F4-A4 (C4 preserved as common tone)
G Major: B3-D4-G4 (smooth voice motion)
C Major: C4-E4-G4 (returns smoothly)
```

## Using the Feature

### Enabling Voice-Leading

1. Open the Music Machine panel
2. Navigate to the "Chord Voicing" section
3. Find "Smooth Voice-Leading" toggle
4. Click to turn **ON** (button turns green)

### What Happens When Enabled

- Manual inversion control is disabled (grayed out)
- Chord progressions automatically optimize voicings
- Smooth transitions occur during playback
- Works with all chord types (triads, 7ths, 9ths, etc.)
- Compatible with all voicing techniques (block, arpeggiated, etc.)

### What Happens When Disabled

- Manual inversion control is re-enabled
- Chords play in the selected inversion
- Original behavior is fully preserved
- No voice-leading optimization applied

## Technical Implementation

### Key Components

**Voice-Leading Engine** (`src/utils/voiceLeading.ts`)
- Singleton class managing voice-leading state
- Tracks last voicing across chord changes
- Calculates optimal inversions in real-time
- Preserves top voice when possible

**Integration Points**
- `generateChordProgression()` - Applies voice-leading to generated chords
- SoundFont playback - Uses optimized voicings
- Tone.js playback - Uses optimized voicings

### Data Flow

```
User selects progression
    ↓
Generate base chords (root position)
    ↓
Voice-Leading enabled?
    ├─ YES → Apply voice-leading algorithm
    │         ├─ Reset engine
    │         ├─ Process each chord
    │         ├─ Find optimal voicing
    │         └─ Store in chord.voicing property
    │
    └─ NO  → Use original chord.notes
    ↓
Playback uses appropriate notes
```

## Compatibility

### Works With
- ✓ All chord types (triad, 7th, 9th, 11th, sus2, sus4)
- ✓ All key signatures (major and minor)
- ✓ All voicing techniques (block, arpeggiated, broken, partial)
- ✓ Custom and preset progressions
- ✓ SoundFont and Tone.js playback
- ✓ All instruments

### Does Not Affect
- Voice settings (speech synthesis)
- Recording functionality
- Audio effects
- Tempo and key signature
- Session bank saves

## Best Practices

### When to Use Voice-Leading

**Recommended:**
- Hymns and sacred music
- Classical progressions
- Smooth, connected passages
- Meditative or contemplative pieces
- Four-part harmony style

**Optional:**
- Contemporary worship songs
- Modern progressions with intentional jumps
- Compositions where voice independence is desired

### Tips

1. **Start with it ON** - Voice-leading generally improves most progressions
2. **Compare** - Toggle it off and on to hear the difference
3. **Use with triads** - Works especially well with 3-note chords
4. **Experiment with 7ths** - Creates rich, smooth jazz-style progressions

## Troubleshooting

### Voice-leading seems too conservative
- The algorithm prioritizes smoothness over dramatic effect
- If you want bigger jumps, turn voice-leading off
- Manual inversions give you full control

### Top voice doesn't sound melodic
- Voice-leading preserves common tones, not melody
- For specific melodic lines, use manual inversions
- Custom progressions may require manual voicing

### Some progressions sound strange
- Certain chord combinations may not have smooth voicings
- The algorithm chooses the best available option
- Try simplifying to triads or adjusting the progression

## Future Enhancements

Potential additions:
- Voice-leading presets (strict, moderate, loose)
- Bass line preservation option
- Specific voice constraints
- Visualization of voice motion
- Export voice-leading analysis

## Examples to Try

### Test Progressions

1. **I-vi-IV-V in C Major**
   - Without: C-E-G, A-C-E, F-A-C, G-B-D (multiple jumps)
   - With: C-E-G, C-E-A, C-F-A, B-D-G (much smoother)

2. **i-VI-III-VII in A Minor**
   - Test how voice-leading handles minor key progressions
   - Notice common tone preservation

3. **ii-V-I Jazz Progression**
   - Works beautifully with 7th chords
   - Creates professional jazz sound

## Conclusion

The Voice-Leading feature brings classical music theory principles to your chord progressions, creating more musical and professional-sounding results automatically. It's an additive feature that preserves all existing functionality while providing an option for enhanced musicality.

**Try it with your favorite scripture passages and hear the difference!**
