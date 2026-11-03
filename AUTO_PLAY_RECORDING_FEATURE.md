# Auto-Play Recording Feature

## Overview

The application now automatically starts music playback when you click "Start Recording" in any recording studio. This eliminates the need to manually scroll down to find and click the play button, then scroll back up to see the lyrics.

## How It Works

### User Experience

1. **Select your text/scripture** for the song
2. **Configure Music Machine settings** (instrument, chord progression, tempo, etc.)
3. **Click "Start Recording"** - Music automatically starts playing!
4. The lyrics remain visible on screen - no scrolling needed
5. Recording captures both your voice and the music

### Technical Implementation

This feature was implemented following strict **additive-only** principles:

- ✅ **No existing functionality was removed or modified**
- ✅ **All previous behaviors remain intact**
- ✅ **The manual play button still works exactly as before**
- ✅ **Auto-play is optional and can be disabled if needed**

## Components Updated

### Core Components

1. **MusicMachine** (`/src/components/MusicMachine.tsx`)
   - Added `useImperativeHandle` to expose `playMusic()` method
   - Parent components can now programmatically start music playback
   - Original play/pause button functionality preserved

2. **DualTrackRecorder** (`/src/components/DualTrackRecorder.tsx`)
   - Added optional `musicMachineRef` and `autoPlayOnRecord` props
   - Auto-starts music when "Start Recording" is clicked
   - Falls back to original validation if auto-play is disabled

3. **LiveRecordingStudio** (`/src/components/LiveRecordingStudio.tsx`)
   - Integrated auto-play support
   - Preserves original "music must be playing" validation

4. **CompactRecordingStudio** (`/src/components/CompactRecordingStudio.tsx`)
   - Added auto-play for both standard and professional recording modes
   - Works seamlessly with existing dual-track recording

5. **UnifiedStudioPage** (`/src/components/UnifiedStudioPage.tsx`)
   - Added MusicMachine ref for programmatic control
   - Auto-plays music when recording starts (except for voice-only mode)

### Parent Components

6. **ProfessionalRecordingStudio** (`/src/components/ProfessionalRecordingStudio.tsx`)
   - Updated to pass `musicMachineRef` to DualTrackRecorder

7. **ScripturePlayer** (`/src/components/ScripturePlayer.tsx`)
   - Updated to pass `musicMachineRef` to CompactRecordingStudio

## Configuration Options

### Enable/Disable Auto-Play

Auto-play is **enabled by default** but can be disabled:

```typescript
<DualTrackRecorder
  isPlaying={isPlaying}
  getMusicDestination={getMusicDestination}
  musicMachineRef={musicMachineRef}
  autoPlayOnRecord={false}  // Disable auto-play
/>
```

### When Auto-Play is Disabled

If `autoPlayOnRecord={false}`, the original behavior is preserved:
- User must manually start music before recording
- Alert/error shown if music isn't playing

## Benefits

1. **Improved Workflow**: No more scrolling to find the play button
2. **Better Focus**: Lyrics stay visible throughout the recording process
3. **Faster Recording**: One click to start both music and recording
4. **User-Friendly**: Natural and intuitive behavior
5. **Backward Compatible**: All existing functionality preserved

## Code Architecture

### Reference Flow

```
Recording Studio Component
    ↓
    musicMachineRef (React.RefObject)
    ↓
    MusicMachine Component (ForwardRef)
    ↓
    Exposed Methods:
      - playMusic()
      - stopMusic()
      - isPlaying()
      - togglePlay()
```

### Auto-Play Sequence

```
1. User clicks "Start Recording"
2. Check if music is already playing
3. If not playing AND autoPlayOnRecord is true:
   a. Call musicMachineRef.current.playMusic()
   b. Wait 100ms for state to update
   c. Proceed with recording setup
4. If not playing AND autoPlayOnRecord is false:
   a. Show error: "Please start music playback first"
   b. Return early (original behavior)
5. Setup and start recording
```

## Implementation Date

**March 20, 2026**

## Notes

- This feature follows the project's **Global Rules** for additive-only modifications
- No destructive changes were made to existing code
- All original validations and error handling remain intact
- The feature gracefully degrades if the MusicMachine ref is not available
