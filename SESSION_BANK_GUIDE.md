# Session Bank & SoundFont Integration Guide

## Overview

Two major new features have been added to the Music Machine:

1. **7-Song Session Bank**: Store up to 7 complete song configurations in your browser session
2. **SoundFont Integration**: Professional-quality instrument sounds using SoundFont technology

---

## 🎵 Session Bank System

### What is the Session Bank?

The Session Bank allows you to save and recall up to 7 different song configurations during a single browsing session. This is perfect for:
- Comparing different arrangements of the same scripture
- Quickly switching between different keys or tempos
- Experimenting with various chord progressions
- Creating multiple variations for practice

### Key Features

✅ **7 Song Slots**: Store up to 7 complete song configurations
✅ **Session-Based**: Songs persist as long as your browser tab is open
✅ **Quick Recall**: One-click loading of saved songs
✅ **Full Configuration**: Saves key, tempo, progression, instrument, chord type, and inversion
✅ **Custom Titles**: Name your songs for easy identification
✅ **Auto-Cleanup**: All songs are automatically deleted when you close the tab (no clutter)

### How to Use the Session Bank

#### Saving a Song

1. Configure your Music Machine with desired settings:
   - Key signature
   - Tempo
   - Chord progression
   - Instrument
   - Chord type and inversion

2. Click the **"Show Session Bank"** button (purple/pink gradient) below the Voice Recorder

3. In the Session Bank, click **"Save Current"** button

4. Enter a title for your song (optional - defaults to "Song 1", etc.)

5. Review the configuration preview

6. Click **"Save"**

Your song is now stored in the first available slot!

#### Loading a Song

1. Open the Session Bank (if not already visible)

2. Find the song you want to load in one of the 7 slots

3. Click the **Play icon** (▶) in the top-right of the song card

4. The Music Machine will immediately update with all saved settings

5. Click Play in the Music Machine to hear your saved configuration

#### Replacing a Song

1. Click **"Replace"** button at the bottom of an occupied slot

2. Modify the title if desired

3. Click **"Save"** to overwrite the slot with current settings

#### Deleting a Song

1. Click the **Trash icon** (🗑) in the top-right of the song card

2. Confirm deletion

The slot will become empty and available for a new song.

### Session Bank Interface

Each song slot displays:
- **Slot Number**: 1-7 for easy reference
- **Song Title**: Custom name or default
- **Key**: Musical key signature
- **Tempo**: Tempo marking (e.g., Andante, Allegro)
- **Instrument**: Selected instrument name
- **Timestamp**: Time the song was saved

Empty slots show:
- "Empty Slot" message
- "Save here" button for quick access

### Technical Details

**Storage Method**: Browser `sessionStorage`
**Capacity**: 7 songs maximum
**Persistence**: Current browser tab/window only
**Data Saved**:
- Key signature
- Tempo
- Progression type
- Chord type (triad, 7th, 9th, etc.)
- Inversion (root, 1st, 2nd, 3rd)
- Instrument selection
- Custom progression (if in custom mode)
- Custom mode flag

### Limitations & Tips

⚠️ **Session-Only Storage**: Songs are NOT saved permanently. They are deleted when:
- You close the browser tab
- You close the browser window
- Your session ends
- You refresh the page (depending on browser)

💡 **Tips**:
- Use descriptive titles to remember song purposes
- Save variations of the same scripture with different settings
- The "LOADED" indicator shows which song is currently active
- You can have different progressions saved for different parts of a service

---

## 🎹 SoundFont Integration

### What are SoundFonts?

SoundFonts are professional-quality digital instrument samples. Instead of synthetic computer-generated sounds, SoundFonts use real instrument recordings for authentic, natural sound quality.

### Benefits

✅ **Realistic Sound**: Authentic instrument timbres
✅ **18 Professional Instruments**: Wide variety across multiple categories
✅ **Better Musicality**: More expressive and natural playback
✅ **Toggle On/Off**: Can switch back to synthetic sounds if needed
✅ **No Installation**: Works entirely in the browser

### Available Instruments

#### Keyboard (3 instruments)
- **Acoustic Grand Piano**: Rich, natural piano sound
- **Bright Acoustic Piano**: Crisp, clear piano tone
- **Electric Piano**: Warm electric piano

