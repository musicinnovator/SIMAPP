# Enhanced Features Guide

This guide covers the major feature enhancements added to the Music Machine application.

## Table of Contents
1. [Chord Quality Modes](#chord-quality-modes)
2. [Time Signature Support](#time-signature-support)
3. [Save/Load Progressions](#saveload-progressions)
4. [Arpeggio Patterns](#arpeggio-patterns)

---

## Chord Quality Modes

### Overview
The Chord Quality Mode feature allows you to control how chord qualities (major, minor, dominant 7th) are applied to your progressions, independent of the key signature.

### Available Modes

#### 1. Key-Aware (Diatonic) - DEFAULT
- **What it does**: Respects the key signature and scale degrees
- **Example in C Major**:
  - I chord = C Major
  - ii chord = D minor
  - iii chord = E minor
  - IV chord = F Major
  - V chord = G Major (or G7 if 7th chords selected)
  - vi chord = A minor
  - vii° chord = B diminished

**Use case**: Traditional, harmonically correct music that follows key signature rules

#### 2. All Major
- **What it does**: Forces every chord to be major quality
- **Example in C Major**:
  - I chord = C Major
  - ii chord = D Major (instead of minor!)
  - iii chord = E Major (instead of minor!)
  - IV chord = F Major
  - V chord = G Major
  - vi chord = A Major (instead of minor!)
  - vii chord = B Major (instead of diminished!)

**Use case**: Bright, uplifting progressions; modal interchange experiments

#### 3. All Minor
- **What it does**: Forces every chord to be minor quality
- **Example in C Major**:
  - I chord = C minor
  - ii chord = D minor
  - iii chord = E minor
  - IV chord = F minor
  - V chord = G minor
  - vi chord = A minor
  - vii chord = B minor

**Use case**: Dark, somber progressions; exploring minor sonorities

#### 4. All Dominant 7th
- **What it does**: Makes every chord a dominant 7th (major triad + minor 7th)
- **Example in C Major**:
  - I chord = C7 (C-E-G-Bb)
  - ii chord = D7 (D-F#-A-C)
  - iii chord = E7 (E-G#-B-D)
  - IV chord = F7 (F-A-C-Eb)
  - V chord = G7 (G-B-D-F)
  - vi chord = A7 (A-C#-E-G)
  - vii chord = B7 (B-D#-F#-A)

**Use case**: Blues progressions, jazz-influenced harmonies, tension-filled progressions

**Important**: This works independently of the "Chord Type" dropdown. You can:
- Select "Triad" + "All Dominant 7th" = Get major triads (ignores the quality mode for triads)
- Select "7th Chords" + "All Dominant 7th" = Get true dominant 7th chords
- Select "7th Chords" + "Key-Aware" = Get diatonic 7ths (Maj7, min7, etc.)

#### 5. Mixed (Random)
- **What it does**: Randomly alternates between major and minor for each chord
- **Example**:
  - Progression might be: C Major → D Major → E minor → F minor → G Major

**Use case**: Experimentation, unpredictable harmonic movement

### How Chord Type and Quality Mode Interact

**Chord Type Dropdown** (triad, 7th, 9th, 11th, sus2, sus4):
- Controls the **size** of the chord (how many notes)
- triad = 3 notes
- 7th = 4 notes
- 9th = 5 notes
- 11th = 6 notes

**Chord Quality Mode** (Key-Aware, All Major, etc.):
- Controls the **quality** of intervals used
- Major vs Minor 3rd
- Perfect vs Diminished 5th
- Major 7th vs Minor 7th (dominant)

**Examples of Combinations:**

| Chord Type | Quality Mode | Result on ii in C Major |
|------------|--------------|-------------------------|
| Triad | Key-Aware | D minor (D-F-A) |
| Triad | All Major | D Major (D-F#-A) |
| 7th | Key-Aware | D min7 (D-F-A-C) |
| 7th | All Dominant 7th | D7 (D-F#-A-C) |
| 7th | All Major | D Maj7 (D-F#-A-C#) |

### When to Use Each Mode

**Key-Aware (Diatonic)**:
- ✅ Traditional hymns and worship songs
- ✅ Classical-style compositions
- ✅ When teaching music theory
- ✅ Scripture memorization songs that should sound "correct"

**All Major**:
- ✅ Happy, bright children's songs
- ✅ Modal interchange experimentation
- ✅ When you want everything to sound "happy"

**All Minor**:
- ✅ Lamentations or sorrowful passages
- ✅ Contemplative meditation music
- ✅ Creating a somber mood

**All Dominant 7th**:
- ✅ Blues-influenced scripture songs
- ✅ Jazz arrangements
- ✅ When you want harmonic tension throughout
- ✅ Gospel music with bluesy feel

**Mixed (Random)**:
- ✅ Experimentation and discovery
- ✅ Finding unexpected harmonic combinations
- ✅ Breaking out of familiar patterns

---

## Time Signature Support

### Overview
The application now supports multiple time signatures, allowing you to create progressions in various meters beyond the default 4/4.

### Available Time Signatures

#### 4/4 (Common Time) - DEFAULT
- **Description**: 4 quarter note beats per measure
- **Feel**: Standard, march-like, most common in Western music
- **Use cases**:
  - Most hymns
  - Contemporary worship
  - Scripture memory songs
  - General purpose
- **Example songs**: "Amazing Grace", "How Great Thou Art"

#### 3/4 (Waltz Time)
- **Description**: 3 quarter note beats per measure
- **Feel**: Waltz, lilting, flowing
- **Accent pattern**: **STRONG**-weak-weak
- **Use cases**:
  - Waltzes
  - "Sway" type songs
  - Lullabies
  - Gentle pastoral music
- **Example songs**: "Holy, Holy, Holy" (often sung in 3/4)

#### 6/8 (Compound Duple)
- **Description**: 6 eighth notes per measure (felt as 2 groups of 3)
- **Feel**: Flowing, lilting, compound meter
- **Accent pattern**: **STRONG**-weak-weak-medium-weak-weak
- **Use cases**:
  - Irish/Celtic influenced songs
  - Pastoral, flowing melodies
  - "We Three Kings" type feel
- **Example songs**: "Silent Night", many Celtic hymns

#### 2/4 (March Time)
- **Description**: 2 quarter note beats per measure
- **Feel**: Quick march, children's songs, upbeat
- **Accent pattern**: **STRONG**-weak
- **Use cases**:
  - Children's scripture songs
  - Marches
  - Energetic, simple songs
- **Example songs**: Many children's songs, military marches

#### 5/4 (Unusual Meter)
- **Description**: 5 quarter note beats per measure
- **Feel**: Asymmetric, interesting, slightly unsettling
- **Accent patterns**:
  - 3+2: **STRONG**-weak-weak-medium-weak
  - 2+3: **STRONG**-weak-medium-weak-weak
- **Use cases**:
  - Modern compositions
  - Creating an "off-kilter" or mysterious feel
  - Experimental arrangements
- **Example songs**: "Take Five" by Dave Brubeck

#### 7/8 (Complex Meter)
- **Description**: 7 eighth note beats per measure
- **Feel**: Very asymmetric, driving, Eastern European influenced
- **Accent patterns**:
  - 3+2+2: **STRONG**-weak-weak-medium-weak-medium-weak
  - 2+2+3: **STRONG**-weak-medium-weak-medium-weak-weak
- **Use cases**:
  - Balkan/Eastern European influenced songs
  - Complex modern compositions
  - Unique rhythmic feels
- **Example songs**: "Money" by Pink Floyd (in 7/4, similar feel)

### How Time Signatures Affect Playback

The time signature controls:
1. **Chord Duration**: How long each chord lasts
2. **Beat Emphasis**: Which beats feel stronger
3. **Overall Rhythm**: The musical "feel" of the progression

**Technical Details:**
- BPM (Beats Per Minute) stays constant
- Measure length changes based on time signature
- For x/4 time: quarter note gets one beat
- For x/8 time: eighth note gets one beat
- Example: At 80 BPM in 4/4, each measure = 3 seconds
- Example: At 80 BPM in 3/4, each measure = 2.25 seconds
- Example: At 80 BPM in 6/8, each measure = 2.25 seconds (but feels different!)

### Choosing the Right Time Signature

**For Scripture Memorization:**
- **4/4**: Best for general memorization, most familiar
- **3/4**: Good for poetic, flowing texts
- **6/8**: Excellent for narrative passages with flowing rhythm
- **2/4**: Great for children's memory verses

**For Worship:**
- **4/4**: Standard worship, most congregational songs
- **3/4**: Intimate worship, gentle songs
- **6/8**: Celtic-influenced, "Be Thou My Vision" style

**For Experimentation:**
- **5/4** and **7/8**: Try these for unique arrangements and modern feels

### Combining Time Signature with Other Features

**Example 1: Contemplative Prayer**
- Time Signature: 3/4
- Chord Type: 7th Chords
- Quality Mode: Key-Aware
- Tempo: Largo (slow)
- Result: Gentle, flowing, rich harmonies

**Example 2: Children's Memory Song**
- Time Signature: 2/4
- Chord Type: Triad
- Quality Mode: All Major
- Tempo: Allegro (fast)
- Result: Happy, bouncy, easy to remember

**Example 3: Complex Modern Arrangement**
- Time Signature: 7/8
- Chord Type: 9th Chords
- Quality Mode: Mixed
- Voicing: Arpeggiated
- Result: Intricate, modern, sophisticated

---

## Save/Load Progressions

### Overview
Save your custom chord progressions with all settings to the database, and reload them later.

### What Gets Saved

When you save a progression, these settings are stored:
- ✅ Chord progression (all chords)
- ✅ Key signature
- ✅ Tempo (or manual BPM)
- ✅ Chord type (triad, 7th, 9th, etc.)
- ✅ Voicing technique (block, arpeggiated, broken, partial)
- ✅ Arpeggio pattern
- ✅ Inversion setting
- ✅ **NEW**: Chord quality mode
- ✅ **NEW**: Time signature

### How to Save a Progression

1. Create your progression (custom or preset)
2. Set all your desired parameters:
   - Chord type
   - Quality mode
   - Time signature
   - Voicing technique
   - Arpeggio pattern (if using arpeggiated)
   - Inversion (if not using voice-leading)
3. Enter a name in the "Progression Name" field
4. Click "💾 Save"
5. Confirm the success message

**Requirements:**
- Must be signed in (authenticated)
- Must provide a name for the progression
- Progression is saved to your personal library

### How to Load a Progression

1. Click "📂 Manage Saved Progressions"
2. Browse your saved progressions
3. Click "Load" on any progression
4. All settings are restored exactly as you saved them

### How to Delete a Progression

1. Click "📂 Manage Saved Progressions"
2. Click the "🗑️ Delete" button on any progression
3. Confirm the deletion
4. The progression is permanently removed

### Combining Progressions

1. Click "📂 Manage Saved Progressions"
2. Click "Combine" on any progression
3. Select another progression to combine with
4. The chords are merged into one longer progression
5. Maximum length: 24 chords

**Note**: Combined progressions are not automatically saved. Save them after combining if you want to keep them.

### Error Handling

The system includes comprehensive error handling:
- ✅ Validates user authentication
- ✅ Checks for empty progression names
- ✅ Handles database connection issues
- ✅ Confirms deletions before executing
- ✅ Provides clear error messages

### Database Security

- Each user can only see their own progressions
- Row Level Security (RLS) ensures data isolation
- Public progressions feature available (is_public flag)
- Automatic cleanup when user accounts are deleted

---

## Arpeggio Patterns

### Overview
When using "Arpeggiated" voicing technique, you can select from 17 different arpeggio patterns that control the order notes are played.

### Available Patterns

See ARPEGGIO_PATTERNS_GUIDE.md for complete details.

**Quick Reference:**
- **Four-note patterns**: 1-3-5-3, 1-5-3-5, 1-3-5-1, 1-5-3-1, 3-1-5-3, 3-5-1-5, 5-3-1-3, 5-1-3-5
- **Three-note patterns**: 1-3-5, 1-5-3, 3-1-5, 3-5-1, 5-1-3, 5-3-1
- **Octave patterns**: 1-3-5-8, 1-5-8-5, 8-5-3-1

### Pattern Notation
- Numbers represent chord tones (1=root, 3=third, 5=fifth)
- "8" means root note one octave higher
- Patterns are played in sequence left to right

---

## Complete Feature Integration Example

### Example: Comprehensive Scripture Memory Song

**Goal**: Create a memorable song for Psalm 23 with rich harmonies, flowing rhythm, and smooth transitions.

**Settings:**
1. **Key Signature**: G Major (comfortable singing range)
2. **Time Signature**: 6/8 (flowing, pastoral feel like a shepherd's song)
3. **Tempo**: Andante (walking pace, ≈76 BPM)
4. **Chord Type**: 7th Chords (rich, full harmonies)
5. **Quality Mode**: Key-Aware (proper diatonic harmony)
6. **Progression**: I - vi - IV - V (G - Em - C - D)
7. **Voicing Technique**: Arpeggiated
8. **Arpeggio Pattern**: 1-3-5-8 (ascending, reaching upward)
9. **Voice-Leading**: ON (smooth transitions)

**Result**: A flowing 6/8 song with rich 7th chord harmonies, arpeggiated accompaniment that ascends like a shepherd leading upward, perfectly suited for the pastoral imagery of Psalm 23.

**Saving**: Name it "Psalm 23 - Shepherd Song" and save for future use.

---

## Technical Implementation Notes

### Chord Quality System
- Separated quality determination from chord building
- `determineChordQuality()` handles quality mode logic
- `getChordIntervals()` generates proper intervals for any quality/type combination
- Dominant 7th properly distinguishes from Major 7th

### Time Signature System
- `getBeatsPerMeasure()` returns correct beat count
- `getBeatValue()` handles x/4 vs x/8 time differences
- Chord duration dynamically calculated based on BPM and time signature
- Playback timing automatically adjusts

### Database Schema
- New columns added safely with IF NOT EXISTS checks
- Default values ensure backward compatibility
- All new fields optional when loading old progressions

### Error Handling
- Try-catch blocks around all database operations
- User feedback via alerts
- Console logging for debugging
- Graceful fallbacks for missing data

---

## Testing Checklist

### Chord Quality Modes
- [ ] Key-Aware produces correct diatonic chords
- [ ] All Major makes everything major
- [ ] All Minor makes everything minor
- [ ] All Dominant 7th (with 7th chord type) produces dom7 chords
- [ ] Mixed produces varied results
- [ ] Modes work in both major and minor keys

### Time Signatures
- [ ] 4/4 plays at correct speed (baseline)
- [ ] 3/4 is 3/4 the length of 4/4
- [ ] 6/8 feels different from 3/4 (same duration, different emphasis)
- [ ] 2/4 is half the length of 4/4
- [ ] 5/4 has 5 beats
- [ ] 7/8 has proper timing
- [ ] BPM stays constant across time signatures

### Save/Load
- [ ] Save creates database entry
- [ ] Load restores all settings
- [ ] Delete removes progression
- [ ] Combine merges progressions
- [ ] Error messages appear for invalid actions
- [ ] New fields (quality mode, time signature) save and load correctly

### Integration
- [ ] All features work together
- [ ] No regressions in existing functionality
- [ ] Smooth voice-leading still works
- [ ] Arpeggio patterns still work
- [ ] Audio effects still work
- [ ] Recording still works

---

## Troubleshooting

### Issue: Quality mode doesn't seem to work
**Solution**: Make sure you're in a mode other than "Key-Aware". Press Play to hear the changes. Check that Chord Type is set appropriately (e.g., "7th Chords" for dominant 7th quality).

### Issue: Time signature doesn't change the sound
**Solution**: The time signature changes the *duration* of each chord and the *feel* of the rhythm. Listen for how long each chord plays. In 3/4, chords are shorter than in 4/4.

### Issue: Can't save progression
**Solution**: Make sure you're signed in and have entered a progression name. Check the browser console for error messages.

### Issue: Loaded progression doesn't restore all settings
**Solution**: If you saved the progression before the enhanced features were added, it won't have those fields. Adjust manually and re-save.

---

## Future Enhancement Ideas

- [ ] Multiple chord type selection (triad + 7th simultaneously)
- [ ] Per-chord quality override
- [ ] Custom time signature creation
- [ ] Metric modulation
- [ ] Polyrhythmic layers
- [ ] MIDI export with time signatures
- [ ] Sharing progressions publicly
- [ ] Progression templates library

---

## Conclusion

These enhanced features dramatically expand the Music Machine's capabilities while preserving all existing functionality. The combination of chord quality modes, time signatures, and comprehensive save/load functionality creates a powerful tool for creating scripture memorization songs and worship music.

**Remember**: Experiment! Try unusual combinations. The best discoveries often come from unexpected settings.

**May your music glorify God and help His Word dwell richly in hearts!**
