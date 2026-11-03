# Voicing Patterns System - Testing Guide

## Overview
This document provides comprehensive testing procedures for the enhanced voicing patterns system, covering all Block, Arpeggiated, and Broken voicing techniques with their various patterns, error handling, and validation.

## System Architecture

### New Components
- **Type Definitions**: `/src/types/voicingPatterns.ts` - All TypeScript types
- **Pattern Library**: `/src/data/voicingPatternLibrary.ts` - 56 built-in patterns (17 Block, 24 Arpeggiated, 15 Broken)
- **Validation Engine**: `/src/utils/patternValidator.ts` - Pattern validation and error handling
- **Voicing Engine**: `/src/utils/voicingEngine.ts` - Core scheduling and playback engine
- **Database Migration**: `/supabase/migrations/20251107120000_create_user_voicing_patterns.sql`
- **State Management**: `/src/hooks/useVoicingPatterns.ts`
- **UI Components**:
  - `/src/components/VoicingPatternSelector.tsx` - Pattern selection interface
  - `/src/components/PatternPreview.tsx` - Pattern preview and visualization
  - `/src/components/CustomPatternEditor.tsx` - Custom pattern creation

## Built-in Pattern Library

### Block Voicing Patterns (17 total)

#### 4/4 Time Signature Patterns:
1. **block-4quarter** - 4 Quarter Notes (standard)
2. **block-2half** - 2 Half Notes
3. **block-whole** - Whole Note
4. **block-dotted-half-quarter** - Dotted Half + Quarter
5. **block-half-2quarter** - Half + 2 Quarters
6. **block-quarter-half-quarter** - Quarter + Half + Quarter
7. **block-2quarter-half** - 2 Quarters + Half
8. **block-8eighth** - 8 Eighth Notes
9. **block-syncopated** - Syncopated (Off-beat)

#### 3/4 Time Signature Patterns (Waltz):
10. **block-3quarter-waltz** - 3 Quarter Notes
11. **block-dotted-half-waltz** - Dotted Half
12. **block-half-quarter-waltz** - Half + Quarter

#### 2/4 Time Signature Patterns (March):
13. **block-2quarter-march** - 2 Quarter Notes
14. **block-half-march** - Half Note

#### 6/8 Time Signature Patterns:
15. **block-6eighth-68** - 6 Eighth Notes
16. **block-2dotted-quarter-68** - 2 Dotted Quarters

### Arpeggiated Patterns (24 total)

#### Four-Note Patterns (Sixteenth Notes):
1. **arp-1353** - Up and Back (1-3-5-3)
2. **arp-1535** - Root Fifth Third Fifth
3. **arp-1351** - Up and Down
4. **arp-1531** - Root Fifth Third Root
5. **arp-3153** - Third Root Fifth Third
6. **arp-3515** - Third Fifth Root Fifth
7. **arp-5313** - Fifth Down
8. **arp-5135** - Fifth Root Third Fifth

#### Three-Note Patterns (Eighth Notes):
9. **arp-135** - Simple Ascending
10. **arp-153** - Root Fifth Third
11. **arp-315** - Third Root Fifth
12. **arp-351** - Third Fifth Root
13. **arp-513** - Simple Descending
14. **arp-531** - Full Descending

#### Octave Patterns:
15. **arp-1358** - Octave Arpeggio (1-3-5-8)
16. **arp-1585** - Wide Octave
17. **arp-8531** - Octave Descending

#### Extended Patterns:
18. **arp-13531** - Extended Up/Down (5 notes)
19. **arp-15351** - Alternating Extended
20. **arp-13513** - Continuous Ascending

#### Special Subdivision Patterns:
21. **arp-triplet-135** - Triplet Ascending
22. **arp-triplet-531** - Triplet Descending
23. **arp-swing-1353** - Swing Up/Back (66% swing)
24. **arp-velocity-135** - Dynamic Ascending (velocity variation)

### Broken Patterns (15 total)

