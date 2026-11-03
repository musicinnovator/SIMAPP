# Instrument Switching Fix Documentation

## Issue Summary
The application would sometimes go blank (white screen) when users changed instruments in the Music Machine, requiring a page refresh. This occurred when switching between SoundFont instruments like Acoustic Grand Piano, Church Organ, Strings, etc.

## Root Causes

### 1. Shared AudioContext Being Closed
**Problem:** The SoundFontManager's `dispose()` method was closing the AudioContext, which is shared with Tone.js. When changing instruments, the old manager was disposed, closing the context that both systems rely on.

**Effect:**
- Subsequent audio operations would fail with "Cannot resume a closed AudioContext"
- Screen would freeze/go blank as React error boundaries caught the exceptions

### 2. Effects Starting Multiple Times
**Problem:** When instruments changed, the effects initialization would run multiple times, attempting to start Chorus and Tremolo effects that were already running.

**Effect:**
- Error: "Start time must be strictly greater than previous start time"
- Audio effects would fail to initialize
- Playback would not work properly

### 3. Phaser.start() Method
**Problem:** The code was attempting to call `.start()` on Tone.Phaser, which doesn't have this method (unlike Chorus/Tremolo).

**Effect:**
- TypeError: "this.phaser.start is not a function"
- Effects initialization would fail completely

## Solutions Implemented

### 1. Preserve Shared AudioContext

**File:** `src/utils/soundFontManager.ts`

**Change:** Modified `dispose()` method to NOT close the AudioContext:

```typescript
dispose(): void {
  this.stopAllNotes();
  this.clearCache();
  // DO NOT close the AudioContext - it's shared with Tone.js
  // Closing it would break all audio functionality

  // Disconnect effects node but keep references
  if (this.effectsInputNode) {
    try {
      this.effectsInputNode.disconnect();
    } catch (e) {
      // Already disconnected
    }
  }

  // Don't null out the context - it will be reused
}
```

**Why it works:**
- AudioContext remains alive across instrument changes
- Multiple SoundFontManager instances can share the same context
- Tone.js and SoundFont coexist without conflicts

### 2. Prevent Duplicate Effect Starts

**File:** `src/utils/globalAudioEffects.ts`

**Change:** Added state checks before starting effects:

```typescript
// Start modulation effects (only for those that need it)
try {
  if (this.chorus.state === 'stopped') {
    this.chorus.start();
  }
} catch (e) {
  console.warn('Chorus already started or error:', e);
}

try {
  if (this.tremolo.state === 'stopped') {
    this.tremolo.start();
  }
} catch (e) {
  console.warn('Tremolo already started or error:', e);
}
```

**Why it works:**
- Only starts effects if they're in the 'stopped' state
- Catches and logs any errors gracefully
- Prevents the "start time" error

### 3. Removed Phaser.start() Call

**File:** `src/utils/globalAudioEffects.ts`

**Change:** Removed the line `this.phaser.start();`

**Why it works:**
- Phaser doesn't need to be "started" like oscillator-based effects
- It works automatically once connected to the effects chain

### 4. Enhanced Error Handling in setupSynth

**File:** `src/components/MusicMachine.tsx`

**Change:** Added comprehensive error handling:

```typescript
const setupSynth = async () => {
  try {
    // ... existing dispose code ...

    // Ensure Tone context is ready
    if (Tone.context.state === 'suspended') {
      await Tone.start();
    }

    // Ensure effects are initialized before connecting
    if (!globalAudioEffects.isInitialized()) {
      try {
        await globalAudioEffects.initialize();
      } catch (error) {
        console.error('Could not initialize effects in setupSynth:', error);
        // Continue without effects
      }
    }

    // ... rest of setup ...
  } catch (error) {
    console.error('Error in setupSynth:', error);
  }
};
```

**Why it works:**
- Gracefully handles context state issues
- Allows synth to work even if effects fail
- Prevents crashes from propagating to React

## Testing Performed

### Test Cases
1. ✓ Switch from Piano to Organ - No crash
2. ✓ Switch from Organ to Strings - No crash
3. ✓ Rapid switching between multiple instruments - No crash
4. ✓ Switch while music is playing - Clean transition
5. ✓ Switch with effects enabled - Effects continue working
6. ✓ Page refresh not required after instrument change

### Expected Behavior
- Smooth instrument transitions
- No white screen/blank page
- Audio continues working
- Effects remain functional
- Console shows no critical errors

## Technical Details

### AudioContext Lifecycle
```
App Start
    ↓
Create Tone.js AudioContext
    ↓
SoundFontManager uses same context
    ↓
Instrument Change
    ↓
Old instrument unloaded (context preserved)
    ↓
New instrument loaded (uses same context)
    ↓
Continue playback seamlessly
```

### Effect Initialization Lifecycle
```
First Load
    ↓
Initialize effects once
    ↓
Check if already initialized
    ↓
If yes: Skip initialization
    ↓
If no: Initialize safely with state checks
    ↓
Connect to audio graph
```

## Backward Compatibility

### Preserved Functionality
- ✓ All instrument sounds work as before
- ✓ Audio effects still function correctly
- ✓ Voice-leading optimization unaffected
- ✓ Recording features unchanged
- ✓ Session bank functionality intact
- ✓ SoundFont quality toggle works

### No Breaking Changes
- No API changes
- No UI changes
- No data structure changes
- Existing saved progressions still work
- All settings persist correctly

## Prevention Measures

### Design Patterns Used
1. **Singleton AudioContext** - Shared across all audio systems
2. **State Checking** - Verify state before operations
3. **Graceful Degradation** - Continue without effects if they fail
4. **Try-Catch Wrappers** - Contain errors to prevent crashes
5. **Resource Preservation** - Don't dispose shared resources

### Future Recommendations
- Consider implementing an AudioManager singleton to centralize context management
- Add telemetry to track instrument switching patterns
- Implement retry logic for failed audio operations
- Add user-facing error messages for audio issues

## Related Files Modified

1. `src/utils/soundFontManager.ts` - AudioContext lifecycle
2. `src/utils/globalAudioEffects.ts` - Effect initialization
3. `src/components/MusicMachine.tsx` - Error handling

## Conclusion

The instrument switching issue has been resolved by:
1. Preserving the shared AudioContext across all audio systems
2. Adding state checks to prevent duplicate effect starts
3. Removing invalid method calls
4. Adding comprehensive error handling

Users can now switch between instruments smoothly without experiencing crashes or requiring page refreshes. All existing functionality remains intact and working as designed.
