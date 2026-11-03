# Option 2: Tiered Voicing Techniques - Implementation Plan

## Concept
Apply the same "WHAT vs HOW" pattern extrapolation to Voicing Techniques:
- **WHAT**: Voicing Structure (close, open, drop-2, drop-3, fourths, clusters, etc.)
- **HOW**: Application Strategy (static, progressive, alternating, responsive)

## Current State
- Voicing Techniques: Block, Arpeggiated, Broken, Partial
- Each has hard-coded behavior
- No separation between structure and application

## Proposed Tiered System

### Tier 1: Voicing Structures (WHAT to voice)
```
- Close Position (all notes within an octave)
- Open Position (spread beyond octave)
- Drop-2 (2nd note from top dropped octave)
- Drop-3 (3rd note from top dropped octave)
- Drop-2-4 (2nd and 4th notes dropped)
- Quartal (voicing in fourths)
- Cluster (adjacent notes, dense)
- Shell (root, 3rd, 7th only)
- Rootless (omit root)
- Upper Structure (9th, 11th, 13th emphasized)
```

### Tier 2: Application Strategies (HOW to apply)
```
- Static: Same voicing throughout
- Progressive: Gradually open up or close
- Alternating: Switch between two structures
- Responsive: Change based on voice leading
- Cascading: Shift voicing on each chord
- Dynamic: Respond to harmonic tension
```

### Tier 3: Distribution (For complex voicings)
Similar to arpeggio distribution but for vertical voicing spread

## Implementation Steps

1. **Create Types** (`src/types/voicingSystem.ts`)
   - VoicingStructure type
   - ApplicationStrategy type
   - VoicingSystemConfig type

2. **Create Data Libraries**
   - `src/data/voicingStructures.ts` - Library of voicing types
   - `src/data/applicationStrategies.ts` - Library of application methods

3. **Create Utilities**
   - `src/utils/voicingStructureEngine.ts` - Applies voicing structures
   - `src/utils/applicationStrategyEngine.ts` - Applies strategies across progression

4. **Create UI Component**
   - `src/components/TieredVoicingSelector.tsx` - Dual dropdown interface

5. **Integrate with MusicMachine**
   - Add alongside existing voicing controls
   - Wire up to playback engine

## Examples

### Example 1: Drop-2 with Progressive Opening
- **Structure**: Drop-2 voicing
- **Strategy**: Progressive (starts close, gradually opens)
- **Result**: Chord 1 in middle register, each subsequent chord slightly higher/wider

### Example 2: Shell Voicings with Alternating
- **Structure**: Shell (root-3rd-7th)
- **Strategy**: Alternating (switch between two octaves)
- **Result**: Low shell, high shell, low shell, high shell...

### Example 3: Quartal with Cascading
- **Structure**: Quartal (stacked fourths)
- **Strategy**: Cascading (shift up by one fourth each chord)
- **Result**: Creates ascending movement through progression

## Benefits

1. **Flexibility**: Mix any structure with any strategy
2. **Educational**: Teaches voicing concepts separately
3. **Creative**: Enables combinations not possible before
4. **Extensible**: Easy to add new structures or strategies
5. **Consistent**: Matches arpeggio system paradigm

## Files to Create

1. `src/types/voicingSystem.ts`
2. `src/data/voicingStructures.ts`
3. `src/data/applicationStrategies.ts`
4. `src/utils/voicingStructureEngine.ts`
5. `src/utils/applicationStrategyEngine.ts`
6. `src/components/TieredVoicingSelector.tsx`
7. `VOICING_SYSTEM_GUIDE.md` - Documentation

## Database Tables

Similar to arpeggio system:
- `user_voicing_structures` - Custom voicing structures
- `user_application_strategies` - Custom application strategies
- `user_voicing_configs` - Saved configurations

---

**Ready to implement after arpeggio fix complete.**