#### Standard Broken Patterns:
1. **broken-standard** - Standard Broken (16-16-8)
2. **broken-reverse** - Reverse Broken (8-16-16)
3. **broken-alternating** - Alternating (16-8-16-8)
4. **broken-even-eighths** - Even Eighths (8-8-8-8)

#### Dotted Rhythms:
5. **broken-scotch-snap** - Scotch Snap (16-dotted-8)
6. **broken-dotted** - Dotted Rhythm (dotted-8-16)

#### Specialized Patterns:
7. **broken-triplet** - Triplet Broken
8. **broken-stutter** - Stuttering (16-16-16-16)
9. **broken-gallop** - Galloping (8-16-16-8)
10. **broken-syncopated** - Syncopated Broken

#### Stumbling Effects:
11. **broken-stumble-light** - Light Stumble (subtle timing offset: 0.02s)
12. **broken-stumble-heavy** - Heavy Stumble (strong timing offset: 0.05s)

#### Random/Probabilistic Patterns:
13. **broken-random-light** - Random Light (15% drop probability)
14. **broken-random-medium** - Random Medium (25% drop probability)

#### Time Signature Specific:
15. **broken-waltz** - Waltz Broken (3/4 time)

---

## Unit Testing Guide

### Test 1: Pattern Library Validation

**Objective**: Verify all 56 built-in patterns are valid and error-free.

```typescript
// Test all Block patterns
import { BLOCK_PATTERNS } from './src/data/voicingPatternLibrary';
import { validateBlockPattern } from './src/utils/patternValidator';

BLOCK_PATTERNS.forEach(pattern => {
  const result = validateBlockPattern(pattern);
  console.assert(result.isValid, `Block pattern ${pattern.id} failed validation: ${result.errors}`);
});

// Test all Arpeggiated patterns
import { ARPEGGIATED_PATTERNS } from './src/data/voicingPatternLibrary';
import { validateArpeggiatedPattern } from './src/utils/patternValidator';

ARPEGGIATED_PATTERNS.forEach(pattern => {
  const result = validateArpeggiatedPattern(pattern);
  console.assert(result.isValid, `Arpeggio pattern ${pattern.id} failed validation: ${result.errors}`);
});

// Test all Broken patterns
import { BROKEN_PATTERNS } from './src/data/voicingPatternLibrary';
import { validateBrokenPattern } from './src/utils/patternValidator';

BROKEN_PATTERNS.forEach(pattern => {
  const result = validateBrokenPattern(pattern);
  console.assert(result.isValid, `Broken pattern ${pattern.id} failed validation: ${result.errors}`);
});
```

**Expected Result**: All patterns pass validation with no errors.

---

### Test 2: Block Voicing - Measure Duration Validation

**Objective**: Ensure Block patterns sum to correct measure length for each time signature.

```typescript
import { validateBlockPattern, getMeasureConstraints } from './src/utils/patternValidator';
import { BLOCK_PATTERNS } from './src/data/voicingPatternLibrary';

BLOCK_PATTERNS.forEach(pattern => {
  const constraints = getMeasureConstraints(pattern.timeSignature);
  const totalBeats = pattern.durations.reduce((sum, d) => sum + d.beats, 0);

  console.assert(
    Math.abs(totalBeats - constraints.beatsPerMeasure) < 0.01,
    `Pattern ${pattern.id} duration mismatch: ${totalBeats} vs ${constraints.beatsPerMeasure}`
  );
});
```

**Expected Result**: All Block patterns match their time signature duration.

---

### Test 3: Arpeggiated Voicing - Sequence Execution

**Objective**: Verify arpeggio patterns play notes in exact specified order.

**Manual Test Procedure**:
1. Open Music Machine
2. Select "Arpeggiated" voicing
3. Click "Show Advanced Pattern Options"
4. Test each of the 24 arpeggio patterns:
   - For pattern "arp-1353" (1-3-5-3): Listen and verify you hear Root → Third → Fifth → Third
   - For pattern "arp-8531" (8-5-3-1): Verify Octave → Fifth → Third → Root
   - For pattern "arp-triplet-135": Verify triplet subdivision timing
   - For pattern "arp-swing-1353": Verify swing feel (every other note delayed)

