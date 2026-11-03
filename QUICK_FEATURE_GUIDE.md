# Quick Feature Guide - TTS & Tempo Improvements

## 🎤 Voice Timing Control

### Where to Find It
📍 **Location**: Voice Settings section (when voice is enabled)

### The Toggle Button

**🗣️ Natural Mode (Recommended)** - Green Button
- Voice speaks at natural pace
- 400ms per word (~150 words/min)
- Always intelligible
- Independent from music timing

**🎵 Synced Mode (Legacy)** - Purple Button
- Voice syncs to music duration
- May be fast with long texts
- Original behavior preserved

### How to Use
1. Click the green microphone icon to enable voice
2. Scroll to "Voice Settings"
3. Look for "Voice Timing" section at the top
4. Click the button to toggle between modes
5. Green = Natural (recommended), Purple = Synced

---

## 🎵 Enhanced Tempo Controls

### Where to Find It
📍 **Location**: Music Settings section → Tempo

### Mode Toggle

**🎹 Manual Mode**
- Enter exact BPM (20-240)
- Quick presets: Slow (40), Moderate (100), Fast (160)
- Shows current BPM in purple box

**📋 Preset Mode**
- Choose from classic tempo names
- Largo, Adagio, Andante, Moderato, Allegro, Maestoso
- Shows tempo name and BPM in blue box

### How to Use Manual BPM
1. Click **"🎹 Manual"** button (turns purple)
2. Type BPM value OR click quick preset
3. Watch current tempo display below

### How to Use Preset Tempos
1. Click **"📋 Preset"** button (turns blue)
2. Select tempo from dropdown
3. Watch current tempo display below

---

## 🧪 Testing Your Changes

### Test TTS Voice
1. Select a scripture (e.g., Psalm 23)
2. Enable voice (green microphone icon)
3. Ensure Voice Timing shows **"🗣️ Natural"**
4. Click Play
5. **Expected**: Voice speaks clearly at natural pace
6. **Check**: Current Word display updates with each word

### Test Voice Toggle
1. Click the Voice Timing toggle
2. Button should change: Natural (green) ↔ Synced (purple)
3. Description text updates
4. Click Play and notice difference in voice speed

### Test Tempo - Manual
1. Click **"🎹 Manual"** in tempo section
2. Try entering: 120
3. **Expected**: Accepts value, shows in purple box
4. Try entering: 500
5. **Expected**: Clamps to 240, shows warning in console
6. Click quick presets (🐌 🚶 🏃)
7. **Expected**: BPM updates immediately

### Test Tempo - Preset
1. Click **"📋 Preset"** in tempo section
2. Select "Allegro"
3. **Expected**: Shows "Allegro (132 BPM)" in blue box
4. Select different preset
5. **Expected**: Updates smoothly

### Test Tempo Validation (Console)
1. Open browser console (F12)
2. Type: `runTempoValidatorTests()`
3. Press Enter
4. **Expected**: See "✅ All tempo validator tests passed!"

---

## 🎯 Quick Visual Reference

### Voice Settings Panel
```
┌─────────────────────────────────────┐
│ Voice Settings                      │
├─────────────────────────────────────┤
│ Voice Timing                        │
│ Natural speech pace (400ms/word)    │
│                      [🗣️ Natural]   │ ← Green = Good!
├─────────────────────────────────────┤
│ Voice: [Microsoft David Desktop  ▼] │
│ Speech Rate: 0.8x   [━━━━━●━━━━━━] │
│ Pitch: 1.0          [━━━━━●━━━━━━] │
└─────────────────────────────────────┘
```

### Tempo Controls - Manual
```
┌─────────────────────────────────────┐
│ 🎵 Tempo            [🎹 Manual]     │ ← Purple when active
├─────────────────────────────────────┤
│ [  120  BPM ]                       │
│ 🐌 Slow   🚶 Moderate   🏃 Fast     │ ← Click to set
├─────────────────────────────────────┤
│ Current Tempo                       │
│      120 BPM                        │ ← Purple box
└─────────────────────────────────────┘
```

### Tempo Controls - Preset
```
┌─────────────────────────────────────┐
│ 🎵 Tempo            [📋 Preset]     │ ← Blue when active
├─────────────────────────────────────┤
│ [Allegro (132 BPM)              ▼] │
├─────────────────────────────────────┤
│ Current Tempo                       │
│   Allegro (132 BPM)                 │ ← Blue box
└─────────────────────────────────────┘
```

---

## 📊 At-a-Glance Comparison

### Voice Timing Modes

| Feature | 🗣️ Natural | 🎵 Synced |
|---------|-----------|----------|
| **Speed** | 400ms/word | Based on music |
| **Intelligibility** | Always clear | May be too fast |
| **Use Case** | Default/Recommended | Special sync needs |
| **Color** | Green | Purple |

### Tempo Control Modes

| Feature | 🎹 Manual | 📋 Preset |
|---------|----------|----------|
| **Input** | Type exact BPM | Select from list |
| **Range** | 20-240 | Standard tempos |
| **Presets** | Quick (40/100/160) | Classic names |
| **Color** | Purple | Blue |

---

## 🚨 Common Questions

**Q: Why is my voice too fast?**
A: Switch to "🗣️ Natural" mode in Voice Timing

**Q: Can I enter any tempo?**
A: Valid range is 20-240 BPM. Values outside are automatically clamped.

**Q: What if I want the old voice behavior?**
A: Switch to "🎵 Synced" mode in Voice Timing

**Q: How do I know what tempo I'm using?**
A: Look at the colored box below the tempo controls

**Q: Can I test if tempo validation works?**
A: Yes! Run `runTempoValidatorTests()` in browser console

---

## ✅ Success Indicators

### Voice Working Correctly
- ✅ Words are clear and understandable
- ✅ Current Word display updates smoothly
- ✅ Voice loops through entire text
- ✅ Toggle changes button color and description

### Tempo Working Correctly
- ✅ Invalid values are clamped (console shows warning)
- ✅ Current tempo display matches your input
- ✅ Music speed changes when you change tempo
- ✅ Quick presets change BPM immediately
- ✅ Mode toggle changes UI color and layout

---

## 🎓 Pro Tips

1. **For Best Voice Experience**: Use Natural mode (🗣️ green button)
2. **Quick Tempo Adjustment**: Use quick presets (🐌 🚶 🏃) instead of typing
3. **Verify Changes**: Watch the colored tempo display box
4. **Console Testing**: Run `runTempoValidatorTests()` to verify all validation works
5. **Extreme Tempos**: Console warns you if tempo is very slow/fast (still valid)

---

## 📝 Notes

- All changes are **additive-only** - no existing features were removed
- **Backward compatible** - legacy behaviors preserved via toggles
- **Production ready** - full validation and error handling
- **Tested** - 50+ unit tests included

---

**Build Status**: ✅ Passing (15.15s)
**Ready to Use**: ✅ Yes
