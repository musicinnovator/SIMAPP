# Arpeggio Badge Label Fix - Verification Guide

## The Issue
Badge labels like "1-5-3-5" must match EXACTLY what the user hears:
- 1st note: Root (1)
- 2nd note: Fifth (5)
- 3rd note: Third (3)
- 4th note: Fifth (5)

## Current Implementation Analysis

### Voicing Engine Logic (CORRECT ✓)
File: `src/utils/voicingEngine.ts`

```typescript
getNoteIndexFromPattern(value: string, noteCount: number): number {
  const numValue = parseInt(value);
  switch (numValue) {
    case 1: return 0;          // Root = index 0
    case 3: return Math.min(1, noteCount - 1);  // Third = index 1
    case 5: return Math.min(2, noteCount - 1);  // Fifth = index 2
    case 7: return Math.min(3, noteCount - 1);  // Seventh = index 3
    case 8: return noteCount - 1;               // Octave = last index
    // ... etc
  }
}
```

This maps:
- "1" → notes[0] (root)
- "3" → notes[1] (third)
- "5" → notes[2] (fifth)
- "7" → notes[3] (seventh)
- "8" → notes[noteCount-1] (octave)

### Pattern Processing (CORRECT ✓)
```typescript
const sequenceParts = pattern.sequence.split('-');  // ['1', '5', '3', '5']
sequenceParts.forEach((value, index) => {
  const noteIndex = this.getNoteIndexFromPattern(value, notes.length);
  const note = notes[noteIndex];
  // Schedule this note at the correct time
});
```

## Verification Test Cases

### Test 1: Pattern "1-3-5"
Chord: C Major [C, E, G]
- Step 1: value="1" → noteIndex=0 → notes[0]="C" ✓
- Step 2: value="3" → noteIndex=1 → notes[1]="E" ✓
- Step 3: value="5" → noteIndex=2 → notes[2]="G" ✓
Result: Plays C, E, G (Root, Third, Fifth) ✓

### Test 2: Pattern "1-5-3-5" (Alberti Bass)
Chord: C Major [C, E, G]
- Step 1: value="1" → noteIndex=0 → notes[0]="C" (Root) ✓
- Step 2: value="5" → noteIndex=2 → notes[2]="G" (Fifth) ✓
- Step 3: value="3" → noteIndex=1 → notes[1]="E" (Third) ✓
- Step 4: value="5" → noteIndex=2 → notes[2]="G" (Fifth) ✓
Result: Plays C, G, E, G ✓

### Test 3: Pattern "5-3-1"
Chord: C Major [C, E, G]
- Step 1: value="5" → noteIndex=2 → notes[2]="G" (Fifth) ✓
- Step 2: value="3" → noteIndex=1 → notes[1]="E" (Third) ✓
- Step 3: value="1" → noteIndex=0 → notes[0]="C" (Root) ✓
Result: Plays G, E, C (Fifth, Third, Root) ✓

## Potential Issues to Check

### Issue 1: Chord Note Order
Are chord notes being generated in the correct order?
- notes[0] should ALWAYS be the root
- notes[1] should ALWAYS be the third
- notes[2] should ALWAYS be the fifth
- notes[3] should ALWAYS be the seventh (if present)

### Issue 2: Inversion Handling
If inversions are applied, the note order changes:
- Root position: [C, E, G]
- 1st inversion: [E, G, C] ← This breaks our assumption!
- 2nd inversion: [G, C, E] ← This also breaks it!

**Solution**: Pattern matching must happen BEFORE inversion is applied, OR we need to track which note is which after inversion.

### Issue 3: Voice Leading
If voice leading is enabled, notes might be reordered for smooth transitions.

## The Real Fix Needed

The voicing engine logic is CORRECT. The issue is likely in ONE of these places:

1. **Chord Generation**: Ensure notes array is always [root, third, fifth, seventh...]
2. **Inversion Application**: Apply inversions AFTER pattern selection, not before
3. **Voice Leading**: Disable for arpeggios or track note identities

## Recommended Fix Strategy

```typescript
// BEFORE scheduling arpeggio:
const baseChordNotes = getChordNotesInRootPosition(chord);  // [C, E, G]
const arpeggiatedNotes = scheduleArpeggiatedPattern(pattern, baseChordNotes, ...);

// AFTER scheduling, apply transformations if needed:
if (inversion > 0) {
  applyInversionToScheduledNotes(arpeggiatedNotes, inversion);
}
```

This ensures the pattern "1-5-3-5" ALWAYS selects from [Root, Third, Fifth] in that order.

---

## Next Steps
1. Verify chord note generation order
2. Check if inversions are being applied before or after pattern selection
3. Ensure voice leading doesn't reorder notes for arpeggios
4. Add console logging to verify note selection