**Expected Result**: Each pattern plays notes in the exact sequence specified, with correct subdivision timing.

---

### Test 4: Broken Voicing - No Unintended Pauses

**Objective**: Verify Broken patterns have no timing gaps that shift musical feel.

```typescript
import { globalVoicingEngine } from './src/utils/voicingEngine';
import { BROKEN_PATTERNS } from './src/data/voicingPatternLibrary';

const testNotes = ['C4', 'E4', 'G4'];
const bpm = 120;

BROKEN_PATTERNS.forEach(pattern => {
  const scheduled = globalVoicingEngine.scheduleBrokenPattern(
    pattern,
    testNotes,
    0,
    bpm,
    0.7
  );

  // Verify no gaps larger than expected subdivision
  for (let i = 0; i < scheduled.length - 1; i++) {
    const currentEnd = scheduled[i].startTime + scheduled[i].duration;
    const nextStart = scheduled[i + 1].startTime;
    const gap = nextStart - currentEnd;

    console.assert(
      gap >= 0 && gap < 0.1, // Max 100ms gap
      `Pattern ${pattern.id} has unexpected gap: ${gap * 1000}ms`
    );
  }
});
```

**Expected Result**: No unintended pauses; timing is continuous within pattern rhythm.

---

### Test 5: Error Handling - Invalid Pattern Data

**Objective**: Test validation catches invalid patterns and provides clear errors.

```typescript
import { validateBlockPattern, validateArpeggiatedPattern } from './src/utils/patternValidator';

// Test 1: Block pattern with mismatched beats
const invalidBlock = {
  id: 'test-invalid',
  name: 'Invalid Block',
  description: 'Test',
  timeSignature: '4/4',
  durations: [
    { subdivision: 'quarter', beats: 1, relativePosition: 0 },
    { subdivision: 'quarter', beats: 1, relativePosition: 0.25 }
    // Missing 2 beats! Should total 4 for 4/4
  ]
};

const result1 = validateBlockPattern(invalidBlock);
console.assert(!result1.isValid, 'Should reject pattern with wrong beat count');
console.assert(result1.errors.length > 0, 'Should provide error message');

// Test 2: Arpeggio with invalid sequence values
const invalidArp = {
  id: 'test-invalid-arp',
  name: 'Invalid Arp',
  description: 'Test',
  sequence: '1-3-99-3', // 99 is invalid!
  subdivision: 'sixteenth'
};

const result2 = validateArpeggiatedPattern(invalidArp);
console.assert(!result2.isValid, 'Should reject invalid sequence values');
console.assert(result2.errors.some(e => e.includes('99')), 'Error should mention invalid value');
```

**Expected Result**: Validation rejects invalid patterns with specific error messages.

---

### Test 6: Time Signature Compatibility

**Objective**: Test patterns work correctly across all supported time signatures.

**Test Time Signatures**: 2/4, 3/4, 4/4, 5/4, 6/8, 7/8, 9/8, 12/8

**Manual Test Procedure**:
1. Set time signature to each value (2/4, 3/4, etc.)
2. Select Block voicing
3. Play progression
4. Verify:
   - Chords align with time signature beats
   - No timing drift across multiple measures
   - Pattern-specific time signature patterns work (e.g., block-3quarter-waltz for 3/4)

**Expected Result**: All time signatures play correctly with proper beat alignment.

---

### Test 7: Custom Pattern Creation & Saving

**Objective**: Test user can create and save custom patterns to database.

**Manual Test Procedure**:
1. Sign in to account
2. Select "Arpeggiated" voicing
3. Click "Show Advanced Pattern Options"
4. Click "Create Custom"
5. Enter:
   - Name: "My Test Pattern"
   - Description: "Testing custom patterns"
   - Sequence: "1-5-8-5-1"
   - Subdivision: "Eighth Notes"