#### Organ (2 instruments)
- **Church Organ**: Majestic church organ
- **Rock Organ**: Powerful rock organ sound

#### Strings (4 instruments)
- **String Ensemble**: Warm orchestral strings
- **Violin**: Expressive solo violin
- **Cello**: Rich, deep cello tone
- **Orchestral Harp**: Delicate harp plucks

#### Voice (2 instruments)
- **Choir Aahs**: Angelic choir sound
- **Voice Oohs**: Smooth vocal ensemble

#### Brass (3 instruments)
- **Brass Section**: Full brass ensemble
- **Trumpet**: Bright trumpet sound
- **French Horn**: Warm, noble horn

#### Percussion (2 instruments)
- **Tubular Bells**: Clear bell chimes
- **Vibraphone**: Mellow mallet instrument

#### Guitar (1 instrument)
- **Acoustic Guitar**: Classical nylon guitar

#### Synth (1 instrument)
- **Warm Pad**: Atmospheric synth pad

### How to Use SoundFonts

#### Enabling SoundFont Mode

1. In the Music Machine, find the **"Instrument Sound"** section

2. Look for the toggle button labeled **"SoundFont Quality"**

3. Click to toggle:
   - **ON** (green): Uses SoundFont samples (recommended)
   - **OFF** (gray): Uses synthetic sounds

4. When enabled, the instrument selector changes to show categorized instruments

#### Selecting an Instrument

1. Ensure SoundFont Quality is **ON**

2. Browse instruments by category (Keyboard, Organ, Strings, etc.)

3. Click any instrument button to select it

4. **First Selection**: Wait 1-2 seconds for the instrument to load
   - "Loading instrument..." message appears
   - Subsequent selections are faster (cached)

5. Hover over any instrument to see its description

6. The selected instrument will be highlighted in yellow

#### Comparing Sounds

**SoundFont vs Synthetic**:
1. Select an instrument in SoundFont mode
2. Play a progression
3. Toggle SoundFont Quality to OFF
4. Play the same progression with synthetic sound
5. Toggle back ON to compare

Most users find SoundFont sounds significantly more realistic and pleasant.

### Technical Details

**Library**: `soundfont-player` (npm package)
**Format**: MP3-compressed samples
**SoundFont Bank**: MusyngKite (high-quality, web-optimized)
**Loading**: Lazy-loaded on first use per instrument
**Caching**: Instruments remain loaded for the session
**Fallback**: Automatically falls back to synthetic if loading fails

### Performance Notes

- **First Load**: 1-2 seconds per instrument (one-time per session)
- **Subsequent Plays**: Instant (cached in memory)
- **Memory Usage**: Minimal (~500KB - 2MB per instrument)
- **Network**: CDN-hosted samples load quickly
- **Browser Compatibility**: All modern browsers supported

### Troubleshooting

**"Loading instrument..." takes too long**:
- Check your internet connection
- The first instrument load requires downloading samples
- Subsequent instruments load from cache

**Sound quality seems poor**:
- Ensure SoundFont Quality toggle is ON (green)
- Try refreshing the page and re-enabling
- Check your device volume and music volume slider

**No sound when SoundFont is enabled**:
- Click the instrument button again to reload
- Try toggling SoundFont OFF then back ON
- Check browser console for errors
- Fall back to synthetic sounds if issues persist

**"Failed to load SoundFont" error**:
- System automatically falls back to synthetic sounds
- This is normal if CDN is temporarily unavailable
- Try again after a few moments

---

## 🎯 Workflow Example

### Creating Multiple Arrangements

**Scenario**: You want to practice a scripture passage with different settings

1. **First Arrangement** (Contemplative):
   - Key: A Minor
   - Tempo: Adagio
   - Progression: Romantic Minor
   - Instrument: Cello (SoundFont)
   - Save as "Contemplative Version"

2. **Second Arrangement** (Uplifting):
   - Key: C Major
   - Tempo: Allegro
   - Progression: Gospel Lift
   - Instrument: Church Organ (SoundFont)
   - Save as "Uplifting Version"