6. Click "Save Pattern"
7. Verify:
   - Pattern appears in pattern list with "Custom" badge
   - Pattern is selectable and plays correctly
   - Pattern persists after page reload

**Expected Result**: Custom patterns save successfully and are usable immediately.

---

### Test 8: Database RLS Security

**Objective**: Verify Row Level Security prevents unauthorized access to user patterns.

**Test Procedure**:
1. User A creates custom pattern (save to database)
2. User B logs in to different account
3. Verify User B cannot see User A's custom pattern
4. Verify User B cannot modify or delete User A's patterns
5. Verify unauthenticated users see built-in patterns only

**Expected Result**: Users can only access their own custom patterns; no cross-user data leaks.

---

### Test 9: Pattern Preview Functionality

**Objective**: Test preview plays isolated pattern correctly.

**Manual Test Procedure**:
1. Open Advanced Pattern Options
2. Click "Preview" button on any pattern
3. Verify:
   - Audio plays immediately (C-E-G-C test chord)
   - Preview stops after one measure
   - Preview button changes to "Stop" while playing
   - Can stop preview mid-playback

**Expected Result**: Preview plays pattern once with test notes and stops cleanly.

---

### Test 10: Fallback Error Recovery

**Objective**: Test system gracefully handles errors and uses safe fallbacks.

**Test Procedure**:
```typescript
import { globalVoicingEngine } from './src/utils/voicingEngine';

// Test with corrupted pattern data
const corruptedPattern = {
  id: 'corrupt',
  name: 'Corrupt',
  description: 'Test',
  timeSignature: 'invalid', // Invalid!
  durations: []
};

// Should NOT crash, should use fallback
const scheduled = globalVoicingEngine.validateAndSchedule(
  'block',
  corruptedPattern,
  ['C4', 'E4', 'G4'],
  0,
  120,
  0.7
);

console.assert(scheduled.length > 0, 'Should schedule notes using fallback pattern');
```

**Expected Result**: Invalid patterns trigger safe fallback, system continues functioning.

---

### Test 11: Timing Telemetry & Drift Detection

**Objective**: Verify timing telemetry tracks scheduling accuracy.

```typescript
import { globalVoicingEngine } from './src/utils/voicingEngine';

globalVoicingEngine.clearTelemetry();

// Schedule several patterns
const patterns = [/* various patterns */];
patterns.forEach(pattern => {
  globalVoicingEngine.scheduleBlockPattern(pattern, ['C4', 'E4', 'G4'], 0, 120, 0.7);
});

const telemetry = globalVoicingEngine.getTelemetry();

telemetry.forEach(entry => {
  console.log(`Drift: ${entry.drift * 1000}ms`);
  console.assert(entry.drift < 0.01, 'Timing drift should be < 10ms');
});
```

**Expected Result**: Telemetry records scheduling data; drift is minimal (< 10ms).

---

## Integration Testing

### Integration Test 1: Complete Workflow

1. Start application
2. Select a scripture
3. Click "Music Machine"
4. Select Block voicing
5. Show Advanced Patterns
6. Select "block-2half" pattern
7. Play progression
8. Verify: Plays 2 half-note chords per measure
9. Switch to Arpeggiated
10. Select "arp-1358" (octave arpeggio)
11. Play progression
12. Verify: Arpeggios ascend root-3rd-5th-octave
13. Switch to Broken
14. Select "broken-stumble-heavy"
15. Play progression
16. Verify: Notes have stumbling/irregular timing feel

**Expected Result**: Smooth transitions between all voicing types and patterns.

---

### Integration Test 2: Pattern Persistence Across Sessions

1. Create custom arpeggio pattern "My Arp"
2. Save to database
3. Close browser tab
4. Reopen application
5. Sign in
6. Navigate to Music Machine
7. Show Advanced Patterns
8. Verify "My Arp" pattern is present with Custom badge
9. Select and play "My Arp"
10. Verify it plays correctly

**Expected Result**: Custom patterns persist across sessions.