3. **Third Arrangement** (Peaceful):
   - Key: G Major
   - Tempo: Andante
   - Progression: Hymn Classic
   - Instrument: Orchestral Harp (SoundFont)
   - Save as "Peaceful Version"

Now you can quickly switch between these three arrangements by loading from the Session Bank!

---

## 🔧 Integration with Existing Features

### Session Bank + Voice Recording

1. Load a song from Session Bank
2. Play the music (automatically records)
3. Record your voice over it
4. Mix the tracks
5. Download or share

The Session Bank configuration determines what music plays during your voice recording!

### Session Bank + Chord Progressions

All 30+ chord progressions work seamlessly:
- Save different progressions for comparison
- Try hymn vs contemporary versions
- Experiment with modal variations
- Store custom progressions

### SoundFont + All Controls

SoundFonts work with all existing features:
- Volume controls
- Chord type selection (triad, 7th, 9th, etc.)
- Inversions
- Custom progressions
- Voice mixing
- Recording and export

---

## 💾 Data & Privacy

### What's Stored

- Song configurations (7 max)
- Current session only
- In browser sessionStorage
- No server upload
- No permanent storage

### What's NOT Stored

- Audio recordings (unless you download them)
- Personal information
- Usage analytics
- SoundFont samples (loaded fresh each session)

### When Data is Cleared

- Closing the browser tab
- Closing the browser
- Clearing browser data
- Session timeout (browser-dependent)
- Page refresh (in some browsers)

---

## 🚀 Advanced Tips

### Quick Experimentation

- Save your "base" configuration in Slot 1
- Try variations in Slots 2-7
- Compare by loading each one
- Keep the best version

### Scripture Study Workflow

- Slot 1: Meditation (slow, peaceful)
- Slot 2: Memorization (moderate, clear)
- Slot 3: Worship (uplifting, dynamic)
- Slot 4: Teaching (steady, accessible)
- Slots 5-7: Experimental variations

### SoundFont Performance

- **Best Quality**: Piano, Strings, Choir
- **Fastest Loading**: Piano, Guitar
- **Most Dramatic**: Organ, Brass
- **Most Peaceful**: Harp, Pad, Cello

### Instrument Combinations (for different parts)

- **Intro/Outro**: Harp or Bells
- **Verses**: Piano or Guitar
- **Chorus**: Strings or Choir
- **Bridge**: Brass or Organ

(Note: You'd need to reload different instruments for different sections)

---

## 📊 Comparison: SoundFont vs Synthetic

| Feature | SoundFont | Synthetic |
|---------|-----------|-----------|
| **Sound Quality** | Professional, realistic | Computer-generated |
| **Loading Time** | 1-2 sec first time | Instant |
| **Memory Usage** | 0.5-2 MB per instrument | Negligible |
| **Variety** | 18 instruments | 8 instruments |
| **Musicality** | High (real samples) | Moderate |
| **Reliability** | Requires internet (first load) | Always available |
| **Best For** | Final recordings, sharing | Quick sketches, offline |

**Recommendation**: Use SoundFont for all final recordings and sharing. Synthetic is fine for quick experiments or if you have connectivity issues.

---

## 🎓 Educational Use

### Teaching Music Theory

- Save examples of different chord types
- Compare major vs minor versions
- Demonstrate inversions
- Show progression variations

### Worship Leadership

- Prepare multiple keys for different vocalists
- Save arrangements for different service sections
- Create practice versions with clear instrumentation
- Build a library of congregation favorites

### Personal Practice

- Save difficult passages with different settings
- Build muscle memory with consistent arrangements
- Experiment with new progressions safely
- Track your progress over time (mentally, since songs aren't permanently saved)

---

## 📝 Summary

The Session Bank and SoundFont integration transform the Music Machine into a professional-grade composition and learning tool while maintaining simplicity and ease of use.

**Key Takeaways**:
- ✅ Save up to 7 songs per session
- ✅ 18 professional instrument sounds
- ✅ One-click switching between arrangements
- ✅ Zero permanent storage (privacy-friendly)
- ✅ Works with all existing features
- ✅ Toggle quality on/off as needed

Start exploring these features to enhance your scripture music experience!