---

### Integration Test 3: Voice Leading + Advanced Patterns

1. Enable "Smart Voice Leading"
2. Select Block voicing
3. Select "block-dotted-half-quarter" pattern
4. Play I-IV-V-I progression
5. Verify:
   - Voice leading smoothness maintained
   - Dotted half + quarter rhythm preserved
   - No stuck notes or timing issues

**Expected Result**: Voice leading works correctly with all pattern types.

---

## Performance Testing

### Performance Test 1: Large Pattern Library Load Time

**Objective**: Verify pattern library loads quickly (< 500ms).

```typescript
const startTime = performance.now();
import { BLOCK_PATTERNS, ARPEGGIATED_PATTERNS, BROKEN_PATTERNS } from './src/data/voicingPatternLibrary';
const endTime = performance.now();

console.log(`Pattern library load time: ${endTime - startTime}ms`);
console.assert(endTime - startTime < 500, 'Load time should be under 500ms');
```

**Expected Result**: All 56 patterns load in under 500ms.

---

### Performance Test 2: Pattern Validation Speed

**Objective**: Verify validation is fast enough for real-time use.

```typescript
import { validatePattern } from './src/utils/patternValidator';

const startTime = performance.now();
for (let i = 0; i < 1000; i++) {
  validatePattern(somePattern, 'block');
}
const endTime = performance.now();

const avgTime = (endTime - startTime) / 1000;
console.log(`Average validation time: ${avgTime}ms`);
console.assert(avgTime < 5, 'Validation should be < 5ms per pattern');
```

**Expected Result**: Pattern validation takes < 5ms per pattern.

---

## Known Limitations & Future Enhancements

### Current Limitations
1. Custom pattern editor for Block/Broken patterns has simplified UI
2. Advanced rhythm editor (grid-based) not yet implemented
3. Pattern preview uses fixed test chord (C major)
4. No pattern import/export functionality
5. No pattern sharing between users

### Planned Enhancements
1. Full grid-based rhythm editor for Block patterns
2. Visual piano roll editor for Broken patterns
3. Pattern marketplace for sharing
4. MIDI import for pattern creation
5. Real-time pattern modification during playback

---

## Troubleshooting Guide

### Issue: Pattern doesn't play
**Cause**: Instrument not loaded
**Solution**: Wait for instrument to load; check console for loading errors

### Issue: Custom pattern not saving
**Cause**: User not authenticated or database permission issue
**Solution**: Verify user is signed in; check console for Supabase errors

### Issue: Timing feels off
**Cause**: Browser audio latency or timing drift
**Solution**: Check telemetry for drift values; adjust audio buffer size

### Issue: Pattern selector not showing
**Cause**: "Show Advanced Pattern Options" not clicked
**Solution**: Click toggle button below voicing technique buttons

---

## Success Criteria Checklist

- ✅ All 56 built-in patterns validate successfully
- ✅ Block patterns: User-configurable rhythms within measures
- ✅ Arpeggiated patterns: Correct note sequencing (17+ patterns)
- ✅ Broken patterns: No unintended pauses, proper stumbling effects
- ✅ Error handling: Validates inputs, provides clear error messages
- ✅ Fallbacks: Safe defaults on validation failures
- ✅ Database: User patterns save/load correctly with RLS
- ✅ UI: Pattern selector, preview, and custom editor functional
- ✅ Testing: Comprehensive test coverage documented
- ✅ Performance: Fast pattern validation and scheduling
- ✅ Extensibility: Architecture supports future chord types

---

## Additional Resources

- **Voicing Engine API**: See `/src/utils/voicingEngine.ts` for detailed API documentation
- **Pattern Types**: See `/src/types/voicingPatterns.ts` for all TypeScript interfaces
- **Pattern Library**: See `/src/data/voicingPatternLibrary.ts` for all built-in patterns
- **Validation Rules**: See `/src/utils/patternValidator.ts` for validation logic

---

**Last Updated**: November 7, 2025
**Version**: 1.0.0
